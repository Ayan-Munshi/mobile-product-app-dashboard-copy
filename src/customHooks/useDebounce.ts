import { useEffect, useState } from "react";

function useDebounce(value: string, delay: number): string {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounceValue?.length > 2 ? debounceValue : "";
}

export default useDebounce;
