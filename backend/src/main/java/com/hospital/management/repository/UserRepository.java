package com.hospital.management.repository;

import com.hospital.management.model.Role;
import com.hospital.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByEmailAndRole(String email, Role role);
}
