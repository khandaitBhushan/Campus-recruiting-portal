package com.yourorg.crp.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.yourorg.crp.model.UserRole;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private static final String DEFAULT_SECRET = "campusRecruitingPortalSuperSecretKeyJWT12345!";
	
	private final SecretKey key;
	private final long expirationMs = 86400000; // 24 hours

	public JwtService() {
		this.key = Keys.hmacShaKeyFor(DEFAULT_SECRET.getBytes(StandardCharsets.UTF_8));
	}

	public String generateToken(String email, UserRole role) {
		return Jwts.builder()
				.subject(email)
				.claim("role", role.name())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + expirationMs))
				.signWith(key)
				.compact();
	}

	public String extractEmail(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public String extractRole(String token) {
		return extractClaim(token, claims -> claims.get("role", String.class));
	}

	public boolean isTokenValid(String token) {
		try {
			Claims claims = extractAllClaims(token);
			return !claims.getExpiration().before(new Date());
		}
		catch (Exception e) {
			return false;
		}
	}

	private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
