package it.unicam.besporty.controller;

import it.unicam.besporty.model.User;
import it.unicam.besporty.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
// @CrossOrigin rimossa perché gestita da SecurityConfig
public class UserQueryController {

    private final UserRepository userRepository;

    public UserQueryController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * NUOVO: Cerca utente per ID
     * GET /api/users/{id}
     * Risolve l'errore "Impossibile caricare il profilo"
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(trimUser(u)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Utente non trovato")));
    }

    /**
     * Lookup per username
     * GET /api/users/by-username/{username}
     */
    @GetMapping("/by-username/{username}")
    public ResponseEntity<?> findByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(u -> ResponseEntity.ok(trimUser(u)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Utente non trovato")));
    }

    /**
     * Lookup per email
     * GET /api/users/by-email/{email}
     */
    @GetMapping("/by-email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(u -> ResponseEntity.ok(trimUser(u)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Utente non trovato")));
    }

    /**
     * Lista tutti gli utenti (utile per debug o ricerca amici)
     * GET /api/users
     */
    @GetMapping
    public List<Map<String, Object>> allUsers() {
        return userRepository.findAll().stream()
                .map(this::trimUser)
                .toList();
    }

    // Helper: Espone solo i campi "sicuri" + i nuovi campi Sport ed Età
    private Map<String, Object> trimUser(User u) {
        return Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "email", u.getEmail(),
                // Gestione null safe per i nuovi campi
                "sportPreference", u.getSportPreference() != null ? u.getSportPreference() : "",
                "age", u.getAge() != null ? u.getAge() : ""
        );
    }
}