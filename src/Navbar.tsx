import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css'; // Custom CSS for styling

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link to="/">Submit Job</Link>
                </li>
                <li>
                    <Link to="/status">Check Status</Link>
                </li>
                <li>
                    {/*<span className="disabled-link">Gallery View</span>*/}
                    <Link to="/gallery">Gallery View</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
