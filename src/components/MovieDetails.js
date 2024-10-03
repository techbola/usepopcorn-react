import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "../hooks/useKey";

const KEY = "e87eba67";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isWatched = watched.some((w) => w.imdbID === selectedId);
  const watchedUserRating = watched.find(
    (w) => w.imdbID === selectedId
  )?.userRating;

  useEffect(() => {
    async function fetchMovie() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Something went wrong with fetching movie");
        }
        setMovie(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovie();
  }, [selectedId]);

  function handleAddWatched() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      userRating: Number(userRating),
      runtime: Number(movie.Runtime.split(" ")[0]),
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    if (!movie.Title) return;
    document.title = `${movie.Title} | usePopcorn`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [movie.Title]);

  useKey("Escape", onCloseMovie);

  return (
    <div className="details">
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              ←
            </button>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} · {movie.Runtime} · {movie.Genre}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    // messages={["Bad", "Okay", "Good", "Great", "Amazing"]}
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddWatched}>
                      +Add to Watched
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already rated this movie <span>⭐</span>{" "}
                  {watchedUserRating}
                </p>
              )}
            </div>

            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
