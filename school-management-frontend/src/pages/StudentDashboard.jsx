import { useEffect, useState } from "react";
import { getStudentDashboard } from "../api/studentApi";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import {
    BookOpen,
    Users,
    TrendingUp,
    UserRound,
    GraduationCap,
} from "lucide-react";

function StudentDashboard({ currentUser, onLogout }) {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const data = await getStudentDashboard(currentUser.userId);
            setDashboard(data);
        } catch (error) {
            console.error(error);
            setError("Could not load the student dashboard");
        }
    }

    /* ── Error state ────────────────────────────────────────── */
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

    /* ── Loading state ──────────────────────────────────────── */
    if (!dashboard) {
        return (
            <>
                <Header currentUser={currentUser} onLogout={onLogout} />
                <main className="dashboard-content">
                    <p className="student-loading">Loading dashboard…</p>
                </main>
            </>
        );
    }

    /* ── Derived statistics ─────────────────────────────────── */
    const totalCourses = dashboard.courses.length;
    const totalClassmates = dashboard.classmates.length;

    const numericGrades = dashboard.courses
        .map((c) => c.grade)
        .filter((g) => g != null && !Number.isNaN(Number(g)));

    const averageGrade =
        numericGrades.length > 0
            ? (
                  numericGrades.reduce((sum, g) => sum + Number(g), 0) /
                  numericGrades.length
              ).toFixed(1)
            : null;

    /* ── Main render ────────────────────────────────────────── */
    return (
        <>
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main className="dashboard-content">

                {/* ── Welcome / identity area ── */}
                <div className="student-welcome-area">
                    <div className="student-welcome-text">
                        <h2 className="student-welcome-heading">
                            Welcome back, {dashboard.name}
                        </h2>
                        <p className="student-welcome-sub">
                            Here's an overview of your classes and academic progress.
                        </p>
                    </div>
                    <div className="student-identity-chips">
                        <span className="student-identity-chip">
                            <UserRound size={13} strokeWidth={2} />
                            ID&nbsp;{dashboard.studentId}
                        </span>
                        <span className="student-identity-chip">
                            <GraduationCap size={13} strokeWidth={2} />
                            {dashboard.className}
                        </span>
                    </div>
                </div>

                {/* ── Summary stats ── */}
                <div className="admin-summary-grid student-stats-grid">
                    <StatCard
                        icon={BookOpen}
                        label="My Courses"
                        count={totalCourses}
                    />
                    <StatCard
                        icon={Users}
                        label="Classmates"
                        count={totalClassmates}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Average Grade"
                        count={averageGrade ?? "—"}
                    />
                </div>

                {/* ── Main two-column layout ── */}
                <div className="student-main-grid">

                    {/* ── Academic Performance ── */}
                    <section className="student-section">
                        <div className="student-section-header">
                            <BookOpen size={18} strokeWidth={1.75} />
                            <h3>Academic Performance</h3>
                        </div>

                        {dashboard.courses.length === 0 ? (
                            <p className="student-empty-note">
                                No courses are currently assigned.
                            </p>
                        ) : (
                            <div className="student-table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Teacher</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboard.courses.map((course) => (
                                            <tr key={course.courseName}>
                                                <td className="student-course-name">
                                                    {course.courseName}
                                                </td>
                                                <td className="student-teacher-name">
                                                    {course.teacherName}
                                                </td>
                                                <td>
                                                    {course.grade != null ? (
                                                        <span className="student-grade-badge">
                                                            {course.grade}
                                                        </span>
                                                    ) : (
                                                        <span className="student-grade-null">
                                                            Not graded
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* ── My Class ── */}
                    <section className="student-section student-class-section">
                        <div className="student-section-header">
                            <Users size={18} strokeWidth={1.75} />
                            <h3>My Class</h3>
                        </div>

                        <p className="student-class-name-display">
                            {dashboard.className}
                        </p>

                        {dashboard.classmates.length === 0 ? (
                            <p className="student-empty-note">
                                No classmates found.
                            </p>
                        ) : (
                            <ul className="student-classmates-list">
                                {dashboard.classmates.map((classmate) => (
                                    <li
                                        key={classmate}
                                        className="student-classmate-row"
                                    >
                                        <span className="student-classmate-avatar">
                                            <UserRound
                                                size={15}
                                                strokeWidth={1.75}
                                            />
                                        </span>
                                        <span className="student-classmate-name">
                                            {classmate}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                </div>
            </main>
        </>
    );
}

export default StudentDashboard;