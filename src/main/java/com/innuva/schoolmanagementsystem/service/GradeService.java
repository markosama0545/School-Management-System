package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.UpdateGradeRequest;
import com.innuva.schoolmanagementsystem.entity.Course;
import com.innuva.schoolmanagementsystem.entity.Grade;
import com.innuva.schoolmanagementsystem.entity.Student;
import com.innuva.schoolmanagementsystem.exception.AccessDeniedException;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.GradeRepository;
import com.innuva.schoolmanagementsystem.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import com.innuva.schoolmanagementsystem.repository.CourseRepository;
import com.innuva.schoolmanagementsystem.repository.StudentRepository;


@Service
public class GradeService {

    private final GradeRepository gradeRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;



    public GradeService(
            GradeRepository gradeRepository,
            TeacherRepository teacherRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository
    ) {
        this.gradeRepository = gradeRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public void updateGrade(
            Long userId,
            UpdateGradeRequest request
    ) {
        validateGradeValue(request.getGrade());

        boolean ownsCourse =
                teacherRepository.teacherOwnsCourse(
                        userId,
                        request.getCourseId()
                );

        if (!ownsCourse) {
            throw new AccessDeniedException(
                    "You cannot edit grades for this course"
            );
        }

        Grade grade = gradeRepository
                .findByStudent_IdAndCourse_Id(
                        request.getStudentId(),
                        request.getCourseId()
                )
                .orElseGet(() -> createNewGrade(request));

        grade.setGradeValue(request.getGrade());

        gradeRepository.save(grade);
    }

    private Grade createNewGrade(
            UpdateGradeRequest request
    ) {
        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: "
                                        + request.getStudentId()
                        )
                );

        Course course = courseRepository
                .findById(request.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Course not found with id: "
                                        + request.getCourseId()
                        )
                );

        Grade grade = new Grade();

        grade.setStudent(student);
        grade.setCourse(course);

        return grade;
    }

    private void validateGradeValue(Double grade) {

        if (grade == null || grade < 0 || grade > 100) {
            throw new IllegalArgumentException(
                    "Grade must be between 0 and 100"
            );
        }
    }
}