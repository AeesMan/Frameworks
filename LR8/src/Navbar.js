import React, { useState, useRef, useEffect } from 'react'
import { FaBars, FaTwitter } from 'react-icons/fa'
import { links, social } from './data'
import logo from './logo.svg'
import {Sidebar, Social} from './Sidebar'




const Navbar = () => {
  const [showLinks, setShowLinks] = useState(true);
  const showMenu = () => {
    if (window.innerWidth < 800) {
      setShowLinks(false);
    } else {
      setShowLinks(true);
    }
  };

  window.addEventListener("resize", showMenu);


  return (
    <nav>
      <div className="nav-center">
        <div className='nav-header'>
          <img src={logo} alt='logo'/>
          <button
            className="nav-toggle"
            onClick={() => setShowLinks(!showLinks)}>
            <FaBars />
          </button>
        </div>
        <div className='link-container show-container'>
        {showLinks && <Sidebar/>}
        </div>
        <ul className='social-icons'>
        <Social/>
        </ul>
      </div>
    </nav>


  );
};


export default Navbar

