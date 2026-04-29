import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Routes, Route} from "react-router-dom";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {

    const { textColor, navbarColor, toggleTheme } = useContext(ThemeContext);

    return <div style={{backgroundColor: navbarColor}} className="navBar">
        
        <div id="navbar_links">
            <ul>
                <li><u>
                    <Link style={{color: textColor}} className="link" to="/">Home</Link>
                </u></li>
                <li><u>
                    <Link style={{color: textColor}} className="link" to="/recipebuilder">Recipe Builder</Link>
                </u></li>
                <li><u>
                    <Link style={{color: textColor}} className="link" to="/about">About</Link>
                </u></li>
            </ul>
        </div>
        <button onClick={toggleTheme}>
            Change Theme
        </button>
    </div>
}

export default Navbar;