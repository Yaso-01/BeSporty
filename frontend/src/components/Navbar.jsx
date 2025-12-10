import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Assicurati di avere react-icons installato
import "./Navbar.css";

export default function Navbar({ onLogout }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); // Stato per gestire apertura/chiusura

    // Helper per classe attiva
    const getLinkClass = (path) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    // Funzione per chiudere il menu quando si clicca un link
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/feed" className="navbar-brand" onClick={closeMenu}>
                    BESPORTY
                </Link>

                {/* Icona Hamburger (visibile solo su mobile) */}
                <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>

                {/* Lista Link (Aggiungiamo classe 'active' se aperto) */}
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
                    <Link to="/profile" className={getLinkClass("/profile")} onClick={closeMenu}>
                        Profilo
                    </Link>

                    {/* Bottone Logout */}
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
