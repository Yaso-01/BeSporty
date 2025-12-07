package it.unicam.besporty.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // FIX SERIALIZZAZIONE
    private User user;

    @ManyToOne
    @JoinColumn(name = "checkin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // FIX SERIALIZZAZIONE
    private CheckIn checkIn;

    public Comment() { this.timestamp = LocalDateTime.now(); }

    public Comment(String text, User user, CheckIn checkIn) {
        this.text = text;
        this.user = user;
        this.checkIn = checkIn;
        this.timestamp = LocalDateTime.now();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public CheckIn getCheckIn() { return checkIn; }
    public void setCheckIn(CheckIn checkIn) { this.checkIn = checkIn; }
    public LocalDateTime getTimestamp() { return timestamp; }
}