/**
 * Ranked, typo-tolerant search over the schools directory.
 *
 * Designed for a bounded dataset (all Nigerian institutions fit in a few
 * hundred rows), so the whole index lives in memory and every keystroke is
 * answered synchronously. If the dataset ever outgrows this, the same API
 * can be backed by Postgres pg_trgm without touching the UI.
 *
 * Matching model:
 * - The query is split into tokens. Every token must match the school
 *   somewhere (AND semantics), so "lagos state" narrows rather than widens.
 * - Each token is scored against weighted fields (name > abbreviation and
 *   aliases > city and state) with a hierarchy of match quality:
 *   exact field > field prefix > word prefix > substring > fuzzy.
 * - Fuzzy matching uses a bounded edit distance so "unilg" still finds
 *   UNILAG, but short tokens never fuzzy-match (too noisy).
 */

export interface SearchableSchool {
  name: string;
  abbreviation?: string | null;
  /** Informal names people actually type, e.g. "great ife". */
  aliases?: readonly string[];
  city?: string | null;
  state?: string | null;
}

interface IndexedField {
  /** Normalized full field text. */
  text: string;
  /** Normalized individual words of the field. */
  words: string[];
  weight: number;
}

interface IndexedEntry<T> {
  item: T;
  fields: IndexedField[];
}

export interface ScoredResult<T> {
  item: T;
  score: number;
}

export interface SchoolSearchIndex<T> {
  /** Returns items ranked by relevance. An empty query returns all items. */
  search: (query: string) => T[];
  /** Like `search`, but keeps scores so results from several indexes can be merged. */
  searchScored: (query: string) => ScoredResult<T>[];
}

/** Lowercase, strip diacritics, collapse punctuation to spaces. */
export function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const FIELD_WEIGHTS = {
  name: 1,
  abbreviation: 0.95,
  alias: 0.9,
  place: 0.55,
} as const;

// Match-quality scores. Gaps are deliberate so weight differences between
// fields never outrank a clearly better match type.
const SCORE = {
  exact: 100,
  fieldPrefix: 80,
  wordPrefix: 64,
  substring: 44,
  fuzzy: 28,
} as const;

/** Max edit distance allowed for a token of the given length. */
function fuzzyBudget(tokenLength: number): number {
  if (tokenLength <= 3) return 0;
  if (tokenLength <= 6) return 1;
  return 2;
}

/**
 * Damerau-Levenshtein distance (adjacent transpositions count as one edit),
 * early-exiting once the distance is guaranteed to exceed `max`.
 * Returns max + 1 when the budget is exceeded.
 */
function boundedEditDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  if (a === b) return 0;

  let prevPrev: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(
        prev[j] + 1,
        current[j - 1] + 1,
        prev[j - 1] + substitutionCost
      );
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        value = Math.min(value, prevPrev[j - 2] + 1);
      }
      current[j] = value;
      if (value < rowMin) rowMin = value;
    }
    if (rowMin > max) return max + 1;
    prevPrev = prev;
    prev = current;
  }
  return prev[b.length] <= max ? prev[b.length] : max + 1;
}

/** Best score for one query token against one field, or 0 if no match. */
function scoreTokenAgainstField(token: string, field: IndexedField): number {
  if (field.text === token) return SCORE.exact * field.weight;
  if (field.text.startsWith(token)) return SCORE.fieldPrefix * field.weight;

  for (const word of field.words) {
    if (word.startsWith(token)) return SCORE.wordPrefix * field.weight;
  }
  if (field.text.includes(token)) return SCORE.substring * field.weight;

  const budget = fuzzyBudget(token.length);
  if (budget > 0) {
    for (const word of field.words) {
      const distance = boundedEditDistance(token, word, budget);
      if (distance <= budget) {
        // Closer typos score higher: distance 1 beats distance 2.
        const closeness = 1 - distance / (budget + 1);
        return SCORE.fuzzy * closeness * field.weight;
      }
    }
  }
  return 0;
}

function indexSchool<T extends SearchableSchool>(item: T): IndexedEntry<T> {
  const fields: IndexedField[] = [];

  function addField(raw: string | null | undefined, weight: number) {
    if (!raw) return;
    const text = normalizeSearchText(raw);
    if (!text) return;
    fields.push({ text, words: text.split(" "), weight });
  }

  addField(item.name, FIELD_WEIGHTS.name);
  addField(item.abbreviation, FIELD_WEIGHTS.abbreviation);
  for (const alias of item.aliases ?? []) {
    addField(alias, FIELD_WEIGHTS.alias);
  }
  addField(item.city, FIELD_WEIGHTS.place);
  addField(item.state, FIELD_WEIGHTS.place);

  return { item, fields };
}

/**
 * Builds a reusable index. Construction is O(n); call once per dataset
 * (e.g. inside useMemo) and reuse `search` on every keystroke.
 */
export function createSchoolSearchIndex<T extends SearchableSchool>(
  schools: readonly T[]
): SchoolSearchIndex<T> {
  const entries = schools.map(indexSchool);

  function searchScored(query: string): ScoredResult<T>[] {
    const tokens = normalizeSearchText(query).split(" ").filter(Boolean);
    if (tokens.length === 0) {
      return entries.map((entry) => ({ item: entry.item, score: 0 }));
    }

    const ranked: ScoredResult<T>[] = [];

    for (const entry of entries) {
      let total = 0;
      let matchedAll = true;

      for (const token of tokens) {
        let best = 0;
        for (const field of entry.fields) {
          const score = scoreTokenAgainstField(token, field);
          if (score > best) best = score;
        }
        if (best === 0) {
          matchedAll = false;
          break;
        }
        total += best;
      }

      if (matchedAll) ranked.push({ item: entry.item, score: total });
    }

    ranked.sort(
      (a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name)
    );
    return ranked;
  }

  return {
    searchScored,
    search: (query) => searchScored(query).map((r) => r.item),
  };
}
