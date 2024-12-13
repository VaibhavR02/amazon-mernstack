import React from 'react';
import { Link } from 'react-router-dom';
// import './nav.css';

const Sidebar = () => {
  return (
    <>
      <div className="">
        <button
          className="btn text-white no-outline"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
          aria-controls="sidebar"
        >
          <span className="border-0 ">
            <i className="fa fa-bars"></i>
          </span>
        </button>

        <div
          className="offcanvas offcanvas-start bg-dark text-white"
          tabIndex="-1"
          id="sidebar"
          aria-labelledby="sidebarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="sidebarLabel">
              DOCUMENT MANAGER Menu
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white no-outline"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-white" to="#">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
