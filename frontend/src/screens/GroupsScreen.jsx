import React, { useEffect, useState, useMemo } from "react";
import { ApiService } from "../services/ApiService";
import { FaPlusCircle, FaFutbol, FaDumbbell, FaBiking, FaRunning } from "react-icons/fa";

export default function GroupsScreen() {
    // Recupera utente loggato dal localStorage
    const storedUser = useMemo(() => {
        try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    }, []);

    const [groups, setGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: "", description: "" });

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
            loadGroups(); // Ricarica per aggiornare contatori
        } catch (e) {
            alert("Errore nell'unirsi al gruppo.");
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await ApiService.createGroup({
                name: newGroup.name,
                description: newGroup.description,
                isPrivate: false
            });
            setShowModal(false);
            setNewGroup({ name: "", description: "" });
            loadGroups();
        } catch (e) {
            alert("Errore creazione gruppo");
        }
    };

    const getIcon = (name) => {
        const n = (name || "").toLowerCase();
        if(n.includes("calcio") || n.includes("soccer")) return <FaFutbol />;
        if(n.includes("gym") || n.includes("crossfit") || n.includes("pesi")) return <FaDumbbell />;
        if(n.includes("bici") || n.includes("mtb")) return <FaBiking />;
        return <FaRunning />;
    };

    return (
        <div style={{ padding: "24px", background: "#000", minHeight: "100vh", fontFamily: "Azonix, sans-serif" }}>

            {/* Header Banner */}
            <div style={{
                background: "linear-gradient(90deg, #2ed573 20%, #fda085 100%)",
                padding: "1rem", borderRadius: "15px", textAlign: "center",
                color: "#000", fontWeight: "bold", fontSize: "1.5rem", marginBottom: "30px"
            }}>
                ALWAYS SPINGERE 💪🔥
            </div>

            {/* SEZIONE: TUOI GRUPPI E CREA */}
            <div style={{
                border: "1px solid #2ed573", borderRadius: "20px", padding: "20px",
                marginBottom: "40px", boxShadow: "0 0 10px #2ed57355", background: "#111"
            }}>
                <h3 style={{ color: "#2ed573", marginTop: 0 }}>👥 I TUOI GRUPPI E CREA NUOVO</h3>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

                    {/* Bottone Crea */}
                    <div
                        onClick={() => setShowModal(true)}
                        style={{
                            border: "1px solid #2ed573", borderRadius: "15px", padding: "20px",
                            minWidth: "200px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px",
                            color: "#2ed573", fontWeight: "bold", background: "#000"
                        }}>
                        <FaPlusCircle size={24} />
                        CREA NUOVO GRUPPO
                    </div>

                    {/* Placeholder statico Gruppi a cui appartieni (opzionale: potresti filtrare 'groups' per memberId) */}
                    <div style={{
                        border: "1px solid #2ed573", borderRadius: "15px", padding: "15px 25px",
                        minWidth: "200px", display: "flex", alignItems: "center", gap: "15px",
                        background: "#111", color: "#fff", boxShadow: "0 0 5px #2ed573"
                    }}>
                        <div style={{ fontSize: "2rem", color: "#fff" }}>⚽</div>
                        <div>
                            <div style={{ color: "#2ed573", fontWeight: "bold" }}>RUNNER DI MILANO</div>
                            <div style={{ fontSize: "0.8rem", color: "#ccc" }}>ISCRITTO</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEZIONE: LISTA TUTTI */}
            <h3 style={{ color: "#2ed573", textAlign: "center", marginBottom: "20px" }}>SCOPRI TUTTI I GRUPPI ESISTENTI</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                {groups.map(g => (
                    <div key={g.id} style={{
                        border: "1px solid #2ed573", borderRadius: "15px", padding: "20px",
                        background: "#111", textAlign: "center", color: "#fff",
                        boxShadow: "0 0 8px #2ed57333"
                    }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#fda085" }}>
                            {getIcon(g.name)}
                        </div>
                        <div style={{ color: "#fda085", fontWeight: "bold", marginBottom: "5px", textTransform: "uppercase" }}>
                            {g.name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#aaa", marginBottom: "15px" }}>
                            {g.members ? g.members.length : 0} MEMBRI
                        </div>
                        <button
                            onClick={() => handleJoin(g.id)}
                            style={{
                                background: "transparent", border: "1px solid #2ed573", color: "#2ed573",
                                padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold",
                                fontFamily: "Azonix"
                            }}
                            onMouseOver={(e) => { e.target.style.background = "#2ed573"; e.target.style.color = "#000"; }}
                            onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#2ed573"; }}
                        >
                            UNISCITI
                        </button>
                    </div>
                ))}
            </div>

            {/* MODALE CREAZIONE */}
            {showModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
                    background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{ background: "#222", padding: "30px", borderRadius: "20px", width: "320px", border: "1px solid #2ed573" }}>
                        <h3 style={{ color: "#2ed573", marginTop: 0, textAlign: "center" }}>Nuovo Gruppo</h3>
                        <input
                            placeholder="Nome gruppo"
                            value={newGroup.name}
                            onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                            style={{ width: "100%", marginBottom: "10px", padding: "10px", background: "#333", border: "1px solid #555", color: "#fff" }}
                        />
                        <input
                            placeholder="Descrizione"
                            value={newGroup.description}
                            onChange={e => setNewGroup({...newGroup, description: e.target.value})}
                            style={{ width: "100%", marginBottom: "20px", padding: "10px", background: "#333", border: "1px solid #555", color: "#fff" }}
                        />
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={handleCreateGroup} className="btn-accent" style={{ flex: 1, marginTop: 0 }}>CREA</button>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, background: "#444", border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer" }}>ANNULLA</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}