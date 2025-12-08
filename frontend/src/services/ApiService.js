import axios from "axios";
//Tutte le chiamate passano per ApiService.js.
// Questo è un ottimo pattern (Facade).
// Se domani cambi l'URL del backend da localhost a un server cloud,
// devi modificare solo una riga (BASE_URL).

// Cambia questa variabile se il backend ha porta diversa
const BASE_URL = "http://localhost:8080/api";

export const ApiService = {
    /**
     * Registrazione utente
     */
    register: async (userData) => {
        try {
            const res = await axios.post(`${BASE_URL}/users/register`, userData, {
                headers: { "Content-Type": "application/json" }
            });
            return res.data;
        } catch (err) {
            console.error("Errore registrazione:", err);
            throw new Error(err.response?.data?.message || "Errore durante la registrazione");
        }
    },

    /**
     * Login utente
     */
    login: async (usernameOrEmail, password) => {
        try {
            const res = await axios.post(`${BASE_URL}/users/login`, { usernameOrEmail, password }, {
                headers: { "Content-Type": "application/json" }
            });
            return res.data;
        } catch (err) {
            console.error("Errore login:", err);
            throw new Error(err.response?.data?.message || "Credenziali errate");
        }
    },

    /**
     * Recupera il feed (tutti i check-in)
     */
    getFeed: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/checkin/feed`);
            const data = res.data;
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.data)) return data.data;
            return [];
        } catch (err) {
            console.error("Errore caricamento feed:", err);
            throw new Error(err.response?.data?.error || "Errore caricamento feed");
        }
    },

    /**
     * Crea un nuovo check-in
     */
    createPost: async (userId, postData) => {
        try {
            const payload = {
                userId: userId,
                text: postData.text,
                sport: postData.sport,
                feeling: postData.feeling,
                intensity: Number(postData.intensity) || null,
                visibility: postData.visibility?.toUpperCase() || "PUBLIC",
                imageUrl: postData.imageUrl || null
            };

            const res = await axios.post(`${BASE_URL}/checkin`, payload, {
                headers: { "Content-Type": "application/json" }
            });

            return res.data;
        } catch (err) {
            console.error("Errore creazione post:", err);
            throw new Error(err.response?.data?.error || "Errore creazione post");
        }
    },

    /**
     * Recupera profilo utente
     */
    getProfile: async (userId) => {
        try {
            const res = await axios.get(`${BASE_URL}/users/${userId}`);
            return res.data;
        } catch (err) {
            console.error("Errore caricamento profilo:", err);
            throw new Error(err.response?.data?.error || "Errore caricamento profilo utente");
        }
    },

    // --- GRUPPI ---
    getAllGroups: async () => {
        const res = await axios.get(`${BASE_URL}/groups`);
        return res.data;
    },

    createGroup: async (groupData) => {
        const res = await axios.post(`${BASE_URL}/groups`, groupData);
        return res.data;
    },

    joinGroup: async (groupId, userId) => {
        await axios.post(`${BASE_URL}/groups/${groupId}/addUser/${userId}`);
    },

    // --- INTERAZIONI (LIKE & COMMENTI) ---

    // NUOVO: Controlla se l'utente ha già messo like
    getLikeStatus: async (checkInId, userId) => {
        const res = await axios.get(`${BASE_URL}/interactions/status/${checkInId}/${userId}`);
        return res.data; // Ritorna { liked: true/false }
    },

    toggleLike: async (checkInId, userId) => {
        // Ritorna { liked: true/false, newCount: number }
        const res = await axios.post(`${BASE_URL}/interactions/like/${checkInId}/${userId}`);
        return res.data;
    },

    addComment: async (checkInId, userId, text) => {
        const res = await axios.post(`${BASE_URL}/interactions/comment`, {
            checkInId, userId, text
        });
        return res.data;
    },

    getComments: async (checkInId) => {
        const res = await axios.get(`${BASE_URL}/interactions/comments/${checkInId}`);
        return res.data;
    }
};