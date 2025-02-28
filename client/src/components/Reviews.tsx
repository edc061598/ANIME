import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { shows } from './HomePage';
import './Reviews.css';

export type ShowData = {
  showId: number;
  title: string;
  description: string;
  image: string;
  rating: number | string;
}


export function Reviews() {
  const { showId } = useParams<{ showId: string }>();


  const [animeList, setAnimeList] = useState<ShowData[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShows() {
      try {
        const response = await fetch(`/api/anime`);
        if (!response.ok) {
          throw new Error('Failed to fetch shows');
        }
        const data = await response.json() as ShowData[];
        setAnimeList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchShows();
  }, [showId]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userId = 1;
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          showId: Number(showId),
          reviewText,
          rating
        })
      });
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      alert('Review submitted!');
      setReviewText('');
      setRating(0);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }



  if (loading) return <p>Loading shows...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="reviews-page-container">
      <div className="reviews-header">
        <h1>Show Reviews</h1>
      </div>


      <div className="reviews-grid">
        {animeList.map((anime) => {
          return (
            <div key={anime.showId} className="review-card">
              <div className="review-image-section">
                <img src={anime.image} alt={anime.title} className="review-image" />
              </div>
              <div className="review-content-section">
                <h2>{anime.title} (2020)</h2>
                <p className="review-description">
                  {anime.description.slice(0, 100)}...
                </p>
                <div className="review-footer">
                  <span className="review-rating">🔥 {anime.rating}/10</span>
                  <Link to={`/reviews/${anime.showId}`}>
                  <button className="put-review-button">
                    Put Review
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Reviews;
