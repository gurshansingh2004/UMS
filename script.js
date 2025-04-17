// Utility functions
function showView(id) {
    ['loginView', 'adminLoginView', 'adminDashboard', 'studentDashboard'].forEach(view => {
      document.getElementById(view).classList.add('d-none');
    });
    document.getElementById(id).classList.remove('d-none');
  }
  
  function logout() {
    sessionStorage.removeItem('loggedInStudent');
    showView('loginView');
  }
  
  // Student Login
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('loginId').value;
    const password = document.getElementById('loginPassword').value;
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === id && s.password === password);
  
    if (student) {
      sessionStorage.setItem('loggedInStudent', JSON.stringify(student));
      showStudentDashboard(student);
    } else {
      alert('Invalid student credentials!');
    }
  });
  
  // Admin Login
  document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const pass = document.getElementById('adminPassword').value;
  
    if (id === "admin" && pass === "admin123") {
      showView('adminDashboard');
      loadAdminTable(); // ✅ Load the student list here
    }
    
  });
  
  // Student Dashboard Display
  function showStudentDashboard(student) {
    document.getElementById('studentName').textContent = student.name;
    document.getElementById('studentId').textContent = student.id;
    document.getElementById('studentCgpa').textContent = student.cgpa;
    document.getElementById('studentSubjects').textContent = student.subjects.join(", ");
    const timetableBody = document.getElementById('studentTimetable');
    timetableBody.innerHTML = '';
  
    student.timetable.forEach(item => {
      const row = `<tr><td>${item.day}</td><td>${item.time}</td><td>${item.subject}</td></tr>`;
      timetableBody.innerHTML += row;
    });
  
    showView('studentDashboard');
  }
  
  // Admin: Add Student
 // Admin: Add Student
document.getElementById('adminAddStudent').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const newId = document.getElementById('newId').value;
  const newName = document.getElementById('newName').value;
  const newCgpa = document.getElementById('newCgpa').value;
  const newSubjects = document.getElementById('newSubjects').value.split(',').map(s => s.trim());
  const newPassword = document.getElementById('newPassword').value;

  const students = JSON.parse(localStorage.getItem('students')) || [];

  // Check for duplicate ID
  if (students.find(s => s.id === newId)) {
    alert("Student ID already exists!");
    return;
  }

  const newStudent = {
    id: newId,
    name: newName,
    password: newPassword,
    cgpa: newCgpa,
    subjects: newSubjects,
    timetable: [
      { day: "Mon", time: "9-10", subject: newSubjects[0] || "Math" },
      { day: "Wed", time: "10-11", subject: newSubjects[1] || "Science" }
    ]
  };

  students.push(newStudent);
  localStorage.setItem('students', JSON.stringify(students));

  console.log("Student added:", newStudent); // ✅ Debug log
  this.reset();
  loadAdminTable();
});

  // Admin: Load Student Table
  function loadAdminTable() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const tbody = document.querySelector("#adminStudentTable tbody");
    tbody.innerHTML = '';
    students.forEach((s, index) => {
      const row = `<tr>
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.cgpa}</td>
        <td>${s.subjects.join(', ')}</td>
        <td><button class="btn btn-sm btn-danger" onclick="deleteStudent(${index})">Delete</button></td>
      </tr>`;
      tbody.innerHTML += row;
    });
  }
  
  // Admin: Delete Student
  function deleteStudent(index) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    loadAdminTable();
  }
  