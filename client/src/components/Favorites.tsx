import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Favorites.css';

// Adjust fields to match your DB query (including joined show data)
interface Favorite {
  showId: number;
  title: string;
  description: string;
  image: string;
  rating: string;         // or number, depending on your DB
  favoritesText?: string; // text user typed about the show, if any
}

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For now, hard-code userId = 1. Replace with actual auth logic later.
  const userId = 1;

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch(`/api/favorites/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch favorites. Status: ${response.status}`);
        }
        const data = (await response.json()) as Favorite[];
        setFavorites(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, [userId]);

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="favorites-page">
      <h1>FAVORITES LIST</h1>
      <div className="favorites-grid">
        {favorites.map((fav) => (
          <div key={fav.showId} className="favorite-card">
            <div className="favorite-card-image">
              <img src={fav.image} alt={fav.title} />
            </div>
            <div className="favorite-card-info">
              <h2>{fav.title} (2022)</h2>
              <p>{fav.description.slice(0, 120)}...</p>
              {/* Rating from the DB (could be out of 10 or 100) */}
              <p className="rating-score">🔥 {fav.rating}/10</p>
              {/* If you have user-specific text stored in favoritesText */}
              {/* {fav.favoritesText && <p className="favorites-text">{fav.favoritesText}</p>} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
