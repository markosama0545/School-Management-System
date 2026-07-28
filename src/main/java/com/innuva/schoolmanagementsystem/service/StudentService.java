package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.StudentResponse;
import com.innuva.schoolmanagementsystem.entity.Student;
import com.innuva.schoolmanagementsystem.repository.SchoolClassRepository;
import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import com.innuva.schoolmanagementsystem.repository.StudentRepository;
import com.innuva.schoolmanagementsystem.dto.StudentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final SchoolClassRepository schoolClassRepository;

    public StudentService(
            StudentRepository studentRepository,
            SchoolClassRepository schoolClassRepository
    ) {
        this.studentRepository = studentRepository;
        this.schoolClassRepository = schoolClassRepository;
    }

    public List<StudentResponse> getStudents() {

        return studentRepository
                .findAll()
                .stream()
                .map(this::toStudentResponse)
                .toList();
    }

    public StudentResponse saveStudent(StudentRequest request) {

        SchoolClass schoolClass = schoolClassRepository
                .findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        Student student = new Student();

        student.setName(request.getName());
        student.setSchoolClass(schoolClass);

        Student savedStudent = studentRepository.save(student);

        return toStudentResponse(savedStudent);
    }

    public Optional<StudentResponse> getStudentById(Long id) {

        return studentRepository
                .findById(id)
                .map(this::toStudentResponse);
    }

    public Optional<StudentResponse> updateStudent(
            Long id,
            StudentRequest request) {

        Optional<Student> optionalStudent =
                studentRepository.findById(id);

        if (optionalStudent.isEmpty()) {
            return Optional.empty();
        }

        SchoolClass schoolClass = schoolClassRepository
                .findById(request.getClassId())
                .orElseThrow(() ->
                        new RuntimeException("Class not found")
                );

        Student existingStudent = optionalStudent.get();

        existingStudent.setName(request.getName());
        existingStudent.setSchoolClass(schoolClass);

        Student savedStudent =
                studentRepository.save(existingStudent);

        return Optional.of(
                toStudentResponse(savedStudent)
        );
    }

    public boolean deleteStudent(Long id) {

        Optional<Student> student = studentRepository.findById(id);

        if (student.isEmpty()) {
            return false;
        }

        studentRepository.delete(student.get());

        return true;
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