-- Pin the trigger helper search_path so it cannot resolve objects through a
-- caller-controlled schema.

ALTER FUNCTION public.update_updated_at()
  SET search_path = public, pg_temp;
