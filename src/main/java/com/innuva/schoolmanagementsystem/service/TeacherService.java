package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.CreateTeacherRequest;
import com.innuva.schoolmanagementsystem.dto.TeacherRequest;
import com.innuva.schoolmanagementsystem.dto.TeacherResponse;
import com.innuva.schoolmanagementsystem.entity.Teacher;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.TeacherRepository;
import com.innuva.schoolmanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.innuva.schoolmanagementsystem.entity.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public TeacherService(
            TeacherRepository teacherRepository,
            UserRepository userRepository
    ) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
    }

    public List<TeacherResponse> getTeachers() {

        return teacherRepository
                .findAll()
                .stream()
                .map(this::toTeacherResponse)
                .toList();
    }

    private TeacherResponse toTeacherResponse(
            Teacher teacher
    ) {
        return new TeacherResponse(
                teacher.getId(),
                teacher.getName(),
                teacher.getPhone(),
                teacher.getEmail()
        );
    }


    @Transactional
    public TeacherResponse createTeacherWithAccount(
            CreateTeacherRequest request
    ) {
        String username = request.getUsername().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException(
                    "Username already exists: " + username
            );
        }

        User user = new User();

        user.setUsername(username);
        user.setPassword(request.getPassword());

        // Teacher role
        user.setRoleId(2L);

        User savedUser = userRepository.save(user);

        Teacher teacher = new Teacher();

        teacher.setName(request.getName().trim());
        teacher.setPhone(request.getPhone().trim());
        teacher.setEmail(request.getEmail().trim());
        teacher.setUser(savedUser);

        Teacher savedTeacher =
                teacherRepository.save(teacher);

        return toTeacherResponse(savedTeacher);
    }

    public TeacherResponse updateTeacher(
            Long id,
            TeacherRequest request
    ) {
        Teacher teacher = teacherRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Teacher not found with id: " + id
                        )
                );

        teacher.setName(request.getName().trim());
        teacher.setPhone(request.getPhone().trim());
        teacher.setEmail(request.getEmail().trim());

        Teacher savedTeacher =
                teacherRepository.save(teacher);

        return toTeacherResponse(savedTeacher);
    }

    @Transactional
    public void deleteTeacher(Long id) {

        Teacher teacher = teacherRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Teacher not found with id: " + id
                        )
                );

        User user = teacher.getUser();

        teacherRepository.delete(teacher);
        teacherRepository.flush();

        if (user != null) {
            userRepository.delete(user);
        }
    }


}