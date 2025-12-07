package it.unicam.besporty.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Entità User aggiornata: aggiunte annotazioni, gestione username/email unique,
 * e preparata per future estensioni (es: ruoli, stati, ecc.).
 */
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Username obbligatorio e unico
    @Column(nullable = false, unique = true, length = 24)
    private String username;

    // Email obbligatoria e unica
    @Column(nullable = false, unique = true)
    private String email;

    // Password codificata (non va MAI restituita nei DTO o in API pubbliche)
    @Column(nullable = false)
    private String password;

    private String sportPreference;

    private Integer age;

    // --- Costruttori ---
    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // --- Getter e Setter ---
    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }

    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {

        this.username = username;
    }

    public String getEmail() {

        return email;
    }

    public void setEmail(String email) {

        this.email = email;
    }

    /**
     * La password viene sempre gestita codificata.
     */
    public String getPassword() {

        return password;
    }

    public void setPassword(String password) {

        this.password = password;
    }

    public String getSportPreference() {

        return sportPreference;
    }

    public void setSportPreference(String sportPreference) {

        this.sportPreference = sportPreference;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

}
