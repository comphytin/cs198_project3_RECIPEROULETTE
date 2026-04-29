import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipeDesc.css';

function RecipeDesc() {
    const location = useLocation();
    const { recipe } = location.state || {};
    const [fullRecipe, setFullRecipe] = useState(null);
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingRecipe, setFetchingRecipe] = useState(true);

    useEffect(() => {
        if (recipe && recipe.id) {
            fetchFullRecipeById(recipe.id);
            fetchRecipeInstructions(recipe.id);
        }
        document.title = recipe ? `${recipe.title} | Recipe Roulette` : 'Recipe Details';
    }, [recipe]);

    const fetchFullRecipeById = async (recipeId) => {
        setFetchingRecipe(true);
        try {
            // Use your backend endpoint to avoid exposing API key
            const response = await axios.get(`http://localhost:5001/api/recipes/${recipeId}/full`);
            console.log("Full recipe data:", response.data);
            setFullRecipe(response.data);
        } catch (error) {
            console.error("Error fetching full recipe:", error);
        } finally {
            setFetchingRecipe(false);
        }
    };

    const fetchRecipeInstructions = async (recipeId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5001/api/recipes/${recipeId}/instructions`);
            setInstructions(response.data);
        } catch (error) {
            console.error("Error fetching instructions:", error);
            setInstructions("Instructions not available.");
        } finally {
            setLoading(false);
        }
    };

    if (!recipe) {
        return (
            <div className="recipe-description-container">
                <h1>No recipe selected</h1>
                <Link to="/recipebuilder">Go back to Recipe Builder</Link>
            </div>
        );
    }

    if (fetchingRecipe) {
        return <div className="recipe-description-container">Loading recipe details...</div>;
    }

    const displayRecipe = fullRecipe || recipe;

    return (
        <div className="recipe-description-container">
            <p style={{textAlign: "left", marginLeft: "10px"}}>
                <Link to="/recipebuilder" className="back-button">← Back to Recipes</Link>
            </p>
            
            <div className="recipe-header">
                <h1>{displayRecipe.title}</h1>
                <img src={displayRecipe.image} alt={displayRecipe.title} className="recipe-image" />
            </div>

            <div className="ingredients-section">
                <h2 style={{textAlign: "left", marginLeft: "10px"}}>Ingredients You Have</h2>
                <ul className="present_ingredients">
                    {displayRecipe.extendedIngredients?.map((ing, idx) => (
                        <li className="present_ingredient" key={idx}>{ing.original}</li>
                    ))}
                </ul>

                <h2 style={{textAlign: "left", marginLeft: "10px"}}>Recipe Summary</h2>
                <div dangerouslySetInnerHTML={{ __html: displayRecipe.summary || "No summary available." }} />
            </div>

            <div className="instructions-section">
                <h2>Instructions</h2>
                {loading ? (
                    <p>Loading instructions...</p>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: instructions }} />
                )}
            </div>
            <br />
            <br />
        </div>
    );
}

export default RecipeDesc;