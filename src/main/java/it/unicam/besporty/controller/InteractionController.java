package it.unicam.besporty.controller;

import it.unicam.besporty.model.*;
import it.unicam.besporty.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {

    @Autowired private CheckInRepository checkInRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ReactionRepository reactionRepository;
    @Autowired private CommentRepository commentRepository;

    // --- LIKE ---
    @PostMapping("/like/{checkInId}/{userId}")
    @Transactional
    public ResponseEntity<?> toggleLike(@PathVariable Long checkInId, @PathVariable Long userId) {

        Optional<Reaction> existing = reactionRepository.findByCheckIn_IdAndUser_Id(checkInId, userId);
        boolean liked;

        if (existing.isPresent()) {
            reactionRepository.delete(existing.get());
            liked = false;
        } else {
            // FIX: Usiamo getReferenceById per ottenere proxy gestiti sicuri invece del classico findById
            //getReferenceById non fa una query al DB per recuperare tutto l'utente.
            // Crea solo un riferimento (proxy) con l'ID.
            // Poiché per salvare un Like (tabella Reaction) serve solo l'ID dell'utente (Foreign Key),
            // questo risparmia una query di lettura inutile rendendo l'operazione di Like molto più veloce.
            User user = userRepository.getReferenceById(userId);

            CheckIn checkIn = checkInRepository.getReferenceById(checkInId);

            Reaction reaction = new Reaction("LIKE", user, checkIn);
            reactionRepository.save(reaction);
            liked = true;
        }

        // Recuperiamo il conteggio aggiornato
        long newCount = reactionRepository.countByCheckIn_Id(checkInId);

        return ResponseEntity.ok(Map.of("liked", liked, "newCount", newCount));
    }

    // --- STATUS ---
    @GetMapping("/status/{checkInId}/{userId}")
    public ResponseEntity<?> getStatus(@PathVariable Long checkInId, @PathVariable Long userId) {
        Optional<Reaction> existing = reactionRepository.findByCheckIn_IdAndUser_Id(checkInId, userId);
        return ResponseEntity.ok(Map.of("liked", existing.isPresent()));
    }

    // --- COMMENTI ---
    @PostMapping("/comment")
    @Transactional
    public Comment addComment(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long checkInId = Long.valueOf(payload.get("checkInId").toString());
        String text = (String) payload.get("text");

        // FIX: Anche qui usiamo getReferenceById per coerenza e sicurezza
        User user = userRepository.getReferenceById(userId);
        CheckIn checkIn = checkInRepository.getReferenceById(checkInId);

        Comment comment = new Comment(text, user, checkIn);
        return commentRepository.save(comment);
    }

    @GetMapping("/comments/{checkInId}")
    public List<Comment> getComments(@PathVariable Long checkInId) {
        return commentRepository.findByCheckIn_IdOrderByTimestampAsc(checkInId);
    }
}