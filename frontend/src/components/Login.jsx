import React, { useState } from 'react';
import { ApiService } from '../services/ApiService';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; // Icone
import './Auth.css'; // Importa il nuovo CSS

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Nota: ApiService.login si aspetta (email, password)
            // Assicurati che il backend accetti "usernameOrEmail" se usi l'email
            const response = await ApiService.login(email, password);
            onLogin(response);
            navigate('/feed');
        } catch (err) {
            console.error(err);
            setError('Credenziali non valide. Riprova.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                {/* Icona omino in alto */}
                <div className="auth-icon-top">
                    <FaUser />
                </div>

                <h2 className="auth-title">User Login</h2>

                <form onSubmit={handleLogin}>
                    {/* Campo Email */}
                    <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input
                            type="text" // Uso text per permettere username o email
                            className="auth-input"
                            placeholder="Email o Username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo Password */}
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            className="auth-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <div className="auth-options">
                        <label>
                            <input type="checkbox" style={{ marginRight: 5 }} />
                            Ricordami
                        </label>
                        <span>Password dimenticata?</span>
                    </div>

                    <button type="submit" className="auth-button" style={{background: "#3b5998"}}>
                        LOGIN
                    </button>

                    <div style={{ marginTop: 20, fontSize: '0.9rem', color: '#888' }}>
                        Non hai un account? <Link to="/register">Registrati</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;