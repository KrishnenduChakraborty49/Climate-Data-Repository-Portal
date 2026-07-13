package com.climate.config;

import com.climate.entity.Category;
import com.climate.entity.Role;
import com.climate.entity.User;
import com.climate.repository.CategoryRepository;
import com.climate.repository.RoleRepository;
import com.climate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles if empty
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setRoleName("ROLE_ADMIN");
            roleRepository.save(adminRole);

            Role userRole = new Role();
            userRole.setRoleName("ROLE_USER");
            roleRepository.save(userRole);
        }

        // Seed Admin User if not exists
        if (!userRepository.existsByEmail("admin@climate.org")) {
            Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@climate.org");
            admin.setPassword(passwordEncoder.encode("password")); // Default password
            admin.setRole(adminRole);
            userRepository.save(admin);
        }

        // Seed Categories
        if (categoryRepository.count() == 0) {
            String[] categories = {"Rainfall", "Temperature", "Humidity", "Wind", "Hydrology"};
            for (String catName : categories) {
                Category cat = new Category();
                cat.setName(catName);
                categoryRepository.save(cat);
            }
        }
    }
}
