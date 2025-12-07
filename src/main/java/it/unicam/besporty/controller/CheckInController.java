package it.unicam.besporty.controller;

import it.unicam.besporty.model.CheckIn;
import it.unicam.besporty.model.User;
import it.unicam.besporty.repository.UserRepository;
import it.unicam.besporty.repository.CheckInRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;

    public CheckInController(CheckInRepository checkInRepository, UserRepository userRepository) {
        this.checkInRepository = checkInRepository;
        this.userRepository = userRepository;
    }

    /**
     * Crea un nuovo check-in
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        try {
            Long userId = payload.get("userId") != null ? Long.valueOf(payload.get("userId").toString()) : null;
            String text = (String) payload.get("text");
            String sport = (String) payload.get("sport");
            String feeling = (String) payload.get("feeling");
            Integer intensity = payload.get("intensity") != null ? Integer.valueOf(payload.get("intensity").toString()) : null;
            String visibility = (String) payload.get("visibility");
            String imageUrl = (String) payload.get("imageUrl");

            if (userId == null || text == null || text.isBlank() || sport == null || sport.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "userId, text e sport sono obbligatori"));
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Utente non trovato con id: " + userId));

            CheckIn c = new CheckIn();
            c.setUser(user);
            c.setText(text.trim());
            c.setSport(sport.trim());
            c.setFeeling(feeling);
            c.setIntensity(intensity);
            c.setVisibility((visibility != null && !visibility.isBlank()) ? visibility.toUpperCase() : "PUBLIC");
            c.setImageUrl(imageUrl);

            CheckIn saved = checkInRepository.save(c);

            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Feed globale (tutti i check-in, più recenti per primi)
     */
    @GetMapping("/feed")
    public ResponseEntity<?> feed() {
        List<CheckIn> list = checkInRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> out = new ArrayList<>();
        for (CheckIn c : list) {
            out.add(toResponse(c));
        }
        return ResponseEntity.ok(out);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> byUser(@PathVariable Long userId) {
        List<CheckIn> list = checkInRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        List<Map<String, Object>> out = new ArrayList<>();
        for (CheckIn c : list) {
            out.add(toResponse(c));
        }
        return ResponseEntity.ok(out);
    }

    // Helper: trasforma CheckIn in risposta “pulita”
    private static Map<String, Object> toResponse(CheckIn c) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", c.getId());
        m.put("userId", c.getUser().getId());
        m.put("username", c.getUser().getUsername());
        m.put("text", c.getText());
        m.put("sport", c.getSport());
        m.put("feeling", c.getFeeling());
        m.put("intensity", c.getIntensity());
        m.put("visibility", c.getVisibility());
        m.put("imageUrl", c.getImageUrl());
        m.put("createdAt", c.getCreatedAt());
        return m;
    }
}