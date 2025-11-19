import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import MovieDetails from "./pages/MovieDetails";
import FavoritesPage from "./pages/FavoritesPage";

function Navbar({ favoritesCount }) {
  return (
    <nav className="bg-gray-600 text-white px-8 py-6 flex justify-between items-center fixed w-full top-0 z-10 shadow-md shadow-purple-400">
      <Link to="/" className="font-bold text-xl">🎬 Movie Searching App</Link>
      <div className="flex items-center space-x-3">
        <Link to="/favorites" className="bg-white font-bold text-blue-600 px-3 py-1 rounded">
          Favorites ({favoritesCount})
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie) => {
    if (favorites.find((f) => f.imdbID === movie.imdbID)) {
      alert("Item already in favorites");
      return;
    }
    setFavorites([...favorites, movie]);
  };

  const removeFavorite = (imdbID) => {
    setFavorites(favorites.filter((f) => f.imdbID !== imdbID));
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar favoritesCount={favorites.length} />
      <div className="p-4 max-w-6xl mx-auto mt-20">
        <Routes>
          <Route path="/" element={<SearchPage onAddFavorite={addFavorite} />} />
          <Route path="/movie/:id" element={<MovieDetails onAddFavorite={addFavorite} />} />
          <Route path="/favorites" element={<FavoritesPage favorites={favorites} onRemoveFavorite={removeFavorite} />} />
        </Routes>
      </div>
    </div>
  );
}
