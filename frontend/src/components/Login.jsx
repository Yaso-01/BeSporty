import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiService } from "../services/ApiService";
import { FaRunning } from "react-icons/fa";

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await ApiService.login(formData.usernameOrEmail, formData.password);
            onLogin(user);
            navigate("/feed");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {/* Logo / Brand */}
                <div className="auth-header">
                    <div className="auth-icon-circle">
                        <FaRunning />
                    </div>
                    <h1 className="auth-title">BESPORTY</h1>
                    <p className="auth-subtitle">Entra nel gioco. Supera i limiti.</p>
                </div>

                {error && <div className="msg-error" style={{textAlign: 'center', marginBottom: 15}}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Email o Username</label>
                        <input
                            name="usernameOrEmail"
                            type="text"
                            placeholder="Inserisci le tue credenziali"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>
                        ACCEDI ORA
                    </button>
                </form>

                <div className="auth-footer">
                    Non hai ancora un account? <Link to="/register" className="auth-link">Registrati qui</Link>
                </div>
            </div>
        </div>
    );
}