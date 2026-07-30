/**
 * PostgREST / Supabase JS caps each response (usually 1000 rows). Paginate until
 * the page is short so directory and list views see every published fee.
 */
export async function fetchAllRows<T>(
  fetchPage: (
    from: number,
    to: number
  ) => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  pageSize = 1000
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = await fetchPage(from, to);
    if (error) throw new Error(error.message);
    const page = (data ?? []) as T[];
    if (!page.length) break;
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}
