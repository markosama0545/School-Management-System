package com.innuva.schoolmanagementsystem.repository;

import com.innuva.schoolmanagementsystem.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeacherRepository
        extends JpaRepository<Teacher, Long> {

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