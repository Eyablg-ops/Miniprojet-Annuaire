// components/ui/IssatLogo.jsx
import React from 'react';

const IssatLogo = ({ size = 'medium', showText = true }) => {
  const sizeMap = {
    small: { logo: 30, text: '1rem' },
    medium: { logo: 40, text: '1.2rem' },
    large: { logo: 60, text: '1.5rem' }
  };

  return (
    <div className="issat-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <img 
        src="/images/issat.jpg" 
        alt="ISSAT Sousse" 
        style={{ 
          width: sizeMap[size].logo, 
          height: sizeMap[size].logo,
          borderRadius: '10px',
          objectFit: 'cover'
        }} 
      />
      {showText && (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: sizeMap[size].text, color: '#1890ff' }}>
            ISSAT Sousse
          </div>
          <div style={{ fontSize: '0.7rem', color: '#999' }}>
            Plateforme de Stages
          </div>
        </div>
      )}
    </div>
  );
};

export default IssatLogo;   