import {useEffect, useState} from "react";


import {
    getTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher
} from "../api/teacherApi";
import {
    getStudents,
    addStudentWithAccount,
    updateStudent,
    deleteStudent
} from "../api/studentApi";
import {
    getClasses,
    createClass,
    updateClass,
    deleteClass
} from "../api/classApi";

function AdminDashboard({currentUser, onLogout}) {
    const [openSection, setOpenSection] = useState(null);
    const [students, setStudents] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [teachersLoading, setTeachersLoading] = useState(false);
    const [teachersError, setTeachersError] = useState("");
    const [studentsError, setStudentsError] = useState("");
    const [openClassName, setOpenClassName] = useState(null);
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        name: "",
        phone: "",
        email: "",
        username: "",
        password: ""
    });
    const [addingTeacher, setAddingTeacher] = useState(false);
    const [teacherSuccessMessage, setTeacherSuccessMessage] = useState("");
    const [editingStudent, setEditingStudent] = useState({
        name: "",
        classId: ""
    });
    const [savingEdit, setSavingEdit] = useState(false);
    const [addingStudent, setAddingStudent] = useState(false);
    const [studentSuccessMessage, setStudentSuccessMessage] =
        useState("");
    const [newStudent, setNewStudent] = useState({
        name: "",
        username: "",
        password: "",
        classId: ""
    });
    const [editingTeacherId, setEditingTeacherId] = useState(null);

    const [editingTeacher, setEditingTeacher] = useState({
        name: "",
        phone: "",
        email: ""
    });

    const [savingTeacherEdit, setSavingTeacherEdit] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [deletingStudent, setDeletingStudent] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const [deletingTeacher, setDeletingTeacher] = useState(false);

    // Classes state
    const [classes, setClasses] = useState([]);
    const [classesLoading, setClassesLoading] = useState(false);
    const [classesError, setClassesError] = useState("");
    const [showAddClassForm, setShowAddClassForm] = useState(false);
    const [newClass, setNewClass] = useState({ name: "" });
    const [addingClass, setAddingClass] = useState(false);
    const [editingClassId, setEditingClassId] = useState(null);
    const [editingClass, setEditingClass] = useState({ name: "" });
    const [savingClassEdit, setSavingClassEdit] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);
    const [deletingClass, setDeletingClass] = useState(false);
    const [classSuccessMessage, setClassSuccessMessage] = useState("");


    useEffect(() => {
        if (openSection === "students") {
            loadStudents();
        }

        if (openSection === "teachers") {
            loadTeachers();
        }

        if (openSection === "classes") {
            loadClasses();
        }
    }, [openSection]);


    async function loadStudents() {
        try {
            setStudentsLoading(true);
            setStudentsError("");

            const data = await getStudents(currentUser.userId);
            setStudents(data.content);
        } catch (error) {
            console.error(error);
            setStudentsError("Could not load students.");
        } finally {
            setStudentsLoading(false);
        }
    }

    const studentsByClass = students.reduce((groups, student) => {
        const className = student.className;

        if (!groups[className]) {
            groups[className] = [];
        }

        groups[className].push(student);
        return groups;
    }, {});


    function toggleClass(className) {
        setShowAddStudentForm(false);

        setOpenClassName((currentClass) =>
            currentClass === className
                ? null
                : className
        );
    }


    function toggleSection(sectionName) {
        setOpenSection((currentSection) =>
            currentSection === sectionName
                ? null
                : sectionName
        );

        setOpenClassName(null);

        // Reset student state
        setShowAddStudentForm(false);
        setEditingStudentId(null);
        setEditingStudent({ name: "", classId: "" });
        setStudentToDelete(null);
        setStudentSuccessMessage("");

        // Reset teacher state
        setShowAddTeacherForm(false);
        setNewTeacher({
            name: "",
            phone: "",
            email: "",
            username: "",
            password: ""
        });
        setEditingTeacherId(null);
        setEditingTeacher({ name: "", phone: "", email: "" });
        setTeacherToDelete(null);
        setTeacherSuccessMessage("");

        // Reset class state
        setShowAddClassForm(false);
        setNewClass({ name: "" });
        setEditingClassId(null);
        setEditingClass({ name: "" });
        setClassToDelete(null);
        setClassSuccessMessage("");
    }


    function handleNewStudentChange(event) {
        const {name, value} = event.target;

        setNewStudent((currentStudent) => ({
            ...currentStudent,
            [name]: value
        }));
    }

    function resetStudentForm() {
        setShowAddStudentForm(false);
        setNewStudent({
            name: "",
            username: "",
            password: "",
            classId: ""
        });
    }


    async function handleAddStudent() {
        if (
            newStudent.name.trim() === "" ||
            newStudent.username.trim() === "" ||
            newStudent.password.trim() === "" ||
            newStudent.classId === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            setAddingStudent(true);
            setStudentSuccessMessage("");

            await addStudentWithAccount(
                currentUser.userId,
                {
                    name: newStudent.name.trim(),
                    username: newStudent.username.trim(),
                    password: newStudent.password,
                    classId: Number(newStudent.classId)
                }
            );

            await loadStudents();

            setStudentSuccessMessage(
                "Student added successfully!"
            );

            resetStudentForm();

        } catch (error) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                "Could not add student.";

            alert(message);

        } finally {
            setAddingStudent(false);
        }
    }


    function startEditingStudent(student) {
        setEditingStudentId(student.id);

        setEditingStudent({
            name: student.name,
            classId: String(student.classId)
        });

        setShowAddStudentForm(false);
    }



    async function handleSaveStudentEdit(studentId) {
        if (
            editingStudent.name.trim() === "" ||
            editingStudent.classId === ""
        ) {
            alert("Please enter the student name and class.");
            return;
        }

        try {
            setSavingEdit(true);
            setStudentSuccessMessage("");

            await updateStudent(
                currentUser.userId,
                studentId,
                {
                    name: editingStudent.name.trim(),
                    classId: Number(editingStudent.classId)
                }
            );

            await loadStudents();

            setStudentSuccessMessage(
                "Student updated successfully!"
            );

            setEditingStudentId(null);

            setEditingStudent({
                name: "",
                classId: ""
            });
        } catch (error) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                "Could not update student.";

            alert(message);
        } finally {
            setSavingEdit(false);
        }
    }


    async function loadTeachers() {
        try {
            setTeachersLoading(true);
            setTeachersError("");

            const data = await getTeachers();

            setTeachers(data);
        } catch (error) {
            console.error(error);
            setTeachersError("Could not load teachers.");
        } finally {
            setTeachersLoading(false);
        }
    }


    function handleNewTeacherChange(event) {
        const { name, value } = event.target;

        setNewTeacher((currentTeacher) => ({
            ...currentTeacher,
            [name]: value
        }));
    }

    function resetTeacherForm() {
        setShowAddTeacherForm(false);

        setNewTeacher({
            name: "",
            phone: "",
            email: "",
            username: "",
            password: ""
        });
    }



    async function handleAddTeacher() {
        if (
            newTeacher.name.trim() === "" ||
            newTeacher.phone.trim() === "" ||
            newTeacher.email.trim() === "" ||
            newTeacher.username.trim() === "" ||
            newTeacher.password.trim() === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            setAddingTeacher(true);
            setTeacherSuccessMessage("");

            await createTeacher({
                name: newTeacher.name.trim(),
                phone: newTeacher.phone.trim(),
                email: newTeacher.email.trim(),
                username: newTeacher.username.trim(),
                password: newTeacher.password
            });

            await loadTeachers();

            setTeacherSuccessMessage(
                "Teacher added successfully!"
            );

            resetTeacherForm();

        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "Could not add teacher."
            );
        } finally {
            setAddingTeacher(false);
        }
    }

    function startEditingTeacher(teacher) {
        setEditingTeacherId(teacher.id);

        setEditingTeacher({
            name: teacher.name,
            phone: teacher.phone,
            email: teacher.email
        });

        setShowAddTeacherForm(false);
    }

    async function handleSaveTeacherEdit(teacherId) {
        if (
            editingTeacher.name.trim() === "" ||
            editingTeacher.phone.trim() === "" ||
            editingTeacher.email.trim() === ""
        ) {
            alert("Please fill in all teacher fields.");
            return;
        }

        try {
            setSavingTeacherEdit(true);
            setTeacherSuccessMessage("");

            await updateTeacher(
                teacherId,
                {
                    name: editingTeacher.name.trim(),
                    phone: editingTeacher.phone.trim(),
                    email: editingTeacher.email.trim()
                }
            );

            await loadTeachers();

            setTeacherSuccessMessage(
                "Teacher updated successfully!"
            );

            setEditingTeacherId(null);

            setEditingTeacher({
                name: "",
                phone: "",
                email: ""
            });

        } catch (error) {
            console.error(error);
            alert(error.message || "Could not update teacher.");
        } finally {
            setSavingTeacherEdit(false);
        }
    }

    async function handleDeleteStudent() {
        if (!studentToDelete) {
            return;
        }

        try {
            setDeletingStudent(true);
            setStudentSuccessMessage("");

            await deleteStudent(
                currentUser.userId,
                studentToDelete.id
            );

            await loadStudents();

            setStudentSuccessMessage(
                "Student deleted successfully!"
            );

            setStudentToDelete(null);

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Could not delete student."
            );
        } finally {
            setDeletingStudent(false);
        }
    }

    async function handleDeleteTeacher() {
        if (!teacherToDelete) {
            return;
        }

        try {
            setDeletingTeacher(true);
            setTeacherSuccessMessage("");

            await deleteTeacher(teacherToDelete.id);

            await loadTeachers();

            setTeacherSuccessMessage(
                "Teacher deleted successfully!"
            );

            setTeacherToDelete(null);

        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "Could not delete teacher."
            );
        } finally {
            setDeletingTeacher(false);
        }
    }

    async function loadClasses() {
        try {
            setClassesLoading(true);
            setClassesError("");
            const data = await getClasses(currentUser.userId);
            setClasses(data);
        } catch (error) {
            console.error(error);
            setClassesError("Could not load classes.");
        } finally {
            setClassesLoading(false);
        }
    }

    async function handleAddClass() {
        if (newClass.name.trim() === "") {
            alert("Please fill in the class name.");
            return;
        }

        try {
            setAddingClass(true);
            setClassSuccessMessage("");

            await createClass(currentUser.userId, {
                name: newClass.name.trim()
            });

            await loadClasses();

            setClassSuccessMessage("Class added successfully!");
            resetClassForm();
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Could not add class.";
            alert(message);
        } finally {
            setAddingClass(false);
        }
    }

    function resetClassForm() {
        setShowAddClassForm(false);
        setNewClass({ name: "" });
    }

    function startEditingClass(cls) {
        setEditingClassId(cls.id);
        setEditingClass({ name: cls.name });
        setShowAddClassForm(false);
    }

    async function handleSaveClassEdit(classId) {
        if (editingClass.name.trim() === "") {
            alert("Please enter the class name.");
            return;
        }

        try {
            setSavingClassEdit(true);
            setClassSuccessMessage("");

            await updateClass(currentUser.userId, classId, {
                name: editingClass.name.trim()
            });

            await loadClasses();

            setClassSuccessMessage("Class updated successfully!");
            setEditingClassId(null);
            setEditingClass({ name: "" });
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Could not update class.";
            alert(message);
        } finally {
            setSavingClassEdit(false);
        }
    }

    async function handleDeleteClass() {
        if (!classToDelete) {
            return;
        }

        try {
            setDeletingClass(true);
            setClassSuccessMessage("");

            await deleteClass(currentUser.userId, classToDelete.id);

            await loadClasses();

            setClassSuccessMessage("Class deleted successfully!");
            setClassToDelete(null);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Could not delete class.";
            alert(message);
        } finally {
            setDeletingClass(false);
        }
    }



    return (
        <main className="app">
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {currentUser.username}</h1>
                    <p>Role: {currentUser.roleName}</p>
                </div>

                <button onClick={onLogout}>
                    Logout
                </button>
            </div>

            <h2>Admin Dashboard</h2>

            <section className="admin-card">
                <button
                    className="admin-card-button"
                    onClick={() => toggleSection("students")}
                >
                    <span>Students Management</span>

                    <span>
                        {openSection === "students" ? "▲" : "▼"}
                    </span>
                </button>

                {openSection === "students" && (
                    <div className="admin-card-content">
                        {studentsLoading ? (
                            <p>Loading students...</p>
                        ) : studentsError ? (
                            <p>{studentsError}</p>
                        ) : students.length === 0 ? (
                            <p>No students found.</p>
                        ) : (
                            <>

                                {studentSuccessMessage && (
                                    <p className="success-message">
                                        {studentSuccessMessage}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="add-student-button"
                                    onClick={() => {
                                        setShowAddStudentForm((currentValue) => {
                                            const willOpen = !currentValue;

                                            if (willOpen) {
                                                setOpenClassName(null);
                                            }

                                            return willOpen;
                                        });
                                    }}
                                >
                                    {showAddStudentForm
                                        ? "Close Add Student Form"
                                        : "+ Add Student"}
                                </button>

                                {showAddStudentForm && (
                                    <div className="add-student-form">
                                        <h3>Add New Student</h3>

                                        <label>
                                            Student Name
                                            <input
                                                type="text"
                                                name="name"
                                                value={newStudent.name}
                                                onChange={handleNewStudentChange}
                                            />
                                        </label>

                                        <label>
                                            Username
                                            <input
                                                type="text"
                                                name="username"
                                                value={newStudent.username}
                                                onChange={handleNewStudentChange}
                                            />
                                        </label>

                                        <label>
                                            Password
                                            <input
                                                type="password"
                                                name="password"
                                                value={newStudent.password}
                                                onChange={handleNewStudentChange}
                                            />
                                        </label>

                                        <label>
                                            Class
                                            <select
                                                name="classId"
                                                value={newStudent.classId}
                                                onChange={handleNewStudentChange}
                                            >
                                                <option value="">Select class</option>
                                                <option value="1">Class A</option>
                                                <option value="2">Class B</option>
                                                <option value="3">Class C</option>
                                            </select>
                                        </label>

                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                onClick={handleAddStudent}
                                                disabled={addingStudent}
                                            >
                                                {addingStudent
                                                    ? "Saving..."
                                                    : "Save Student"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={resetStudentForm}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {Object.entries(studentsByClass).map(
                                    ([className, classStudents]) => (
                                        <div
                                            className="class-group"
                                            key={className}
                                        >
                                            <button
                                                type="button"
                                                className="class-accordion-button"
                                                onClick={() => toggleClass(className)}
                                            >
                                                <span>{className}</span>

                                                <span>
                                                    {openClassName === className
                                                        ? "▲"
                                                        : "▼"}
                                                </span>
                                            </button>






                                            {openClassName === className && (
                                                <table className="students-table">
                                                    <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Student Name</th>
                                                        <th>Class</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                    </thead>




                                                    <tbody>
                                                    {[...classStudents]
                                                        .sort((a, b) =>
                                                            a.name.localeCompare(b.name)
                                                        )
                                                        .map((student, index) => (
                                                            <tr key={student.id}>
                                                                <td>{index + 1}</td>

                                                                <td>
                                                                    {editingStudentId === student.id ? (
                                                                        <input
                                                                            type="text"
                                                                            value={editingStudent.name}
                                                                            onChange={(event) =>
                                                                                setEditingStudent((current) => ({
                                                                                    ...current,
                                                                                    name: event.target.value
                                                                                }))
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        student.name
                                                                    )}
                                                                </td>

                                                                <td>
                                                                    {editingStudentId === student.id ? (
                                                                        <select
                                                                            value={editingStudent.classId}
                                                                            onChange={(event) =>
                                                                                setEditingStudent((current) => ({
                                                                                    ...current,
                                                                                    classId: event.target.value
                                                                                }))
                                                                            }
                                                                        >
                                                                            <option value="1">Class A</option>
                                                                            <option value="2">Class B</option>
                                                                            <option value="3">Class C</option>
                                                                        </select>
                                                                    ) : (
                                                                        student.className
                                                                    )}
                                                                </td>

                                                                <td className="student-actions">
                                                                    {editingStudentId === student.id ? (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                disabled={savingEdit}
                                                                                onClick={() =>
                                                                                    handleSaveStudentEdit(student.id)
                                                                                }
                                                                            >
                                                                                {savingEdit ? "Saving..." : "Save"}
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setEditingStudentId(null);

                                                                                    setEditingStudent({
                                                                                        name: "",
                                                                                        classId: ""
                                                                                    });
                                                                                }}
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                className="edit-button"
                                                                                onClick={() =>
                                                                                    startEditingStudent(student)
                                                                                }
                                                                            >
                                                                                Edit
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                className="delete-button"
                                                                                onClick={() => setStudentToDelete(student)}
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    )
                                )}
                            </>
                        )}
                    </div>
                )}
            </section>

            <section className="admin-card">
                <button
                    className="admin-card-button"
                    onClick={() => toggleSection("teachers")}
                >
                    <span>Teachers Management</span>
                    <span>
            {openSection === "teachers" ? "▲" : "▼"}
        </span>
                </button>

                {openSection === "teachers" && (
                    <div className="admin-card-content">

                        {teacherSuccessMessage && (
                            <p className="success-message">
                                {teacherSuccessMessage}
                            </p>
                        )}

                        <button
                            type="button"
                            className="add-student-button"
                            onClick={() =>
                                setShowAddTeacherForm(
                                    (currentValue) => !currentValue
                                )
                            }
                        >
                            {showAddTeacherForm
                                ? "Close Add Teacher Form"
                                : "+ Add Teacher"}
                        </button>

                        {showAddTeacherForm && (
                            <div className="add-student-form">
                                <h3>Add New Teacher</h3>

                                <label>
                                    Teacher Name
                                    <input
                                        type="text"
                                        name="name"
                                        value={newTeacher.name}
                                        onChange={handleNewTeacherChange}
                                    />
                                </label>

                                <label>
                                    Phone
                                    <input
                                        type="text"
                                        name="phone"
                                        value={newTeacher.phone}
                                        onChange={handleNewTeacherChange}
                                    />
                                </label>

                                <label>
                                    Email
                                    <input
                                        type="email"
                                        name="email"
                                        value={newTeacher.email}
                                        onChange={handleNewTeacherChange}
                                    />
                                </label>

                                <label>
                                    Username
                                    <input
                                        type="text"
                                        name="username"
                                        value={newTeacher.username}
                                        onChange={handleNewTeacherChange}
                                    />
                                </label>

                                <label>
                                    Password
                                    <input
                                        type="password"
                                        name="password"
                                        value={newTeacher.password}
                                        onChange={handleNewTeacherChange}
                                    />
                                </label>

                                <div className="form-actions"><button
                                    type="button"
                                    onClick={handleAddTeacher}
                                    disabled={addingTeacher}
                                >
                                    {addingTeacher
                                        ? "Saving..."
                                        : "Save Teacher"}
                                </button>

                                    <button
                                        type="button"
                                        onClick={resetTeacherForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {teachersLoading ? (
                            <p>Loading teachers...</p>
                        ) : teachersError ? (
                            <p>{teachersError}</p>
                        ) : teachers.length === 0 ? (
                            <p>No teachers found.</p>
                        ) : (
                            <table className="students-table">
                                <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Teacher Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {[...teachers]
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                    )
                                    .map((teacher, index) => (
                                        <tr key={teacher.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {editingTeacherId === teacher.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingTeacher.name}
                                                        onChange={(event) =>
                                                            setEditingTeacher((current) => ({
                                                                ...current,
                                                                name: event.target.value
                                                            }))
                                                        }
                                                    />
                                                ) : (
                                                    teacher.name
                                                )}
                                            </td>

                                            <td>
                                                {editingTeacherId === teacher.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingTeacher.phone}
                                                        onChange={(event) =>
                                                            setEditingTeacher((current) => ({
                                                                ...current,
                                                                phone: event.target.value
                                                            }))
                                                        }
                                                    />
                                                ) : (
                                                    teacher.phone
                                                )}
                                            </td>

                                            <td>
                                                {editingTeacherId === teacher.id ? (
                                                    <input
                                                        type="email"
                                                        value={editingTeacher.email}
                                                        onChange={(event) =>
                                                            setEditingTeacher((current) => ({
                                                                ...current,
                                                                email: event.target.value
                                                            }))
                                                        }
                                                    />
                                                ) : (
                                                    teacher.email
                                                )}
                                            </td>

                                            <td className="student-actions">
                                                {editingTeacherId === teacher.id ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={savingTeacherEdit}
                                                            onClick={() =>
                                                                handleSaveTeacherEdit(teacher.id)
                                                            }
                                                        >
                                                            {savingTeacherEdit
                                                                ? "Saving..."
                                                                : "Save"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingTeacherId(null);

                                                                setEditingTeacher({
                                                                    name: "",
                                                                    phone: "",
                                                                    email: ""
                                                                });
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="edit-button"
                                                            onClick={() =>
                                                                startEditingTeacher(teacher)
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            onClick={() => setTeacherToDelete(teacher)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </section>

            <section className="admin-card">
                <button
                    className="admin-card-button"
                    onClick={() => toggleSection("classes")}
                >
                    <span>Classes Management</span>
                    <span>{openSection === "classes" ? "▲" : "▼"}</span>
                </button>

                {openSection === "classes" && (
                    <div className="admin-card-content">
                        {classSuccessMessage && (
                            <p className="success-message">
                                {classSuccessMessage}
                            </p>
                        )}

                        <button
                            type="button"
                            className="add-student-button"
                            onClick={() => {
                                setShowAddClassForm((currentValue) => !currentValue);
                            }}
                        >
                            {showAddClassForm
                                ? "Close Add Class Form"
                                : "+ Add Class"}
                        </button>

                        {showAddClassForm && (
                            <div className="add-student-form">
                                <h3>Add New Class</h3>

                                <label>
                                    Class Name
                                    <input
                                        type="text"
                                        name="name"
                                        value={newClass.name}
                                        onChange={(e) => setNewClass({ name: e.target.value })}
                                    />
                                </label>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={handleAddClass}
                                        disabled={addingClass}
                                    >
                                        {addingClass ? "Saving..." : "Save Class"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetClassForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {classesLoading ? (
                            <p>Loading classes...</p>
                        ) : classesError ? (
                            <p>{classesError}</p>
                        ) : classes.length === 0 ? (
                            <p>No classes found.</p>
                        ) : (
                            <table className="students-table">
                                <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Class Name</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>
                                {[...classes]
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((cls, index) => (
                                        <tr key={cls.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {editingClassId === cls.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingClass.name}
                                                        onChange={(event) =>
                                                            setEditingClass({
                                                                name: event.target.value
                                                            })
                                                        }
                                                    />
                                                ) : (
                                                    cls.name
                                                )}
                                            </td>

                                            <td className="student-actions">
                                                {editingClassId === cls.id ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={savingClassEdit}
                                                            onClick={() => handleSaveClassEdit(cls.id)}
                                                        >
                                                            {savingClassEdit ? "Saving..." : "Save"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingClassId(null);
                                                                setEditingClass({ name: "" });
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="edit-button"
                                                            onClick={() => startEditingClass(cls)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="delete-button"
                                                            onClick={() => setClassToDelete(cls)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </section>

            <section className="admin-card">
                <button
                    className="admin-card-button"
                    onClick={() => toggleSection("courses")}
                >
                    <span>Courses Management</span>
                    <span>{openSection === "courses" ? "▲" : "▼"}</span>
                </button>

                {openSection === "courses" && (
                    <div className="admin-card-content">
                        <p>Courses management will appear here.</p>
                    </div>
                )}
            </section>
            {studentToDelete && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h3>Delete Student</h3>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{studentToDelete.name}</strong>?
                        </p>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDeleteStudent}
                                disabled={deletingStudent}
                            >
                                {deletingStudent
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setStudentToDelete(null)
                                }
                                disabled={deletingStudent}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {teacherToDelete && (
                <div className="modal-overlay">
                    <div className="confirm-modal">

                        <h3>Delete Teacher</h3>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{teacherToDelete.name}</strong>?
                        </p>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDeleteTeacher}
                                disabled={deletingTeacher}
                            >
                                {deletingTeacher
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setTeacherToDelete(null)
                                }
                                disabled={deletingTeacher}
                            >
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {classToDelete && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h3>Delete Class</h3>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{classToDelete.name}</strong>?
                        </p>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDeleteClass}
                                disabled={deletingClass}
                            >
                                {deletingClass
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setClassToDelete(null)
                                }
                                disabled={deletingClass}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default AdminDashboard;