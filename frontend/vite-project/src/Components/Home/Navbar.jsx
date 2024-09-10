import React, { useState } from 'react';
import './Nav.css';

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`wrapper ${isCollapsed ? 'collapse' : ''}`}>
      <div className="top_navbar">
        <div className="hamburger" onClick={handleToggle}>
          <div className="one"></div>
          <div className="two"></div>
          <div className="three"></div>
        </div>
        <div className="top_menu">
          <div className="logo">logo</div>
          <ul>
            <li>
              <a href="#">
                <i className="fas fa-search"></i>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-bell"></i>
              </a>
            </li>
            <li>
            <a href="#" onClick={() => {
                            window.location.href="/userProfile"
                          }}>
                <i className="fas fa-user"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="sidebar">
        <ul>
          <li>
            <a href="#">
              <span className="icon"><i className="fas fa-book"></i></span>
              <span className="title">Books</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon"><i className="fas fa-file-video"></i></span>
              <span className="title">Movies</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon"><i className="fas fa-volleyball-ball"></i></span>
              <span className="title">Sports</span>
            </a>
          </li>
          <li>
            <a href="#" className="active">
              <span className="icon"><i className="fas fa-blog"></i></span>
              <span className="title">Blogs</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon"><i className="fas fa-leaf"></i></span>
              <span className="title">Nature</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="main_container">
        <div className="item">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut sapiente adipisci nemo atque eligendi reprehenderit minima blanditiis eum quae aspernatur!
        </div>
        <div className="item">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut sapiente adipisci nemo atque eligendi reprehenderit minima blanditiis eum quae aspernatur!
        </div>
        <div className="item">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut sapiente adipisci nemo atque eligendi reprehenderit minima blanditiis eum quae aspernatur!
        </div>
        <div className="item">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut sapiente adipisci nemo atque eligendi reprehenderit minima blanditiis eum quae aspernatur!
        </div>
      </div>
    </div>
  );
}

export default Navbar;
