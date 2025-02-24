// import React from "react";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { type shows } from './HomePage';
// import './Favorites.css';

// export function Favorites() {
//   const [favorites, setFavorites] = useState<shows[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const userId = 1;

//   useEffect(() => {
//     async function loadFavorites() {
//       const URL = `/api/favorites/${userId}`
//       try {
//         const response = await fetch(URL);
//         if (!response.ok) {
//           throw new Error('Submission failed');
//         }
//         console.log(response);
//         const data = await response.json() as shows[];
//         setFavorites(data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     loadFavorites();
//   }, [userId]);

//   if (isLoading) {
//     return <div>Loading show details...</div>;
//   }
//   if (error) {
//     return (
//       <div>
//         <h1>Error</h1>
//         <Link to='/'>Back to Homepage</Link>
//       </div>
//     );
//   }
//   return (
//     <div className="favorites-page">
//       <h1>FAVORITES LIST</h1>
//       <div className="favorites-grid">
//         {favorites.map((fav) => (
//           <div key={fav.showId} className="favorite-card">
//             <div className="favorite-card-image">
//               <img src={fav.image} alt={fav.title} />
//             </div>
//             <div className="favorite-card-info">
//               <h2>{fav.title}</h2>
//               <p>{fav.description}</p>
//               <p className="rating"> {fav.rating}/10</p>
//               <Link to={`/anime/${fav.showId}`} className="full-review">Full Review</Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Favorites;
