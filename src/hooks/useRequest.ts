import { useEffect, useState } from "react";

type RequestState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export function useRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    load: typeof load;
    attempt: number;
    state: RequestState<T>;
  }>();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    load(signal).then(
      (data) => {
        if (!signal.aborted)
          setResult({ load, attempt, state: { status: "success", data } });
      },
      (error: unknown) => {
        if (signal.aborted) return;

        const message = error instanceof Error ? error.message : "";
        setResult({ load, attempt, state: { status: "error", message } });
      },
    );

    return () => controller.abort();
  }, [load, attempt]);

  const state: RequestState<T> =
    result?.load === load && result.attempt === attempt
      ? result.state
      : { status: "loading" };

  return { state, retry: () => setAttempt((previous) => previous + 1) };
}
