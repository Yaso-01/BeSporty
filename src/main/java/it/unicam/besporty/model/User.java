package it.unicam.besporty.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // <--- FONDAMENTALE
//Senza questa riga, Jackson (la libreria che trasforma gli oggetti Java in JSON)
// andrebbe in crash provando a serializzare un oggetto "proxy" di Hibernate non ancora inizializzato.
// Questo è fondamentale perché le relazioni (es. User dentro CheckIn)
// sono caricate in modo "Lazy" (solo quando servono).
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 24)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String sportPreference;
    private Integer age;

    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getter e Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getSportPreference() { return sportPreference; }
    public void setSportPreference(String sportPreference) { this.sportPreference = sportPreference; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
}