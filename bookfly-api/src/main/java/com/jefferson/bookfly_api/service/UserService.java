package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.dto.user.UserRequest;
import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
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

    public User createUser(User user){

        if (userRepository.findByEmail(user.getEmail())
                .filter(u -> !u.getId().equals(user.getId()))
                .isPresent()) {
            throw new NotFoundException("Email já está em uso");
        }

        User userToSave = new User();
        userToSave.setName(user.getName());
        userToSave.setEmail(user.getEmail());
        userToSave.setPassword(user.getPassword());
        userToSave.setRole(user.getRole());

        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));
    }

    @Transactional
    public User updateUser(User newUser){

        User userExist = userRepository.findById(newUser.getId())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        if (userRepository.findByEmail(newUser.getEmail())
                .filter(u -> !u.getId().equals(newUser.getId()))
                .isPresent()) {
            throw new NotFoundException("Email já está em uso");
        }


       if (newUser.getName() != null)  userExist.setName(newUser.getName());
       if (newUser.getEmail() != null) userExist.setEmail(newUser.getEmail());

        if (newUser.getPassword() != null && !newUser.getPassword().isBlank()) {
            userExist.setPassword(newUser.getPassword());
        }

        if (newUser.getRole() != null) {
            userExist.setRole(newUser.getRole());
        }

        return userRepository.save(userExist);
    }

//    @Transactional
//    public User updateUser(User user){
//
//        User existUser = userRepository.findById(user.getId())
//                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));
//
//        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
//            throw new NotFoundException("Email já está em uso");
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
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        user.getRecordStatus().delete(user);

        userRepository.save(user);
    }

    public boolean userExistsById(Long id){
        return userRepository.existsById(id);
    }


}
