import React from 'react';
import './Loading.css'; // Import your CSS file
import skullsLogo from '../Images/Phi_Kappa_Sigma_coat_of_arms.png'

const LoadingScreen = () => {
    return (
        <div className="loading-screen">
            <div className="logo">
                <img src={skullsLogo} alt="Logo" />
            </div>
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingScreen;