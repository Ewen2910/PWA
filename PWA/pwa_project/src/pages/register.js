import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Utilisez la fonction useNavigate pour obtenir la fonction de navigation
    const navigate = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Effectuez la requête POST avec axios
            const response = await axios.post('http://localhost:3001/register', {
                username,
                password,
            });

            // Traitez la réponse comme nécessaire

            // Enregistrez le statut de connexion dans sessionStorage
            sessionStorage.setItem("user", username)
            sessionStorage.setItem('isConnected', true);

            // Utilisez la fonction de navigation pour rediriger vers la page HomePage
            navigate('/HomePage');
        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
        }
    };

    return (

        <MDBContainer className='mt-5'>
            <MDBRow className='justify-content-center'>
                <MDBCol md='6'>
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCardTitle className='h2 text-center'>Register</MDBCardTitle>
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
                                        Register
                                    </MDBBtn>
                                </div>
                            </form>
                            <MDBCardText className='text-center mt-3'>
                                Already have an account?{' '}
                                <Link to='/login'>Login here</Link>
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default RegisterPage;
