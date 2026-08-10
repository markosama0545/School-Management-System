import { API_BASE_URL } from "./apiConfig";

export async function getTeacherSummary(userId) {
    const response = await fetch(`${API_BASE_URL}/teacher-dashboard/summary`, {
        headers: { "X-User-Id": userId }
    });
    if (!response.ok) throw new Error("Failed to load teacher summary");
    return response.json();
}

export async function getTeacherCourses(userId) {
    const response = await fetch(`${API_BASE_URL}/teacher-dashboard/courses`, {
        headers: { "X-User-Id": userId }
    });
    if (!response.ok) throw new Error("Failed to load teacher courses");
    return response.json();
}

export async function getTeacherCourseStudents(userId, courseId, classId, page = 0, size = 10) {
    const url = new URL(`${API_BASE_URL}/teacher-dashboard/courses/${courseId}/classes/${classId}/students`);
    url.searchParams.set("page", page);
    url.searchParams.set("size", size);
    const response = await fetch(url.toString(), {
        headers: { "X-User-Id": userId }
    });
    if (!response.ok) throw new Error("Failed to load students");
    return response.json();
}

export async function updateGrade(userId, studentId, courseId, grade) {
    const response = await fetch(`${API_BASE_URL}/grades`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId
        },
        body: JSON.stringify({ studentId, courseId, grade })
    });
    if (!response.ok) throw new Error("Failed to update grade");
}

export async function getTeachers() {
    const response = await fetch(`${API_BASE_URL}/teachers`);
    if (!response.ok) throw new Error("Failed to load teachers");
    return response.json();
}

export async function getTeachersPaged(page = 0, size = 5, sortBy = "id", direction = "asc") {
    const url = new URL(`${API_BASE_URL}/teachers/paged`);
    url.searchParams.set("page", page);
    url.searchParams.set("size", size);
    url.searchParams.set("sortBy", sortBy);
    url.searchParams.set("direction", direction);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Failed to load teachers");
    return response.json();
}

export async function createTeacher(teacherData) {
    const response = await fetch(`${API_BASE_URL}/teachers/with-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create teacher");
    }
    return response.json();
}

export async function updateTeacher(teacherId, teacherData) {
    const response = await fetch(`${API_BASE_URL}/teachers/${teacherId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update teacher");
    }
    return response.json();
}

export async function deleteTeacher(teacherId) {
    const response = await fetch(`${API_BASE_URL}/teachers/${teacherId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete teacher");
    }
}