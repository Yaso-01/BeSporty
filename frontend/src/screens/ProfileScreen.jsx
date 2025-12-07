import React, { useEffect, useMemo, useState } from "react";
import { ApiService } from "../services/ApiService";

export default function ProfileScreen({ user }) {
    // Se non arriva via props, prova da localStorage
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
                // Carica eventuali altri campi profilo dal BE
                const p = await ApiService.getProfile(effectiveUser.id);
                setProfile({ ...effectiveUser, ...p });
            } catch (e) {
                setError("Impossibile caricare il profilo");
            }
        };
        load();
    }, [effectiveUser]);

    if (!effectiveUser) {
        return (
            <div style={{ padding: "24px", color: "#fff" }}>
                Effettua l’accesso per vedere il profilo.
            </div>
        );
    }

    return (
        <div style={{ padding: "24px", background: "#181818", minHeight: "100vh" }}>
            <div
                style={{
                    background: "#222",
                    color: "#fff",
                    padding: "32px 24px",
                    borderRadius: "22px",
                    margin: "0 auto",
                    maxWidth: "500px",
                    boxShadow: "0 2px 18px #2ed57333",
                }}
            >
                <h2
                    style={{
                        color: "#2ed573",
                        marginBottom: 12,
                        fontWeight: 700,
                        letterSpacing: 2,
                    }}
                >
                    Profilo Personale
                </h2>
                <div
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        margin: "0 auto 20px auto",
                        background: "linear-gradient(120deg, #2ed573 70%, #fda085 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 48,
                        color: "#000",
                        fontWeight: 800,
                    }}
                >
                    <span role="img" aria-label="avatar">🏋️‍♂️</span>
                </div>

                {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

                <div style={{ marginBottom: 10 }}>
                    @{profile?.username || "username"}
                </div>
                <div style={{ marginBottom: 8 }}>
                    Email: <span style={{ color: "#fda085" }}>{profile?.email || "-"}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                    Sport preferito: <span style={{ color: "#fda085" }}>{profile?.sportPreference || "Da inserire"}</span>
                </div>
                <div style={{ marginBottom: 16 }}>
                    Streak: <span style={{ color: "#2ed573", fontWeight: "bold" }}>0</span>
                </div>
                <div style={{ marginBottom: 18, fontWeight: 600, color: "#fda085" }}>
                    Badge sbloccati:
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 14,
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
          <span
              style={{
                  background: "#2ed573",
                  color: "#000",
                  borderRadius: "50%",
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 700,
              }}
          >
            🏆
          </span>
                    <span
                        style={{
                            background: "#fda085",
                            color: "#000",
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 26,
                            fontWeight: 700,
                        }}
                    >
            🔥
          </span>
                </div>
            </div>
        </div>
    );
}
