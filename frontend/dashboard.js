const token = localStorage.getItem('token');
if(!token) window.location.href='index.html';

const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

async function fetchTasks() {
  const res = await fetch('http://localhost:5000/api/tasks/all', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const tasks = await res.json();
  taskList.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerText = `${t.title} - ${new Date(t.time).toLocaleString()}`;
    taskList.appendChild(li);
  });
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const title = document.getElementById('title').value;
  const time = document.getElementById('time').value;

  await fetch('http://localhost:5000/api/tasks/create', {
    method:'POST',
    headers:{ 
      'Content-Type':'application/json',
      'Authorization':'Bearer '+token
    },
    body: JSON.stringify({title,time})
  });

  form.reset();
  fetchTasks();
});

fetchTasks();
