import { useState, useCallback } from "react";

export function usePagination(initialLimit = 20) {
  const [state, setState] = useState({ page: 1, limit: initialLimit, total: 0, totalPages: 0 });

  const setPage = useCallback((page: number) => setState((s) => ({ ...s, page })), []);
  const setTotal = useCallback((total: number) =>
    setState((s) => ({ ...s, total, totalPages: Math.ceil(total / s.limit) })), []);

  return { ...state, setPage, setTotal };
}
