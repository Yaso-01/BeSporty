import React, { useEffect, useMemo, useState } from "react";
import { ApiService } from "../services/ApiService";
import { FaMedal, FaFire, FaUserAstronaut } from "react-icons/fa"; // Ho aggiunto un'icona carina per il placeholder

export default function ProfileScreen({ user }) {
    // 1. Recupero utente da props o localStorage
    const storedUser = useMemo(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, []);
    const effectiveUser = user || storedUser;

    const [profile, setProfile] = useState(effectiveUser);
    const [error, setError] = useState("");

    // 2. Caricamento dati aggiornati dal Backend
    useEffect(() => {
        const load = async () => {
            if (!effectiveUser?.id) return;
            try {
                const p = await ApiService.getProfile(effectiveUser.id);
                // Uniamo i dati locali con quelli freschi del server
                setProfile({ ...effectiveUser, ...p });
            } catch (e) {
                console.error(e);
                setError("Impossibile caricare il profilo");
            }
        };
        load();
    }, [effectiveUser]);

    // Se l'utente non è loggato
    if (!effectiveUser) {
        return (
            <div className="page-container" style={{ textAlign: "center", marginTop: "50px" }}>
                <h2 style={{color: "var(--secondary)", fontFamily: "Azonix, sans-serif"}}>ACCESSO RICHIESTO</h2>
                <p style={{color: "var(--text-muted)"}}>Effettua il login per visualizzare il tuo profilo.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h2 className="page-title">IL TUO PROFILO</h2>

            <div className="profile-card">
                {/* Avatar Iconico */}
                <div className="profile-avatar-large">
                    {profile?.username ? (
                        profile.username.charAt(0).toUpperCase()
                    ) : (
                        <FaUserAstronaut />
                    )}
                </div>

                {error && <div style={{ color: "var(--secondary)", marginBottom: 10 }}>{error}</div>}

                <h3 className="profile-username">@{profile?.username}</h3>
                <div className="profile-email">{profile?.email}</div>

                {/* Griglia Statistiche */}
                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="stat-label">Sport Preferito</span>
                        <div className="stat-value" style={{color: "var(--primary)"}}>
                            {profile?.sportPreference || "Misto"}
                        </div>
                    </div>

                    <div className="stat-box">
                        <span className="stat-label">Età</span>
                        <div className="stat-value">
                            {profile?.age ? profile.age + " anni" : "--"}
                        </div>
                    </div>

                    <div className="stat-box">
                        <span className="stat-label">Streak</span>
                        <div className="stat-value">🔥 3 Giorni</div>
                    </div>

                    <div className="stat-box">
                        <span className="stat-label">Livello</span>
                        <div className="stat-value">Rookie 1</div>
                    </div>
                </div>

                {/* Sezione Badge (Aggiornata con classe badge-circle) */}
                <div className="badges-section">
                    <h4>BADGE SBLOCCATI</h4>

                    <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>

                        {/* Badge 1: Campione */}
                        <div
                            className="badge-circle"
                            style={{ background: "rgba(46, 213, 115, 0.2)", color: "var(--primary)" }}
                            title="Campione"
                        >
                            <FaMedal />
                        </div>

                        {/* Badge 2: On Fire */}
                        <div
                            className="badge-circle"
                            style={{ background: "rgba(255, 165, 2, 0.2)", color: "var(--accent)" }}
                            title="Streak attiva"
                        >
                            <FaFire />
                        </div>

                        {/* Badge Vuoto/Bloccato */}
                        <div
                            className="badge-circle"
                            style={{ background: "#333", color: "#555", cursor: "default" }}
                            title="Da sbloccare"
                        >
                            ?
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}