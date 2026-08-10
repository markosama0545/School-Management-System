import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";
import { getTeacherCourseStudents, updateGrade, getTeacherCourses } from "../api/teacherApi";

const PAGE_SIZE = 10;

export default function TeacherCourseDetailPage({ currentUser, onLogout }) {
    const navigate = useNavigate();
    const { courseId, classId } = useParams();
    const { state } = useLocation();

    const [courseName, setCourseName] = useState(state?.courseName || "");
    const [className, setClassName] = useState(state?.className || "");

    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Grade editing
    const [editingId, setEditingId] = useState(null);
    const [gradeInput, setGradeInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");

    useEffect(() => {
        if (!courseName || !className) {
            getTeacherCourses(currentUser.userId).then(courses => {
                const course = courses.find(c => c.courseId === Number(courseId));
                if (course) {
                    setCourseName(course.courseName);
                    const cl = course.classes?.find(x => x.classId === Number(classId));
                    if (cl) {
                        setClassName(cl.className);
                    }
                }
            }).catch(() => {});
        }
    }, [currentUser.userId, courseId, classId, courseName, className]);

    const load = useCallback(async (pg) => {
        try {
            setLoading(true);
            setError("");
            const data = await getTeacherCourseStudents(
                currentUser.userId,
                Number(courseId),
                Number(classId),
                pg,
                PAGE_SIZE
            );
            setStudents(data.content);
            setPage(data.page);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            setError("Could not load student grades.");
        } finally {
            setLoading(false);
        }
    }, [currentUser.userId, courseId, classId]);

    useEffect(() => { load(0); }, [load]);

    function startEdit(student) {
        setEditingId(student.studentId);
        setGradeInput(student.grade !== null && student.grade !== undefined ? String(student.grade) : "");
        setSaveError("");
        setSaveSuccess("");
    }

    async function handleSaveGrade(studentId) {
        const g = parseFloat(gradeInput);
        if (isNaN(g) || g < 0 || g > 100) {
            setSaveError("Grade must be between 0 and 100.");
            return;
        }
        try {
            setSaving(true);
            setSaveError("");
            await updateGrade(currentUser.userId, studentId, Number(courseId), g);
            setSaveSuccess("Grade saved.");
            setEditingId(null);
            // Refresh just the current page
            load(page);
            setTimeout(() => setSaveSuccess(""), 2500);
        } catch {
            setSaveError("Failed to save grade.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main className="page-content page-content--mgmt">
                <div className="page-header">
                    <div className="page-header__left">
                        <button className="back-btn" onClick={() => navigate("/teacher/courses")}>
                            <ArrowLeft size={16} /> Back to My Courses
                        </button>
                        <h1 className="page-title">Grade Management</h1>
                        <p className="page-subtitle">
                            <strong>{courseName || `Course #${courseId}`}</strong> — {className || `Class #${classId}`}
                            {!loading && !error && (
                                <> &middot; <strong>{totalElements}</strong> Student{totalElements !== 1 ? "s" : ""}</>
                            )}
                        </p>
                    </div>
                </div>

                {saveSuccess && <div className="alert-success">{saveSuccess}</div>}

                <div className="mgmt-card">
                    {loading ? (
                        <div className="loading-state"><div className="loading-spinner" /><p>Loading student grades…</p></div>
                    ) : error ? (
                        <div className="error-state"><p>{error}</p></div>
                    ) : students.length === 0 ? (
                        <div className="empty-state"><p>No students are enrolled in this class.</p></div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student Name</th>
                                    <th>Grade</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, i) => (
                                    <tr key={s.studentId}>
                                        <td>{page * PAGE_SIZE + i + 1}</td>
                                        <td>{s.studentName}</td>
                                        <td>
                                            {editingId === s.studentId ? (
                                                <input
                                                    className="form-input form-input--inline"
                                                    style={{ width: "80px" }}
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={gradeInput}
                                                    onChange={e => setGradeInput(e.target.value)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className={`grade-badge ${s.grade === null || s.grade === undefined ? "grade-badge--none" : s.grade >= 50 ? "grade-badge--pass" : "grade-badge--fail"}`}>
                                                    {s.grade !== null && s.grade !== undefined ? s.grade : "—"}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {editingId === s.studentId ? (
                                                <div className="table-actions">
                                                    {saveError && <span className="form-error" style={{fontSize:"12px"}}>{saveError}</span>}
                                                    <button className="icon-btn icon-btn--edit" disabled={saving} onClick={() => handleSaveGrade(s.studentId)} title="Save">
                                                        <Check size={15} />
                                                    </button>
                                                    <button className="icon-btn" onClick={() => { setEditingId(null); setSaveError(""); }} title="Cancel">
                                                        <X size={15} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="icon-btn icon-btn--edit" onClick={() => startEdit(s)} title="Edit grade">
                                                    <Edit2 size={15} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && !error && (
                        <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={PAGE_SIZE} onPageChange={load} />
                    )}
                </div>
            </main>
        </div>
    );
}
