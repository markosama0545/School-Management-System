import { API_BASE_URL } from "./apiConfig";

export async function getTeacherDashboard(userId) {
    const response = await fetch(
        `${API_BASE_URL}/teacher-dashboard`,
        {
            headers: {
                "X-User-Id": userId
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to load teacher dashboard"
        );
    }

    return response.json();
}

export async function updateGrade(
    userId,
    studentId,
    courseId,
    grade
) {
    const response = await fetch(
        `${API_BASE_URL}/grades`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-User-Id": userId
            },
            body: JSON.stringify({
                studentId,
                courseId,
                grade
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to update grade"
        );
    }
}


export async function getTeachers() {
    const response = await fetch(
        `${API_BASE_URL}/teachers`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to load teachers"
        );
    }

    return response.json();
}

export async function createTeacher(teacherData) {
    const response = await fetch(
        `${API_BASE_URL}/teachers/with-account`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacherData)
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.message ||
            "Failed to create teacher"
        );
    }

    return response.json();
}

export async function updateTeacher(
    teacherId,
    teacherData
) {
    const response = await fetch(
        `${API_BASE_URL}/teachers/${teacherId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(teacherData)
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.message ||
            "Failed to update teacher"
        );
    }

    return response.json();
}

export async function deleteTeacher(teacherId) {
    const response = await fetch(
        `${API_BASE_URL}/teachers/${teacherId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.message ||
            "Failed to delete teacher"
        );
    }
}