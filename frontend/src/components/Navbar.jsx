import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar({ onLogout }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Helper per classe attiva
    const getLinkClass = (path) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/feed" className="navbar-brand" onClick={closeMenu}>
                    BESPORTY
                </Link>

                <div
                    className="menu-icon"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease"
                    }}
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>

                <div className={`navbar-links ${isOpen ? "active" : ""}`}>
                    <Link to="/feed" className={getLinkClass("/feed")} onClick={closeMenu}>
                        Feed
                    </Link>
                    <Link to="/checkin" className={getLinkClass("/checkin")} onClick={closeMenu}>
                        Check-In
                    </Link>
                    <Link to="/groups" className={getLinkClass("/groups")} onClick={closeMenu}>
                        Gruppi
                    </Link>

                    {/* --- NUOVO LINK BADGE --- */}
                    <Link to="/badges" className={getLinkClass("/badges")} onClick={closeMenu}>
                        Badge
                    </Link>

                    <Link to="/profile" className={getLinkClass("/profile")} onClick={closeMenu}>
                        Profilo
                    </Link>

                    <button
                        onClick={() => { onLogout(); closeMenu(); }}
                        className="btn-logout"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

