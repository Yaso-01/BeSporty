import React, { useEffect, useMemo, useState } from "react";
import { ApiService } from "../services/ApiService";

export default function ProfileScreen({ user }) {
    // 1. Recupero utente da props o localStorage
    const storedUser = useMemo(() => {
        try {
            const raw = localStorage.getItem("user"); // Chiave corretta "user"
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, []);
    const effectiveUser = user || storedUser;

    const [profile, setProfile] = useState(effectiveUser);
    const [error, setError] = useState("");

    // 2. Caricamento dati aggiornati dal Backend (inclusi Età e Sport)
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

    if (!effectiveUser) {
        return (
            <div style={{ padding: "24px", color: "#fff", textAlign: "center" }}>
                <h2>EFFETTUA L'ACCESSO PER VEDERE IL PROFILO.</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px", background: "#000", minHeight: "100vh" }}>
            <div
                style={{
                    background: "#111", // Sfondo leggermente più chiaro del nero totale
                    color: "#fff",
                    padding: "32px 24px",
                    borderRadius: "22px",
                    margin: "0 auto",
                    maxWidth: "500px",
                    boxShadow: "0 0 20px #2ed57333", // Bagliore verde
                    textAlign: "center",
                    fontFamily: "Azonix, sans-serif"
                }}
            >
                <h2
                    style={{
                        color: "#2ed573",
                        marginBottom: 20,
                        letterSpacing: 2,
                    }}
                >
                    PROFILO PERSONALE
                </h2>

                {/* Avatar */}
                <div
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        margin: "0 auto 20px auto",
                        background: "linear-gradient(135deg, #2ed573 0%, #000 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 48,
                        boxShadow: "0 0 15px #2ed573"
                    }}
                >
                    <span role="img" aria-label="avatar">🏋️‍♂️</span>
                </div>

                {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

                <h3 style={{ marginBottom: 5 }}>@{profile?.username || "username"}</h3>

                <div style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: 20 }}>
                    {profile?.email}
                </div>

                {/* DATI UTENTE */}
                <div style={{ textAlign: "left", display: "inline-block", marginTop: 10 }}>

                    <div style={{ marginBottom: 12 }}>
                        <strong style={{ color: "#2ed573" }}>SPORT PREFERITO: </strong>
                        <span style={{ color: "#fda085" }}>{profile?.sportPreference || "Non specificato"}</span>
                    </div>

                    {/* --- QUI AGGIUNGIAMO L'ETÀ --- */}
                    <div style={{ marginBottom: 12 }}>
                        <strong style={{ color: "#2ed573" }}>ETÀ: </strong>
                        <span style={{ color: "#fff" }}>{profile?.age ? profile.age + " anni" : "Non specificata"}</span>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <strong style={{ color: "#2ed573" }}>STREAK: </strong>
                        <span style={{ color: "#fff", fontWeight: "bold" }}>0 Giorni</span>
                    </div>
                </div>

                {/* BADGE */}
                <div style={{ marginTop: 30 }}>
                    <div style={{ marginBottom: 18, fontWeight: 600, color: "#fda085" }}>
                        BADGE SBLOCCATI:
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: 14,
                            justifyContent: "center",
                        }}
                    >
                        <span className="badge-icon" style={{ background: "#2ed573", padding: 10, borderRadius: "50%" }}>🏆</span>
                        <span className="badge-icon" style={{ background: "#fda085", padding: 10, borderRadius: "50%" }}>🔥</span>
                    </div>
                </div>
            </div>
        </div>
    );
}