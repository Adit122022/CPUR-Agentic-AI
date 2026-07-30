<!-- 9. Create a dynamic To-Do list (add, complete, delete tasks).  -->
<!-- 10. Explain how to create a custom menu in WordPress and add pages, posts, and external 
links to it. Also describe how you can reorder and manage the menu items.  -->



<!DOCTYPE html>
<html>
<body>

<input id="task" placeholder="Enter task">
<button onclick="addTask()">Add</button>

<ul id="list"></ul>

<script>
function addTask() {
    let t = document.getElementById("task").value;
    if (t === "") return;

    let li = document.createElement("li");
    li.innerHTML = t + " <button onclick='this.parentNode.remove()'>Delete</button>";
     li.style.cursor ="pointer";
    li.onclick = function () {
       
        li.style.textDecoration = "line-through";
    }

    document.getElementById("list").appendChild(li);
    document.getElementById("task").value = "";
}
</script>

</body>
</html>











<!-- 


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Simple To-Do List</title>
  <style>
    :root{--accent:#4b8df8}
    body{
      font-family: Arial, Helvetica, sans-serif;
      display:flex;align-items:center;justify-content:center;
      min-height:100vh;margin:0;background:#f5f7fb;
      padding:20px;
    }
    .app{
      width:360px;background:#fff;border-radius:8px;
      box-shadow:0 6px 18px rgba(30,30,30,0.08);padding:18px;
    }
    h2{margin:0 0 12px 0;font-size:20px;text-align:center}
    .input-row{display:flex;gap:8px}
    input[type="text"]{
      flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;
      outline:none;font-size:14px;
    }
    button{
      padding:10px 12px;border-radius:6px;border:none;cursor:pointer;
      background:var(--accent);color:#fff;font-weight:600;
    }
    ul{list-style:none;padding:0;margin:14px 0 0 0;max-height:300px;overflow:auto}
    li{
      display:flex;align-items:center;gap:10px;padding:10px;border-radius:6px;
      border:1px solid #f0f0f0;margin-bottom:8px;background:#fcfdff;
    }
    li.completed{opacity:0.8;text-decoration:line-through;color:#6b7280;background:#f3f6ff}
    .task-text{flex:1;font-size:14px}
    .small-btn{background:transparent;border:1px solid #eee;padding:6px;border-radius:6px;cursor:pointer}
    .meta{display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:13px;color:#555}
    .clear{background:#ef4444;color:#fff;border:none;padding:6px 8px;border-radius:6px;cursor:pointer}
    .empty{text-align:center;color:#999;padding:18px 6px}
  </style>
</head>
<body>

  <div class="app">
    <h2>My To-Do List</h2>

    <div class="input-row">
      <input id="taskInput" type="text" placeholder="Add a new task and press Enter" />
      <button id="addBtn">Add</button>
    </div>

    <ul id="todoList"></ul>

    <div class="meta">
      <div>
        <span id="totalCount">0</span> tasks • <span id="remainingCount">0</span> remaining
      </div>
      <div>
        <button id="clearCompleted" class="clear" title="Clear completed tasks">Clear Done</button>
      </div>
    </div>
  </div>

<script>
  // Simple To-Do with localStorage
  const input = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const listEl = document.getElementById('todoList');
  const totalCountEl = document.getElementById('totalCount');
  const remainingCountEl = document.getElementById('remainingCount');
  const clearCompletedBtn = document.getElementById('clearCompleted');

  let todos = JSON.parse(localStorage.getItem('todos_v1')) || [];

  function save() {
    localStorage.setItem('todos_v1', JSON.stringify(todos));
    render();
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    todos.unshift({ id: Date.now(), text: trimmed, done: false }); // newest on top
    save();
    input.value = '';
    input.focus();
  }

  function toggleDone(id) {
    todos = todos.map(t => t.id === id ? {...t, done: !t.done} : t);
    save();
  }

  function deleteTask(id) {
    todos = todos.filter(t => t.id !== id);
    save();
  }

  function clearCompleted() {
    todos = todos.filter(t => !t.done);
    save();
  }

  function render() {
    listEl.innerHTML = '';
    if (todos.length === 0) {
      listEl.innerHTML = '<div class="empty">No tasks yet — add one! ✨</div>';
    } else {
      todos.forEach(t => {
        const li = document.createElement('li');
        li.className = t.done ? 'completed' : '';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = t.done;
        checkbox.addEventListener('change', () => toggleDone(t.id));

        const span = document.createElement('div');
        span.className = 'task-text';
        span.textContent = t.text;
        span.addEventListener('dblclick', () => editTask(t.id)); // double-click to edit

        const del = document.createElement('button');
        del.className = 'small-btn';
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
          if (confirm('Delete this task?')) deleteTask(t.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(del);
        listEl.appendChild(li);
      });
    }

    totalCountEl.textContent = todos.length;
    remainingCountEl.textContent = todos.filter(t => !t.done).length;
  }

  function editTask(id) {
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return;
    const newText = prompt('Edit task:', todos[idx].text);
    if (newText === null) return; // cancelled
    todos[idx].text = newText.trim() || todos[idx].text;
    save();
  }

  // Events
  addBtn.addEventListener('click', () => addTask(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask(input.value);
  });
  clearCompletedBtn.addEventListener('click', () => {
    if (confirm('Remove all completed tasks?')) clearCompleted();
  });

  // initial render
  render();
</script>

</body>
</html>




 -->
