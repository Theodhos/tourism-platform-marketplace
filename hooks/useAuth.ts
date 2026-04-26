"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useAuth() {
  const { data, error, mutate, isLoading } = useSWR("/api/auth/me", fetcher);

  return {
    user: data?.user ?? null,
    isLoading,
    isError: Boolean(error),
    refresh: mutate
  };
}
