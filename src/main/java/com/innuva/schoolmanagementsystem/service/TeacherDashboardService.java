package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.*;
import com.innuva.schoolmanagementsystem.entity.Course;
import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import com.innuva.schoolmanagementsystem.entity.Teacher;
import com.innuva.schoolmanagementsystem.exception.AccessDeniedException;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.CourseRepository;
import com.innuva.schoolmanagementsystem.repository.SchoolClassRepository;
import com.innuva.schoolmanagementsystem.repository.StudentRepository;
import com.innuva.schoolmanagementsystem.repository.TeacherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeacherDashboardService {

    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final StudentRepository studentRepository;

    public TeacherDashboardService(
            TeacherRepository teacherRepository,
            CourseRepository courseRepository,
            SchoolClassRepository schoolClassRepository,
            StudentRepository studentRepository
    ) {
        this.teacherRepository = teacherRepository;
        this.courseRepository = courseRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.studentRepository = studentRepository;
    }

    public TeacherDashboardSummaryResponse getSummary(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found for user: " + userId));

        long courseCount = teacherRepository.countCoursesByTeacherUserId(userId);
        long classCount = teacherRepository.countClassesByTeacherUserId(userId);
        long studentCount = teacherRepository.countStudentsByTeacherUserId(userId);

        return new TeacherDashboardSummaryResponse(
                teacher.getId(),
                teacher.getName(),
                courseCount,
                classCount,
                studentCount
        );
    }

    public List<TeacherCourseInfo> getCourses(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found for user: " + userId));

        // Get all courses taught by this teacher using CourseRepository
        List<Course> courses = courseRepository.findAll().stream()
                .filter(c -> c.getTeacher() != null && c.getTeacher().getId().equals(teacher.getId()))
                .toList();

        List<TeacherCourseInfo> courseInfos = new ArrayList<>();
        for (Course course : courses) {
            List<SchoolClass> classes = schoolClassRepository.findClassesByCourseId(course.getId());
            List<TeacherClassInfo> classInfos = new ArrayList<>();
            for (SchoolClass sc : classes) {
                // Return empty list of students initially for the course overview page
                classInfos.add(new TeacherClassInfo(sc.getId(), sc.getName(), new ArrayList<>()));
            }
            courseInfos.add(new TeacherCourseInfo(course.getId(), course.getName(), classInfos));
        }

        return courseInfos;
    }

    public PagedResponse<TeacherStudentInfo> getCourseStudentsPaged(
            Long userId,
            Long courseId,
            Long classId,
            int page,
            int size
    ) {
        // Enforce ownership: teacher must own this course!
        if (!teacherRepository.teacherOwnsCourse(userId, courseId)) {
            throw new AccessDeniedException("You are not authorized to view this course.");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<TeacherStudentInfo> studentPage = studentRepository.findStudentsWithGradesByClassAndCourse(
                classId,
                courseId,
                pageable
        );

        return new PagedResponse<>(
                studentPage.getContent(),
                studentPage.getNumber(),
                studentPage.getSize(),
                studentPage.getTotalElements(),
                studentPage.getTotalPages(),
                studentPage.isFirst(),
                studentPage.isLast()
        );
    }
}