package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.TeacherClassInfo;
import com.innuva.schoolmanagementsystem.dto.TeacherCourseInfo;
import com.innuva.schoolmanagementsystem.dto.TeacherDashboardResponse;
import com.innuva.schoolmanagementsystem.dto.TeacherStudentInfo;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.TeacherDashboardRowProjection;
import com.innuva.schoolmanagementsystem.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class TeacherDashboardService {

    private final TeacherRepository teacherRepository;

    public TeacherDashboardService(
            TeacherRepository teacherRepository
    ) {
        this.teacherRepository = teacherRepository;
    }

    public TeacherDashboardResponse getDashboard(Long userId) {

        List<TeacherDashboardRowProjection> rows =
                teacherRepository.getDashboardRows(userId);

        if (rows.isEmpty()) {
            throw new ResourceNotFoundException(
                    "Teacher dashboard not found for user id: " + userId
            );
        }

        TeacherDashboardRowProjection firstRow = rows.get(0);

        Map<Long, TeacherCourseInfo> coursesById =
                new LinkedHashMap<>();

        for (TeacherDashboardRowProjection row : rows) {

            TeacherCourseInfo courseInfo =
                    coursesById.computeIfAbsent(
                            row.getCourseId(),
                            courseId -> new TeacherCourseInfo(
                                    row.getCourseId(),
                                    row.getCourseName(),
                                    new ArrayList<>()
                            )
                    );

            TeacherClassInfo classInfo =
                    courseInfo.getClasses()
                            .stream()
                            .filter(currentClass ->
                                    currentClass.getClassId()
                                            .equals(row.getClassId())
                            )
                            .findFirst()
                            .orElseGet(() -> {
                                TeacherClassInfo newClass =
                                        new TeacherClassInfo(
                                                row.getClassId(),
                                                row.getClassName(),
                                                new ArrayList<>()
                                        );

                                courseInfo.getClasses().add(newClass);
                                return newClass;
                            });

            classInfo.getStudents().add(
                    new TeacherStudentInfo(
                            row.getStudentId(),
                            row.getStudentName(),
                            row.getGrade()
                    )
            );
        }

        return new TeacherDashboardResponse(
                firstRow.getTeacherId(),
                firstRow.getTeacherName(),
                new ArrayList<>(coursesById.values())
        );
    }
}