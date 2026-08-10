import { useEffect, useState } from "react";
import {
    getTeacherDashboard,
    updateGrade
} from "../api/teacherApi";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import {
    BookOpen,
    Users,
    GraduationCap,
    ChevronDown,
    Pencil,
    Check,
    X,
} from "lucide-react";

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
            const data = await getTeacherDashboard(currentUser.userId);
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
            courseId: courseId,
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

    /* ── Derived stats ─────────────────────────────────────── */
    const totalCourses  = dashboard ? dashboard.courses.length : 0;
    const totalClasses  = dashboard
        ? dashboard.courses.reduce((sum, c) => sum + c.classes.length, 0)
        : 0;
    const totalStudents = dashboard
        ? dashboard.courses.reduce(
              (sum, c) =>
                  sum +
                  c.classes.reduce(
                      (s2, cl) => s2 + cl.students.length,
                      0
                  ),
              0
          )
        : 0;

    /* ── Error state ───────────────────────────────────────── */
    if (error) {
        return (
            <>
                <Header currentUser={currentUser} onLogout={onLogout} />
                <main className="dashboard-content">
                    <p className="error-message">{error}</p>
                </main>
            </>
        );
    }

    /* ── Loading state ─────────────────────────────────────── */
    if (!dashboard) {
        return (
            <>
                <Header currentUser={currentUser} onLogout={onLogout} />
                <main className="dashboard-content">
                    <p className="teacher-loading">Loading dashboard…</p>
                </main>
            </>
        );
    }

    /* ── Main render ───────────────────────────────────────── */
    return (
        <>
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main className="dashboard-content">

                {/* Page title */}
                <div className="dashboard-title-area">
                    <h2>Teacher Dashboard</h2>
                    <p className="dashboard-subtitle">
                        Manage your courses, classes and student grades.
                    </p>
                </div>

                {/* Stats row */}
                <div className="admin-summary-grid">
                    <StatCard
                        icon={BookOpen}
                        label="My Courses"
                        count={totalCourses}
                    />
                    <StatCard
                        icon={GraduationCap}
                        label="My Classes"
                        count={totalClasses}
                    />
                    <StatCard
                        icon={Users}
                        label="Students Taught"
                        count={totalStudents}
                    />
                </div>

                {/* Success banner */}
                {successMessage && (
                    <p className="success-message">{successMessage}</p>
                )}

                {/* Course list */}
                {dashboard.courses.length === 0 ? (
                    <div className="teacher-empty">
                        <BookOpen size={40} strokeWidth={1.2} />
                        <p>No courses assigned yet.</p>
                    </div>
                ) : (
                    <div className="teacher-courses-list">
                        {dashboard.courses.map((course) => {
                            const courseOpen = openCourseId === course.courseId;

                            return (
                                <div
                                    className="admin-card"
                                    key={course.courseId}
                                >
                                    {/* Course accordion header */}
                                    <button
                                        type="button"
                                        className={`admin-card-button${courseOpen ? " admin-card-button-open" : ""}`}
                                        onClick={() =>
                                            toggleCourse(course.courseId)
                                        }
                                    >
                                        <span className="admin-card-button-title">
                                            <span className="admin-card-button-icon">
                                                <BookOpen size={18} strokeWidth={1.75} />
                                            </span>
                                            {course.courseName}
                                            <span className="teacher-course-meta">
                                                {course.classes.length}{" "}
                                                {course.classes.length === 1
                                                    ? "class"
                                                    : "classes"}
                                            </span>
                                        </span>
                                        <ChevronDown
                                            size={18}
                                            strokeWidth={2}
                                            className="admin-card-chevron"
                                        />
                                    </button>

                                    {/* Course body */}
                                    {courseOpen && (
                                        <div className="admin-card-content">
                                            {course.classes.map((schoolClass) => {
                                                const classKey = `${course.courseId}-${schoolClass.classId}`;
                                                const classIsOpen =
                                                    openClassKey === classKey;

                                                return (
                                                    <div
                                                        className="class-group"
                                                        key={schoolClass.classId}
                                                    >
                                                        {/* Class accordion header */}
                                                        <button
                                                            type="button"
                                                            className="class-accordion-button"
                                                            onClick={() =>
                                                                toggleClass(
                                                                    course.courseId,
                                                                    schoolClass.classId
                                                                )
                                                            }
                                                        >
                                                            <span className="teacher-class-label">
                                                                <GraduationCap
                                                                    size={15}
                                                                    strokeWidth={1.75}
                                                                    style={{ flexShrink: 0 }}
                                                                />
                                                                {schoolClass.className}
                                                                <span className="teacher-student-badge">
                                                                    {schoolClass.students.length}{" "}
                                                                    {schoolClass.students.length === 1
                                                                        ? "student"
                                                                        : "students"}
                                                                </span>
                                                            </span>
                                                            <ChevronDown
                                                                size={15}
                                                                strokeWidth={2}
                                                                style={{
                                                                    transition: "transform 0.2s",
                                                                    transform: classIsOpen
                                                                        ? "rotate(180deg)"
                                                                        : "rotate(0deg)",
                                                                    color: "var(--text-secondary)",
                                                                }}
                                                            />
                                                        </button>

                                                        {/* Class body — grade table */}
                                                        {classIsOpen && (
                                                            <>
                                                                {schoolClass.students.length === 0 ? (
                                                                    <p className="teacher-no-students">
                                                                        No students enrolled in this class.
                                                                    </p>
                                                                ) : (
                                                                    <table>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Student ID</th>
                                                                                <th>Name</th>
                                                                                <th>Grade</th>
                                                                                <th>Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {schoolClass.students.map(
                                                                                (student) => (
                                                                                    <tr key={student.studentId}>
                                                                                        <td className="teacher-id-cell">
                                                                                            #{student.studentId}
                                                                                        </td>

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
                                                                                                    className="teacher-grade-input"
                                                                                                    onChange={(e) =>
                                                                                                        setEditedGrade(
                                                                                                            e.target.value
                                                                                                        )
                                                                                                    }
                                                                                                />
                                                                                            ) : (
                                                                                                <span
                                                                                                    className={
                                                                                                        student.grade == null
                                                                                                            ? "teacher-grade-null"
                                                                                                            : "teacher-grade-value"
                                                                                                    }
                                                                                                >
                                                                                                    {student.grade ?? "Not graded"}
                                                                                                </span>
                                                                                            )}
                                                                                        </td>

                                                                                        <td>
                                                                                            <div className="student-actions">
                                                                                                {isEditing(
                                                                                                    student.studentId,
                                                                                                    course.courseId
                                                                                                ) ? (
                                                                                                    <>
                                                                                                        <button
                                                                                                            className="teacher-save-button"
                                                                                                            disabled={saving}
                                                                                                            onClick={() =>
                                                                                                                saveGrade(
                                                                                                                    student,
                                                                                                                    course.courseId
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            <Check size={13} strokeWidth={2.5} />
                                                                                                            {saving ? "Saving…" : "Save"}
                                                                                                        </button>
                                                                                                        <button
                                                                                                            className="cancel-button"
                                                                                                            disabled={saving}
                                                                                                            onClick={cancelEditing}
                                                                                                        >
                                                                                                            <X size={13} strokeWidth={2.5} />
                                                                                                            Cancel
                                                                                                        </button>
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <button
                                                                                                        className="edit-button"
                                                                                                        onClick={() =>
                                                                                                            startEditing(
                                                                                                                student,
                                                                                                                course.courseId
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        <Pencil size={13} strokeWidth={2} />
                                                                                                        Edit Grade
                                                                                                    </button>
                                                                                                )}
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            )}
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
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </>
    );
}

export default TeacherDashboard;