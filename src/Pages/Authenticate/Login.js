import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../Images/Phi_Kappa_Sigma_coat_of_arms.png";
import { AuthContext, AuthProvider } from '../../Components/AuthContext.js';
import { tryPassword } from '../../Api/api-service';
import "./Login.css"

function Login() {
  const [password, setPassword] = useState('');
  const { updateAuthenticated } = useContext(AuthContext); 
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    const authenticated = await tryPassword(password)
    if (authenticated) {
      updateAuthenticated(true); 
      navigate('/choose');
    } else {
      // Password is incorrect
      console.error('Incorrect password');
      alert("Incorrect Password. Please Try Again.")
      setPassword('')
      // Handle authentication errors (e.g., show an error message)
    }
  };

  return (
    <div className="login-container">
    <div className="login-box">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Are you a Phi Kap?</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Shhhh!"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  </div>
  );
}

export default Login;





