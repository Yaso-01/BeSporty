package it.unicam.besporty.controller;

import it.unicam.besporty.model.Post;
import it.unicam.besporty.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable Long userId) {
        return postService.getPostsByUser(userId);
    }

    @GetMapping("/sport/{sport}")
    public List<Post> getPostsBySport(@PathVariable String sport) {
        return postService.getPostsBySport(sport);
    }

    @GetMapping("/visibility/{visibility}")
    public List<Post> getPostsByVisibility(@PathVariable String visibility) {
        return postService.getPostsByVisibility(visibility);
    }

    @GetMapping("/{id}")
    public Optional<Post> getPost(@PathVariable Long id) {
        return postService.getPost(id);
    }

    @PostMapping("/user/{userId}")
    public Post createPost(@RequestBody Post post, @PathVariable Long userId) {
        return postService.createPost(post, userId);
    }
}
