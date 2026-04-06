import { useState, useEffect, useCallback, useRef } from 'react';
/**
 * Generic hook for fetching async data with loading/error state management.
 * Replaces the repeated useState(null) + useState(true) + useState(null) pattern.
 *
 * @param fetcher  Async function that returns the data
 * @param deps     Dependency array — refetches when deps change
 * @param options  Optional config: skip (don't fetch), keepStale (preserve data on error)
 */
export function useAsyncData(fetcher, deps = [], options) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!options?.skip);
    const [error, setError] = useState(null);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;
    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcherRef.current();
            setData(result);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'An error occurred';
            setError(msg);
            if (!options?.keepStale)
                setData(null);
        }
        finally {
            setLoading(false);
        }
    }, [options?.keepStale]);
    useEffect(() => {
        if (options?.skip) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, options?.skip]);
    return { data, loading, error, refetch };
}
