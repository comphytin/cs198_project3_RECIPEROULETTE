import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import axios from 'axios';
import recipe_roulette_icon from "../img/recipe_roulette_icon.png";
import taco_rice from "../img/taco_rice.jpg";
import hide_the_pain_harold from "../img/hide_the_pain_harold.jpg";
import grilled_chicken from "../img/grilled_chicken.jpg";
import irish_stew from "../img/irish_stew.jpg";
import './Home.css';

function Home() {

    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Recipe Roulette | Home";
        document.body.style.backgroundColor = "#ba7bcc";
        fetchTrendingRecipes();
    }, [])

    const fetchTrendingRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/trending_recipes');
            setTrendingRecipes(response.data);
        } catch (error) {
            console.error("Error fetching trending recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    return <div>
        <div>
            <img src={recipe_roulette_icon} id="rr_icon" alt="Recipe Roulette Icon" />
            <h1>Recipe Roulette</h1>
            <h2>Make More with Less!!</h2>
        </div>
        <br />
        <br />

        {!loading && trendingRecipes.length > 0 && (
                <div className="trending-section">
                    <h2 className="trending-title">🔥 Trending Recipes 🔥</h2>
                    <p className="trending-subtitle">Most saved by our community</p>
                    <div className="trending-grid">
                        {trendingRecipes.map((recipe) => (
                            <div key={recipe.recipe_id} className="trending-card">
                                <img className="good_food_image" src={recipe.recipe_image} alt={recipe.recipe_title} />
                                <h3>{recipe.recipe_title}</h3>
                                <p>Saved {recipe.save_count} {recipe.save_count === 1 ? 'time' : 'times'}</p>
                                <p className="view_recipe"><Link to="/recipedescription" state={{
                                    recipe: {
                                        id: recipe.recipe_id,
                                        title: recipe.recipe_title,
                                        image: recipe.recipe_image,
                                        usedIngredients: [],
                                        missedIngredients: []
                                    }
                                }}>View Recipe</Link></p>
                            </div>
                        ))}
                        <br />
                    </div>
                </div>
            )}
        <div className="container">
            <div className="imghome_container">
                <img className="img_home" src={taco_rice} alt="Taco Rice" />
            </div>
            <div className="more_text_home">
                <h1 className="more_text_home_heading">Get Delicious Recipes</h1>
                <h2 className="more_text_home_body">If you want to save money instead of subscribing
                    to "questionable" meal plans, this tool could save you both time and money by creating Recipes
                    from the ingredients you already have. These will help you cook healthy yet delicious meals for you
                    to enjoy in this economy.
                </h2>
            </div>
        </div>
        <div className="container">
            <div className="more_text_home">
                <h1 className="more_text_home_heading">Think Less, Stress Less</h1>
                <h2 className="more_text_home_body">Didn't have enough time to come up with recipes?? We got you covered.
                    For real, stop overthinking and start generating recipes.
                </h2>
            </div>
            <div className="imghome_container">
                <img src={hide_the_pain_harold} className="img_home" alt="Hide the Pain Harold"/>
            </div>
        </div>
        <br />
        <br />
        <br />
        <div className="bundled_images">
            <img src={grilled_chicken} alt="Juicy Grilled Chicken Breasts"/>
            <img src={irish_stew} alt="Irish Stew"/>
        </div>
        <div>
            <button id="start_crafting_button"><Link id="start_crafting_text" to="/recipebuilder">Start Crafting</Link></button>
        </div>
        <br />
        <br />
    </div>
}

export default Home;