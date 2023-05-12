import React from 'react';
import '../styles/Header.css'

const Header = () => {
  return (
    <header className="navbar">
      <h1 className="logo">Photo Walk</h1>
      <nav className="navbar-nav">
        
        <a href="/" className="nav-link">Home</a>
        <a href="/about" className="nav-link">About</a>
        <a href="/contact" className="nav-link">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
