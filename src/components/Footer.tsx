
import React from 'react';

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
    backgroundColor: '#4A90E2',
    color: 'white',
    fontSize: '14px',
    position: 'fixed',
    bottom: 0,
    width: '100%',
  };

  return (
    <div style={footerStyle}>
      © 2024 Speech to Text Converter. All rights reserved.
    </div>
  );
};

export default Footer;
