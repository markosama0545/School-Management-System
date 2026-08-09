package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface StudentRepository extends JpaRepository<Student, Long> {

    Page<Student> findByNameContainingIgnoreCase(
            String name,
            Pageable pageable
    );
    @Query("""
SELECT
    s.id AS studentId,
    s.name AS studentName,
    c.name AS className,
    c.id AS classId
FROM Student s
JOIN s.schoolClass c
WHERE s.user.id = :userId
""")
    StudentProfileProjection getProfile(Long userId);

    @Query("""
SELECT s.name
FROM Student s
WHERE s.schoolClass.id = :classId
AND s.id <> :studentId
ORDER BY s.name
""")
    List<String> getClassmates(
            Long classId,
            Long studentId
    );

    @Query("""
SELECT
    c.name AS courseName,
    t.name AS teacherName,
    g.gradeValue AS grade
FROM Grade g
JOIN g.course c
JOIN c.teacher t
WHERE g.student.id = :studentId
ORDER BY c.name
""")
    List<StudentCourseProjection> getCourses(Long studentId);

}
