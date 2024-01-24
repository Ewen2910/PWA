import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBInput,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit';
import Navbar from './Navbar';

const RecipeDetail = () => {
    const { recetteId } = useParams();
    const [recette, setRecette] = useState(null);
    const [commentaire, setCommentaire] = useState({ nomUtilisateur: '', message: '' });
    const [showComments, setShowComments] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchRecetteDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/getrecettes/${recetteId}`);
                setRecette(response.data);
            } catch (error) {
                console.error('Error fetching recette details:', error);
            }
        };

        const isConnectedFromSession = sessionStorage.getItem('isConnected') === 'true';
        setIsConnected(isConnectedFromSession);

        fetchRecetteDetails();
    }, [recetteId]);

    const usernameFromSession = sessionStorage.getItem('user');
    const [username] = useState(usernameFromSession || '');

    const handleCommentChange = (e) => {
        setCommentaire({
            ...commentaire,
            message: e.target.value,
        });
    };

    const handleAddComment = async () => {
        try {

            await axios.post('http://localhost:3001/addComment', {
                recetteId: recetteId,
                commentaire: { nomUtilisateur: username, message: commentaire.message },
            });


            const response = await axios.get(`http://localhost:3001/getrecettes/${recetteId}`);
            setRecette(response.data);


            setCommentaire({
                nomUtilisateur: '',
                message: '',
            });
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!recette) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <MDBContainer className="mt-5">
                <MDBRow className="justify-content-center">
                    <MDBCol md="8">
                        <MDBCard>
                            <MDBCardBody>
                                <MDBCardTitle className="h2">Recipe Details</MDBCardTitle>


                                <div className='form-outline mb-4'>
                                    <label className='form-label'>Recipe Name</label>
                                    <p className='form-control'>{recette.nom}</p>
                                </div>


                                <div className='form-outline mb-4'>
                                    <label className='form-label'>Creator</label>
                                    <p className='form-control'>{recette.createur}</p>
                                </div>


                                <div className='form-outline mb-4'>
                                    <label className='form-label'>Ingredients</label>
                                    <ul>
                                        {recette.ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>




                                <div className='form-outline mb-4'>
                                    <label className='form-label'>Preparation Time (in minutes)</label>
                                    <p className='form-control'>{recette.tempsPreparation}</p>
                                </div>


                                {isConnected && (
                                    <>
                                        <MDBInput
                                            label="Add a Comment"
                                            type="text"
                                            value={commentaire.message}
                                            onChange={handleCommentChange}
                                            className="mb-4"
                                        />
                                        <MDBBtn color="primary" onClick={handleAddComment}>
                                            Add Comment
                                        </MDBBtn>
                                    </>
                                )}


                                <div className="mt-4">
                                    <MDBBtn color="secondary" onClick={() => setShowComments(!showComments)}>
                                        {showComments ? 'Hide Comments' : 'Show Comments'} <MDBIcon icon={showComments ? 'angle-up' : 'angle-down'} />
                                    </MDBBtn>

                                    {showComments && (
                                        <div>
                                            <h5 className="mt-3">Comments:</h5>
                                            <ul>
                                                {recette.commentaires.map((comment, index) => (
                                                    <li key={index}>
                                                        <strong>{comment.nomUtilisateur}:</strong> {comment.message}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    );
};

export default RecipeDetail;
