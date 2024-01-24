import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/main_page';
import CreateRecipePage from './pages/createrecipepage';
import LoginPage from './pages/login';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/register';
import SearchRecipesPage from './pages/searchrecipes';
import RecipeDetail from './pages/RecipeDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/create-recipe" element={<CreateRecipePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/SearchRecipe" element={<SearchRecipesPage />} />
        {/* Ajoutez la nouvelle route pour RecipeDetail avec un paramètre :recetteId */}
        <Route path="/recipe-details/:recetteId" element={<RecipeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
