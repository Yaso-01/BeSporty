package it.unicam.besporty.repository;

import it.unicam.besporty.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    // Per gestire il toggle del like (singolo)
    Optional<Reaction> findByCheckIn_IdAndUser_Id(Long checkInId, Long userId);

    // Per ottenere la lista di tutte le reazioni di un checkin (per il Service)
    List<Reaction> findByCheckIn_Id(Long checkInId);
    long countByCheckIn_Id(Long checkInId);
}