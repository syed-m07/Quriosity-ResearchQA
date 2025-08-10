package com.researchrag.backend.token;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface TokenRepository extends JpaRepository<Token, Integer> {

  @Query(value = "select t from Token t inner join User u on t.user.id = u.id where u.id = :id and t.expired = false and t.revoked = false")
  List<Token> findAllValidTokenByUser(Integer id);

  Optional<Token> findByToken(String token);

  @Modifying
  @Query("delete from Token t where t.user.id = ?1")
  void deleteAllByUserId(Integer userId);
}
