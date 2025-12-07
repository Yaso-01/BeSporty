package it.unicam.besporty.service;

import it.unicam.besporty.model.Reaction;
import it.unicam.besporty.repository.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    // MODIFICATO: ora accetta checkInId e chiama il metodo corretto
    public List<Reaction> findByCheckIn(Long checkInId) {
        return reactionRepository.findByCheckIn_Id(checkInId);
    }

    public Reaction addReaction(Reaction reaction) {
        return reactionRepository.save(reaction);
    }
}