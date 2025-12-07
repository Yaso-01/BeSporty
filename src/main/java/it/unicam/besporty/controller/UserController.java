package it.unicam.besporty.controller;

import it.unicam.besporty.model.User;
import it.unicam.besporty.repository.UserRepository;
import it.unicam.besporty.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {

        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> payload) { // Nota: Object, non String
        try {
            String username = (String) payload.get("username");
            String email = (String) payload.get("email");
            String password = (String) payload.get("password");
            String sport = (String) payload.get("sportPreference");

            // Gestione sicura dell'età (potrebbe arrivare come stringa o numero)
            Integer age = null;
            if (payload.get("age") != null) {
                age = Integer.valueOf(payload.get("age").toString());
            }

            if (username == null || email == null || password == null) {
                return ResponseEntity.badRequest().body("Username, Email e Password sono obbligatori.");
            }

            User newUser = userService.registerUser(username, email, password);
            newUser.setSportPreference(sport);
            newUser.setAge(age);
            userRepository.save(newUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("id", newUser.getId(), "username", newUser.getUsername()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore server: " + e.getMessage());
        }
    }

    /**
     * Endpoint per login.
     * Attende JSON tipo:
     * {
     *   "usernameOrEmail": "user",
     *   "password": "password123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String usernameOrEmail = payload.get("usernameOrEmail");

        if (usernameOrEmail == null) usernameOrEmail = payload.get("email");

        String password = payload.get("password");

        if (usernameOrEmail == null || password == null) {
            return ResponseEntity.badRequest().body("Email/Username e Password obbligatori.");
        }

        Optional<User> userOpt = userService.login(usernameOrEmail, password);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "sportPreference", user.getSportPreference() != null ? user.getSportPreference() : "",
                    "age", user.getAge() != null ? user.getAge() : ""
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenziali non valide.");
        }
    }

}
