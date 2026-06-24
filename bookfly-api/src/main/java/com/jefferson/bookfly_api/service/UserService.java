package com.jefferson.bookfly_api.service;

import com.jefferson.bookfly_api.annotation.Auditable;
import com.jefferson.bookfly_api.config.AuditContext;
import com.jefferson.bookfly_api.dto.user.UserRequest;
import com.jefferson.bookfly_api.dto.user.UserSummary;
import com.jefferson.bookfly_api.enums.ItemEventAction;
import com.jefferson.bookfly_api.enums.Role;
import com.jefferson.bookfly_api.events.ItemEvent;
import com.jefferson.bookfly_api.exceptions.NotFoundException;
import com.jefferson.bookfly_api.models.User;
import com.jefferson.bookfly_api.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Auditable(
            action = "CRIADO_USUARIO",
            details = "Criado Usuario {userNome}"
    )
    public User createUser(User user){

        if (userRepository.findByEmail(user.getEmail())
                .filter(u -> !u.getId().equals(user.getId()))
                .isPresent()) {
            throw new NotFoundException("Email já está em uso");
        }

        User userToSave = new User();
        userToSave.setName(user.getName());
        AuditContext.capture("userName", user.getName());
        userToSave.setEmail(user.getEmail());
        userToSave.setPassword(user.getPassword());
        userToSave.setRole(user.getRole());
        eventPublisher.publishEvent(new ItemEvent("users", ItemEventAction.CREATED));
        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public List<User> getAllUsersActive(){
        return userRepository.findAllActive();
    }

    public User getUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));
    }

    @Transactional
    @Auditable(
            action = "USUARIO_ATUALIZADO",
             details = "USUÁRIO FOI ATUALIZADO"
    )
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
        eventPublisher.publishEvent(new ItemEvent("users", ItemEventAction.UPDATED));
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
    @Auditable(
            action = "USUARIO_DELETADO",
            details = "USUÁRIO ID°{id} FOI DELETADO"
    )
    public void deleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        user.getRecordStatus().delete(user);
        eventPublisher.publishEvent(new ItemEvent("users", ItemEventAction.DELETED));
        userRepository.save(user);
    }

    public boolean userExistsById(Long id){
        return userRepository.existsById(id);
    }

    public Page<User> findAll(String search,Pageable pageable){
        if (search == null || search.isBlank()) {
            return userRepository.findAll(pageable);
        }
        return userRepository.search(
                search,
                pageable
        );
    }

    public Page<User> findAll(Pageable pageable){
        return userRepository.findAll(pageable);
    }
}
