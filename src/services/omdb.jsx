const BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

async function fetchFromOmdb(params) {
    const url = new URL(BASE_URL);
    url.search = new URLSearchParams({ apikey: API_KEY, ...params }).toString();

    try {
        const res = await fetch(url.toString());
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error("Network error while contacting OMDb API.");
    }
}

export async function searchMovies(query, type = "", page = 1) {
    if (!query || query.trim() === "") {
        return { Response: "False", Error: "Please enter a search term." };
    }
    const params = { s: query.trim(), page: String(page) };
    if (type) params.type = type;
    const data = await fetchFromOmdb(params);
    return data;
}

export async function fetchMovieDetails(imdbID) {
    if (!imdbID) throw new Error("Missing imdbID");
    const data = await fetchFromOmdb({ i: imdbID, plot: "full" });
    return data;
}
