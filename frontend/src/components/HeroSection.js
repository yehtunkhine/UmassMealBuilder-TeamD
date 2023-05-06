import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';
import { Link} from "react-router-dom"


function HeroSection() {
  return (
    <div className='hero-container'>
      <h1>
        Welcome to Your UMass <br/>
        Dining Meal Builder
      </h1>
      
      <div className='hero-btns'>
        <Button buttonStyle ={'btn--outline'} buttonSize={'btn--large'}>
          See how it works
        </Button>
        <Link to={{pathname: "/DiningHalls"}}>
        <Button
          buttonStyle={'btn--primary'}
          buttonSize={'btn--large'}
          >
          Try Now
        </Button>
          </Link>
      </div>
    </div>
  );
}

export default HeroSection;