import React, { useEffect, useState, useMemo } from "react";
import { ApiService } from "../services/ApiService";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane } from "react-icons/fa"; // Icone più belle

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
        <li className="feed-card">
            {/* Header del Post */}
            <div className="card-header">
                <div className="user-info">
                    <div className="avatar-placeholder">
                        {post.username ? post.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                        <h3 className="username">{post.username || "Anonimo"}</h3>
                        <span className="timestamp">
                            {new Date(post.createdAt).toLocaleDateString()} alle {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contenuto Testuale */}
            <div className="card-body">
                <p className="post-text">{post.text}</p>

                <div className="post-meta">
                    <span className="badge-sport">🏅 {post.sport}</span>
                    {post.intensity && (
                        <span className="badge-intensity">⚡ Intensità: {post.intensity}/10</span>
                    )}
                </div>
            </div>

            {/* Immagine (se presente) */}
            {post.imageUrl && (
                <div className="card-image-container">
                    <img src={post.imageUrl} alt="post" className="card-image" />
                </div>
            )}

            {/* BARRA AZIONI */}
            <div className="action-bar">
                <button
                    onClick={handleLike}
                    className={`action-btn ${isLiked ? "liked" : ""}`}
                >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>{likes} Like</span>
                </button>

                <button
                    onClick={toggleComments}
                    className="action-btn"
                >
                    <FaComment />
                    <span>{commentCountDisplay} Commenti</span>
                </button>
            </div>

            {/* AREA COMMENTI */}
            {showComments && (
                <div className="comments-section">
                    {comments.length === 0 && (
                        <div className="no-comments">Nessun commento. Scrivi il primo!</div>
                    )}

                    <div className="comments-list">
                        {comments.map(c => (
                            <div key={c.id} className="comment-item">
                                <div className="comment-header">
                                    <strong className="comment-author">
                                        {c.user ? c.user.username : "Utente"}
                                    </strong>
                                    <span className="comment-time">
                                        {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <div className="comment-text">{c.text}</div>
                            </div>
                        ))}
                    </div>

                    <div className="comment-input-wrapper">
                        <input
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Scrivi un commento..."
                            className="comment-input"
                        />
                        <button onClick={handleSendComment} className="send-btn">
                            <FaPaperPlane />
                        </button>
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

    if (loading) return <div className="feed-loading">Caricamento feed...</div>;
    if (error) return <div className="feed-error">{error}</div>;
    if (!posts.length) return <div className="feed-empty">Nessun check-in trovato.</div>;

    return (
        <div className="feed-container">
            <h2 className="feed-title">FEED ATTIVITÀ</h2>
            <ul className="feed-list">
                {posts.map(post => (
                    <FeedItem key={post.id} post={post} />
                ))}
            </ul>
        </div>
    );
}