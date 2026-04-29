const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());

// SQL CONNECTION
// Todo: Create MYSQL connection using mysql.createConnection()
// You'll need: host, user, password, and database

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "838838",
    database: "recipe_roulette_db"
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log("MySQL connected as id " + connection.threadId);
})

app.post('/api/request_recipes', async (req, res) => {
    try {   
        
        const { ingredientList } = req.body;
        if (!ingredientList || ingredientList.length === 0) {
            return res.status(400).json({error: "No ingredients provided"});
        }
        const apiKey = process.env.SPOONACULAR_API_KEY;
        const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=5&apiKey=${apiKey}`;
        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        console.error("API ERROR: ", error.message);
        res.status(500).json({error: "Failed to fetch recipes"});
    }
});

// Get recipe instructions by ID
app.get('/api/recipes/:id/instructions', async (req, res) => {
    try {
        const { id } = req.params;
        const apiKey = process.env.SPOONACULAR_API_KEY;
        
        // Spoonacular endpoint for recipe instructions
        const url = `https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`;
        const response = await axios.get(url);
        
        // Format the instructions
        let instructions = '';
        if (response.data && response.data.length > 0) {
            instructions = response.data[0].steps.map(step => 
                `<p><strong>Step ${step.number}:</strong> ${step.step}</p>`
            ).join('');
        } else {
            instructions = '<p>No instructions available for this recipe.</p>';
        }
        
        res.json(instructions);
    } catch (error) {
        console.error("Error fetching instructions:", error.message);
        res.status(500).json({ error: "Failed to fetch instructions" });
    }
});

app.get('/api/test', async (req, res) => {
    console.log("California Dreamin");
    res.send('<div><h1>English Test</h1><h2>Somewhere over the rainbow lies a hot girl named Irene Kim.</h2></div>');
})

// Save a search

app.post('/api/save_search', (req, res) => {
    const { ingredients } = req.body;
    const query = "INSERT INTO saved_searches (ingredients) VALUES (?)";
    connection.query(query, [ingredients]);
    res.json({ success: true });
});

// Get search history

app.get('/api/search_history', (req, res) => {
    connection.query("SELECT * FROM saved_searches ORDER by search_date DESC LIMIT 10",
        (err, results) => {
            res.json(results);
        });
});

app.get('/api/trending_recipes', (req, res) => {
    const query = "SELECT recipe_id, recipe_title, recipe_image, COUNT(*) as save_count FROM favorites GROUP by recipe_id, recipe_title, recipe_image ORDER BY save_count DESC LIMIT 8";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Database error: ", err);
            return res.status(500).json({error: "Failed to fetch trending recipes"});
        }
        res.json(results);
    });
});

// Save to favorites
// Save recipe to favorites
app.post('/api/favorites', (req, res) => {
    const { recipe_id, recipe_title, recipe_image, usedIngredientCount, missedIngredientCount } = req.body;
    
    const query = `INSERT INTO favorites 
        (recipe_id, recipe_title, recipe_image, used_ingredients_count, missed_ingredients_count) 
        VALUES (?, ?, ?, ?, ?)`;
    
    connection.query(query, [recipe_id, recipe_title, recipe_image, usedIngredientCount, missedIngredientCount], 
        (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Failed to save favorite" });
            }
            res.json({ success: true, message: "Recipe saved to favorites!" });
        });
});

// Get all favorites (for checking if already saved)
app.get('/api/favorites', (req, res) => {
    connection.query("SELECT recipe_id FROM favorites", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get full recipe details by ID
app.get('/api/recipes/:id/full', async (req, res) => {
    try {
        const { id } = req.params;
        const apiKey = process.env.SPOONACULAR_API_KEY;
        
        const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;
        const response = await axios.get(url);
        
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching recipe details:", error.message);
        res.status(500).json({ error: "Failed to fetch recipe details" });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`Recipe endpoint: http://localhost:${PORT}/api/request_recipes`);
});
