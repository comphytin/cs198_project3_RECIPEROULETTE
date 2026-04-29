import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './recipebuilder.css';

function RecipeBuilder() {
    const [ingredientList, setIngredientList] = useState([]);
    const [recipes, setRecipes] = useState([]); // ADD THIS - store API results
    const [loading, setLoading] = useState(false); // ADD THIS - show loading state
    const [recipesLoaded, setrecipesLoaded] = useState(false);
    const [savedFavorites, setSavedFavorites] = useState([]); // Track saved recipes

    useEffect(() => {
        document.title = "Recipe Roulette | Recipe Builder";
        document.body.style.backgroundColor = "#8bc86f";
    }, []);

    const loadSavedFavorites = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/favorites');
            const savedIds = response.data.map(fav => fav.recipe_id);
            setSavedFavorites(savedIds);
        } catch(error) {
            console.error("Error loading favorites:", error);
        }
    };

    const addIngredient = () => {
        
        const input = document.getElementById("add_ingredient");
        const ingredient = input.value.trim();
        
        if (!ingredient) {
            alert("Please add an ingredient!!");
            return;
        }
        
        setIngredientList([...ingredientList, ingredient]);

        input.value = "";
    };

    const deleteIngredient = () => {
        if (ingredientList.length === 0) {
            alert("There are no ingredients to delete.");
            return;
        }
        setIngredientList(ingredientList.slice(0, -1));
        console.log("Last ingredient deleted. Remaining:");
    };

    const generateRecipe = async () => {
        
        console.log(ingredientList);
        
        if (ingredientList.length === 0) {
            alert("Please add some ingredients!");
            return;
        }
        
        setLoading(true);

        try {
            const ingredientsParam = ingredientList.join(",");
            const response = await axios.post('http://localhost:5001/api/request_recipes', {
                ingredientList: ingredientsParam
            });

            setRecipes(response.data);

            await axios.post('http://localhost:5001/api/save_search', {
                ingredients: ingredientsParam
            });

            console.log("Recipes found:", response.data);

        } catch (error) {
            console.error("Error fetching recipes:", error);
            alert("Could not get recipes. Server is down.");
        } finally {
            setLoading(false);
        }

    }

    const saveToFavorites = async (recipe, event) => {
        event.preventDefault();
        event.stopPropagation();

        if (savedFavorites.includes(recipe.id)) {
            alert("This recipe is already in your favorites!");
            return;
        }

        try {
            await axios.post('http://localhost:5001/api/favorites', {
                recipe_id: recipe.id,
                recipe_title: recipe.title,
                recipe_image: recipe.image,
                usedIngredientCount: recipe.usedIngredientCount,
                missedIngredientCount: recipe.missedIngredientCount
            });
            
            // Update local state
            setSavedFavorites([...savedFavorites, recipe.id]);
            alert("Recipe saved to favorites!");
            
        } catch (error) {
            console.error("Error saving:", error);
            alert("Failed to save recipe. Please try again.");
        }
    }


    return <div className="recipe-builder-container">
        <h1 style={{
            textAlign: "left",
            marginLeft: "10px"
            }}>Recipe Builder</h1>
        <div>
            <input type="text" id="add_ingredient" name="add_ingredient" placeholder="Ex: Eggs"/>
            <br />
            <br />
            <br />

            <button id="add_ingredient_button" onClick={addIngredient}>Add Ingredient</button>
            <button id="delete_ingredient_button" onClick={deleteIngredient}>Delete Ingredient</button>
        </div>
        <br />
        <br />
        <div className="ingredients-wrapper" id="ingredients_list_div">
            <h2 style={{
                textAlign: "left",
                marginLeft: "10px"
            }}>Given Ingredients:</h2>
            <ul id="ingredients_list">
                {ingredientList.map((item, index) => (
                    <li key={index} className="every_ingredient">{item}</li>
                ))}
            </ul>
        </div>
        <div id="generate_recipe_div">
            <button id="generate_recipe_button" onClick={generateRecipe} disabled={loading}>
                {loading ? "Loading..." : "Generate Recipe"}
            </button>
        </div>
        {recipes.length > 0 && (
            <div className="recipes-results">
                <h2>List of Recipes</h2>
                <div className="recipes-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <Link style={{textDecoration: "none"}} to="/recipedescription" state={{ recipe: recipe }}>
                            <div className="recipe_heading_div">
                                <h3>{recipe.title}</h3>
                            </div>
                            <img className="image_dishes" src={recipe.image} alt={recipe.title} />
                            <p style={{color: "black"}}>You have {recipe.usedIngredientCount} of {recipe.usedIngredientCount + recipe.missedIngredientCount} ingredients</p>
                            </Link>
                            <button 
                                className="save_to_favorites" 
                                onClick={(e) => saveToFavorites(recipe, e)}
                                disabled={savedFavorites.includes(recipe.id)}
                                style={{backgroundColor: savedFavorites.includes(recipe.id) ? "#ccc" : "#4CAF50",
                                    cursor: savedFavorites.includes(recipe.id) ? "not-allowed" : "pointer"
                                }}
                                >
                                {savedFavorites.includes(recipe.id) ? "Saved!" : "Save to Favorites"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
}

export default RecipeBuilder;