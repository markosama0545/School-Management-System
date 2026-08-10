import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ConfirmationModal from "../components/ConfirmationModal";
import Pagination from "../components/Pagination";
import { ArrowLeft, Plus, Edit2, Trash2, Search, X } from "lucide-react";
import {
    getStudentsPaged,
    searchStudentsPaged,
    addStudentWithAccount,
    updateStudent,
    deleteStudent
} from "../api/studentApi";
import { getClasses } from "../api/classApi";

const PAGE_SIZE = 10;

export default function AdminStudentsPage({ currentUser, onLogout }) {
    const navigate = useNavigate();

    // List state
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [listError, setListError] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchInput, setSearchInput] = useState("");

    // Classes for dropdown
    const [classes, setClasses] = useState([]);

    // Add form
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: "", username: "", password: "", classId: "" });
    const [addError, setAddError] = useState("");
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");

    // Edit — uses student.id (backend serializes StudentResponse.id, NOT studentId)
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", classId: "" });
    const [editError, setEditError] = useState("");
    const [saving, setSaving] = useState(false);

    // Delete
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadStudents = useCallback(async (pg, search) => {
        try {
            setLoading(true);
            setListError("");
            let data;
            if (search && search.trim()) {
                data = await searchStudentsPaged(currentUser.userId, search.trim(), pg, PAGE_SIZE);
            } else {
                data = await getStudentsPaged(currentUser.userId, pg, PAGE_SIZE);
            }
            setStudents(data.content);
            setPage(data.page);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            setListError("Could not load students.");
        } finally {
            setLoading(false);
        }
    }, [currentUser.userId]);

    useEffect(() => {
        loadStudents(0, "");
        getClasses(currentUser.userId).then(setClasses).catch(() => {});
    }, [currentUser.userId, loadStudents]);

    function handleSearch(e) {
        e.preventDefault();
        setSearchName(searchInput);
        loadStudents(0, searchInput);
    }

    function clearSearch() {
        setSearchInput("");
        setSearchName("");
        loadStudents(0, "");
    }

    function handlePageChange(pg) {
        loadStudents(pg, searchName);
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!newStudent.name.trim() || !newStudent.username.trim() || !newStudent.password.trim() || !newStudent.classId) {
            setAddError("All fields are required.");
            return;
        }
        try {
            setAdding(true);
            setAddError("");
            await addStudentWithAccount(currentUser.userId, {
                name: newStudent.name.trim(),
                username: newStudent.username.trim(),
                password: newStudent.password.trim(),
                classId: Number(newStudent.classId)
            });
            setAddSuccess("Student added successfully.");
            setNewStudent({ name: "", username: "", password: "", classId: "" });
            setShowAddForm(false);
            loadStudents(page, searchName);
            setTimeout(() => setAddSuccess(""), 3000);
        } catch (err) {
            setAddError(err.message || "Failed to add student.");
        } finally {
            setAdding(false);
        }
    }

    // FIXED: use student.id (backend field), not student.studentId (undefined)
    function startEdit(student) {
        setEditingId(student.id);
        setEditForm({ name: student.name, classId: String(student.classId || "") });
        setEditError("");
    }

    function cancelEdit() {
        setEditingId(null);
        setEditError("");
    }

    async function handleSaveEdit(studentId) {
        if (!editForm.name.trim() || !editForm.classId) {
            setEditError("Name and class are required.");
            return;
        }
        try {
            setSaving(true);
            setEditError("");
            await updateStudent(currentUser.userId, studentId, {
                name: editForm.name.trim(),
                classId: Number(editForm.classId)
            });
            setEditingId(null);
            loadStudents(page, searchName);
        } catch (err) {
            setEditError(err.message || "Failed to update student.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            // FIXED: use deleteTarget.id (not deleteTarget.studentId)
            await deleteStudent(currentUser.userId, deleteTarget.id);
            setDeleteTarget(null);
            const newPage = students.length === 1 && page > 0 ? page - 1 : page;
            loadStudents(newPage, searchName);
        } catch {
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="dashboard-page">
            <Header currentUser={currentUser} onLogout={onLogout} />

            <main className="page-content page-content--mgmt">
                {/* Page header */}
                <div className="page-header">
                    <div className="page-header__left">
                        <button className="back-btn" onClick={() => navigate("/admin")}>
                            <ArrowLeft size={16} /> Back to Dashboard
                        </button>
                        <h1 className="page-title">Students Management</h1>
                        <p className="page-subtitle">
                            {totalElements > 0 ? `${totalElements} student${totalElements !== 1 ? "s" : ""} total` : "Manage all student records and accounts"}
                        </p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => { setShowAddForm(!showAddForm); setAddError(""); }}
                    >
                        <Plus size={16} /> Add Student
                    </button>
                </div>

                {addSuccess && <div className="alert-success">{addSuccess}</div>}

                {/* Add Form */}
                {showAddForm && (
                    <div className="mgmt-card" style={{ marginBottom: "1.5rem" }}>
                        <div className="mgmt-card__header">
                            <span>Add New Student</span>
                            <button className="icon-btn" onClick={() => setShowAddForm(false)}><X size={16}/></button>
                        </div>
                        <form onSubmit={handleAdd} className="mgmt-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        className="form-input"
                                        value={newStudent.name}
                                        onChange={e => setNewStudent(s => ({ ...s, name: e.target.value }))}
                                        placeholder="Student name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        className="form-input"
                                        value={newStudent.username}
                                        onChange={e => setNewStudent(s => ({ ...s, username: e.target.value }))}
                                        placeholder="Login username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        className="form-input"
                                        type="password"
                                        value={newStudent.password}
                                        onChange={e => setNewStudent(s => ({ ...s, password: e.target.value }))}
                                        placeholder="Password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Class</label>
                                    <select
                                        className="form-select"
                                        value={newStudent.classId}
                                        onChange={e => setNewStudent(s => ({ ...s, classId: e.target.value }))}
                                    >
                                        <option value="">Select class…</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {addError && <p className="form-error">{addError}</p>}
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={adding}>
                                    {adding ? "Saving…" : "Add Student"}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search bar */}
                <div className="search-bar">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrap">
                            <Search size={16} className="search-icon" />
                            <input
                                className="search-input"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search students by name…"
                            />
                            {searchInput && (
                                <button type="button" className="search-clear" onClick={clearSearch}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <button type="submit" className="btn-primary">Search</button>
                    </form>
                </div>

                {/* Table */}
                <div className="mgmt-card">
                    {loading ? (
                        <div className="loading-state"><div className="loading-spinner" /><p>Loading…</p></div>
                    ) : listError ? (
                        <div className="error-state"><p>{listError}</p></div>
                    ) : students.length === 0 ? (
                        <div className="empty-state"><p>No students found.</p></div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "60px" }}>#</th>
                                    <th>Name</th>
                                    <th>Class</th>
                                    <th style={{ width: "130px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    // FIXED: key uses student.id (backend field)
                                    <tr key={student.id}>
                                        {editingId === student.id ? (
                                            // FIXED: Only this row enters edit mode (editingId === student.id)
                                            <>
                                                <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>{student.id}</td>
                                                <td>
                                                    <input
                                                        className="form-input form-input--inline"
                                                        value={editForm.name}
                                                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                                        autoFocus
                                                    />
                                                    {editError && <p className="form-error" style={{marginTop:"4px"}}>{editError}</p>}
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select--inline"
                                                        value={editForm.classId}
                                                        onChange={e => setEditForm(f => ({ ...f, classId: e.target.value }))}
                                                    >
                                                        <option value="">Select…</option>
                                                        {classes.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn-primary btn--sm" disabled={saving} onClick={() => handleSaveEdit(student.id)}>
                                                            {saving ? "…" : "Save"}
                                                        </button>
                                                        <button className="btn-secondary btn--sm" onClick={cancelEdit}>Cancel</button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            // Read-only row — only shows when this student is NOT being edited
                                            <>
                                                <td style={{ color: "var(--text-muted)", fontSize: "12px" }}>{student.id}</td>
                                                <td>{student.name}</td>
                                                <td>{student.className || "—"}</td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="icon-btn icon-btn--edit" onClick={() => startEdit(student)} title="Edit">
                                                            <Edit2 size={15} />
                                                        </button>
                                                        <button className="icon-btn icon-btn--delete" onClick={() => setDeleteTarget(student)} title="Delete">
                                                            <Trash2 size={15} />
                                                        </button>
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
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            totalElements={totalElements}
                            size={PAGE_SIZE}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>

                {/* Delete confirmation */}
                {deleteTarget && (
                    <ConfirmationModal
                        message={`Delete student "${deleteTarget.name}"? This cannot be undone.`}
                        onConfirm={handleDelete}
                        onCancel={() => setDeleteTarget(null)}
                        loading={deleting}
                    />
                )}
            </main>
        </div>
    );
}
