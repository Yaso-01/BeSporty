package it.unicam.besporty.controller;

import it.unicam.besporty.model.Group;
import it.unicam.besporty.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.findAll();
    }

    @GetMapping("/public")
    public List<Group> getPublicGroups() {
        return groupService.findPublicGroups();
    }

    @GetMapping("/user/{userId}")
    public List<Group> getGroupsByUser(@PathVariable Long userId) {
        return groupService.findGroupsByUser(userId);
    }

    @GetMapping("/{id}")
    public Optional<Group> getGroup(@PathVariable Long id) {
        return groupService.findById(id);
    }

    @PostMapping
    public Group createGroup(@RequestBody Group group) {
        return groupService.createGroup(group);
    }

    @PostMapping("/{groupId}/addUser/{userId}")
    public void addUserToGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        groupService.addUserToGroup(groupId, userId);
    }
}
