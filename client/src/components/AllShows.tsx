import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shows } from './HomePage';
import './AllShows.css';

export function AllShows() {
  const [allShows, setAllShows] = useState<shows[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    async function fetchShows() {
      try {
        const response = await fetch('/api/anime');
        if (!response.ok) {
          throw new Error(`Failed to fetch shows. Status: ${response.status}`);
        }
        const data: shows[] = await response.json();
        setAllShows(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchShows();
  }, []);

  const filterShows = allShows.filter(show =>
    show.rating >= minRating);

  if (isLoading) return <p>Loading shows...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<>
      <div className='all-shows-title'>
        <h1>Shows By Filter</h1>
      </div>
    <div className='return-to-home-link'>
      <Link to={'/'}>
      <h2>Return to the homepage</h2>
        </Link>
    </div>

    <div className='rating-filter'>
      <label>Filter by Rating: {minRating} </label>
      <input
      type='range'
      step='0.5'
      min='0'
      max='10'
      value={minRating}
      onChange={(e) => setMinRating(parseFloat(e.target.value))}
      />
    </div>
      <div className="all-shows-layout">
        <div className="all-shows-grid">
          {filterShows.length > 0 ? (
            filterShows.map(show => (
              <div key={show.showId} className="show-card">
                <h3>{show.title}</h3>
                <Link to={`/anime/${show.showId}`}>
                  <div className='image-absolute'>
                    <img src={show.image} alt={show.title} className='all-shows-image' />
                    <p>Rating: {show.rating}/10</p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No shows found with rating {minRating} or higher.</p>
          )}
        </div>
      </div>
    </>
  );

}

export default AllShows;
