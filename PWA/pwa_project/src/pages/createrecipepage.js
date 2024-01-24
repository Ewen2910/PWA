// CreateRecipePage.js
import React, { useState } from 'react';
import Navbar from './Navbar'; // Adjust the path accordingly
import axios from 'axios';
import {
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBBtn,
    MDBInput,
} from 'mdb-react-ui-kit';

const CreateRecipePage = () => {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState(['']); // Use an array to store ingredients
    const [instructions, setInstructions] = useState('');
    const [preparationTime, setPreparationTime] = useState('');

    const handleRecipeNameChange = (e) => {
        setRecipeName(e.target.value);
    };

    const handleIngredientChange = (index, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = value;
        setIngredients(updatedIngredients);
    };

    const handleInstructionsChange = (e) => {
        setInstructions(e.target.value);
    };

    const handlePreparationTimeChange = (e) => {
        setPreparationTime(e.target.value);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log the submitted recipe details
        console.log('Recipe Submitted:', { recipeName, ingredients, instructions, preparationTime });

        try {
            // Make a POST request to your backend endpoint to add the recipe
            const response = await axios.post('http://localhost:3001/addRecette', {
                nom: recipeName,
                creator: sessionStorage.getItem("user"),
                ingredients,
                tempsPreparation: preparationTime,

            });

            // Display the backend response
            console.log('Backend Response:', response.data);

            // Perform additional actions here, e.g., redirect the user
        } catch (error) {
            // Handle errors here, e.g., display an error message to the user
            console.error('Error submitting recipe:', error);
        }
    };

    return (
        <>
            {/* Use the imported Navbar component */}
            <Navbar />

            {/* Create Recipe Form */}
            <MDBRow className='mt-5'>
                <MDBCol md='8'>
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCardTitle className='h2'>Create Your Own Recipe</MDBCardTitle>
                            <form onSubmit={handleSubmit}>
                                <MDBInput
                                    label='Recipe Name'
                                    type='text'
                                    value={recipeName}
                                    onChange={handleRecipeNameChange}
                                    required
                                />
                                {ingredients.map((ingredient, index) => (
                                    <MDBInput
                                        key={index}
                                        label={`Ingredient ${index + 1}`}
                                        type='text'
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                        required
                                    />
                                ))}
                                <button type="button" onClick={handleAddIngredient}>
                                    Add Ingredient
                                </button>
                                <div className='form-outline mb-4'>
                                    <textarea
                                        className='form-control'
                                        rows='4'
                                        placeholder='Instructions'
                                        value={instructions}
                                        onChange={handleInstructionsChange}
                                        required
                                    ></textarea>
                                </div>
                                <MDBInput
                                    label='Preparation Time (in minutes)'
                                    type='number'
                                    value={preparationTime}
                                    onChange={handlePreparationTimeChange}
                                    required
                                />
                                <MDBBtn color='primary' type='submit'>
                                    Create Recipe
                                </MDBBtn>
                            </form>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol md='4'>
                    {/* Add an image or additional content if needed */}
                </MDBCol>
            </MDBRow>
        </>
    );
};

export default CreateRecipePage;
