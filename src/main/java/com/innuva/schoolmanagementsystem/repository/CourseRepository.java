package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository
        extends JpaRepository<Course, Long> {

    // Duplicate name checks (case-insensitive)
    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    // Deletion safety guards
    @Query(value = "SELECT COUNT(*) FROM grades WHERE CourseId = :courseId", nativeQuery = true)
    long countGradesByCourseId(@Param("courseId") Long courseId);

    @Query(value = "SELECT COUNT(*) FROM classcourses WHERE CourseId = :courseId", nativeQuery = true)
    long countClassCourseAssignments(@Param("courseId") Long courseId);

    // Eager-fetch teacher to avoid N+1 on the list view
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.teacher")
    List<Course> findAllWithTeacher();

    // Load class IDs for a course (used to pre-populate edit form)
    @Query(value = "SELECT ClassId FROM classcourses WHERE CourseId = :courseId", nativeQuery = true)
    List<Long> findClassIdsByCourseId(@Param("courseId") Long courseId);

    // Replace-all class-course management
    @Modifying
    @Query(value = "DELETE FROM classcourses WHERE CourseId = :courseId", nativeQuery = true)
    void deleteClassCoursesByCourseId(@Param("courseId") Long courseId);

    @Modifying
    @Query(value = "INSERT INTO classcourses (ClassId, CourseId) VALUES (:classId, :courseId)", nativeQuery = true)
    void insertClassCourse(@Param("classId") Long classId, @Param("courseId") Long courseId);
}