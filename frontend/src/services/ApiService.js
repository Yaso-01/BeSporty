import axios from "axios";

// Cambia questa variabile se il backend ha porta diversa
const BASE_URL = "http://localhost:8080/api";

export const ApiService = {
    /**
     * Registrazione utente
     */
    register: async (userData) => {
        try {
            // NOTA: L'endpoint giusto per la registrazione è /users/register
            const res = await axios.post(`${BASE_URL}/users/register`, userData, {
                headers: { "Content-Type": "application/json" }
            });
            return res.data;
        } catch (err) {
            console.error("Errore registrazione:", err);
            throw new Error(err.response?.data?.message || "Errore durante la registrazione");
        }
    },

    // !!! MODIFICA: HO AGGIUNTO QUESTA FUNZIONE 'login' MANCANTE !!!
    /**
     * Login utente
     */
    login: async (email, password) => {
        try {
            // Chiama l'endpoint di login del backend (UserController.java)
            const res = await axios.post(`${BASE_URL}/users/login`, { email, password }, {
                headers: { "Content-Type": "application/json" }
            });
            return res.data; // Ritorna i dati dell'utente
        } catch (err) {
            console.error("Errore login:", err);
            // Lancia l'errore che il componente Login.jsx mostrerà
            throw new Error(err.response?.data?.message || "Email o password errati");
        }
    },


    /**
     * Recupera il feed (tutti i check-in)
     */
    getFeed: async () => {
        try {
            const res = await axios.get(`${BASE_URL}/checkin/feed`);
            const data = res.data;

            // Garantiamo sempre che sia un array
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.data)) return data.data;
            return [];
        } catch (err) {
            console.error("Errore caricamento feed:", err);
            // Se il server restituisce un errore leggibile
            const msg = err.response?.data?.error || "Errore caricamento feed";
            throw new Error(msg);
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
            const msg = err.response?.data?.error || "Errore creazione post";
            throw new Error(msg);
        }
    },

    /**
     * Recupera i post di un singolo utente
     */
    getUserPosts: async (userId) => {
        try {
            const res = await axios.get(`${BASE_URL}/checkin/user/${userId}`);
            const data = res.data;
            return Array.isArray(data) ? data : [];
        } catch (err) {
            console.error("Errore caricamento post utente:", err);
            const msg = err.response?.data?.error || "Errore caricamento post utente";
            throw new Error(msg);
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
    }
};