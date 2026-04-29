import Navbar from './components/Navbar';
import Home from "./pages/Home";
import About from "./pages/About";
import RecipeBuilder from "./pages/RecipeBuilder";
import RecipeDesc from './pages/RecipeDesc';
import './App.css';
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/recipebuilder" element={<RecipeBuilder />} />
        <Route path="/recipedescription" element={<RecipeDesc />} />
      </Routes>

      
    </div>
  );
}

export default App;
