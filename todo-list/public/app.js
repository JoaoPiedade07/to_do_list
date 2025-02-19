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
  
          // Botão de Editar
          const editBtn = document.createElement('button');
          editBtn.textContent = "Editar";
          editBtn.onclick = () => editTask(task.id, task.task);
  
          // Botão de Deletar
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = "Excluir";
          deleteBtn.onclick = () => deleteTask(task.id);
  
          li.appendChild(editBtn);
          li.appendChild(deleteBtn);
          taskList.appendChild(li);
        });
      });
  }  

  function deleteTask(id) {
    fetch(`/delete-task/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
      loadTasks();
    });
  }

  function editTask(id, oldTask) {
    const newTask = prompt("Edite sua tarefa:", oldTask);
    if (newTask) {
      fetch(`/edit-task/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask })
      })
      .then(response => response.json())
      .then(() => {
        loadTasks();
      });
    }
  } 
  
  // Carregar tarefas ao inicializar a página
  loadTasks();
  