import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import { ArrowLeft, Plus, Edit2, Trash2, X } from "lucide-react";
import {
    getTeachersPaged,
    createTeacher,
    updateTeacher,
    deleteTeacher
} from "../api/teacherApi";

const PAGE_SIZE = 5;

export default function AdminTeachersPage({ currentUser, onLogout }) {
    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [listError, setListError] = useState("");

    const [showAddForm, setShowAddForm] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: "", phone: "", email: "", username: "", password: "" });
    const [addError, setAddError] = useState("");
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editTeacher, setEditTeacher] = useState({ name: "", phone: "", email: "" });
    const [editError, setEditError] = useState("");
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadTeachers = useCallback(async (pg) => {
        try {
            setLoading(true);
            setListError("");
            const data = await getTeachersPaged(pg, PAGE_SIZE);
            setTeachers(data.content);
            setPage(data.page);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            setListError("Could not load teachers.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadTeachers(0); }, [loadTeachers]);

    async function handleAdd(e) {
        e.preventDefault();
        const { name, phone, email, username, password } = newTeacher;
        if (!name.trim() || !phone.trim() || !email.trim() || !username.trim() || !password.trim()) {
            setAddError("All fields are required."); return;
        }
        try {
            setAdding(true); setAddError("");
            await createTeacher({ name: name.trim(), phone: phone.trim(), email: email.trim(), username: username.trim(), password: password.trim() });
            setAddSuccess("Teacher added successfully.");
            setNewTeacher({ name: "", phone: "", email: "", username: "", password: "" });
            setShowAddForm(false);
            loadTeachers(page);
            setTimeout(() => setAddSuccess(""), 3000);
        } catch (err) {
            setAddError(err.message || "Failed to add teacher.");
        } finally {
            setAdding(false);
        }
    }

    function startEdit(t) {
        setEditingId(t.id);
        setEditTeacher({ name: t.name, phone: t.phone || "", email: t.email || "" });
        setEditError("");
    }

    async function handleSaveEdit(teacherId) {
        if (!editTeacher.name.trim()) { setEditError("Name is required."); return; }
        try {
            setSaving(true); setEditError("");
            await updateTeacher(teacherId, { name: editTeacher.name.trim(), phone: editTeacher.phone.trim(), email: editTeacher.email.trim() });
            setEditingId(null);
            loadTeachers(page);
        } catch (err) {
            setEditError(err.message || "Failed to update teacher.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            await deleteTeacher(deleteTarget.id);
            setDeleteTarget(null);
            const newPage = teachers.length === 1 && page > 0 ? page - 1 : page;
            loadTeachers(newPage);
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
                        <h1 className="page-title">Teachers Management</h1>
                        <p className="page-subtitle">Manage all teacher records and accounts</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setShowAddForm(!showAddForm); setAddError(""); }}>
                        <Plus size={16} /> Add Teacher
                    </button>
                </div>

                {addSuccess && <div className="alert-success">{addSuccess}</div>}

                {showAddForm && (
                    <div className="mgmt-card" style={{ marginBottom: "1.5rem" }}>
                        <div className="mgmt-card__header">
                            <span>Add New Teacher</span>
                            <button className="icon-btn" onClick={() => setShowAddForm(false)}><X size={16}/></button>
                        </div>
                        <form onSubmit={handleAdd} className="mgmt-form">
                            <div className="form-grid">
                                {[["name","Full Name","text"],["phone","Phone","text"],["email","Email","email"],["username","Username","text"],["password","Password","password"]].map(([key, label, type]) => (
                                    <div className="form-group" key={key}>
                                        <label>{label}</label>
                                        <input className="form-input" type={type} value={newTeacher[key]}
                                            onChange={e => setNewTeacher(t => ({ ...t, [key]: e.target.value }))}
                                            placeholder={label} />
                                    </div>
                                ))}
                            </div>
                            {addError && <p className="form-error">{addError}</p>}
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={adding}>{adding ? "Saving…" : "Add Teacher"}</button>
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
                    ) : teachers.length === 0 ? (
                        <div className="empty-state"><p>No teachers found.</p></div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {teachers.map(t => (
                                    <tr key={t.id}>
                                        {editingId === t.id ? (
                                            <>
                                                <td>{t.id}</td>
                                                <td><input className="form-input form-input--inline" value={editTeacher.name} onChange={e => setEditTeacher(et => ({...et, name: e.target.value}))} /></td>
                                                <td><input className="form-input form-input--inline" value={editTeacher.phone} onChange={e => setEditTeacher(et => ({...et, phone: e.target.value}))} /></td>
                                                <td><input className="form-input form-input--inline" value={editTeacher.email} onChange={e => setEditTeacher(et => ({...et, email: e.target.value}))} />
                                                    {editError && <p className="form-error">{editError}</p>}
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn-primary btn--sm" disabled={saving} onClick={() => handleSaveEdit(t.id)}>{saving ? "…" : "Save"}</button>
                                                        <button className="btn-secondary btn--sm" onClick={() => setEditingId(null)}>Cancel</button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{t.id}</td>
                                                <td>{t.name}</td>
                                                <td>{t.phone || "—"}</td>
                                                <td>{t.email || "—"}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="icon-btn icon-btn--edit" onClick={() => startEdit(t)} title="Edit"><Edit2 size={15}/></button>
                                                        <button className="icon-btn icon-btn--delete" onClick={() => setDeleteTarget(t)} title="Delete"><Trash2 size={15}/></button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {!loading && !listError && (
                        <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={PAGE_SIZE} onPageChange={loadTeachers} />
                    )}
                </div>

                {deleteTarget && (
                    <ConfirmationModal
                        message={`Delete teacher "${deleteTarget.name}"? This cannot be undone.`}
                        onConfirm={handleDelete}
                        onCancel={() => setDeleteTarget(null)}
                        loading={deleting}
                    />
                )}
            </main>
        </div>
    );
}
