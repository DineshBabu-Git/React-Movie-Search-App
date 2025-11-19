export default function FavoritesPage({ favorites, onRemoveFavorite }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Your Favorites</h2>

            {favorites.length === 0 ? (
                <div className="text-gray-600">No favorites yet. Add some from search results!</div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {favorites.map((f) => (
                        <div key={f.imdbID} className="bg-white p-3 rounded shadow flex flex-col">
                            <img src={f.Poster !== "N/A" ? f.Poster : "/placeholder.png"} alt={f.Title} className="h-48 object-contain mb-2" />
                            <div className="flex-1">
                                <h3 className="font-semibold">{f.Title}</h3>
                                <p className="text-sm text-gray-600">{f.Year}</p>
                            </div>
                            <div className="mt-2 flex gap-2">
                                <a href={`/movie/${f.imdbID}`} className="text-blue-500 underline text-sm font-bold">Details</a>
                                <button onClick={() => onRemoveFavorite(f.imdbID)} className="ml-auto bg-red-500 text-white px-3 py-1 rounded text-sm cursor-pointer">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
