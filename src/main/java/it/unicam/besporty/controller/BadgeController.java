package it.unicam.besporty.controller;

import it.unicam.besporty.model.Badge;
import it.unicam.besporty.service.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @GetMapping
    public List<Badge> getAllBadges() {
        return badgeService.findAll();
    }

    @GetMapping("/name/{name}")
    public Optional<Badge> getBadgeByName(@PathVariable String name) {
        return badgeService.findByName(name);
    }

    @PostMapping
    public Badge createBadge(@RequestBody Badge badge) {
        return badgeService.createBadge(badge);
    }
}
