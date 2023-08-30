import React from 'react';
import './ItemNotFound.css'; // Import your CSS file

const ItemNotFound = () => {
  return (
    <div className="item-not-found">
      <div className="icon">
        <i className="fas fa-exclamation-circle"></i>
      </div>
      <p>Oops! The requested item no longer exists.</p>
    </div>
  );
};

export default ItemNotFound;