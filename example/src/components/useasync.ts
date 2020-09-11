import { useReducer, useCallback, useRef, useEffect } from "react";

export enum AsyncState {
  Idle,
  Pending,
  Done,
  Error
}

export interface AsyncState2 {
  isIdle?: boolean;
  isLoading?: boolean;
  isDone?: boolean;
  isError?: boolean;
}

type State<T> = { data: T; state: AsyncState2 };
type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;
type ReturnType<T extends any[], R> = [R, AsyncState2, (...args: T) => void];

export default function useAsync<T extends any[], R>(method: AsyncFunction<T, R>): ReturnType<T, R | undefined>;
export default function useAsync<T extends any[], R>(method: AsyncFunction<T, R>, initialValue: R): ReturnType<T, R>;
export default function useAsync<T extends any[], R>(method: AsyncFunction<T, R>, initialValue?: R): ReturnType<T, R> {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => void (isMounted.current = false);
  }, []);

  const [{ data, state }, dispatch] = useReducer(
    (state: State<R>, action: Partial<State<R>>) => ({
      ...state,
      ...action
    }),
    { data: initialValue as R, state: { isIdle: true } }
  );

  const invoke = useCallback(
    (...args: T) => {
      if (!isMounted.current) {
        return;
      }
      dispatch({ state: { isLoading: true } });
      method(...args)
        .then((data) => {
          if (isMounted.current) {
            dispatch({ data, state: { isDone: true } });
          }
        })
        .catch((err) => {
          if (isMounted.current) {
            dispatch({ data: err, state: { isError: true } });
          }
        });
    },
    [method]
  );

  return [data, state, invoke];
}
