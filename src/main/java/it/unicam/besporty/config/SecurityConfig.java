package it.unicam.besporty.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Configurazione CORS "Permissiva"
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disabilita CSRF (Blocca i POST se attivo)
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Fix per H2 Console
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

                // 4. Gestione degli URL
                .authorizeHttpRequests(auth -> auth
                        // Permetti sempre le chiamate "OPTIONS" (Pre-flight del browser)
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // Endpoint pubblici
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/users/**").permitAll()     // Login e Register
                        .requestMatchers("/api/checkin/**").permitAll()   // Post e Feed

                        // Per sicurezza in sviluppo, sblocca tutto sotto /api
                        .requestMatchers("/api/**").permitAll()

                        // Tutto il resto richiede login
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // USARE IL PATTERN "*" PERMETTE QUALSIASI ORIGINE (Localhost, 127.0.0.1, IP locale, ecc.)
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}