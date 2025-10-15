// Sidebar toggle for mobile
    const toggleBtn = document.getElementById('toggle');
    const sidebar = document.getElementById('sidebar');
    toggleBtn?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      document.body.classList.toggle('sidebar-open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if(window.innerWidth > 900) return;
      const isClickInside = sidebar.contains(e.target) || toggleBtn.contains(e.target);
      if(!isClickInside && sidebar.classList.contains('open')){
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
      }
    });

    const addNewBtn = document.getElementById("addNewBtn");
  const modal = document.getElementById("formModal");
  const form = document.getElementById("medicalForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const formTitle = document.getElementById("formTitle");

  let editIndex = -1;

  // Show modal
  addNewBtn.onclick = () => {
    form.reset();
    modal.style.display = "flex";
    formTitle.textContent = "Add New Record";
    editIndex = -1;
  };

  // Cancel modal
  cancelBtn.onclick = () => modal.style.display = "none";

  // Save record
  form.onsubmit = (e) => {
    e.preventDefault();
    const record = {
      studentId: studentId.value.trim(),
      name: studentName.value.trim(),
      course: course.value,
      year: year.value,
      bloodType: bloodType.value.trim(),
      allergies: allergies.value.trim(),
      emergencyContact: emergencyContact.value.trim(),
    };

    let records = JSON.parse(localStorage.getItem("medicalRecords")) || [];

    if (editIndex === -1) {
      records.push(record);
    } else {
      records[editIndex] = record;
      editIndex = -1;
    }

    localStorage.setItem("medicalRecords", JSON.stringify(records));
    modal.style.display = "none";
    loadRecords();
  };

  // Load data
  function loadRecords() {
    document.querySelectorAll(".records-table").forEach(t => t.innerHTML = "");
    const records = JSON.parse(localStorage.getItem("medicalRecords")) || [];

    records.forEach((r, i) => {
      const table = document.getElementById(`${r.course}${r.year}`);
      if (table) {
        if (!table.innerHTML.trim()) {
          table.innerHTML = `
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Blood Type</th>
              <th>Allergies</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>`;
        }
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${r.studentId}</td>
          <td>${r.name}</td>
          <td>${r.bloodType}</td>
          <td>${r.allergies}</td>
          <td>${r.emergencyContact}</td>
          <td>
            <button onclick="editRecord(${i})">✏️</button>
            <button class="delete" onclick="deleteRecord(${i})">🗑️</button>
          </td>`;
        table.appendChild(row);
      }
    });
  }

  // Edit record
  function editRecord(index) {
    const records = JSON.parse(localStorage.getItem("medicalRecords")) || [];
    const r = records[index];
    studentId.value = r.studentId;
    studentName.value = r.name;
    course.value = r.course;
    year.value = r.year;
    bloodType.value = r.bloodType;
    allergies.value = r.allergies;
    emergencyContact.value = r.emergencyContact;
    modal.style.display = "flex";
    formTitle.textContent = "Edit Record";
    editIndex = index;
  }

  // Delete record
  function deleteRecord(index) {
    if (confirm("Delete this record?")) {
      let records = JSON.parse(localStorage.getItem("medicalRecords")) || [];
      records.splice(index, 1);
      localStorage.setItem("medicalRecords", JSON.stringify(records));
      loadRecords();
    }
  }

  // Initialize
  loadRecords();