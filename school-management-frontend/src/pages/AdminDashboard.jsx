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
import {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} from "../api/courseApi";

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

    // Courses state
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [coursesError, setCoursesError] = useState("");
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [newCourse, setNewCourse] = useState({ name: "", teacherId: "", classIds: [] });
    const [addingCourse, setAddingCourse] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editingCourse, setEditingCourse] = useState({ name: "", teacherId: "", classIds: [] });
    const [savingCourseEdit, setSavingCourseEdit] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [deletingCourse, setDeletingCourse] = useState(false);
    const [courseSuccessMessage, setCourseSuccessMessage] = useState("");
    const [expandedCourseId, setExpandedCourseId] = useState(null);


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

        if (openSection === "courses") {
            loadCourses();
            // Teachers and classes are needed for dropdowns/checkboxes
            loadTeachers();
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

        // Reset course state
        setShowAddCourseForm(false);
        setNewCourse({ name: "", teacherId: "", classIds: [] });
        setEditingCourseId(null);
        setEditingCourse({ name: "", teacherId: "", classIds: [] });
        setCourseToDelete(null);
        setCourseSuccessMessage("");
        setExpandedCourseId(null);
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

    // -----------------------------------------------------------------------
    // Courses handlers
    // -----------------------------------------------------------------------

    async function loadCourses() {
        try {
            setCoursesLoading(true);
            setCoursesError("");
            const data = await getCourses(currentUser.userId);
            setCourses(data);
        } catch (error) {
            console.error(error);
            setCoursesError("Could not load courses.");
        } finally {
            setCoursesLoading(false);
        }
    }

    function resetCourseForm() {
        setShowAddCourseForm(false);
        setNewCourse({ name: "", teacherId: "", classIds: [] });
    }

    function toggleCourseClassId(classId, isAdd, setter) {
        setter((current) => ({
            ...current,
            classIds: isAdd
                ? [...current.classIds, classId]
                : current.classIds.filter((id) => id !== classId)
        }));
    }

    async function handleAddCourse() {
        if (newCourse.name.trim() === "") {
            alert("Please enter the course name.");
            return;
        }

        if (newCourse.teacherId === "") {
            alert("Please select a teacher.");
            return;
        }

        try {
            setAddingCourse(true);
            setCourseSuccessMessage("");

            await createCourse(currentUser.userId, {
                name: newCourse.name.trim(),
                teacherId: Number(newCourse.teacherId),
                classIds: newCourse.classIds
            });

            await loadCourses();

            setCourseSuccessMessage("Course added successfully!");
            resetCourseForm();
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Could not add course.";
            alert(message);
        } finally {
            setAddingCourse(false);
        }
    }

    function startEditingCourse(course) {
        setEditingCourseId(course.id);
        setEditingCourse({
            name: course.name,
            teacherId: course.teacherId ? String(course.teacherId) : "",
            classIds: course.classIds ? [...course.classIds] : []
        });
        setShowAddCourseForm(false);
        setExpandedCourseId(course.id);
    }

    async function handleSaveCourseEdit(courseId) {
        if (editingCourse.name.trim() === "") {
            alert("Please enter the course name.");
            return;
        }

        if (editingCourse.teacherId === "") {
            alert("Please select a teacher.");
            return;
        }

        try {
            setSavingCourseEdit(true);
            setCourseSuccessMessage("");

            await updateCourse(currentUser.userId, courseId, {
                name: editingCourse.name.trim(),
                teacherId: Number(editingCourse.teacherId),
                classIds: editingCourse.classIds
            });

            await loadCourses();

            setCourseSuccessMessage("Course updated successfully!");
            setEditingCourseId(null);
            setEditingCourse({ name: "", teacherId: "", classIds: [] });
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Could not update course.";
            alert(message);
        } finally {
            setSavingCourseEdit(false);
        }
    }

    async function handleDeleteCourse() {
        if (!courseToDelete) {
            return;
        }

        try {
            setDeletingCourse(true);
            setCourseSuccessMessage("");

            await deleteCourse(currentUser.userId, courseToDelete.id);

            await loadCourses();

            setCourseSuccessMessage("Course deleted successfully!");
            setCourseToDelete(null);
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Could not delete course.";
            alert(message);
        } finally {
            setDeletingCourse(false);
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

                        {courseSuccessMessage && (
                            <p className="success-message">
                                {courseSuccessMessage}
                            </p>
                        )}

                        <button
                            type="button"
                            className="add-student-button"
                            onClick={() => {
                                setShowAddCourseForm((current) => {
                                    const next = !current;
                                    if (next) {
                                        setExpandedCourseId(null);
                                    }
                                    return next;
                                });
                            }}
                        >
                            {showAddCourseForm
                                ? "Close Add Course Form"
                                : "+ Add Course"}
                        </button>

                        {showAddCourseForm && (
                            <div className="add-student-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h3>Add New Course</h3>

                                <label style={{ display: 'block', fontWeight: 'bold' }}>
                                    Course Name
                                    <input
                                        type="text"
                                        name="name"
                                        value={newCourse.name}
                                        onChange={(e) =>
                                            setNewCourse((c) => ({ ...c, name: e.target.value }))
                                        }
                                        style={{ width: '100%', boxSizing: 'border-box', marginTop: '6px' }}
                                    />
                                </label>

                                <label style={{ display: 'block', fontWeight: 'bold' }}>
                                    Teacher
                                    <select
                                        value={newCourse.teacherId}
                                        onChange={(e) =>
                                            setNewCourse((c) => ({ ...c, teacherId: e.target.value }))
                                        }
                                        style={{ width: '100%', boxSizing: 'border-box', marginTop: '6px' }}
                                    >
                                        <option value="" disabled>Select Teacher</option>
                                        {[...teachers]
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map((t) => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                    </select>
                                </label>

                                {classes.length > 0 && (
                                    <div>
                                        <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>Assign Classes</p>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                            gap: '12px',
                                            marginTop: '8px'
                                        }}>
                                            {[...classes]
                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                .map((cls) => (
                                                    <label
                                                        key={cls.id}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "8px",
                                                            fontWeight: "normal",
                                                            cursor: 'pointer',
                                                            userSelect: 'none'
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={newCourse.classIds.includes(cls.id)}
                                                            onChange={(e) =>
                                                                toggleCourseClassId(cls.id, e.target.checked, setNewCourse)
                                                            }
                                                            style={{ margin: 0 }}
                                                        />
                                                        <span style={{ lineHeight: '1' }}>{cls.name}</span>
                                                    </label>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                <div className="form-actions" style={{ marginTop: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={handleAddCourse}
                                        disabled={addingCourse}
                                    >
                                        {addingCourse ? "Saving..." : "Save Course"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resetCourseForm}
                                        style={{ border: '1px solid #777777', background: 'transparent' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {coursesLoading ? (
                            <p>Loading courses...</p>
                        ) : coursesError ? (
                            <p>{coursesError}</p>
                        ) : courses.length === 0 ? (
                            <p>No courses found.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                                {[...courses]
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((course) => {
                                        const isExpanded = expandedCourseId === course.id;
                                        const isEditing = editingCourseId === course.id;

                                        return (
                                            <div
                                                key={course.id}
                                                style={{
                                                    border: '1px solid #d8dce3',
                                                    borderRadius: '8px',
                                                    background: '#ffffff',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                {/* Collapsible Header */}
                                                <div
                                                    onClick={() => {
                                                        setExpandedCourseId((prev) => {
                                                            const next = (prev === course.id ? null : course.id);
                                                            if (next !== null) setShowAddCourseForm(false);
                                                            return next;
                                                        });
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: '16px',
                                                        cursor: 'pointer',
                                                        background: isExpanded ? '#f8fafc' : '#ffffff',
                                                        transition: 'background-color 0.2s ease',
                                                        borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a202c' }}>{course.name}</span>
                                                        <span style={{ fontSize: '14px', color: '#4a5568' }}>Teacher: {course.teacherName || "—"}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <span style={{
                                                            fontSize: '13px',
                                                            background: '#edf2f7',
                                                            color: '#4a5568',
                                                            padding: '4px 10px',
                                                            borderRadius: '16px',
                                                            fontWeight: '500'
                                                        }}>
                                                            {course.classNames ? course.classNames.length : 0} Class{(course.classNames && course.classNames.length === 1) ? '' : 'es'}
                                                        </span>
                                                        <span style={{ fontSize: '16px', color: '#a0aec0', fontWeight: 'bold', userSelect: 'none' }}>
                                                            {isExpanded ? '▲' : '▼'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Collapsible Body */}
                                                {isExpanded && (
                                                    <div style={{ padding: '16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                                                        {isEditing ? (
                                                            /* Redesigned Edit Form Inside Accordion Card */
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                                <label style={{ display: 'block', fontWeight: 'bold' }}>
                                                                    Course Name
                                                                    <input
                                                                        type="text"
                                                                        value={editingCourse.name}
                                                                        onChange={(e) =>
                                                                            setEditingCourse((c) => ({ ...c, name: e.target.value }))
                                                                        }
                                                                        style={{ width: '100%', boxSizing: 'border-box', marginTop: '6px', padding: '9px' }}
                                                                    />
                                                                </label>

                                                                <label style={{ display: 'block', fontWeight: 'bold' }}>
                                                                    Teacher
                                                                    <select
                                                                        value={editingCourse.teacherId}
                                                                        onChange={(e) =>
                                                                            setEditingCourse((c) => ({ ...c, teacherId: e.target.value }))
                                                                        }
                                                                        style={{ width: '100%', boxSizing: 'border-box', marginTop: '6px', padding: '9px' }}
                                                                    >
                                                                        <option value="" disabled>Select Teacher</option>
                                                                        {[...teachers]
                                                                            .sort((a, b) => a.name.localeCompare(b.name))
                                                                            .map((t) => (
                                                                                <option key={t.id} value={t.id}>{t.name}</option>
                                                                            ))}
                                                                    </select>
                                                                </label>

                                                                {classes.length > 0 && (
                                                                    <div>
                                                                        <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>Assign Classes</p>
                                                                        <div style={{
                                                                            display: 'grid',
                                                                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                                                            gap: '12px',
                                                                            marginTop: '8px'
                                                                        }}>
                                                                            {[...classes]
                                                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                                                .map((cls) => (
                                                                                    <label
                                                                                        key={cls.id}
                                                                                        style={{
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            gap: "8px",
                                                                                            fontWeight: "normal",
                                                                                            cursor: 'pointer',
                                                                                            userSelect: 'none'
                                                                                        }}
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={editingCourse.classIds.includes(cls.id)}
                                                                                            onChange={(e) =>
                                                                                                toggleCourseClassId(cls.id, e.target.checked, setEditingCourse)
                                                                                            }
                                                                                            style={{ margin: 0 }}
                                                                                        />
                                                                                        <span style={{ lineHeight: '1' }}>{cls.name}</span>
                                                                                    </label>
                                                                                ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="form-actions" style={{ marginTop: '8px' }}>
                                                                    <button
                                                                        type="button"
                                                                        disabled={savingCourseEdit}
                                                                        onClick={() => handleSaveCourseEdit(course.id)}
                                                                    >
                                                                        {savingCourseEdit ? "Saving..." : "Save"}
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setEditingCourseId(null);
                                                                            setEditingCourse({ name: "", teacherId: "", classIds: [] });
                                                                        }}
                                                                        style={{ border: '1px solid #777777', background: 'transparent' }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            /* Read Mode inside Collapsible Card */
                                                            <div>
                                                                <div style={{ marginBottom: '16px' }}>
                                                                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#4a5568', fontSize: '14px' }}>Assigned Classes</p>
                                                                    {course.classNames && course.classNames.length > 0 ? (
                                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                                            {course.classNames.map((className) => (
                                                                                <span
                                                                                    key={className}
                                                                                    style={{
                                                                                        background: '#ebf8ff',
                                                                                        color: '#2b6cb0',
                                                                                        padding: '4px 10px',
                                                                                        borderRadius: '16px',
                                                                                        fontSize: '13px',
                                                                                        fontWeight: '500',
                                                                                        border: '1px solid #bee3f8'
                                                                                    }}
                                                                                >
                                                                                    {className}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <span style={{ fontSize: '13px', color: '#a0aec0', fontStyle: 'italic' }}>No classes assigned</span>
                                                                    )}
                                                                </div>

                                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                                    <button
                                                                        type="button"
                                                                        className="edit-button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            startEditingCourse(course);
                                                                        }}
                                                                        style={{ padding: '7px 14px', borderRadius: '6px', cursor: 'pointer' }}
                                                                    >
                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="delete-button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setCourseToDelete(course);
                                                                        }}
                                                                        style={{ padding: '7px 14px', borderRadius: '6px', cursor: 'pointer' }}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
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

            {courseToDelete && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h3>Delete Course</h3>

                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{courseToDelete.name}</strong>?
                        </p>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDeleteCourse}
                                disabled={deletingCourse}
                            >
                                {deletingCourse
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setCourseToDelete(null)
                                }
                                disabled={deletingCourse}
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