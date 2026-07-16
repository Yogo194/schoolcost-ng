export type SearchSuggestionKind = "school" | "course" | "state";

export interface SearchSuggestion {
  id: string;
  kind: SearchSuggestionKind;
  label: string;
  meta?: string;
  href: string;
}

export interface SearchSuggestionsResponse {
  query: string;
  suggestions: SearchSuggestion[];
}

export const SEARCH_SUGGESTION_LIMIT = 8;
export const SEARCH_MIN_CHARS = 2;
export const SEARCH_DEBOUNCE_MS = 180;
