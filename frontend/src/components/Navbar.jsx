import React from "react";
// 1. Importa useNavigate e la nuova icona
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUserAlt, FaUsers, FaTrophy, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css"; // Stile personalizzato

// 2. Accetta la prop "onLogout"
export default function Navbar({ onLogout }) {
    const location = useLocation();
    // 3. Inizializza navigate
    const navigate = useNavigate();

    const navItems = [
        { to: "/feed", icon: <FaHome />, label: "Feed" },
        { to: "/checkin", icon: <FaPlusCircle />, label: "Check-In" },
        { to: "/groups", icon: <FaUsers />, label: "Gruppi" },
        { to: "/badges", icon: <FaTrophy />, label: "Badge" },
        { to: "/profile", icon: <FaUserAlt />, label: "Profilo" },
    ];

    // 4. Crea la funzione per gestire il click sul logout
    const handleLogoutClick = () => {
        onLogout(); // Pulisce lo stato in App.js e il localStorage
        navigate('/login', { replace: true }); // Torna al login
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <span role="img" aria-label="logo" className="logo-emoji">🏆</span>
                <span className="navbar-title">BeSporty</span>
            </div>
            <div className="navbar-tabs">
                {navItems.map(item => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={location.pathname === item.to ? "nav-link active" : "nav-link"}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}

                {/* 5. Aggiungi il pulsante di Logout */}
                <button
                    onClick={handleLogoutClick}
                    className="nav-link logout-button" // Usiamo le classi giuste
                >
                    <FaSignOutAlt />
                    <span>Abbandona</span>
                </button>
            </div>
        </nav>
    );
}