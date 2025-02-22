import './App.css';
import {Routes, Route } from 'react-router-dom';
import {Header} from "./components/Header";
import {Home} from "./components/HomePage"
import { ShowDetails } from './components/ShowDetails';
export default function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
        <Route index element={<Home />} />
        <Route path='/anime/:showId' element={<ShowDetails/>}/>
        </Route>
      </Routes>
    </>
  );
}
