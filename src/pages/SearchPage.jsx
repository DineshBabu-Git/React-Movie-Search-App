import { useEffect, useState } from "react";
import { searchMovies } from "../services/omdb";
import { Link } from "react-router-dom";

export default function SearchPage({ onAddFavorite }) {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("");
    const [page, setPage] = useState(1);
    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // DEFAULT MOVIES TO SHOW ON INITIAL LOAD
    const defaultQuery = "Avengers";

    async function doSearch(q = query, t = type, p = page) {
        setLoading(true);
        setError("");
        try {
            const data = await searchMovies(q, t, p);

            if (data.Response === "False") {
                setResults([]);
                setTotalResults(0);
                setError(data.Error || "No results found.");
            } else {
                setResults(data.Search || []);
                setTotalResults(parseInt(data.totalResults || "0", 10));
            }
        } catch (err) {
            setError(err.message || "Error fetching data.");
            setResults([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }

    // LOAD DEFAULT MOVIES AT INITIAL PAGE LOAD
    useEffect(() => {
        if (!query.trim()) {
            doSearch(defaultQuery, "", page);
        }
    }, [page]);

    const handleSearch = (e) => {
        e?.preventDefault();

        if (!query.trim()) {
            setError("Please enter a movie title or keyword.");
            return;
        }

        setPage(1);
        doSearch(query, type, 1);
    };

    const totalPages = Math.ceil(totalResults / 10);

    return (
        <div>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Search movies... (e.g., Toy Story, Batman, Inception)"
                />

                <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded px-3 py-2 w-48">
                    <option value="">All types</option>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                    <option value="episode">Episode</option>
                </select>

                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer">
                    Search
                </button>
            </form>

            {/* Loading Overlay */}
            {loading && (
                <div className="flex items-center justify-center mx-auto absolute inset-0 bg-black/50">
                    <img src="/loader.gif" alt="Loading..." className="w-32" />
                </div>
            )}

            {/* Errors */}
            {error && <div className="text-red-600 mb-4">{error}</div>}

            {/* No Results */}
            {!loading && !error && results.length === 0 && (
                <div className="text-gray-600">No results — try another search.</div>
            )}

            {/* Movie Grid */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {results.map((movie) => (
                    <div key={movie.imdbID} className="bg-white rounded shadow-md p-3 flex flex-col">
                        <img
                            src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
                            alt={movie.Title}
                            className="h-48 object-contain mb-2"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold">{movie.Title}</h3>
                            <p className="text-sm text-gray-600">{movie.Year} • {movie.Type}</p>
                        </div>

                        <div className="mt-3 flex items-center space-x-2">
                            <Link to={`/movie/${movie.imdbID}`} className="text-blue-500 underline text-sm font-bold">
                                Details
                            </Link>
                            <button
                                onClick={() => onAddFavorite(movie)}
                                className="ml-auto bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                            >
                                Add Favorite
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-3">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded bg-gray-600 disabled:opacity-50 cursor-pointer text-white"
                    >
                        Prev
                    </button>

                    <div className="flex space-x-2">
                        {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => {
                            let start = Math.max(1, page - 4);
                            const end = Math.min(totalPages, start + 8);
                            if (end - start < 8) start = Math.max(1, end - 8);
                            const pageNumbers = Array.from({ length: end - start + 1 }, (_, k) => start + k);
                            return pageNumbers;
                        })[0].map((num) => (
                            <button
                                key={num}
                                onClick={() => setPage(num)}
                                className={`px-3 py-1 rounded ${num === page ? "bg-purple-600 text-white cursor-pointer" : "bg-white border cursor-pointer"}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded bg-gray-600 disabled:opacity-50 cursor-pointer text-white"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
