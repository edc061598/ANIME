import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { useUser } from './useUser';

export type shows = {
  showId: number;
  title: string;
  description: string;
  image: string;
  rating: number;
};

export function Home() {
  const [animeList, setAnimeList] = useState<shows[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [selectedAnime, setSelectedAnime] = useState<shows | null>(null);
  const { user } = useUser();

  useEffect(() => {
    async function loadShows() {
      try {
        const URL = '/api/anime';
        const response = await fetch(URL);
        const data: shows[] = await response.json();
        console.log('Shows ', data);
        const firstShows = data.slice(0, 6);
        setAnimeList(firstShows);
        if (firstShows.length > 0) {
          setSelectedAnime(firstShows[0]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadShows();
    console.log(user);
  }, [user]);

  if (loading) return <p>Loading anime shows...</p>;
  if (error) return <p>Error:</p>;

  return (
    <div className="home">
      {selectedAnime && (
        <div
          className="featured-anime"
          style={{ backgroundImage: `url(${selectedAnime.image})` }}>
          <div className="anime-info">
            <h1>{selectedAnime.title}</h1>
            <p>{selectedAnime.description}</p>
            <div className="rating">
              <img src="gundam unicorn.png"></img>
              <span>{selectedAnime.rating}/10</span>
            </div>
            <div className="buttons">
              <button className="show-review">Show review</button>
              <button className="edit-review">Edit review/list</button>
            </div>
          </div>
          <div className="anime-layout">
            {animeList.map((anime) => (
              <div
                key={anime.showId}
                className={`anime-card ${
                  selectedAnime.showId === anime.showId ? 'active' : ''
                }`}
                onClick={() => setSelectedAnime(anime)}>
                <h3>
                  <Link
                    to={`/anime/${anime.showId}`}
                    onClick={(e: any) => e.stopPropagation()}>
                    {anime.title}
                  </Link>
                </h3>
                <img
                  className="image-position"
                  src={anime.image}
                  alt={anime.title}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="all-shows-section">
        <div className="section-header">
          <h2>ALL SHOWS</h2>
          <Link to="/all-shows" className="view-all">
            View All →
          </Link>
        </div>
        <div className="all-shows-grid">
          {animeList.map((anime) => (
            <Link key={anime.showId} to={`/anime/${anime.showId}`}>
              <div className="show-card">
                <div
                  className="show-card-image"
                  style={{ backgroundImage: `url(${anime.image})` }}></div>

                <h3>{anime.title}</h3>

                <p className="rating-score">{anime.rating}/10</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Home;
