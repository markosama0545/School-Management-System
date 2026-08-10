package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.CourseInfo;
import com.innuva.schoolmanagementsystem.dto.PagedResponse;
import com.innuva.schoolmanagementsystem.dto.StudentDashboardSummaryResponse;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.StudentCourseProjection;
import com.innuva.schoolmanagementsystem.repository.StudentProfileProjection;
import com.innuva.schoolmanagementsystem.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentDashboardService {

    private final StudentRepository studentRepository;

    public StudentDashboardService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public StudentDashboardSummaryResponse getSummary(Long userId) {
        StudentProfileProjection profile = studentRepository.getProfile(userId);
        if (profile == null) {
            throw new ResourceNotFoundException("Student profile not found for user: " + userId);
        }

        List<StudentCourseProjection> courses = studentRepository.getCourses(profile.getStudentId());
        long courseCount = courses.size();

        List<Double> numericGrades = courses.stream()
                .map(StudentCourseProjection::getGrade)
                .filter(g -> g != null && !Double.isNaN(g))
                .toList();

        Double averageGrade = numericGrades.isEmpty() ? null :
                numericGrades.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        return new StudentDashboardSummaryResponse(
                profile.getStudentId(),
                profile.getStudentName(),
                profile.getClassName(),
                courseCount,
                averageGrade
        );
    }

    public List<CourseInfo> getCourses(Long userId) {
        StudentProfileProjection profile = studentRepository.getProfile(userId);
        if (profile == null) {
            throw new ResourceNotFoundException("Student profile not found for user: " + userId);
        }

        return studentRepository.getCourses(profile.getStudentId()).stream()
                .map(course -> new CourseInfo(
                        course.getCourseName(),
                        course.getTeacherName(),
                        course.getGrade()
                ))
                .toList();
    }

    public PagedResponse<String> getClassmates(Long userId, int page, int size) {
        StudentProfileProjection profile = studentRepository.getProfile(userId);
        if (profile == null) {
            throw new ResourceNotFoundException("Student profile not found for user: " + userId);
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<String> classmatePage = studentRepository.getClassmatesPaged(
                profile.getClassId(),
                profile.getStudentId(),
                pageable
        );

        return new PagedResponse<>(
                classmatePage.getContent(),
                classmatePage.getNumber(),
                classmatePage.getSize(),
                classmatePage.getTotalElements(),
                classmatePage.getTotalPages(),
                classmatePage.isFirst(),
                classmatePage.isLast()
        );
    }
}