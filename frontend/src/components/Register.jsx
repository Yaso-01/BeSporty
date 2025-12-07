import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiService } from "../services/ApiService";
import { FaUser, FaEnvelope, FaLock, FaRunning, FaCalendarAlt } from "react-icons/fa";
import './Auth.css';

export default function Register({ onRegisterSuccess }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        sportPreference: "", // Ripristinato
        age: ""              // Ripristinato
    });
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // Inviamo tutto il payload, incluso sport e età
            const data = await ApiService.register(form);

            // Se la registrazione va a buon fine, salviamo e andiamo al feed
            if (onRegisterSuccess) onRegisterSuccess(data);
            navigate('/feed');

        } catch (err) {
            setError(err.message || "Registrazione fallita.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box" style={{ maxWidth: 450 }}>
                <div className="auth-icon-top">
                    <FaUser />
                </div>
                <h2 className="auth-title">Registrati</h2>

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input
                            name="username"
                            className="auth-input"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input
                            name="email"
                            type="email"
                            className="auth-input"
                            placeholder="Email ID"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input
                            name="password"
                            type="password"
                            className="auth-input"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Sport Preferito (Nuovo) */}
                    <div className="input-wrapper">
                        <FaRunning className="input-icon" />
                        <input
                            name="sportPreference"
                            className="auth-input"
                            placeholder="Sport Preferito (es. Calcio)"
                            value={form.sportPreference}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Età (Nuovo) */}
                    <div className="input-wrapper">
                        <FaCalendarAlt className="input-icon" />
                        <input
                            name="age"
                            type="number"
                            className="auth-input"
                            placeholder="La tua età"
                            value={form.age}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" className="auth-button" style={{ background: "#2ed573", color: "#000" }}>
                        CREA ACCOUNT
                    </button>

                    <div style={{ marginTop: 20, fontSize: '0.9rem', color: '#888' }}>
                        Hai già un account? <Link to="/login">Accedi</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}