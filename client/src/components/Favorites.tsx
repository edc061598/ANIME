import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Favorites.css';

interface Favorite {
  showId: number;
  title: string;
  description: string;
  image: string;
  rating: string;
  favoritesText?: string;
}

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setIsLoading(false);
      }
    }
    fetchFavorites();
  }, [userId]);

  async function handleDelete(fav: Favorite) {
    try {
      const response = await fetch(`/api/favorites/${userId}/${fav.showId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete favorite');
      }
      setFavorites(prev => prev.filter(item => item.showId !== fav.showId));
      alert('Show has been removed!!! :(');
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (isLoading) return <p>Loading favorites...</p>;
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

              <p className="rating-score">🔥 {fav.rating}/10</p>
              <button onClick={() => handleDelete(fav)}
              className='delete-button-favorites'>
                Remove from favorites
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
