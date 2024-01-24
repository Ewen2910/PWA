import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBBtn,
    MDBInput,
} from 'mdb-react-ui-kit';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    sessionStorage.setItem("isConnected", false)

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleGuestMode = () => {
        // Handle guest mode logic
        window.location.href = '/HomePage';
        console.log('Guest mode activated');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Faites la requête POST avec axios
            const response = await axios.post('http://localhost:3001/login', {
                username,
                password,
            });
            // Vérifiez la réponse de la requête
            if (response.data.message === 'Connexion réussie.') {
                try {
                    // Récupérez le nom d'utilisateur depuis votre authentification ou tout autre moyen
                    const usernam = username  // Remplacez par la logique appropriée pour obtenir le nom d'utilisateur

                    // Faites une requête pour récupérer les informations de l'utilisateur
                    const response = await axios.get(`http://localhost:3001/user/${usernam}`);
                    sessionStorage.setItem("Fave", JSON.stringify(response.data.favorites))
                    sessionStorage.setItem("Recette", JSON.stringify(response.data.recettes))
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }

                // Si la connexion réussit, mettez isConnected à true dans sessionStorage
                sessionStorage.setItem("user", username)
                sessionStorage.setItem('isConnected', true);
                // Redirigez vers la page HomePage
                window.location.href = '/HomePage';
            } else {
                console.error('Échec de la connexion:', response.data.error);
                // Gérez les erreurs de connexion ici (par exemple, affichez un message d'erreur à l'utilisateur)
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error.message);
            // Gérez les erreurs de connexion ici (par exemple, affichez un message d'erreur à l'utilisateur)
        }
    };

    return (
        <MDBContainer className='mt-5'>
            <MDBRow className='justify-content-center'>
                <MDBCol md='6'>
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCardTitle className='h2 text-center'>Login</MDBCardTitle>
                            <form onSubmit={handleSubmit}>
                                <MDBInput
                                    label='Username'
                                    type='text'
                                    value={username}
                                    onChange={handleUsernameChange}
                                    required
                                />
                                <MDBInput
                                    label='Password'
                                    type='password'
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <div className='d-grid gap-2'>
                                    <MDBBtn color='primary' type='submit'>
                                        Login
                                    </MDBBtn>
                                    {/* Ajoutez le bouton "Utiliser en mode invité" */}
                                    <MDBBtn color='secondary' onClick={handleGuestMode}>
                                        Utiliser en mode invité
                                    </MDBBtn>
                                </div>
                            </form>
                            <MDBCardText className='text-center mt-3'>
                                Don't have an account?{' '}
                                <Link to='/register'>Register here</Link>
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default LoginPage;
