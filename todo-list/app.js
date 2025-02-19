function addTask() {
    const taskInput = document.getElementById('task');
    const task = taskInput.value;
  
    if (task) {
      fetch('/add-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task })
      })
      .then(response => response.json())
      .then(data => {
        loadTasks();
        taskInput.value = ''; // Limpar o campo de entrada
      });
    }
  }
  
  function loadTasks() {
    fetch('/tasks')
      .then(response => response.json())
      .then(data => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = ''; // Limpar lista antes de adicionar as tarefas
        data.tasks.forEach(task => {
          const li = document.createElement('li');
          li.textContent = task.task;
          taskList.appendChild(li);
        });
      });
  }
  
  // Carregar tarefas ao inicializar a página
  loadTasks();
  