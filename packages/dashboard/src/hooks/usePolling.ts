import { useState, useEffect, useCallback, useRef } from 'react';

interface PollingState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for polling data at a regular interval.
 * Keeps stale data on error to avoid flickering.
 *
 * @param fetcher   Async function that returns data
 * @param interval  Polling interval in ms
 * @param deps      Dependency array — restarts polling when deps change
 * @param options   Optional config: skip (disable polling), immediate (fetch on mount, default true)
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  interval: number,
  deps: unknown[] = [],
  options?: { skip?: boolean; immediate?: boolean },
): PollingState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  fetcherRef.current = fetcher;

  const refetch = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Polling error');
      // keep stale data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options?.skip) {
      setLoading(false);
      return;
    }

    const immediate = options?.immediate ?? true;
    if (immediate) refetch();

    intervalRef.current = setInterval(refetch, interval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, interval, options?.skip]);

  return { data, loading, error, refetch };
}
