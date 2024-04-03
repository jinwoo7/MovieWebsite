import { useState, useEffect } from "react";

const API_KEY = "ffb758bb";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(err.message);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    // console.log("inside of useEffect");

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // handleCloseMovie();
    fetchMovies();

    // cleanup function
    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
