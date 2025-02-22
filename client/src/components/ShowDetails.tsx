import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { type shows } from './HomePage';
import './ShowDetails.css';

export function ShowDetails() {
  let { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState<shows>();
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadShowDetails() {
      const URL = `/api/anime/${showId}`;
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setShow(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadShowDetails();
  }, [showId]);

  async function generateRandomShows() {
    try {
      const url = '/api/anime';
      const response = await fetch(url);
      const data = (await response.json()) as shows[];
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomShow = data[randomIndex];
        navigate(`/anime/${randomShow.showId}`);
      }
    } catch (err) {
      console.error('Error fetching random show:', err);
    }
  }

  async function handleClick() {
    try {
      const userId = 1;
      const url = `/api/favorites/${userId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({showId })
      });
      if (!response.ok) {
        console.error('Submission failed');
      }
      alert('Show added to favorites!');
      await generateRandomShows();
    } catch (err) {
      console.error('Error with the post fetch:', err);
    }
  }

  if (isLoading) {
    return <div>Loading show details...</div>;
  }
  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <Link to='/'>Back to Homepage</Link>
      </div>
    );
  }
  if (show) {
    return (
      <>
        <div className='back-to-homepage'>
          <Link to='/' className="show-homepage-link">
            Back to Homepage
          </Link>
        </div>
        <h1>Show Synopsis</h1>
        <div className='show-details-layout'>
          <div className='show-description-details'>
            <h1>{show.title}</h1>
            <span>
              <p>{show.description}</p>
            </span>
            <div className='rating-details'>
              <p>
                <img
                  className='gundam-details'
                  src="gundam unicorn.png"
             
                />
                {show.rating}/10
              </p>
            </div>
            <div className='fav-button'>
              <button onClick={handleClick} className='favorites'>
                Add To Favorites
              </button>
            </div>
          </div>
          <div className='show-header-details'>
            <img
              src={show.image}
              alt={show.title}
              className='show-card-details'
            />
          </div>
        </div>
      </>
    );
  }
}
export default ShowDetails;
