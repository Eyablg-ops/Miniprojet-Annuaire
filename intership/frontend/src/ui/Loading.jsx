import React from 'react';
import '../styles/Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <div className="loading-text">
          <span className="loading-word">L</span>
          <span className="loading-word">o</span>
          <span className="loading-word">a</span>
          <span className="loading-word">d</span>
          <span className="loading-word">i</span>
          <span className="loading-word">n</span>
          <span className="loading-word">g</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </div>
        <p className="loading-message">Please wait while we prepare your experience</p>
      </div>
    </div>
  );
};

export default Loading;