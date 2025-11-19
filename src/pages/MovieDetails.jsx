import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../services/omdb";

export default function MovieDetails({ onAddFavorite }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDetails() {
            setLoading(true);
            setErr("");
            try {
                const data = await fetchMovieDetails(id);
                if (data.Response === "False") {
                    setErr(data.Error || "Movie not found.");
                    setMovie(null);
                } else {
                    setMovie(data);
                }
            } catch (e) {
                setErr(e.message || "Error loading movie details.");
                setMovie(null);
            } finally {
                setLoading(false);
            }
        }
        loadDetails();
    }, [id]);

    if (loading) return <div className="flex items-center justify-center h-screen mx-auto absolute inset-0 bg-black/25"><img src="/loader.gif" alt="Loading details..." /></div>;
    if (err) return <div className="text-red-600">{err} <button onClick={() => navigate(-1)} className="ml-2 text-blue-600">Go back</button></div>;
    if (!movie) return null;

    return (
        <div className="bg-white rounded shadow p-6">
            <div className="flex flex-col md:flex-row gap-6">
                <img
                    src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
                    alt={movie.Title}
                    className="w-64 object-contain" />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{movie.Title} ({movie.Year})</h1>
                    <p className="mb-2 text-sm text-gray-700"><strong>Genre:</strong> {movie.Genre}</p>
                    <p className="mb-2 text-sm text-gray-700"><strong>Runtime:</strong> {movie.Runtime}</p>
                    <p className="mb-4 text-sm text-gray-700"><strong>Cast:</strong> {movie.Actors}</p>
                    <p className="mb-4">{movie.Plot}</p>

                    <div className="mb-4">
                        <strong>Ratings:</strong>
                        <ul className="list-disc ml-6">
                            {movie.Ratings?.length ? movie.Ratings.map((r) => (
                                <li key={r.Source}>{r.Source}: {r.Value}</li>
                            )) : <li>Not available</li>}
                        </ul>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => onAddFavorite({
                            imdbID: movie.imdbID,
                            Title: movie.Title,
                            Year: movie.Year,
                            Poster: movie.Poster
                        })} className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">Add to Favorites</button>

                        <Link to="/" className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Back to search</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
