import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(() => {
    function callbackFunc(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }
    document.addEventListener("keydown", callbackFunc);
    return () => document.removeEventListener("keydown", callbackFunc);
  }, [key, action]);
}
