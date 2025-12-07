package it.unicam.besporty.controller;

import it.unicam.besporty.model.User;
import it.unicam.besporty.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserQueryController {

    private final UserRepository userRepository;

    public UserQueryController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Lookup per username – utile al login "light" dal FE
     * GET /api/users/by-username/{username}
     */
    @GetMapping("/by-username/{username}")
    public ResponseEntity<?> findByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(u -> ResponseEntity.ok(trimUser(u)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Utente non trovato")));
    }

    /**
     * (Opzionale) Lookup per email
     * GET /api/users/by-email/{email}
     */
    @GetMapping("/by-email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(u -> ResponseEntity.ok(trimUser(u)))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Utente non trovato")));
    }

    /**
     * (Comodo per debug) lista utenti "safe"
     * GET /api/users
     */
    @GetMapping
    public List<Map<String, Object>> allUsers() {
        return userRepository.findAll().stream()
                .map(this::trimUser)
                .toList();
    }

    // Espone solo i campi "sicuri"
    private Map<String, Object> trimUser(User u) {
        return Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "email", u.getEmail(),
                "sportPreference", u.getSportPreference()
        );
    }
}
