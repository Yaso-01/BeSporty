import React, { useMemo, useState } from "react";
import { ApiService } from "../services/ApiService";
import {
    FaCamera,
    FaRunning,
    FaDumbbell,
    FaSwimmer,
    FaBiking,
    FaFutbol,
    FaBasketballBall,
    FaWalking,
    FaHiking
} from "react-icons/fa";
import { IoIosTennisball } from "react-icons/io";

// 1. CONFIGURAZIONE: Lista degli sport con Icone e Etichette
const SPORTS_OPTIONS = [
    { id: "Running", label: "Corsa", icon: <FaRunning /> },
    { id: "Gym", label: "Palestra", icon: <FaDumbbell /> },
    { id: "Cycling", label: "Ciclismo", icon: <FaBiking /> },
    { id: "Swimming", label: "Nuoto", icon: <FaSwimmer /> },
    { id: "Soccer", label: "Calcio", icon: <FaFutbol /> },
    { id: "Basketball", label: "Basket", icon: <FaBasketballBall /> },
    { id: "Tennis", label: "Tennis", icon: <IoIosTennisball /> },
    { id: "Walking", label: "Camminata", icon: <FaWalking /> },
    { id: "Hiking", label: "Trekking", icon: <FaHiking /> },
];

export default function NewPost({ user, onPostCreated }) {
    const storedUser = useMemo(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }, []);
    const effectiveUser = user || storedUser;

    const [form, setForm] = useState({
        text: "",
        imageUrl: "",
        sport: effectiveUser?.sportPreference || "Running", // Default sicuro
        feeling: "",
        intensity: "5", // Default intermedio
        visibility: "PUBLIC",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // Funzione specifica per selezionare lo sport dalla griglia
    const selectSport = (sportId) => {
        setForm({ ...form, sport: sportId });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");

        if (!effectiveUser || !effectiveUser.id) {
            setError("Devi effettuare l'accesso per condividere un check-in.");
            return;
        }

        try {
            await ApiService.createPost(effectiveUser.id, form);
            setForm({
                text: "",
                imageUrl: "",
                sport: effectiveUser?.sportPreference || "Running",
                feeling: "",
                intensity: "5",
                visibility: "PUBLIC",
            });
            setSuccess("Check-in condiviso con successo!");
            if (onPostCreated) onPostCreated();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Impossibile creare post.");
        }
    };

    return (
        <div className="newpost-card">
            <div className="newpost-header">
                <FaCamera style={{ fontSize: "1.2rem" }} />
                <span>Nuova Attività</span>
            </div>

            <form onSubmit={handleSubmit}>
                {/* 2. SELETTORE SPORT VISUALE (Griglia) */}
                <label className="section-label">Scegli lo sport:</label>
                <div className="sports-grid">
                    {SPORTS_OPTIONS.map((option) => (
                        <div
                            key={option.id}
                            className={`sport-card ${form.sport === option.id ? "selected" : ""}`}
                            onClick={() => selectSport(option.id)}
                        >
                            <div className="sport-icon">{option.icon}</div>
                            <span className="sport-label">{option.label}</span>
                        </div>
                    ))}
                </div>

                {/* Descrizione */}
                <textarea
                    name="text"
                    rows="3"
                    placeholder="Racconta la tua performance..."
                    value={form.text}
                    onChange={handleChange}
                    required
                    style={{ marginTop: "15px" }}
                />

                <div className="form-row">
                    {/* 3. INTENSITÀ (Select Dropdown) */}
                    <div style={{ flex: 1 }}>
                        <label className="input-label">Intensità</label>
                        <select
                            name="intensity"
                            value={form.intensity}
                            onChange={handleChange}
                            className="styled-select"
                        >
                            <option value="1">1 - Riposo attivo</option>
                            <option value="3">3 - Leggero</option>
                            <option value="5">5 - Moderato</option>
                            <option value="7">7 - Impegnativo</option>
                            <option value="9">9 - Estremo</option>
                            <option value="10">10 - Massimale</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label className="input-label">Visibilità</label>
                        <select
                            name="visibility"
                            value={form.visibility}
                            onChange={handleChange}
                            className="styled-select"
                        >
                            <option value="PUBLIC">🌎 Pubblico</option>
                            <option value="FRIENDS">👥 Amici</option>
                            <option value="PRIVATE">🔒 Privato</option>
                        </select>
                    </div>
                </div>

                <input
                    name="feeling"
                    placeholder="Sensazione (es. Carico a mille! 🔥)"
                    value={form.feeling}
                    onChange={handleChange}
                />

                <input
                    name="imageUrl"
                    placeholder="URL Foto (opzionale)"
                    value={form.imageUrl}
                    onChange={handleChange}
                />

                {error && <div className="msg-error">⚠️ {error}</div>}
                {success && <div className="msg-success">✅ {success}</div>}

                <div style={{ textAlign: "right", marginTop: "15px" }}>
                    <button type="submit" className="btn-primary">
                        PUBBLICA
                    </button>
                </div>
            </form>
        </div>
    );
}