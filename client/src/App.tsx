import './App.css';
import {Routes, Route } from 'react-router-dom';
import {Header} from "./components/Header";
import {Home} from "./components/HomePage"
import { ShowDetails } from './components/ShowDetails';
import { AllShows } from './components/AllShows';
import { Reviews } from './components/Reviews';
import {ReviewDetails} from './components/ReviewDetails'
import FavoritesPage from './components/Favorites';
import AuthPage from './components/AuthPage';
import { UserProvider } from './components/UserContext';

export default function App() {
  return (
    <>
    <UserProvider>
        <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path='/anime/:showId' element={<ShowDetails/>}/>
          <Route path='/all-shows' element={<AllShows/>}/>
          <Route path='/reviews' element={<Reviews/>}/>
          <Route path='/reviews/:showId' element={<ReviewDetails/>}/>
          <Route path='/favorites' element={<FavoritesPage/>}/>
        </Route>
          <Route index path='/auth' element={<AuthPage />} />
      </Routes>
      </UserProvider>
    </>
  );
}
