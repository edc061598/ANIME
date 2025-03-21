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

interface Review {
  reviewId: number;
  userId: number;
  showId: number;
  reviewText: string;
  rating: string;
  createdAt: string;
  userName: string;
}

export function ReviewDetails() {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<ShowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const [editReviewId, setEditReviewId] = useState<number | null>(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editReviewRating, setEditReviewRating] = useState(0);

  const userId = 1;

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
        setIsLoading(false);
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

  async function handleUpdate(reviewId: number) {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: editReviewText,
          rating: editReviewRating
        })
      });
      if (!res.ok) {
        throw new Error('Failed to update review');
      }
      const updatedReview = await res.json();
      setReviews(prev =>
        prev.map(r => (r.reviewId === reviewId ? updatedReview : r))
      );
      setEditReviewId(null);
    } catch (err: any) {
      alert(err.message);
    }
  }

  function startEditing(review: Review) {
    setEditReviewId(review.reviewId);
    setEditReviewText(review.reviewText);
    setEditReviewRating(Number(review.rating));
  }


  if (isLoading) return <p>Loading show details...</p>;
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

      <div className="existing-reviews" style={{ margin: '40px' }}>
        <h2>Existing Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.reviewId} className="review-card" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              {editReviewId === review.reviewId ? (
                <div className="edit-review-form">
                  <textarea
                    value={editReviewText}
                    onChange={(e) => setEditReviewText(e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={editReviewRating}
                    onChange={(e) => setEditReviewRating(Number(e.target.value))}
                  />
                  <button onClick={() => handleUpdate(review.reviewId)}>
                    Save
                  </button>
                  <button onClick={() => setEditReviewId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="review-display">
                  <div className="review-display-details">
                    <p>{review.reviewText}</p>
                    <p>Rating: {parseFloat(review.rating).toFixed(1)}/10</p>
                    <small>{new Date(review.createdAt).toLocaleString()}</small>
                  </div>

                  {review.userId === userId && (
                    <div className='review-display-button'>
                    <button onClick={() => startEditing(review)}>
                      Edit
                    </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewDetails;
