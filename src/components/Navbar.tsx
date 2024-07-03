import React from 'react';

const Navbar: React.FC = () => {
  const navbarStyle: React.CSSProperties = {
    width:"100vw",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px',
    backgroundColor: '#2a2a2a',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom:'3rem'
  };

  return (
    <div style={navbarStyle}>
      Speech to text Converter
    </div>
  );
};

export default Navbar;
