package it.unicam.besporty.repository;
import it.unicam.besporty.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByCheckIn_IdOrderByTimestampAsc(Long checkInId);
}