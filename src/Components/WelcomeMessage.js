import React from 'react';
import Logo from '../Images/Phi_Kappa_Sigma_coat_of_arms.png';
import './WelcomeMessage.css';

const WelcomeMessage = () => {
    return (
        <div className="welcome-message-container">
            <img src={Logo} alt="Your Logo" className="logo" />
            <h1 className="welcome-title">Welcome to Skulls</h1>
        </div>
    );
};

export default WelcomeMessage;