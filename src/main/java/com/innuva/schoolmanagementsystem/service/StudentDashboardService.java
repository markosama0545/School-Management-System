package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.CourseInfo;
import com.innuva.schoolmanagementsystem.dto.StudentDashboardResponse;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.StudentCourseProjection;
import com.innuva.schoolmanagementsystem.repository.StudentProfileProjection;
import com.innuva.schoolmanagementsystem.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentDashboardService {

    private final StudentRepository studentRepository;

    public StudentDashboardService(
            StudentRepository studentRepository
    ) {
        this.studentRepository = studentRepository;
    }

    public StudentDashboardResponse getDashboard(Long userId) {

        StudentProfileProjection profile =
                studentRepository.getProfile(userId);

        if (profile == null) {
            throw new ResourceNotFoundException(
                    "Student profile not found for user id: " + userId
            );
        }

        List<String> classmates =
                studentRepository.getClassmates(
                        profile.getClassId(),
                        profile.getStudentId()
                );

        List<CourseInfo> courses =
                studentRepository
                        .getCourses(profile.getStudentId())
                        .stream()
                        .map(course ->
                                new CourseInfo(
                                        course.getCourseName(),
                                        course.getTeacherName(),
                                        course.getGrade()
                                )
                        )
                        .toList();

        return new StudentDashboardResponse(
                profile.getStudentId(),
                profile.getStudentName(),
                profile.getClassName(),
                classmates,
                courses
        );
    }
}