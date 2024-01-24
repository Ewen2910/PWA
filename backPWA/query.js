const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb+srv://Ewen:C23S04E29K11M02@atlascluster.44qvhkk.mongodb.net/?retryWrites=true&w=majority";

const database = 'Recette_app';
const collectionName = 'user';
const collectionNameR = 'Recette'

let client;

async function connect() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
    }
}

async function addUser(username, password) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            console.log(`User with username "${username}" already exists. No new user created.`);
            return;
        }

        // Ajoutez les tableaux recettes et favorites au nouvel utilisateur
        const user = {
            username,
            password,
            recettes: [],   // Tableau pour les recettes
            favorites: []   // Tableau pour les favoris
        };

        const result = await collection.insertOne(user);
        console.log('New user created:', result.insertedId);
        console.log(user)
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

async function loginUser(username, password) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        const user = await collection.findOne({ username });

        if (user && user.password === password) {
            console.log('Login successful for user:', username);
            return true;
        } else {
            console.log('Invalid credentials for user:', username);
            return false;
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

async function getUser(username) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        // Récupérer l'utilisateur par son nom d'utilisateur
        const user = await collection.findOne({ username });

        console.log('User retrieved:', user);
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error; // Vous pouvez choisir de traiter l'erreur de manière appropriée pour votre application
    }
}

async function addRecette(nom, createur, ingredients, tempsPreparation, commentaires) {
    try {
        await connect();

        const db = client.db(database);
        const recettesCollection = db.collection(collectionNameR);
        const usersCollection = db.collection(collectionName);

        // Création d'un nouvel ID automatiquement généré pour la recette
        const newRecetteId = new ObjectId();

        // Document à insérer dans la collection recettes
        const recette = {
            _id: newRecetteId,
            nom: nom,
            createur: createur,
            ingredients: ingredients, // Champ tableau pour les ingrédients
            tempsPreparation: tempsPreparation, // Champ temps de préparation
            nombreLikes: 0,
            commentaires: commentaires || [], // Champ tableau pour les commentaires
        };

        // Insérer la nouvelle recette dans la collection recettes
        const resultRecette = await recettesCollection.insertOne(recette);
        console.log('New recette added:', resultRecette.insertedId);

        // Mettre à jour le document utilisateur pour ajouter la nouvelle recette
        const resultUser = await usersCollection.updateOne(
            { username: createur },
            {
                $push: { recettes: { nom: nom, id: newRecetteId } }
            }
        );

        console.log('User updated with new recette:', resultUser.modifiedCount);
    } catch (error) {
        console.error('Error adding recette:', error);
    }
}


async function getRecettes(index) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionNameR);

        let recettes;

        if (index === 0) {
            // Récupérer toutes les recettes sans tri
            recettes = await collection.find({}).toArray();
        } else if (index === 1) {
            // Récupérer toutes les recettes triées par nombreLikes dans l'ordre décroissant
            recettes = await collection.find({}).sort({ nombreLikes: -1 }).toArray();
        } else {
            // Autres cas si nécessaire
            // ...
        }

        console.log('Recettes retrieved:', recettes);
        return recettes;
    } catch (error) {
        console.error('Error getting recettes:', error);
        throw error; // Vous pouvez choisir de traiter l'erreur de manière appropriée pour votre application
    }
}


async function addFavorite(username, recetteId, recetteNom) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionName);

        // Mettre à jour le document utilisateur pour ajouter la nouvelle recette aux favoris
        const result = await collection.updateOne(
            { username: username }, // Filtrer par nom d'utilisateur
            {
                $push: { favorites: { id: recetteId, nom: recetteNom } } // Ajouter la recette aux favoris
            }
        );

        console.log('User favorites updated:', result.modifiedCount);
        const recetteObjectId = new ObjectId(recetteId);
        // Mettre à jour la collection de recettes pour incrémenter le nombre de likes
        const recettesCollection = db.collection(collectionNameR);
        const resultRecette = await recettesCollection.updateOne(

            { _id: recetteObjectId }, // Filtrer par ID de recette
            {
                $inc: { nombreLikes: 1 } // Incrémenter le nombre de likes de 1
            }
        );

        console.log('Recette likes updated:', resultRecette.modifiedCount);
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
}



async function removeFavorite(username, recetteId) {
    try {
        await connect();

        const db = client.db(database);
        const usersCollection = db.collection(collectionName);
        const recettesCollection = db.collection(collectionNameR);

        // Mettre à jour le document utilisateur pour retirer la recette des favoris
        const result = await usersCollection.updateOne(
            { username: username }, // Filtrer par nom d'utilisateur
            {
                $pull: { favorites: { id: recetteId } } // Retirer la recette des favoris
            }
        );

        console.log('User favorites updated:', result.modifiedCount);

        // Décrémenter le champ nombreLikes de la recette dans la collection recettes
        const recetteResult = await recettesCollection.updateOne(
            { _id: new ObjectId(recetteId) },
            { $inc: { nombreLikes: -1 } }
        );

        console.log('Recette nombreLikes decremented:', recetteResult.modifiedCount);
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
}

async function getRecetteById(recetteId) {
    try {
        await connect();

        const db = client.db(database);
        const recettesCollection = db.collection(collectionNameR);

        // Convertir l'ID de la recette en ObjectId
        const recetteObjectId = new ObjectId(recetteId);

        // Rechercher la recette par son ID
        const recette = await recettesCollection.findOne({ _id: recetteObjectId });

        console.log('Recette retrieved by ID:', recette);
        return recette;
    } catch (error) {
        console.error('Error getting recette by ID:', error);
        throw error;
    }
}

async function getRecettesByFilter(nom, tempsPreparation, ingredients) {
    try {
        await connect();

        const db = client.db(database);
        const collection = db.collection(collectionNameR);

        // Construire le filtre en fonction des paramètres fournis
        const filter = {};

        if (nom) {
            filter.nom = { $regex: nom, $options: 'i' }; // Recherche insensible à la casse
        }

        if (tempsPreparation) {
            filter.tempsPreparation = tempsPreparation;
        }

        if (ingredients && ingredients.length > 0) {
            filter.ingredients = { $regex: ingredients.join('|'), $options: 'i' };
        }

        // Récupérer les recettes en fonction du filtre
        const recettes = await collection.find(filter).toArray();

        console.log('Recettes retrieved by filter:', recettes);
        return recettes;
    } catch (error) {
        console.error('Error getting recettes by filter:', error);
        throw error;
    }
}

async function addCommentToRecette(recetteId, commentaire) {
    try {
        await connect();

        const db = client.db(database);
        const recettesCollection = db.collection(collectionNameR);

        // Convertir l'ID de la recette en ObjectId
        const recetteObjectId = new ObjectId(recetteId);

        // Mettre à jour la recette pour ajouter le nouveau commentaire
        const result = await recettesCollection.updateOne(
            { _id: recetteObjectId },
            {
                $push: { commentaires: commentaire }
            }
        );

        console.log('Recette updated with new commentaire:', result.modifiedCount);
    } catch (error) {
        console.error('Error adding commentaire to recette:', error);
        throw error;
    }
}



module.exports = { addUser, loginUser, addRecette, getRecettes, getUser, addFavorite, removeFavorite, getRecetteById, getRecettesByFilter, addCommentToRecette };