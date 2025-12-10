package it.unicam.besporty.service;

import it.unicam.besporty.model.CheckIn;
import it.unicam.besporty.model.User;
import it.unicam.besporty.repository.CheckInRepository;
import it.unicam.besporty.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;

    public CheckInService(CheckInRepository checkInRepository, UserRepository userRepository) {
        this.checkInRepository = checkInRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CheckIn createCheckIn(Long userId,
                                 String text,
                                 String sport,
                                 String feeling,
                                 Integer intensity,
                                 String visibility,
                                 String imageUrl) {

        if (userId == null || text == null || text.isBlank() || sport == null || sport.isBlank()) {
            throw new IllegalArgumentException("userId, text e sport sono obbligatori.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato: " + userId));

        CheckIn c = new CheckIn();
        c.setUser(user);
        c.setText(text.trim());
        c.setSport(sport.trim());

        if (feeling != null && !feeling.isBlank()) c.setFeeling(feeling.trim());
        if (intensity != null) c.setIntensity(Math.max(1, Math.min(10, intensity)));
        //controlla che l'intensità sia tra 1 e 10 (Math.max(1, Math.min(10, intensity)))
        // e forza la visibilità a "PUBLIC" se arriva un valore strano.
        if (visibility != null && !visibility.isBlank()) {
            // Accetta solo valori attesi, altrimenti default PUBLIC
            String v = visibility.trim().toUpperCase();
            if (v.equals("PUBLIC") || v.equals("FRIENDS") || v.equals("PRIVATE")) {
                c.setVisibility(v);
            } // altrimenti rimane PUBLIC
        }
        if (imageUrl != null && !imageUrl.isBlank()) c.setImageUrl(imageUrl.trim());

        return checkInRepository.save(c);
    }

    @Transactional(readOnly = true)
    public List<CheckIn> feed() {
        return checkInRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<CheckIn> findByUser(Long userId) {
        return checkInRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }
}
