import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import { ArrowLeft, Plus, Edit2, Trash2, X, ChevronDown } from "lucide-react";
import { getCoursesPaged, createCourse, updateCourse, deleteCourse } from "../api/courseApi";
import { getTeachers } from "../api/teacherApi";
import { getClasses } from "../api/classApi";

const PAGE_SIZE = 5;

export default function AdminCoursesPage({ currentUser, onLogout }) {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [listError, setListError] = useState("");

    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [lookupsLoaded, setLookupsLoaded] = useState(false);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: "", teacherId: "", classIds: [] });
    const [addError, setAddError] = useState("");
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editCourse, setEditCourse] = useState({ name: "", teacherId: "", classIds: [] });
    const [editError, setEditError] = useState("");
    const [saving, setSaving] = useState(false);

    const [expandedId, setExpandedId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadCourses = useCallback(async (pg) => {
        try {
            setLoading(true);
            setListError("");
            const data = await getCoursesPaged(currentUser.userId, pg, PAGE_SIZE);
            setCourses(data.content);
            setPage(data.page);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            setListError("Could not load courses.");
        } finally {
            setLoading(false);
        }
    }, [currentUser.userId]);

    async function loadLookups() {
        if (lookupsLoaded) return;
        try {
            const [tList, cList] = await Promise.all([
                getTeachers(),
                getClasses(currentUser.userId)
            ]);
            setTeachers(tList);
            setClasses(cList);
            setLookupsLoaded(true);
        } catch { /* non-fatal */ }
    }

    useEffect(() => { loadCourses(0); }, [loadCourses]);

    function toggleClassId(classId, target, setTarget) {
        const id = Number(classId);
        if (target.classIds.includes(id)) {
            setTarget(c => ({ ...c, classIds: c.classIds.filter(x => x !== id) }));
        } else {
            setTarget(c => ({ ...c, classIds: [...c.classIds, id] }));
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!newCourse.name.trim() || !newCourse.teacherId) { setAddError("Name and teacher are required."); return; }
        try {
            setAdding(true); setAddError("");
            await createCourse(currentUser.userId, {
                name: newCourse.name.trim(),
                teacherId: Number(newCourse.teacherId),
                classIds: newCourse.classIds
            });
            setAddSuccess("Course added successfully.");
            setNewCourse({ name: "", teacherId: "", classIds: [] });
            setShowAddForm(false);
            loadCourses(page);
            setTimeout(() => setAddSuccess(""), 3000);
        } catch (err) {
            setAddError(err.message || "Failed to add course.");
        } finally {
            setAdding(false);
        }
    }

    function startEdit(c) {
        setEditingId(c.id);
        setEditCourse({ name: c.name, teacherId: String(c.teacherId || ""), classIds: c.classIds || [] });
        setEditError("");
        loadLookups();
    }

    async function handleSaveEdit(courseId) {
        if (!editCourse.name.trim() || !editCourse.teacherId) { setEditError("Name and teacher are required."); return; }
        try {
            setSaving(true); setEditError("");
            await updateCourse(currentUser.userId, courseId, {
                name: editCourse.name.trim(),
                teacherId: Number(editCourse.teacherId),
                classIds: editCourse.classIds
            });
            setEditingId(null);
            loadCourses(page);
        } catch (err) {
            setEditError(err.message || "Failed to update course.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            await deleteCourse(currentUser.userId, deleteTarget.id);
            setDeleteTarget(null);
            const newPage = courses.length === 1 && page > 0 ? page - 1 : page;
            loadCourses(newPage);
        } catch { setDeleteTarget(null); }
        finally { setDeleting(false); }
    }

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />
            <main className="page-content page-content--mgmt">
                <div className="page-header">
                    <div className="page-header__left">
                        <button className="back-btn" onClick={() => navigate("/admin")}>
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="page-title">Courses Management</h1>
                        <p className="page-subtitle">Manage courses, assign teachers and classes</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setShowAddForm(!showAddForm); setAddError(""); loadLookups(); }}>
                        <Plus size={16} /> Add Course
                    </button>
                </div>

                {addSuccess && <div className="alert-success">{addSuccess}</div>}

                {showAddForm && (
                    <div className="mgmt-card" style={{ marginBottom: "1.5rem" }}>
                        <div className="mgmt-card__header">
                            <span>Add New Course</span>
                            <button className="icon-btn" onClick={() => setShowAddForm(false)}><X size={16}/></button>
                        </div>
                        <form onSubmit={handleAdd} className="mgmt-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Course Name</label>
                                    <input className="form-input" value={newCourse.name}
                                        onChange={e => setNewCourse(c => ({ ...c, name: e.target.value }))}
                                        placeholder="e.g. Mathematics" />
                                </div>
                                <div className="form-group">
                                    <label>Teacher</label>
                                    <select className="form-select" value={newCourse.teacherId}
                                        onChange={e => setNewCourse(c => ({ ...c, teacherId: e.target.value }))}>
                                        <option value="">Select teacher…</option>
                                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Assign Classes</label>
                                <div className="checkbox-group">
                                    {classes.map(cl => (
                                        <label key={cl.id} className="checkbox-label">
                                            <input type="checkbox"
                                                checked={newCourse.classIds.includes(cl.id)}
                                                onChange={() => toggleClassId(cl.id, newCourse, setNewCourse)} />
                                            {cl.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {addError && <p className="form-error">{addError}</p>}
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={adding}>{adding ? "Saving…" : "Add Course"}</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mgmt-card">
                    {loading ? (
                        <div className="loading-state"><div className="loading-spinner" /><p>Loading…</p></div>
                    ) : listError ? (
                        <div className="error-state"><p>{listError}</p></div>
                    ) : courses.length === 0 ? (
                        <div className="empty-state"><p>No courses found.</p></div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr><th>#</th><th>Course</th><th>Teacher</th><th>Classes</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {courses.map(c => (
                                    <>
                                        {editingId === c.id ? (
                                            <tr key={c.id}>
                                                <td>{c.id}</td>
                                                <td>
                                                    <input className="form-input form-input--inline"
                                                        value={editCourse.name}
                                                        onChange={e => setEditCourse(ec => ({ ...ec, name: e.target.value }))} />
                                                </td>
                                                <td>
                                                    <select className="form-select form-select--inline"
                                                        value={editCourse.teacherId}
                                                        onChange={e => setEditCourse(ec => ({ ...ec, teacherId: e.target.value }))}>
                                                        <option value="">Select…</option>
                                                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                    </select>
                                                </td>
                                                <td>
                                                    <div className="checkbox-group checkbox-group--compact">
                                                        {classes.map(cl => (
                                                            <label key={cl.id} className="checkbox-label">
                                                                <input type="checkbox"
                                                                    checked={editCourse.classIds.includes(cl.id)}
                                                                    onChange={() => toggleClassId(cl.id, editCourse, setEditCourse)} />
                                                                {cl.name}
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {editError && <p className="form-error">{editError}</p>}
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn-primary btn--sm" disabled={saving} onClick={() => handleSaveEdit(c.id)}>{saving ? "…" : "Save"}</button>
                                                        <button className="btn-secondary btn--sm" onClick={() => setEditingId(null)}>Cancel</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={c.id}>
                                                <td>{c.id}</td>
                                                <td>
                                                    <button className="text-btn" onClick={() => setExpandedId(x => x === c.id ? null : c.id)}>
                                                        {c.name} <ChevronDown size={12} style={{ transform: expandedId === c.id ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                                                    </button>
                                                    {expandedId === c.id && c.classNames?.length > 0 && (
                                                        <ul className="inline-list">
                                                            {c.classNames.map((n, i) => <li key={i}>{n}</li>)}
                                                        </ul>
                                                    )}
                                                </td>
                                                <td>{c.teacherName || "—"}</td>
                                                <td>{c.classNames?.length ?? 0} class{c.classNames?.length !== 1 ? "es" : ""}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="icon-btn icon-btn--edit" onClick={() => startEdit(c)} title="Edit"><Edit2 size={15}/></button>
                                                        <button className="icon-btn icon-btn--delete" onClick={() => setDeleteTarget(c)} title="Delete"><Trash2 size={15}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && !listError && (
                        <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={PAGE_SIZE} onPageChange={loadCourses} />
                    )}
                </div>

                {deleteTarget && (
                    <ConfirmationModal
                        message={`Delete course "${deleteTarget.name}"? This cannot be undone.`}
                        onConfirm={handleDelete}
                        onCancel={() => setDeleteTarget(null)}
                        loading={deleting}
                    />
                )}
            </main>
        </div>
    );
}
