package com.taskflow.auth_service.security;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

  // بمشروع حقيقي، هاد السر لازم يكون بـ application.properties أو environment variable، مش مكتوب هون مباشرة
  private static final String SECRET = "ChangeThisToALongRandomSecretKeyAtLeast256BitsForHS256!!";
  private static final long EXPIRATION_MS = 1000 * 60 * 60 * 24; // 24 ساعة

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(SECRET.getBytes());
  }

  public String generateToken(String userId, String email) {
    return Jwts.builder()
      .subject(userId)
      .claim("email", email)
      .issuedAt(new Date())
      .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
      .signWith(getSigningKey())
      .compact();
  }

  public String extractUserId(String token) {
    return Jwts.parser()
      .verifyWith(getSigningKey())
      .build()
      .parseSignedClaims(token)
      .getPayload()
      .getSubject();
  }

  public boolean isTokenValid(String token) {
    try {
      Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}
