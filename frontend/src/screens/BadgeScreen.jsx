import React, { useMemo } from "react";
import { FaTrophy, FaBolt, FaMedal, FaRunning, FaMountain, FaLock, FaSwimmer, FaDumbbell } from "react-icons/fa";

export default function BadgeScreen({ user }) {
    const storedUser = useMemo(() => {
        try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    }, []);
    const effectiveUser = user || storedUser;

    // SIMULAZIONE DATI DAL BACKEND
    // In futuro questi dati arriveranno da ApiService.getBadges(userId)
    const badges = [
        { id: 1, name: "Primo Passo", desc: "Effettua il tuo primo Check-In", icon: <FaRunning />, unlocked: true },
        { id: 2, name: "Costanza", desc: "Streak di 3 giorni consecutivi", icon: <FaBolt />, unlocked: true },
        { id: 3, name: "Veterano", desc: "Iscritto alla piattaforma da 1 mese", icon: <FaMedal />, unlocked: false },
        { id: 4, name: "Scalatore", desc: "Registra un'attività di Trekking", icon: <FaMountain />, unlocked: false },
        { id: 5, name: "Delfino", desc: "Completa 10 sessioni di Nuoto", icon: <FaSwimmer />, unlocked: false },
        { id: 6, name: "Bodybuilder", desc: "5 Check-in in Palestra con intensità 10", icon: <FaDumbbell />, unlocked: false },
        { id: 7, name: "Campione", desc: "Vinci una sfida di gruppo", icon: <FaTrophy />, unlocked: false },
    ];

    // Calcolo statistiche
    const unlockedCount = badges.filter(b => b.unlocked).length;
    const totalBadges = badges.length;
    const progressPercentage = (unlockedCount / totalBadges) * 100;

    return (
        <div className="page-container">
            <h2 className="page-title">
                <FaTrophy style={{ marginRight: 10, fontSize: "1.5rem" }} />
                BACHECA TROFEI
            </h2>

            {/* CARD RIEPILOGO E PROGRESSO */}
            <div className="profile-card" style={{ padding: "30px", marginBottom: "40px" }}>
                <h3 style={{ color: "var(--primary)", marginTop: 0 }}>
                    Livello Collezionista
                </h3>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <span>Progressi sblocco</span>
                    <span>{unlockedCount} / {totalBadges}</span>
                </div>

                {/* Barra di Progresso */}
                <div style={{ width: "100%", height: "12px", background: "#333", borderRadius: "6px", overflow: "hidden" }}>
                    <div
                        style={{
                            width: `${progressPercentage}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, var(--primary), var(--accent))",
                            transition: "width 0.8s ease-in-out"
                        }}
                    />
                </div>

                <p style={{ marginTop: "20px", color: "#eee" }}>
                    Completa le sfide e mantieni alta la streak per sbloccare nuovi badge esclusivi!
                </p>
            </div>

            {/* GRIGLIA DEI BADGE */}
            <h3 style={{ color: "var(--text-main)", textAlign: "center", fontFamily: "Azonix, sans-serif", marginBottom: "20px" }}>
                TUTTI I BADGE
            </h3>

            <div className="badge-grid">
                {badges.map((badge) => (
                    <div key={badge.id} className={`badge-item ${badge.unlocked ? "unlocked" : "locked"}`}>

                        {/* Cerchio Icona */}
                        <div className="badge-circle-large">
                            {badge.unlocked ? badge.icon : <FaLock />}
                        </div>

                        {/* Testi */}
                        <div className="badge-name">{badge.name}</div>
                        <div className="badge-desc">{badge.desc}</div>

                        {/* Etichetta Stato */}
                        <div className="badge-status">
                            {badge.unlocked ? "SBLOCCATO" : "BLOCCATO"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}