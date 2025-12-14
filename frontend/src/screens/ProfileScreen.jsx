import React, { useEffect, useMemo, useState } from "react";
import { ApiService } from "../services/ApiService";
import { FaRunning, FaBolt, FaUserAstronaut } from "react-icons/fa"; // Icone coerenti con BadgeScreen

export default function ProfileScreen({ user }) {
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

    useEffect(() => {
        const load = async () => {
            if (!effectiveUser?.id) return;
            try {
                const p = await ApiService.getProfile(effectiveUser.id);
                setProfile({ ...effectiveUser, ...p });
            } catch (e) {
                console.error(e);
                setError("Impossibile caricare il profilo");
            }
        };
        load();
    }, [effectiveUser]);

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

                {/* Sezione Badge Sincronizzata */}
                <div className="badges-section">
                    <h4>ULTIMI BADGE SBLOCCATI</h4>

                    <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>

                        {/* Badge 1: Primo Passo (Coerente con BadgeScreen) */}
                        <div
                            className="badge-circle"
                            style={{ background: "rgba(46, 213, 115, 0.1)", color: "var(--primary)", border: "2px solid var(--primary)" }}
                            title="Primo Passo: Primo Check-In effettuato"
                        >
                            <FaRunning />
                        </div>

                        {/* Badge 2: Costanza (Coerente con BadgeScreen) */}
                        <div
                            className="badge-circle"
                            style={{ background: "rgba(255, 165, 2, 0.1)", color: "var(--accent)", border: "2px solid var(--accent)" }}
                            title="Costanza: 3 Giorni di fila"
                        >
                            <FaBolt />
                        </div>

                        {/* Placeholder Vuoto */}
                        <div
                            className="badge-circle"
                            style={{ background: "#2a2a2a", color: "#555", cursor: "default", border: "2px solid #444" }}
                            title="Slot Vuoto"
                        >
                            ?
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}