import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className='hero-container'>
      <h1>Welcome to your Umass Dining meal builder</h1>
      <p>description</p>
      <div className='hero-btns'>
        <Button buttonStyle='btn--outline' buttonSize='btn--large'>
          See how it works
        </Button>
        <Button
          // className='btns'
          buttonStyle={'btn--primary'}
          buttonSize={'btn--large'}
        >
          Try Now
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;