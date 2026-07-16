import { NextResponse } from "next/server";
import { getSearchSuggestions } from "@/lib/search/get-suggestions";
import {
  SEARCH_MIN_CHARS,
  SEARCH_SUGGESTION_LIMIT,
  type SearchSuggestionsResponse,
} from "@/lib/search/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < SEARCH_MIN_CHARS) {
    return NextResponse.json({
      query,
      suggestions: [],
    } satisfies SearchSuggestionsResponse);
  }

  const suggestions = await getSearchSuggestions(query, SEARCH_SUGGESTION_LIMIT);

  return NextResponse.json({
    query,
    suggestions,
  } satisfies SearchSuggestionsResponse);
}
