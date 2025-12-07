import React, { useState } from 'react';
// 1. MODIFICA: Importiamo i componenti del Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppRouter from './navigation/AppRouter';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    // 2. MODIFICA: Rimuoviamo 'isRegistering', lo gestirà il Router

    const handleLogin = (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("Impossibile salvare l'utente nel localStorage", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // 3. MODIFICA: Avvolgiamo tutto in <BrowserRouter>
    return (
        <BrowserRouter>
            {/* 4. MODIFICA: La logica di routing ora gestisce tutto */}
            {!user ? (
                // Se l'utente NON è loggato, mostriamo solo le rotte di Login e Register
                <Routes>
                    <Route
                        path="/login"
                        element={<Login onLogin={handleLogin} />}
                    />
                    <Route
                        path="/register"
                        // Passiamo onLogin così dopo la registrazione fa l'accesso automatico
                        element={<Register onRegisterSuccess={handleLogin} />}
                    />
                    {/* Qualsiasi altra rotta (es. "/") reindirizza al login */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            ) : (
                // Se l'utente È loggato, mostriamo l'app principale
                <div className="App">
                    <AppRouter user={user} onLogout={handleLogout} />
                </div>
            )}
        </BrowserRouter>
    );
}

export default App;