package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.CourseRequest;
import com.innuva.schoolmanagementsystem.dto.CourseResponse;
import com.innuva.schoolmanagementsystem.entity.Course;
import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import com.innuva.schoolmanagementsystem.entity.Teacher;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.CourseRepository;
import com.innuva.schoolmanagementsystem.repository.SchoolClassRepository;
import com.innuva.schoolmanagementsystem.repository.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final UserBehavior userBehavior;

    public CourseService(
            CourseRepository courseRepository,
            TeacherRepository teacherRepository,
            SchoolClassRepository schoolClassRepository,
            UserBehavior userBehavior
    ) {
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.userBehavior = userBehavior;
    }

    public List<CourseResponse> getAllCourses(Long userId) {
        userBehavior.requireCanViewCourse(userId);

        List<Course> courses = courseRepository.findAllWithTeacher();
        List<CourseResponse> responses = new ArrayList<>();

        for (Course course : courses) {
            responses.add(buildResponse(course));
        }

        return responses;
    }

    public com.innuva.schoolmanagementsystem.dto.PagedResponse<CourseResponse> getCoursesPaged(
            Long userId,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        userBehavior.requireCanViewCourse(userId);

        org.springframework.data.domain.Sort sort = direction.equalsIgnoreCase("desc")
                ? org.springframework.data.domain.Sort.by(sortBy).descending()
                : org.springframework.data.domain.Sort.by(sortBy).ascending();

        org.springframework.data.domain.Pageable pageable =
                org.springframework.data.domain.PageRequest.of(page, size, sort);

        org.springframework.data.domain.Page<Course> coursePage =
                courseRepository.findAll(pageable);

        List<CourseResponse> content = coursePage
                .getContent()
                .stream()
                .map(this::buildResponse)
                .toList();

        return new com.innuva.schoolmanagementsystem.dto.PagedResponse<>(
                content,
                coursePage.getNumber(),
                coursePage.getSize(),
                coursePage.getTotalElements(),
                coursePage.getTotalPages(),
                coursePage.isFirst(),
                coursePage.isLast()
        );
    }

    @Transactional
    public CourseResponse createCourse(Long userId, CourseRequest request) {
        userBehavior.requireCanAddCourse(userId);

        String name = request.getName().trim();

        if (courseRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Course name already exists: " + name);
        }

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Teacher not found with id: " + request.getTeacherId()
                ));

        // Validate every submitted classId before touching the DB
        List<SchoolClass> assignedClasses = validateAndLoadClasses(request.getClassIds());

        Course course = new Course();
        course.setName(name);
        course.setTeacher(teacher);

        Course saved = courseRepository.save(course);

        // Insert class-course assignments
        for (SchoolClass cls : assignedClasses) {
            courseRepository.insertClassCourse(cls.getId(), saved.getId());
        }

        return buildResponse(saved, assignedClasses);
    }

    @Transactional
    public CourseResponse updateCourse(Long userId, Long id, CourseRequest request) {
        userBehavior.requireCanEditCourse(userId);

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        String name = request.getName().trim();

        if (courseRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new IllegalArgumentException("Course name already exists: " + name);
        }

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Teacher not found with id: " + request.getTeacherId()
                ));

        // Validate every submitted classId before replacing assignments
        List<SchoolClass> assignedClasses = validateAndLoadClasses(request.getClassIds());

        course.setName(name);
        course.setTeacher(teacher);

        Course saved = courseRepository.save(course);

        // Replace-all: delete existing, then re-insert
        courseRepository.deleteClassCoursesByCourseId(saved.getId());
        for (SchoolClass cls : assignedClasses) {
            courseRepository.insertClassCourse(cls.getId(), saved.getId());
        }

        return buildResponse(saved, assignedClasses);
    }

    @Transactional
    public void deleteCourse(Long userId, Long id) {
        userBehavior.requireCanDeleteCourse(userId);

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        if (courseRepository.countGradesByCourseId(id) > 0) {
            throw new IllegalArgumentException(
                    "Cannot delete course because it has existing grade records"
            );
        }

        if (courseRepository.countClassCourseAssignments(id) > 0) {
            throw new IllegalArgumentException(
                    "Cannot delete course because it is assigned to one or more classes"
            );
        }

        courseRepository.delete(course);
    }

    // -------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------

    /**
     * Validates that every id in the submitted list refers to an existing class.
     * Throws ResourceNotFoundException with a clear message if any is missing.
     * Returns an empty list if classIds is null or empty.
     */
    private List<SchoolClass> validateAndLoadClasses(List<Long> classIds) {
        if (classIds == null || classIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<SchoolClass> result = new ArrayList<>();
        for (Long classId : classIds) {
            SchoolClass cls = schoolClassRepository.findById(classId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Class not found with id: " + classId
                    ));
            result.add(cls);
        }
        return result;
    }

    private CourseResponse buildResponse(Course course) {
        List<Long> classIds = courseRepository.findClassIdsByCourseId(course.getId());
        List<SchoolClass> classes = classIds.isEmpty()
                ? new ArrayList<>()
                : schoolClassRepository.findAllById(classIds);
        return buildResponse(course, classes);
    }

    private CourseResponse buildResponse(Course course, List<SchoolClass> assignedClasses) {
        Long teacherId = null;
        String teacherName = null;

        if (course.getTeacher() != null) {
            teacherId = course.getTeacher().getId();
            teacherName = course.getTeacher().getName();
        }

        List<Long> classIds = new ArrayList<>();
        List<String> classNames = new ArrayList<>();
        for (SchoolClass cls : assignedClasses) {
            classIds.add(cls.getId());
            classNames.add(cls.getName());
        }

        return new CourseResponse(
                course.getId(),
                course.getName(),
                teacherId,
                teacherName,
                classIds,
                classNames
        );
    }
}
