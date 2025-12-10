import React, { useEffect, useState, useMemo } from "react";
import { ApiService } from "../services/ApiService";
import {
    FaPlusCircle, FaUsers,
    FaRunning, FaDumbbell, FaSwimmer, FaBiking, FaFutbol, FaBasketballBall, FaWalking, FaHiking
} from "react-icons/fa";
import { IoIosTennisball } from "react-icons/io";

// CONFIGURAZIONE: Lista sport identica a NewPost.jsx
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

export default function GroupsScreen() {
    const storedUser = useMemo(() => {
        try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    }, []);

    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Stato del nuovo gruppo con sport di default
    const [newGroup, setNewGroup] = useState({
        name: "",
        description: "",
        sport: "Running"
    });

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const data = await ApiService.getAllGroups();
            setGroups(data);
        } catch (error) {
            console.error("Errore caricamento gruppi", error);
        }
    };

    const handleJoin = async (groupId) => {
        if(!storedUser) return alert("Devi essere loggato!");
        try {
            await ApiService.joinGroup(groupId, storedUser.id);
            alert("Ti sei unito al gruppo!");
            loadGroups();
        } catch (e) {
            alert("Errore nell'unirsi al gruppo.");
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            // Inviamo anche il campo 'sport' al backend
            await ApiService.createGroup({
                name: newGroup.name,
                description: newGroup.description,
                sport: newGroup.sport,
                isPrivate: false
            });
            setShowModal(false);
            setNewGroup({ name: "", description: "", sport: "Running" });
            loadGroups();
        } catch (e) {
            alert("Errore creazione gruppo");
        }
    };

    // Helper per trovare l'icona dallo sport salvato (o fallback sul nome)
    const getGroupIcon = (group) => {
        // 1. Se il gruppo ha il campo 'sport', usiamo quello
        if (group.sport) {
            const found = SPORTS_OPTIONS.find(s => s.id === group.sport);
            if (found) return found.icon;
        }
        // 2. Fallback: cerca nel nome (vecchia logica per compatibilità)
        const n = (group.name || "").toLowerCase();
        if(n.includes("calcio") || n.includes("soccer")) return <FaFutbol />;
        if(n.includes("gym") || n.includes("palestra")) return <FaDumbbell />;
        if(n.includes("bici") || n.includes("cycling")) return <FaBiking />;

        // 3. Icona generica se nulla corrisponde
        return <FaUsers />;
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Community & Gruppi</h2>

            <div className="groups-grid">

                {/* Card Speciale: CREA GRUPPO */}
                <div className="group-card create-card" onClick={() => setShowModal(true)}>
                    <FaPlusCircle size={40} color="var(--primary)" />
                    <span style={{color: "var(--primary)", fontWeight: "bold"}}>CREA NUOVO GRUPPO</span>
                </div>

                {/* Lista Gruppi */}
                {groups.map(g => (
                    <div key={g.id} className="group-card">
                        <div className="group-icon-wrapper">
                            {getGroupIcon(g)}
                        </div>

                        <div style={{width: "100%"}}>
                            <div className="group-name">{g.name}</div>
                            {/* Mostriamo anche l'etichetta dello sport se presente */}
                            {g.sport && <div style={{color: "var(--primary)", fontSize:"0.8rem", marginBottom: 5}}>{g.sport}</div>}

                            <div className="group-members">
                                {g.members ? g.members.length : 0} Membri
                            </div>

                            <button
                                onClick={() => handleJoin(g.id)}
                                className="btn-primary"
                                style={{ width: "100%", padding: "10px", fontSize: "0.9rem" }}
                            >
                                UNISCITI
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODALE CREAZIONE GRUPPO AGGIORNATO */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{maxHeight: "90vh", overflowY: "auto"}}>
                        <h3 style={{ color: "var(--primary)", textAlign: "center", marginTop: 0 }}>
                            Nuovo Gruppo
                        </h3>

                        <input
                            placeholder="Nome del gruppo (es. Running Club Roma)"
                            value={newGroup.name}
                            onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                        />

                        {/* SELETTORE SPORT (Griglia Identica a NewPost) */}
                        <label className="section-label" style={{marginTop: 10}}>Di cosa si occupa il gruppo?</label>
                        <div className="sports-grid" style={{marginBottom: 20}}>
                            {SPORTS_OPTIONS.map((option) => (
                                <div
                                    key={option.id}
                                    className={`sport-card ${newGroup.sport === option.id ? "selected" : ""}`}
                                    onClick={() => setNewGroup({...newGroup, sport: option.id})}
                                >
                                    <div className="sport-icon" style={{fontSize: "1.2rem"}}>{option.icon}</div>
                                    <span className="sport-label" style={{fontSize: "0.7rem"}}>{option.label}</span>
                                </div>
                            ))}
                        </div>

                        <textarea
                            rows="3"
                            placeholder="Descrizione del gruppo..."
                            value={newGroup.description}
                            onChange={e => setNewGroup({...newGroup, description: e.target.value})}
                            style={{ width: "100%", marginBottom: "20px" }}
                        />

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ flex: 1, background: "#444", color: "#fff", padding: "10px", borderRadius: "8px" }}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                className="btn-primary"
                                style={{ flex: 1 }}
                            >
                                Crea Gruppo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}