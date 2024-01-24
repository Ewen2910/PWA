// Importez les bibliothèques nécessaires
import React, { useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBInput,
    MDBBtn,
} from 'mdb-react-ui-kit';

const SearchRecipePage = () => {
    // États pour gérer les champs de recherche et les résultats
    const [recipeName, setRecipeName] = useState('');
    const [preparationTime, setPreparationTime] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Fonction pour gérer la soumission du formulaire de recherche
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Faire une requête pour obtenir les résultats de recherche
            const response = await axios.get(`http://localhost:3001/searchRecettes?nom=${recipeName || ''}&tempsPreparation=${preparationTime || ''}&ingredients=${ingredients || ''}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <>
            {/* Utilisez le composant Navbar importé */}
            <Navbar />

            {/* Contenu de la page de recherche de recettes */}
            <MDBContainer className='mt-5'>
                <MDBRow>
                    <MDBCol md='12'>
                        <MDBCard>
                            <MDBCardBody>
                                <MDBCardTitle className='h2'>Recherche de Recettes</MDBCardTitle>

                                {/* Formulaire de recherche */}
                                <form onSubmit={handleSubmit}>
                                    <MDBInput
                                        label='Nom de la recette'
                                        type='text'
                                        value={recipeName}
                                        onChange={(e) => setRecipeName(e.target.value)}
                                    />
                                    <MDBInput
                                        label='Temps de Préparation (en minutes)'
                                        type='number'
                                        value={preparationTime}
                                        onChange={(e) => setPreparationTime(e.target.value)}
                                    />
                                    <MDBInput
                                        label='Ingrédients'
                                        type='text'
                                        value={ingredients}
                                        onChange={(e) => setIngredients(e.target.value)}
                                    />
                                    <MDBBtn color='primary' type='submit'>
                                        Rechercher
                                    </MDBBtn>
                                </form>

                                {/* Afficher les résultats de la recherche */}
                                {searchResults.length > 0 ? (
                                    searchResults.map((recette, index) => (
                                        <MDBCard key={index} className='mb-3'>
                                            <MDBCardBody>
                                                <MDBCardTitle className='h4'>{recette.nom}</MDBCardTitle>
                                                <MDBCardText>
                                                    <strong>Créateur:</strong> {recette.createur}
                                                </MDBCardText>
                                                <MDBCardText>
                                                    <strong>Ingrédients:</strong> {recette.ingredients.join(', ')}
                                                </MDBCardText>
                                                <MDBCardText>
                                                    <strong>Temps de Préparation:</strong> {recette.tempsPreparation} minutes
                                                </MDBCardText>
                                            </MDBCardBody>
                                        </MDBCard>
                                    ))
                                ) : (
                                    <p>Aucun résultat trouvé.</p>
                                )}
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    );
};

export default SearchRecipePage;
