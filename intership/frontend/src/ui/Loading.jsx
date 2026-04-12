import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/Loading.css';

const Loading = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return (
    <div className="loading-container">
      <div className="loading-content">
        <img src="/images/issat.jpg" alt="ISSAT Sousse" className="loading-logo" />
        <Spin indicator={antIcon} size="large" />
        <div className="loading-text">
          <span className="loading-word">C</span>
          <span className="loading-word">h</span>
          <span className="loading-word">a</span>
          <span className="loading-word">r</span>
          <span className="loading-word">g</span>
          <span className="loading-word">e</span>
          <span className="loading-word">m</span>
          <span className="loading-word">e</span>
          <span className="loading-word">n</span>
          <span className="loading-word">t</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
          <span className="loading-dot">.</span>
        </div>
        <p className="loading-message">ISSAT Sousse - Plateforme de stages</p>
      </div>
    </div>
  );
};

export default Loading;