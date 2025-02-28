import './App.css';
import {Routes, Route } from 'react-router-dom';
import {Header} from "./components/Header";
import {Home} from "./components/HomePage"
import { ShowDetails } from './components/ShowDetails';
import { AllShows } from './components/AllShows';
import { Reviews } from './components/Reviews';
import {ReviewDetails} from './components/ReviewDetails'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
        <Route index element={<Home />} />
        <Route path='/anime/:showId' element={<ShowDetails/>}/>
        <Route path='/all-shows' element={<AllShows/>}/>
        <Route path='/reviews' element={<Reviews/>}/>
        <Route path='/reviews/:showId' element={<ReviewDetails/>}/>
        </Route>
      </Routes>
    </>
  );
}
