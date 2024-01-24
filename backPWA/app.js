// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { addUser, loginUser, addRecette, getRecettes, getUser, addFavorite, removeFavorite, getRecetteById, getRecettesByFilter, addCommentToRecette } = require('./query'); // Assurez-vous d'ajuster le chemin selon votre structure de projet
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.use(cors());

// Route pour créer un nouvel utilisateur
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Veuillez fournir un nom d\'utilisateur et un mot de passe.' });
    }

    addUser(username, password);
    res.json({ message: 'Utilisateur créé avec succès.' });
});

// Route pour la connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Veuillez fournir un nom d\'utilisateur et un mot de passe.' });
    }

    try {
        const loginResult = await loginUser(username, password);
        console.log(loginResult);

        if (loginResult) {
            res.json({ message: 'Connexion réussie.' });
        } else {
            res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Erreur interne du serveur lors de la connexion.' });
    }
});

app.get('/user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await getUser(username);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Erreur interne du serveur lors de la récupération des informations de l\'utilisateur.' });
    }
});

app.post('/addRecette', (req, res) => {
    const { nom, creator, ingredients, tempsPreparation } = req.body;

    if (!nom || !creator) {
        return res.status(400).json({ error: 'Veuillez fournir un nom et un créateur pour la recette.' });
    }

    // Ajoutez une vérification pour vous assurer que les champs requis sont présents
    if (!nom || !creator || !ingredients || !tempsPreparation) {
        return res.status(400).json({ error: 'Veuillez fournir tous les détails nécessaires pour la recette.' });
    }

    addRecette(nom, creator, ingredients, tempsPreparation);
    res.json({ message: 'Recette ajoutée avec succès.' });
});


app.get('/recettes/:i', async (req, res) => {
    const { i } = req.params;

    try {
        const recettes = await getRecettes(parseInt(i));
        res.json(recettes);
    } catch (error) {
        console.error('Error getting recettes:', error);
        res.status(500).json({ error: 'Erreur interne du serveur lors de la récupération des recettes.' });
    }
});

app.post('/addFavorite', async (req, res) => {
    const { username, recetteId, recetteNom } = req.body;

    if (!username || !recetteId || !recetteNom) {
        return res.status(400).json({ error: 'Veuillez fournir le nom d\'utilisateur, l\'ID de la recette et le nom de la recette.' });
    }

    try {
        // Appelez la fonction addFavorite pour ajouter la recette aux favoris de l'utilisateur
        await addFavorite(username, recetteId, recetteNom);

        res.json({ message: 'Recette ajoutée aux favoris avec succès.' });
    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: 'Erreur interne du serveur lors de l\'ajout de la recette aux favoris.' });
    }
});

app.post('/removeFavorite', async (req, res) => {
    const { username, recetteId } = req.body;

    if (!username || !recetteId) {
        return res.status(400).json({ error: 'Veuillez fournir le nom d\'utilisateur et l\'ID de la recette.' });
    }

    try {
        await removeFavorite(username, recetteId);
        res.json({ message: 'Recette retirée des favoris avec succès.' });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ error: 'Erreur interne du serveur lors du retrait de la recette des favoris.' });
    }
});

app.get('/getrecettes/:recetteId', async (req, res) => {
    const recetteId = req.params.recetteId;

    try {
        // Utilisez la fonction getRecetteById pour obtenir les détails de la recette par ID
        const recetteDetails = await getRecetteById(recetteId);

        // Répondez avec les détails de la recette en format JSON
        res.json(recetteDetails);
    } catch (error) {
        console.error('Error getting recette details by ID:', error);
        // Répondez avec une erreur 500 en cas d'erreur
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/searchRecettes', async (req, res) => {
    const { nom, tempsPreparation, ingredients } = req.query;
    console.log("yep")

    try {
        const recettes = await getRecettesByFilter(nom, tempsPreparation, ingredients ? ingredients.split(',') : []);

        res.json(recettes);
    } catch (error) {
        console.error('Error searching recettes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Ajoutez cette route pour gérer l'ajout de commentaires à une recette
app.post('/addComment', async (req, res) => {
    const { recetteId, commentaire } = req.body;

    // Vérifiez la présence des champs nécessaires
    if (!recetteId || !commentaire) {
        return res.status(400).json({ error: 'Veuillez fournir l\'ID de la recette et le commentaire.' });
    }

    try {
        // Appelez la fonction addCommentToRecette pour ajouter le commentaire à la recette
        await addCommentToRecette(recetteId, commentaire);

        res.json({ message: 'Commentaire ajouté avec succès.' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Erreur interne du serveur lors de l\'ajout du commentaire à la recette.' });
    }
});


app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
