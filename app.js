// Elements
const form = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const toggleBtn = document.getElementById('night-mode-toggle');

// Load Night Mode from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const night = localStorage.getItem('night-mode');
  if (night === 'enabled') {
    document.body.classList.add('night-mode');
  }
  loadTasks();
});

// Toggle Night Mode
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('night-mode');
  const enabled = document.body.classList.contains('night-mode');
  localStorage.setItem('night-mode', enabled ? 'enabled' : 'disabled');
});

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => renderTask(task));
}

// Save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  const task = { text, completed: false };
  renderTask(task);

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  saveTasks(tasks);

  taskInput.value = '';
});

// Render a single task
function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task' + (task.completed ? ' completed' : '');
  li.innerHTML = `
    <span>${task.text}</span>
    <div class="task-buttons">
      <button title="Toggle Complete">✔️</button>
      <button title="Delete Task">🗑️</button>
    </div>
  `;

  const completeBtn = li.querySelector('button:nth-child(1)');
  const deleteBtn = li.querySelector('button:nth-child(2)');

  completeBtn.addEventListener('click', () => {
    task.completed = !task.completed;
    li.classList.toggle('completed');

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(t => t.text === task.text);
    if (index > -1) {
      tasks[index].completed = task.completed;
      saveTasks(tasks);
    }
  });

  deleteBtn.addEventListener('click', () => {
    li.remove();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updated = tasks.filter(t => t.text !== task.text);
    saveTasks(updated);
  });

  taskList.appendChild(li);
}