package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SchoolClassRepository
        extends JpaRepository<SchoolClass, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    @Query(value = "SELECT COUNT(*) FROM classcourses WHERE ClassId = :classId", nativeQuery = true)
    long countClassCourseAssignments(@Param("classId") Long classId);

    @Query(value = """
            SELECT cl.*
            FROM classes cl
            JOIN classcourses cc ON cc.ClassId = cl.Id
            WHERE cc.CourseId = :courseId
            ORDER BY cl.Name
            """, nativeQuery = true)
    java.util.List<SchoolClass> findClassesByCourseId(@Param("courseId") Long courseId);
}