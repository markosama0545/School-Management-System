import { useEffect, useState } from "react";
import {
    getTeacherDashboard,
    updateGrade
} from "../api/teacherApi";

function TeacherDashboard({ currentUser, onLogout }) {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");
    const [editingRow, setEditingRow] = useState(null);
    const [editedGrade, setEditedGrade] = useState("");
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [openCourseId, setOpenCourseId] = useState(null);
    const [openClassKey, setOpenClassKey] = useState(null);


    async function loadDashboard() {
        try {
            const data = await getTeacherDashboard(
                currentUser.userId
            );

            setDashboard(data);
            setError("");
        } catch (error) {
            console.error(error);
            setError("Could not load teacher dashboard");
        }
    }

    useEffect(() => {
        loadDashboard();
    }, [currentUser.userId]);

    function startEditing(student, courseId) {
        setSuccessMessage("");
        setEditingRow({
            studentId: student.studentId,
            courseId: courseId

        });

        setEditedGrade(student.grade ?? "");
    }

    function cancelEditing() {
        setEditingRow(null);
        setEditedGrade("");
    }

    function isEditing(studentId, courseId) {
        return (
            editingRow?.studentId === studentId &&
            editingRow?.courseId === courseId
        );
    }

    async function saveGrade(student, courseId) {
        const gradeValue = Number(editedGrade);

        if (
            editedGrade === "" ||
            Number.isNaN(gradeValue) ||
            gradeValue < 0 ||
            gradeValue > 100
        ) {
            alert("Grade must be between 0 and 100.");
            return;
        }

        try {
            setSaving(true);

            await updateGrade(
                currentUser.userId,
                student.studentId,
                courseId,
                gradeValue
            );

            await loadDashboard();
            setSuccessMessage("Grade updated successfully!");

            setEditingRow(null);
            setEditedGrade("");
        } catch (error) {
            console.error(error);
            alert("Failed to update grade.");
        } finally {
            setSaving(false);
        }
    }

    if (error) {
        return (
            <main className="app">
                <p>{error}</p>
                <button onClick={onLogout}>
                    Logout
                </button>
            </main>
        );
    }

    if (!dashboard) {
        return <p>Loading...</p>;
    }

    function toggleCourse(courseId) {
        setOpenCourseId((currentId) =>
            currentId === courseId ? null : courseId
        );

        setOpenClassKey(null);
    }

    function toggleClass(courseId, classId) {
        const classKey = `${courseId}-${classId}`;

        setOpenClassKey((currentKey) =>
            currentKey === classKey ? null : classKey
        );
    }

    return (
        <main className="app">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {dashboard.teacherName}</h1>
                    <p>Teacher ID: {dashboard.teacherId}</p>
                </div>

                <button onClick={onLogout}>
                    Logout
                </button>
            </div>

            {successMessage && (
                <p className="success-message">
                    {successMessage}
                </p>
            )}

            {dashboard.courses.length === 0 ? (
                <p>No courses assigned.</p>
            ) : (
                dashboard.courses.map((course) => (
                    <section
                        className="dashboard-section"
                        key={course.courseId}
                    >

                        <button
                            type="button"
                            className="accordion-button course-button"
                            onClick={() => toggleCourse(course.courseId)}
                        >
                            <span>{course.courseName}</span>

                            <span>
        {openCourseId === course.courseId ? "▲" : "▼"}
    </span>
                        </button>


                        {openCourseId === course.courseId && (
                            <div className="course-content">
                                {course.classes.map((schoolClass) => {
                                    const classKey =
                                        `${course.courseId}-${schoolClass.classId}`;

                                    const classIsOpen =
                                        openClassKey === classKey;

                                    return (
                                        <div
                                            className="teacher-class"
                                            key={schoolClass.classId}
                                        >
                                            <button
                                                type="button"
                                                className="accordion-button class-button"
                                                onClick={() =>
                                                    toggleClass(
                                                        course.courseId,
                                                        schoolClass.classId
                                                    )
                                                }
                                            >
                                                <span>{schoolClass.className}</span>

                                                <span>
                            {classIsOpen ? "▲" : "▼"}
                        </span>
                                            </button>

                                            {classIsOpen && (
                                                <>
                                                    {schoolClass.students.length === 0 ? (
                                                        <p>No students found.</p>
                                                    ) : (
                                                        <table>
                                                            <thead>
                                                            <tr>
                                                                <th>Student ID</th>
                                                                <th>Student Name</th>
                                                                <th>Grade</th>
                                                                <th>Action</th>
                                                            </tr>
                                                            </thead>

                                                            <tbody>
                                                            {schoolClass.students.map((student) => (
                                                                <tr key={student.studentId}>
                                                                    <td>{student.studentId}</td>

                                                                    <td>{student.studentName}</td>

                                                                    <td>
                                                                        {isEditing(
                                                                            student.studentId,
                                                                            course.courseId
                                                                        ) ? (
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                max="100"
                                                                                value={editedGrade}
                                                                                onChange={(event) =>
                                                                                    setEditedGrade(
                                                                                        event.target.value
                                                                                    )
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            student.grade ?? "Not graded"
                                                                        )}
                                                                    </td>

                                                                    <td>
                                                                        {isEditing(
                                                                            student.studentId,
                                                                            course.courseId
                                                                        ) ? (
                                                                            <>
                                                                                <button
                                                                                    disabled={saving}
                                                                                    onClick={() =>
                                                                                        saveGrade(
                                                                                            student,
                                                                                            course.courseId
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {saving
                                                                                        ? "Saving..."
                                                                                        : "Save"}
                                                                                </button>

                                                                                <button
                                                                                    disabled={saving}
                                                                                    onClick={cancelEditing}
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() =>
                                                                                    startEditing(
                                                                                        student,
                                                                                        course.courseId
                                                                                    )
                                                                                }
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                ))
            )}
        </main>
    );
}

export default TeacherDashboard;