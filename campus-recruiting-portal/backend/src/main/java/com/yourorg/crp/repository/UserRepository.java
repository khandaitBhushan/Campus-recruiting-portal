package com.yourorg.crp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yourorg.crp.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
}
