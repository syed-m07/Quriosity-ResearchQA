package com.researchrag.backend.userapi.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PatchMapping("/password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyInfo(Principal connectedUser) {
        return ResponseEntity.ok(service.getMyInfo(connectedUser));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyInfo(
            @Valid @RequestBody UpdateUserRequest request,
            Principal connectedUser
    ) {
        service.updateMyInfo(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount(Principal connectedUser) {
        service.deleteMyAccount(connectedUser);
        return ResponseEntity.noContent().build();
    }
}
