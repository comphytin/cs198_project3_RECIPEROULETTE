import { useEffect } from 'react';
import './About.css';
import sandvich_maker from '../img/sandvich_maker.png';

function About() {

    useEffect(() => {
        document.title = "Recipe Roulette | About";
        document.body.style.backgroundColor = "#ba7bcc";
    })

    return <div>
        <h1 id="about_heading">About</h1>
        <h2 className="about_paragraph">Welcome to Recipe Roulette!! We're Austin Adithia and Vince Muego. We know that the world is getting tougher every single day.
            Everyone has been struggling to make ends meet with the cost of living and the ongoing sociopolitcal choas around the world. Everyone
            cooking a meal has almost felt like a luxury as the cost of groceries has soared more than 50% in the last few years. So if you're
            one of them and you're dealing with insufficient ingredients in your own fridge, this is the website to look up to.
        </h2>
        <h2 className="about_paragraph">
            We developed an idea to build this website, having done meal prep with relatively few ingredients. We soon realized that it's 
            possible to make something delicious through minimalist means. We decided to build this website for you to make the best out of
            what you have in this tough period. We hope that you could lead a healthy yet happy lifestyle by making use of this website.
        </h2>
        <h2 className="about_paragraph">
            Happy cooking, everyone.
        </h2>
        <br />
        <br />
        <img src={sandvich_maker} id="sandvich_maker" alt="" />
    </div>

}

export default About;