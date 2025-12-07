package it.unicam.besporty.controller;

import it.unicam.besporty.model.Challenge;
import it.unicam.besporty.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    @GetMapping
    public List<Challenge> getAllChallenges() {
        return challengeService.findAll();
    }

    @GetMapping("/group/{groupId}")
    public List<Challenge> getChallengesByGroup(@PathVariable Long groupId) {
        return challengeService.findByGroup(groupId);
    }

    @GetMapping("/{id}")
    public Optional<Challenge> getChallenge(@PathVariable Long id) {
        return challengeService.findById(id);
    }

    @PostMapping
    public Challenge createChallenge(@RequestBody Challenge challenge) {
        return challengeService.createChallenge(challenge);
    }

    @PostMapping("/{challengeId}/complete/{userId}")
    public void completeChallenge(@PathVariable Long challengeId, @PathVariable Long userId) {
        challengeService.markChallengeCompleted(challengeId, userId);
    }
}
