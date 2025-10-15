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

// === LocalStorage Helpers ===
function saveData(key, data){ localStorage.setItem(key, JSON.stringify(data)); }
function loadData(key){ return JSON.parse(localStorage.getItem(key) || "[]"); }

// === Appointments ===
let appointments = loadData("appointments");
function renderAppointments(){
  const tbody = document.querySelector("#appointments tbody");
  tbody.innerHTML = "";
  appointments.forEach((a,i)=>{
    tbody.innerHTML += `<tr><td>${a.time}</td><td>${a.patient}</td><td>${a.doctor}</td><td><span class='status'>${a.status}</span></td><td><button class='delete-btn' onclick="deleteAppointment(${i})">X</button></td></tr>`;
  });
}
function addAppointment(){
  const time = prompt("Time:");
  const patient = prompt("Patient Name:");
  const doctor = prompt("Doctor:");
  const status = prompt("Status (Waiting/Checked-in/Completed):");
  if(time && patient){ appointments.push({time, patient, doctor, status}); saveData("appointments", appointments); renderAppointments(); }
}
function deleteAppointment(i){ appointments.splice(i,1); saveData("appointments", appointments); renderAppointments(); }

// Init
renderCards();
renderAppointments();