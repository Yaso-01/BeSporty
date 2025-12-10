package it.unicam.besporty.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private boolean isPrivate;
    private String checkInSlot;

    // NUOVO CAMPO
    private String sport;

    @ManyToMany
    @JoinTable(
            name = "group_members",
            joinColumns = @JoinColumn(name = "group_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<Challenge> challenges = new ArrayList<>();

    public Group() {}

    public Group(String name, String description, boolean isPrivate, String checkInSlot, String sport) {
        this.name = name;
        this.description = description;
        this.isPrivate = isPrivate;
        this.checkInSlot = checkInSlot;
        this.sport = sport;
    }

    // Getter e Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isPrivate() { return isPrivate; }
    public void setPrivate(boolean isPrivate) { this.isPrivate = isPrivate; }

    public String getCheckInSlot() { return checkInSlot; }
    public void setCheckInSlot(String checkInSlot) { this.checkInSlot = checkInSlot; }

    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }

    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> members) { this.members = members; }

    public List<Challenge> getChallenges() { return challenges; }
    public void setChallenges(List<Challenge> challenges) { this.challenges = challenges; }
}