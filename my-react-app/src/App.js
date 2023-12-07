import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PhotoList from './components/PhotoList';

const Home = () => {
  return (
    <div>
      <h2>Home Page</h2>
      <PhotoList count={5} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/photo">Random Photos</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photo" element={<PhotoList count={5} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
