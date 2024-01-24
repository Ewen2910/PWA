import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';

const HomePage = () => {
    const navigate = useNavigate();
    const [recettes, setRecettes] = useState([]);
    const [likedRecipeIds, setLikedRecipeIds] = useState([]);
    const isConnected = sessionStorage.getItem('isConnected') === 'true';

    const handleLike = async (recetteId, recetteNom) => {
        try {
            if (!isConnected) {
                console.log('User is not connected. Handle accordingly.');
                return;
            }

            const storedFavorites = JSON.parse(sessionStorage.getItem('Fave')) || [];
            const isLiked = storedFavorites.some((item) => item.id === recetteId);

            if (isLiked) {
                const updatedFavorites = storedFavorites.filter((item) => item.id !== recetteId);
                sessionStorage.setItem('Fave', JSON.stringify(updatedFavorites));
                setLikedRecipeIds((prevLikedIds) => prevLikedIds.filter((id) => id !== recetteId));

                await axios.post('http://localhost:3001/removeFavorite', {
                    username: sessionStorage.getItem('user'),
                    recetteId,
                });
            } else {
                await axios.post('http://localhost:3001/addFavorite', {
                    username: sessionStorage.getItem('user'),
                    recetteId,
                    recetteNom,
                });

                const updatedFavorites = [...storedFavorites, { id: recetteId, nom: recetteNom }];
                sessionStorage.setItem('Fave', JSON.stringify(updatedFavorites));
                setLikedRecipeIds((prevLikedIds) => [...prevLikedIds, recetteId]);
            }
        } catch (error) {
            console.error('Error liking recette:', error);
        }
    };

    useEffect(() => {
        const ids = JSON.parse(sessionStorage.getItem('Fave'))?.map((item) => item.id) || [];
        setLikedRecipeIds(ids);

        const fetchRecettes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/recettes/1');
                setRecettes(response.data);
            } catch (error) {
                console.error('Error fetching recettes:', error);
            }
        };

        fetchRecettes();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/SearchRecipe');
    };

    const handleCardClick = (recetteId) => {
        // Naviguer vers la page RecipeDetails avec la recette sélectionnée
        navigate(`/recipe-details/${recetteId}`);
    };

    return (
        <>
            <Navbar />

            <MDBRow className='mt-3 text-center'>
                <h2>Ready to Explore More Recipes?</h2>
                <p>Join our community and discover a world of culinary delights.</p>
                <MDBBtn color='success' onClick={handleSubmit}>
                    Get Started
                </MDBBtn>
            </MDBRow>

            <MDBRow className='mt-3'>
                {recettes.map((recette) => (
                    <MDBCol key={recette._id} md='4'>
                        {/* Utiliser un div avec un gestionnaire de clic pour restreindre la zone cliquable */}
                        <div
                            onClick={() => handleCardClick(recette._id)}
                            style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                        >
                            <MDBCard>
                                <MDBCardBody>
                                    <MDBCardTitle>{recette.nom}</MDBCardTitle>
                                    <MDBCardText>Creator: {recette.createur}</MDBCardText>
                                    {isConnected && (
                                        <MDBBtn
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLike(recette._id, recette.nom);
                                            }}
                                            color={likedRecipeIds.includes(recette._id) ? 'success' : 'warning'}
                                        >
                                            {likedRecipeIds.includes(recette._id) ? 'Liked' : 'Like'}
                                        </MDBBtn>
                                    )}
                                    {/* Afficher le nombre de likes */}
                                    <div className='d-flex justify-content-between'>
                                        <span>Likes: {recette.nombreLikes || 0}</span>
                                        {/* Ajoutez ici un symbole pour indiquer le like */}
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </div>
                    </MDBCol>
                ))}
            </MDBRow>
        </>
    );
};

export default HomePage;
