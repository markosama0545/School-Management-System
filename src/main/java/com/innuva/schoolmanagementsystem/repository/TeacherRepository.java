package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository
        extends JpaRepository<Teacher, Long> {

    @Query("SELECT t FROM Teacher t WHERE t.user.id = :userId")
    Optional<Teacher> findByUserId(@Param("userId") Long userId);

    @Query(value = """
            SELECT COUNT(DISTINCT co.Id)
            FROM teachers t
            JOIN courses co ON co.TeacherId = t.Id
            WHERE t.UserId = :userId
            """, nativeQuery = true)
    long countCoursesByTeacherUserId(@Param("userId") Long userId);

    @Query(value = """
            SELECT COUNT(DISTINCT cc.ClassId)
            FROM teachers t
            JOIN courses co ON co.TeacherId = t.Id
            JOIN classcourses cc ON cc.CourseId = co.Id
            WHERE t.UserId = :userId
            """, nativeQuery = true)
    long countClassesByTeacherUserId(@Param("userId") Long userId);

    @Query(value = """
            SELECT COUNT(DISTINCT s.Id)
            FROM teachers t
            JOIN courses co ON co.TeacherId = t.Id
            JOIN classcourses cc ON cc.CourseId = co.Id
            JOIN students s ON s.ClassId = cc.ClassId
            WHERE t.UserId = :userId
            """, nativeQuery = true)
    long countStudentsByTeacherUserId(@Param("userId") Long userId);

    @Query("""
SELECT COUNT(c) > 0
FROM Course c
JOIN c.teacher t
WHERE t.user.id = :userId
AND c.id = :courseId
""")
    boolean teacherOwnsCourse(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId
    );

    @Query(value = """
            SELECT
                t.Id AS teacherId,
                t.Name AS teacherName,

                co.Id AS courseId,
                co.Name AS courseName,

                cl.Id AS classId,
                cl.Name AS className,

                s.Id AS studentId,
                s.Name AS studentName,

                g.GradeValue AS grade

            FROM teachers t

            JOIN courses co
                ON co.TeacherId = t.Id

            JOIN classcourses cc
                ON cc.CourseId = co.Id

            JOIN classes cl
                ON cl.Id = cc.ClassId

            JOIN students s
                ON s.ClassId = cl.Id

            LEFT JOIN grades g
                ON g.StudentId = s.Id
                AND g.CourseId = co.Id

            WHERE t.UserId = :userId

            ORDER BY
                co.Name,
                cl.Name,
                s.Name
            """, nativeQuery = true)
    List<TeacherDashboardRowProjection> getDashboardRows(
            @Param("userId") Long userId
    );
}