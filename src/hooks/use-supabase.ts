import { useCallback, useEffect, useState } from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface UseSupabaseQueryOptions {
    enabled?: boolean;
}

export function useSupabaseQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
    dependencies: React.DependencyList = [],
    options: UseSupabaseQueryOptions = {},
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);
    const [loading, setLoading] = useState(true);

    const { enabled = true } = options;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoizedQueryFn = useCallback(queryFn, dependencies);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        memoizedQueryFn()
            .then(({ data, error }) => {
                setData(data);
                setError(error);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [enabled, memoizedQueryFn]);

    const refetch = () => {
        if (!enabled) return;

        setLoading(true);
        queryFn()
            .then(({ data, error }) => {
                setData(data);
                setError(error);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { data, error, loading, refetch };
}

export function useSupabaseSubscription(table: string, filter?: string, callback?: (payload: any) => void) {
    useEffect(() => {
        let subscription: any;

        if (filter) {
            subscription = supabase
                .channel(`${table}-changes`)
                .on("postgres_changes", { event: "*", schema: "public", table, filter }, callback || (() => {}))
                .subscribe();
        } else {
            subscription = supabase
                .channel(`${table}-changes`)
                .on("postgres_changes", { event: "*", schema: "public", table }, callback || (() => {}))
                .subscribe();
        }

        return () => {
            subscription?.unsubscribe();
        };
    }, [table, filter, callback]);
}
