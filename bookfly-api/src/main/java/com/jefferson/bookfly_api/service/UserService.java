package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return usuarioRepository.findAll();
    }

    public User getUserById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public User getUserByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public void createUser(User user) {
        Optional<User> existUser = usuarioRepository.findByEmail(user.getEmail());

        if (existUser.isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        usuarioRepository.save(user);
    }

    public void updateUser(User user) {
        usuarioRepository.save(user);
    }

    public void updatePassword(User user, String oldPassword, String newPassword) {

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Senha incorreta");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(user);
    }

    public void updateRole(User user, Role role) {
       user.setRole(role);
        usuarioRepository.save(user);
    }

    public void deleteUser(Long id) {
        usuarioRepository.deleteById(id);
    }
}
