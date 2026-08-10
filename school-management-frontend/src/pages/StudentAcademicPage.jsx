import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ArrowLeft, BookOpen, Award } from "lucide-react";
import { getStudentCourses } from "../api/studentApi";

export default function StudentAcademicPage({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError("");
                const data = await getStudentCourses(currentUser.userId);
                setCourses(data);
            } catch {
                setError("Could not load academic information.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [currentUser.userId]);

    const gradeAvg = courses.length > 0
        ? courses.filter(c => c.grade !== null && c.grade !== undefined).reduce((s, c) => s + c.grade, 0) /
          Math.max(1, courses.filter(c => c.grade !== null && c.grade !== undefined).length)
        : null;

    function gradeClass(g) {
        if (g === null || g === undefined) return "grade-badge--none";
        return g >= 50 ? "grade-badge--pass" : "grade-badge--fail";
    }

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main className="page-content page-content--wide">
                <div className="page-header">
                    <div className="page-header__left">
                        <button className="back-btn" onClick={() => navigate("/student")}>
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="page-title">Academic Performance</h1>
                        <p className="page-subtitle">Your courses, teachers and grades</p>
                    </div>
                    {gradeAvg !== null && (
                        <div className="stat-pill">
                            <Award size={16} />
                            Average: <strong>{gradeAvg.toFixed(1)}%</strong>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="loading-state"><div className="loading-spinner" /><p>Loading…</p></div>
                ) : error ? (
                    <div className="error-state"><p>{error}</p></div>
                ) : courses.length === 0 ? (
                    <div className="empty-state">
                        <BookOpen size={36} />
                        <p>No courses enrolled yet.</p>
                    </div>
                ) : (
                    <div className="mgmt-card">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Course</th>
                                    <th>Teacher</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((c, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{c.courseName}</td>
                                        <td>{c.teacherName}</td>
                                        <td>
                                            <span className={`grade-badge ${gradeClass(c.grade)}`}>
                                                {c.grade !== null && c.grade !== undefined ? c.grade : "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
