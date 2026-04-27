package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.dto.user.UserRequest;
import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(UserRequest request){

        if (userRepository.findByEmail(request.email())
                .filter(u -> !u.getId().equals(request.userID()))
                .isPresent()) {
            throw new RuntimeException("Email já está em uso");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setRole(request.role());

        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @Transactional
    public User updateUser(UserRequest request){

        User user = userRepository.findById(request.userID())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (userRepository.findByEmail(request.email())
                .filter(u -> !u.getId().equals(request.userID()))
                .isPresent()) {
            throw new RuntimeException("Email já está em uso");
        }


        user.setName(request.name());
        user.setEmail(request.email());


        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(request.password());
        }

        if (request.role() != null) {
            user.setRole(request.role());
        }

        return userRepository.save(user);
    }

//    @Transactional
//    public User updateUser(User user){
//
//        User existUser = userRepository.findById(user.getId())
//                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
//
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            throw new RuntimeException("Email já está em uso");
//        }
//
//
//
//
//
//        if (user.getPassword() != null && !user.getPassword().isBlank()) {
//            user.setPassword(user.getPassword());
//        }
//
//        if (user.getRole() != null) {
//            user.setRole(user.getRole());
//        }
//
//        return userRepository.save(user);
//    }

    @Transactional
    public void deleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        userRepository.delete(user);
    }

    public boolean userExistsById(Long id){
        return userRepository.existsById(id);
    }


}
