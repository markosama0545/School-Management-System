import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import { ArrowLeft, Plus, Edit2, Trash2, X } from "lucide-react";
import { getClassesPaged, createClass, updateClass, deleteClass } from "../api/classApi";

const PAGE_SIZE = 5;

export default function AdminClassesPage({ currentUser, onLogout }) {
    const navigate = useNavigate();

    const [classes, setClasses] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [listError, setListError] = useState("");

    const [showAddForm, setShowAddForm] = useState(false);
    const [newClass, setNewClass] = useState({ name: "" });
    const [addError, setAddError] = useState("");
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editClass, setEditClass] = useState({ name: "" });
    const [editError, setEditError] = useState("");
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadClasses = useCallback(async (pg) => {
        try {
            setLoading(true);
            setListError("");
            const data = await getClassesPaged(currentUser.userId, pg, PAGE_SIZE);
            setClasses(data.content);
            setPage(data.page);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            setListError("Could not load classes.");
        } finally {
            setLoading(false);
        }
    }, [currentUser.userId]);

    useEffect(() => { loadClasses(0); }, [loadClasses]);

    async function handleAdd(e) {
        e.preventDefault();
        if (!newClass.name.trim()) { setAddError("Class name is required."); return; }
        try {
            setAdding(true); setAddError("");
            await createClass(currentUser.userId, { name: newClass.name.trim() });
            setAddSuccess("Class added successfully.");
            setNewClass({ name: "" });
            setShowAddForm(false);
            loadClasses(page);
            setTimeout(() => setAddSuccess(""), 3000);
        } catch (err) {
            setAddError(err.message || "Failed to add class.");
        } finally {
            setAdding(false);
        }
    }

    async function handleSaveEdit(classId) {
        if (!editClass.name.trim()) { setEditError("Class name is required."); return; }
        try {
            setSaving(true); setEditError("");
            await updateClass(currentUser.userId, classId, { name: editClass.name.trim() });
            setEditingId(null);
            loadClasses(page);
        } catch (err) {
            setEditError(err.message || "Failed to update class.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            await deleteClass(currentUser.userId, deleteTarget.id);
            setDeleteTarget(null);
            const newPage = classes.length === 1 && page > 0 ? page - 1 : page;
            loadClasses(newPage);
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
                        <h1 className="page-title">Classes Management</h1>
                        <p className="page-subtitle">Create and manage school classes</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setShowAddForm(!showAddForm); setAddError(""); }}>
                        <Plus size={16} /> Add Class
                    </button>
                </div>

                {addSuccess && <div className="alert-success">{addSuccess}</div>}

                {showAddForm && (
                    <div className="mgmt-card" style={{ marginBottom: "1.5rem" }}>
                        <div className="mgmt-card__header">
                            <span>Add New Class</span>
                            <button className="icon-btn" onClick={() => setShowAddForm(false)}><X size={16}/></button>
                        </div>
                        <form onSubmit={handleAdd} className="mgmt-form">
                            <div className="form-group">
                                <label>Class Name</label>
                                <input className="form-input" value={newClass.name}
                                    onChange={e => setNewClass({ name: e.target.value })}
                                    placeholder="e.g. Class 10-A" />
                            </div>
                            {addError && <p className="form-error">{addError}</p>}
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={adding}>{adding ? "Saving…" : "Add Class"}</button>
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
                    ) : classes.length === 0 ? (
                        <div className="empty-state"><p>No classes found.</p></div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr><th>#</th><th>Class Name</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {classes.map(c => (
                                    <tr key={c.id}>
                                        {editingId === c.id ? (
                                            <>
                                                <td>{c.id}</td>
                                                <td>
                                                    <input className="form-input form-input--inline"
                                                        value={editClass.name}
                                                        onChange={e => setEditClass({ name: e.target.value })} />
                                                    {editError && <p className="form-error">{editError}</p>}
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn-primary btn--sm" disabled={saving} onClick={() => handleSaveEdit(c.id)}>{saving ? "…" : "Save"}</button>
                                                        <button className="btn-secondary btn--sm" onClick={() => setEditingId(null)}>Cancel</button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{c.id}</td>
                                                <td>{c.name}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="icon-btn icon-btn--edit" onClick={() => { setEditingId(c.id); setEditClass({ name: c.name }); setEditError(""); }} title="Edit"><Edit2 size={15}/></button>
                                                        <button className="icon-btn icon-btn--delete" onClick={() => setDeleteTarget(c)} title="Delete"><Trash2 size={15}/></button>
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
                        <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={PAGE_SIZE} onPageChange={loadClasses} />
                    )}
                </div>

                {deleteTarget && (
                    <ConfirmationModal
                        message={`Delete class "${deleteTarget.name}"? This cannot be undone.`}
                        onConfirm={handleDelete}
                        onCancel={() => setDeleteTarget(null)}
                        loading={deleting}
                    />
                )}
            </main>
        </div>
    );
}
