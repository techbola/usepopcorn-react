import { useEffect, useState } from "react";

const KEY = "e87eba67";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // callback?.();

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {
            signal: controller.signal,
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Something went wrong with fetching movies");
        }

        if (data.Response === "False") {
          throw new Error(data.Error);
        }

        setMovies(data.Search);
        setError(null);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError(null);
      return;
    }

    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return { movies, isLoading, error };
}
