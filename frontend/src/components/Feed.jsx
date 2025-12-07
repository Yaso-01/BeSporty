import React, { useEffect, useState, useMemo } from "react";
import { ApiService } from "../services/ApiService";

function FeedItem({ post }) {
    // RECUPERO UTENTE DIRETTO (Più robusto)
    const currentUser = useMemo(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    }, []);

    const [likes, setLikes] = useState(post.likeCount || 0);
    const [isLiked, setIsLiked] = useState(false);

    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");

    // Mostra il numero commenti reale se caricati, altrimenti quello del post
    const commentCountDisplay = showComments ? comments.length : (post.commentCount || 0);

    // 1. Controllo stato iniziale Like
    useEffect(() => {
        let mounted = true;
        const checkStatus = async () => {
            if (currentUser && post.id) {
                try {
                    const status = await ApiService.getLikeStatus(post.id, currentUser.id);
                    if(mounted) setIsLiked(status.liked);
                } catch (e) {
                    console.warn("Info like non disponibile", e);
                }
            }
        };
        checkStatus();
        return () => { mounted = false; };
    }, [post.id, currentUser]);

    // Gestione Click Like
    const handleLike = async () => {
        if(!currentUser) {
            alert("Effettua il login per mettere like!");
            return;
        }

        // Aggiornamento visivo immediato
        const prevLiked = isLiked;
        const prevLikes = likes;
        setIsLiked(!prevLiked);
        setLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);

        try {
            const res = await ApiService.toggleLike(post.id, currentUser.id);
            if(res.newCount !== undefined) setLikes(res.newCount);
            if(res.liked !== undefined) setIsLiked(res.liked);
        } catch(e) {
            // Se fallisce, torna indietro
            setIsLiked(prevLiked);
            setLikes(prevLikes);
            alert("Errore like. Riprova.");
        }
    };

    // Gestione Click Commenti
    const toggleComments = async () => {
        if (!showComments) {
            try {
                const data = await ApiService.getComments(post.id);
                setComments(data);
            } catch(e) {
                console.error(e);
            }
        }
        setShowComments(!showComments);
    };

    // Invio Commento
    const handleSendComment = async () => {
        if(!newComment.trim()) return;
        if(!currentUser) {
            alert("Effettua il login per commentare!");
            return;
        }

        try {
            const added = await ApiService.addComment(post.id, currentUser.id, newComment);
            setComments([...comments, added]);
            setNewComment("");
        } catch(e) {
            console.error(e);
            alert("Errore invio commento.");
        }
    };

    return (
        <li style={{
            background: "#222", padding: "18px", borderRadius: "12px", marginBottom: "16px",
            boxShadow: "0 2px 8px #00000055", color: "#fff", border: "1px solid #333"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ margin: 0, color: "#fda085" }}>{post.username || "Anonimo"}</h3>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                </span>
            </div>

            <p style={{ margin: "8px 0", fontSize: "1.1rem" }}>{post.text}</p>

            <div style={{ fontSize: "0.9em", color: "#aaa", marginBottom: "15px" }}>
                <span style={{ color: "#2ed573", fontWeight: "bold", textTransform: "uppercase" }}>🏅 {post.sport}</span>
                {post.intensity && <span style={{ marginLeft: 15 }}>⚡ Intensità: {post.intensity}</span>}
            </div>

            {post.imageUrl && (
                <img src={post.imageUrl} alt="post" style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "15px" }} />
            )}

            {/* BARRA AZIONI */}
            <div style={{ display: "flex", gap: "25px", borderTop: "1px solid #444", paddingTop: "12px" }}>
                <button
                    onClick={handleLike}
                    style={{ background: "none", border: "none", color: isLiked ? "#ff4757" : "#bbb", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "1rem", fontFamily: "inherit", transition: "color 0.2s" }}>
                    {isLiked ? "❤️" : "🤍"} {likes} Like
                </button>
                <button
                    onClick={toggleComments}
                    style={{ background: "none", border: "none", color: "#bbb", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "1rem", fontFamily: "inherit" }}>
                    💬 {commentCountDisplay} Commenti
                </button>
            </div>

            {/* AREA COMMENTI */}
            {showComments && (
                <div style={{ marginTop: "15px", background: "#1a1a1a", padding: "15px", borderRadius: "10px" }}>
                    {comments.length === 0 && <div style={{color: "#777", fontSize: "0.9rem", textAlign: "center"}}>Nessun commento. Scrivi il primo!</div>}

                    <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "15px" }}>
                        {comments.map(c => (
                            <div key={c.id} style={{ marginBottom: "10px", borderBottom: "1px solid #333", paddingBottom: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <strong style={{ color: "#2ed573", fontSize: "0.85rem" }}>{c.user ? c.user.username : "Utente"}</strong>
                                    <span style={{ fontSize: "0.7rem", color: "#555" }}>{new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div style={{ fontSize: "0.95rem", color: "#ddd", marginTop: "2px" }}>{c.text}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Scrivi un commento..."
                            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #444", background: "#2a2a2a", color: "#fff", outline: "none" }}
                        />
                        <button onClick={handleSendComment} style={{ background: "#2ed573", border: "none", borderRadius: "8px", cursor: "pointer", padding: "0 18px", color: "#000", fontWeight: "bold" }}>➤</button>
                    </div>
                </div>
            )}
        </li>
    );
}

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFeed = async () => {
            try {
                setLoading(true);
                const data = await ApiService.getFeed();
                setPosts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError("Impossibile caricare il feed.");
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        loadFeed();
    }, []);

    if (loading) return <div style={{ color: "#fff", padding: 20, textAlign: "center" }}>Caricamento feed...</div>;
    if (error) return <div style={{ color: "#ff6b6b", padding: 20, textAlign: "center" }}>{error}</div>;
    if (!posts.length) return <div style={{ marginTop: 20, color: "#ccc", textAlign: "center" }}>Nessun check-in trovato.</div>;

    return (
        <div style={{ marginTop: "20px" }}>
            <h2 style={{ color: "#2ed573", marginBottom: 18, fontFamily: "Azonix", textAlign: "center" }}>FEED</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {posts.map(post => (
                    <FeedItem key={post.id} post={post} />
                ))}
            </ul>
        </div>
    );
}