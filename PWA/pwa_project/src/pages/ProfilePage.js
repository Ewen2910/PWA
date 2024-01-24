// ProfilePage.js
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom'; // Importez le composant Link de react-router-dom
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBBtn,
} from 'mdb-react-ui-kit';
import axios from 'axios';

const ProfilePage = () => {
    const [recettesRealisees, setRecettesRealisees] = useState([]);
    const [recettesFavorites, setRecettesFavorites] = useState([]);
    const userProfile = {
        Name: sessionStorage.getItem("user"),
        recipes: recettesRealisees,
        favorites: recettesFavorites,
    };

    const isConnected = sessionStorage.getItem('isConnected') === 'true';

    const handleLogout = () => {
        window.location.href = '/login';
    };

    const handleDislike = async (favorite) => {
        const favoritesFromStorage = JSON.parse(sessionStorage.getItem("Fave")) || [];
        const updatedFavorites = favoritesFromStorage.filter((fav) => fav.id !== favorite.id);
        sessionStorage.setItem("Fave", JSON.stringify(updatedFavorites));

        await axios.post('http://localhost:3001/removeFavorite', {
            username: sessionStorage.getItem('user'),
            recetteId: favorite.id,
        });

        setRecettesFavorites(updatedFavorites);
    };

    useEffect(() => {
        setRecettesRealisees(JSON.parse(sessionStorage.getItem("Recette")));
        setRecettesFavorites(JSON.parse(sessionStorage.getItem("Fave")));
    }, []);

    return (
        <>
            <Navbar />

            <MDBContainer className='mt-5'>
                {isConnected ? (
                    <>
                        <MDBRow>
                            <MDBCol md='12'>
                                <MDBCard>
                                    <MDBCardBody>
                                        <MDBCardTitle className='h2'>Profil</MDBCardTitle>
                                        <div>
                                            <strong>Username :</strong> {userProfile.Name}
                                        </div>

                                        <div className='d-grid gap-2'>
                                            <MDBBtn color='danger' onClick={handleLogout}>
                                                Se déconnecter
                                            </MDBBtn>
                                        </div>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md='12'>
                                <MDBCard className='mt-3'>
                                    <MDBCardBody>
                                        <MDBCardTitle className='h2'>Recettes réalisées</MDBCardTitle>
                                        {userProfile.recipes.map((recipe, index) => (
                                            <MDBCard key={index} className='mt-3'>
                                                <MDBCardBody>
                                                    {/* Utilisez le composant Link pour créer un lien vers RecipeDetail */}
                                                    <Link to={`/recipe-details/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <MDBCardTitle>{recipe.nom}</MDBCardTitle>
                                                    </Link>
                                                </MDBCardBody>
                                            </MDBCard>
                                        ))}
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md='12'>
                                <MDBCard className='mt-3'>
                                    <MDBCardBody>
                                        <MDBCardTitle className='h2'>Recettes favorites</MDBCardTitle>
                                        {userProfile.favorites.map((favorite, index) => (
                                            <MDBCard key={index} className='mt-3'>
                                                <MDBCardBody>
                                                    {/* Utilisez le composant Link pour créer un lien vers RecipeDetail */}
                                                    <Link to={`/recipe-details/${favorite.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <MDBCardTitle>{favorite.nom}</MDBCardTitle>
                                                    </Link>

                                                    <MDBBtn color='danger' onClick={() => handleDislike(favorite)}>
                                                        Dislike
                                                    </MDBBtn>
                                                </MDBCardBody>
                                            </MDBCard>
                                        ))}
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        </MDBRow>
                    </>
                ) : (
                    <MDBRow className='justify-content-center mt-5'>
                        <MDBCol md='6'>
                            <MDBCard>
                                <MDBCardBody className='text-center'>
                                    <MDBCardTitle className='h2'>Mode Invité</MDBCardTitle>
                                    <MDBBtn color='primary' href='/login'>
                                        Se connecter
                                    </MDBBtn>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                    </MDBRow>
                )}
            </MDBContainer>
        </>
    );
};

export default ProfilePage;
