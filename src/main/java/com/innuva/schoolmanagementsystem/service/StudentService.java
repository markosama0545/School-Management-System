package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.StudentResponse;
import com.innuva.schoolmanagementsystem.entity.Student;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.SchoolClassRepository;
import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import com.innuva.schoolmanagementsystem.repository.StudentRepository;
import com.innuva.schoolmanagementsystem.dto.StudentRequest;
import com.innuva.schoolmanagementsystem.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.innuva.schoolmanagementsystem.dto.PagedResponse;
import com.innuva.schoolmanagementsystem.dto.CreateStudentRequest;
import com.innuva.schoolmanagementsystem.entity.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private static final List<String> ALLOWED_SORT_FIELDS =
            List.of("id", "name");



    private final StudentRepository studentRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final UserRepository userRepository;
    private final UserBehavior userBehavior;


    public StudentService(
            StudentRepository studentRepository,
            SchoolClassRepository schoolClassRepository,
            UserRepository userRepository,
            UserBehavior userBehavior
    ) {
        this.studentRepository = studentRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.userRepository = userRepository;
        this.userBehavior = userBehavior;
    }


    public PagedResponse<StudentResponse> getStudents(
            Long userId,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        userBehavior.requireCanViewStudent(userId);
        if (!ALLOWED_SORT_FIELDS.contains(sortBy.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid sort field. Allowed values: "
                            + ALLOWED_SORT_FIELDS
            );
        }

        if (!direction.equalsIgnoreCase("asc")
                && !direction.equalsIgnoreCase("desc")) {

            throw new IllegalArgumentException(
                    "Invalid sort direction. Allowed values: asc, desc"
            );
        }

        Sort sort;

        if (direction.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        } else {
            sort = Sort.by(sortBy).ascending();
        }

        Pageable pageable =
                PageRequest.of(page, size, sort);

        Page<Student> studentPage =
                studentRepository.findAll(pageable);

        List<StudentResponse> content =
                studentPage
                        .getContent()
                        .stream()
                        .map(this::toStudentResponse)
                        .toList();

        return new PagedResponse<>(
                content,
                studentPage.getNumber(),
                studentPage.getSize(),
                studentPage.getTotalElements(),
                studentPage.getTotalPages(),
                studentPage.isFirst(),
                studentPage.isLast()
        );
    }


    public PagedResponse<StudentResponse> searchStudents(
            Long userId,
            String name,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        userBehavior.requireCanViewStudent(userId);

        if (!ALLOWED_SORT_FIELDS.contains(sortBy.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid sort field. Allowed values: "
                            + ALLOWED_SORT_FIELDS
            );
        }

        if (!direction.equalsIgnoreCase("asc")
                && !direction.equalsIgnoreCase("desc")) {

            throw new IllegalArgumentException(
                    "Invalid sort direction. Allowed values: asc, desc"
            );
        }

        Sort sort;

        if (direction.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        } else {
            sort = Sort.by(sortBy).ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Student> studentPage =
                studentRepository.findByNameContainingIgnoreCase(
                        name,
                        pageable
                );

        List<StudentResponse> content =
                studentPage.getContent()
                        .stream()
                        .map(this::toStudentResponse)
                        .toList();

        return new PagedResponse<>(
                content,
                studentPage.getNumber(),
                studentPage.getSize(),
                studentPage.getTotalElements(),
                studentPage.getTotalPages(),
                studentPage.isFirst(),
                studentPage.isLast()
        );
    }



    public StudentResponse saveStudent( Long userId,
                                        StudentRequest request) {
        userBehavior.requireCanAddStudent(userId);

        SchoolClass schoolClass = schoolClassRepository
                .findById(request.getClassId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class not found with id: " + request.getClassId()
                        )
                );

        Student student = new Student();

        student.setName(request.getName());
        student.setSchoolClass(schoolClass);

        Student savedStudent = studentRepository.save(student);

        return toStudentResponse(savedStudent);
    }

    @Transactional
    public StudentResponse createStudentWithAccount(
            Long adminUserId,
            CreateStudentRequest request
    ) {
        userBehavior.requireCanAddStudent(adminUserId);

        String username = request.getUsername().trim();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException(
                    "Username already exists: " + username
            );
        }

        SchoolClass schoolClass = schoolClassRepository
                .findById(request.getClassId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class not found with id: "
                                        + request.getClassId()
                        )
                );

        User user = new User();
        user.setUsername(username);
        user.setPassword(request.getPassword());
        user.setRoleId(3L);

        User savedUser = userRepository.save(user);

        Student student = new Student();
        student.setName(request.getName().trim());
        student.setSchoolClass(schoolClass);
        student.setUser(savedUser);

        Student savedStudent = studentRepository.save(student);

        return toStudentResponse(savedStudent);
    }



    public StudentResponse getStudentById(
            Long userId,
            Long id
    ) {
        userBehavior.requireCanViewStudent(userId);

        Student student = studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );

        return toStudentResponse(student);
    }

    public StudentResponse updateStudent(
            Long userId,
            Long id,
            StudentRequest request
    ) {
        userBehavior.requireCanEditStudent(userId);

        Student existingStudent = studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );

        SchoolClass schoolClass = schoolClassRepository
                .findById(request.getClassId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Class not found with id: "
                                        + request.getClassId()
                        )
                );

        existingStudent.setName(request.getName());
        existingStudent.setSchoolClass(schoolClass);

        Student savedStudent =
                studentRepository.save(existingStudent);

        return toStudentResponse(savedStudent);
    }

    public void deleteStudent(Long userId, Long id) {

        userBehavior.requireCanDeleteStudent(userId);

        Student student = studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id
                        )
                );

        studentRepository.delete(student);
    }

    private StudentResponse toStudentResponse(Student student) {

        SchoolClass schoolClass = student.getSchoolClass();

        return new StudentResponse(
                student.getId(),
                student.getName(),
                schoolClass.getId(),
                schoolClass.getName()
        );
    }




}