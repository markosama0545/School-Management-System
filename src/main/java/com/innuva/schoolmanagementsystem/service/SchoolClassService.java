package com.innuva.schoolmanagementsystem.service;

import com.innuva.schoolmanagementsystem.dto.SchoolClassRequest;
import com.innuva.schoolmanagementsystem.dto.SchoolClassResponse;
import com.innuva.schoolmanagementsystem.entity.SchoolClass;
import com.innuva.schoolmanagementsystem.exception.ResourceNotFoundException;
import com.innuva.schoolmanagementsystem.repository.SchoolClassRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SchoolClassService {

    private final SchoolClassRepository schoolClassRepository;
    private final UserBehavior userBehavior;

    public SchoolClassService(
            SchoolClassRepository schoolClassRepository,
            UserBehavior userBehavior
    ) {
        this.schoolClassRepository = schoolClassRepository;
        this.userBehavior = userBehavior;
    }

    public Optional<SchoolClass> getClassById(Long id) {
        return schoolClassRepository.findById(id);
    }

    public List<SchoolClassResponse> getAllClasses(Long userId) {
        userBehavior.requireCanViewClass(userId);
        return schoolClassRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public com.innuva.schoolmanagementsystem.dto.PagedResponse<SchoolClassResponse> getClassesPaged(
            Long userId,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        userBehavior.requireCanViewClass(userId);

        org.springframework.data.domain.Sort sort = direction.equalsIgnoreCase("desc")
                ? org.springframework.data.domain.Sort.by(sortBy).descending()
                : org.springframework.data.domain.Sort.by(sortBy).ascending();

        org.springframework.data.domain.Pageable pageable =
                org.springframework.data.domain.PageRequest.of(page, size, sort);

        org.springframework.data.domain.Page<SchoolClass> classPage =
                schoolClassRepository.findAll(pageable);

        List<SchoolClassResponse> content = classPage
                .getContent()
                .stream()
                .map(this::toResponse)
                .toList();

        return new com.innuva.schoolmanagementsystem.dto.PagedResponse<>(
                content,
                classPage.getNumber(),
                classPage.getSize(),
                classPage.getTotalElements(),
                classPage.getTotalPages(),
                classPage.isFirst(),
                classPage.isLast()
        );
    }

    @Transactional
    public SchoolClassResponse createClass(Long userId, SchoolClassRequest request) {
        userBehavior.requireCanAddClass(userId);
        String name = request.getName().trim();

        if (schoolClassRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Class name already exists: " + name);
        }

        SchoolClass schoolClass = new SchoolClass();
        schoolClass.setName(name);

        SchoolClass saved = schoolClassRepository.save(schoolClass);
        return toResponse(saved);
    }

    @Transactional
    public SchoolClassResponse updateClass(Long userId, Long id, SchoolClassRequest request) {
        userBehavior.requireCanEditClass(userId);
        
        SchoolClass schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        String name = request.getName().trim();

        if (schoolClassRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new IllegalArgumentException("Class name already exists: " + name);
        }

        schoolClass.setName(name);
        SchoolClass saved = schoolClassRepository.save(schoolClass);
        return toResponse(saved);
    }

    @Transactional
    public void deleteClass(Long userId, Long id) {
        userBehavior.requireCanDeleteClass(userId);

        SchoolClass schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        if (schoolClass.getStudents() != null && !schoolClass.getStudents().isEmpty()) {
            throw new IllegalArgumentException("Cannot delete class because it has associated students");
        }

        if (schoolClassRepository.countClassCourseAssignments(id) > 0) {
            throw new IllegalArgumentException("Cannot delete class because it has existing course assignments");
        }

        schoolClassRepository.delete(schoolClass);
    }

    private SchoolClassResponse toResponse(SchoolClass schoolClass) {
        return new SchoolClassResponse(schoolClass.getId(), schoolClass.getName());
    }
}