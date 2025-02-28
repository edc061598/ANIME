import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ReviewDetails.css';

interface ShowData {
  showId: number;
  title: string;
  description: string;
  image: string;
  rating: number;
}

export function ReviewDetails() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<ShowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);


  useEffect(() => {
    async function fetchShow() {
      try {
        const response = await fetch(`/api/anime/${showId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch show details');
        }
        const data = (await response.json()) as ShowData;
        setShow(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (showId) {
      fetchShow();
    }
  }, [showId]);


  async function fetchReviewsForShow() {
    try {
      const res = await fetch(`/api/reviews/${showId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (showId) {
      fetchReviewsForShow();
    }
  }, [showId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userId = 1;
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          showId: Number(showId),
          reviewText,
          rating: reviewRating
        })
      });
      if (!res.ok) {
        throw new Error('Failed to submit review');
      }
      alert('Review submitted successfully!');

      setReviewText('');
      setReviewRating(0);

      await fetchReviewsForShow();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading show details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!show) return null;

  const ratingOutOf10 = (show.rating);

  return (
    <div className="review-details-page">

      <div className='review-backpage'>
        <Link to='/reviews'>
          Return to Reviews
        </Link>
      </div>

      <div
        className="show-hero"
        style={{ backgroundImage: `url(${show.image})` }}
      >
      </div>



      <div className="review-form-section">
        <h2>WRITE YOUR REVIEW HERE...</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <textarea
            placeholder="OPINION HERE..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          />
          <div className="rating-input">
            <label>
              Rating (0 - 10):
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={submitting} className="post-btn">
            POST
          </button>
        </form>
      </div>

      <div style={{ margin: '40px' }}>
        <h2>Existing Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.reviewId} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <p>{review.reviewText}</p>
              <p>Rating: {review.rating}/10</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewDetails;
