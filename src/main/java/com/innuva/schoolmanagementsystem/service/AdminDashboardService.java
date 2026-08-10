package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.AdminDashboardSummaryResponse;
import com.innuva.schoolmanagementsystem.repository.CourseRepository;
import com.innuva.schoolmanagementsystem.repository.SchoolClassRepository;
import com.innuva.schoolmanagementsystem.repository.StudentRepository;
import com.innuva.schoolmanagementsystem.repository.TeacherRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final CourseRepository courseRepository;
    private final UserBehavior userBehavior;

    public AdminDashboardService(
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            SchoolClassRepository schoolClassRepository,
            CourseRepository courseRepository,
            UserBehavior userBehavior
    ) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.courseRepository = courseRepository;
        this.userBehavior = userBehavior;
    }

    public AdminDashboardSummaryResponse getSummary(Long userId) {
        // Enforce authorization using UserBehavior
        userBehavior.requireCanViewStudent(userId);

        long studentCount = studentRepository.count();
        long teacherCount = teacherRepository.count();
        long classCount = schoolClassRepository.count();
        long courseCount = courseRepository.count();

        return new AdminDashboardSummaryResponse(studentCount, teacherCount, classCount, courseCount);
    }
}
