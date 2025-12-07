package it.unicam.besporty.controller;

import it.unicam.besporty.model.Reaction;
import it.unicam.besporty.service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reactions")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @GetMapping("/post/{postId}")
    public List<Reaction> getReactionsByPost(@PathVariable Long postId) {
        return reactionService.findByPost(postId);
    }

    @PostMapping
    public Reaction addReaction(@RequestBody Reaction reaction) {
        return reactionService.addReaction(reaction);
    }
}
