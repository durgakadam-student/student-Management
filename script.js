const API = "/api/students";
const form = document.getElementById("studentForm");
const msg = document.getElementById("msg");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");
const idInput = document.getElementById("studentId");
let editingId = null;

function showMessage(text, ok) {
  msg.textContent = text;
  msg.className = ok ? "ok" : "err";
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function loadStudents() {
  const res = await fetch(API);
  const result = await res.json();
  const rows = result.data.map((s) => `
    <tr>
      <td>${esc(s.studentId)}</td>
      <td>${esc(s.name)}</td>
      <td>${esc(s.email)}</td>
      <td>${esc(s.age)}</td>
      <td>
        <button class="btn green" data-edit="${esc(s.studentId)}">Edit</button>
        <button class="btn red" data-delete="${esc(s.studentId)}">Delete</button>
      </td>
    </tr>`);
  document.getElementById("list").innerHTML = rows.join("") ||
    '<tr><td colspan="5">No students found</td></tr>';
}

function resetForm() {
  editingId = null;
  form.reset();
  idInput.disabled = false;
  formTitle.textContent = "Add New Student";
  submitBtn.textContent = "Add Student";
  cancelBtn.style.display = "none";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    studentId: idInput.value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    age: Number(document.getElementById("age").value)
  };
  const url = editingId ? `${API}/${editingId}` : API;
  const method = editingId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const result = await res.json();
    showMessage(result.message || result.error, res.ok);
    if (res.ok) { resetForm(); loadStudents(); }
  } catch (err) {
    showMessage("Could not reach the server", false);
  }
});

document.getElementById("list").addEventListener("click", async (e) => {
  const editId = e.target.dataset.edit;
  const delId = e.target.dataset.delete;

  if (editId) {
    const res = await fetch(`${API}/${editId}`);
    const { data } = await res.json();
    editingId = data.studentId;
    idInput.value = data.studentId;
    idInput.disabled = true;           // ID cannot be changed while editing
    document.getElementById("name").value = data.name;
    document.getElementById("email").value = data.email;
    document.getElementById("age").value = data.age;
    formTitle.textContent = "Update Student";
    submitBtn.textContent = "Update Student";
    cancelBtn.style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (delId && confirm("Delete this student?")) {
    const res = await fetch(`${API}/${delId}`, { method: "DELETE" });
    const result = await res.json();
    showMessage(result.message || result.error, res.ok);
    loadStudents();
  }
});

cancelBtn.addEventListener("click", resetForm);
document.getElementById("refreshBtn").addEventListener("click", loadStudents);
loadStudents();
