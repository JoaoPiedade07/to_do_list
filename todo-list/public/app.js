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
  
          // Criar um contêiner para organizar o texto e os botões
          const taskContainer = document.createElement('div');
          taskContainer.style.display = 'flex';
          taskContainer.style.justifyContent = 'space-between';
          taskContainer.style.alignItems = 'center';
          taskContainer.style.width = '100%';
  
          // Criar um elemento de texto editável
          const taskText = document.createElement('span');
          taskText.textContent = task.task;
          taskText.style.flex = '1'; // Para ocupar o espaço disponível
  
          // Criar um campo de entrada (input) oculto inicialmente
          const input = document.createElement('input');
          input.type = 'text';
          input.value = task.task;
          input.style.display = 'none';
  
          // Criar um contêiner para os botões
          const buttonContainer = document.createElement('div');
  
          // Botão de Editar
          const editBtn = document.createElement('button');
          editBtn.textContent = "Editar";
          editBtn.onclick = () => {
            taskText.style.display = 'none'; // Esconder o texto
            input.style.display = 'inline-block'; // Mostrar input
            input.focus();
            editBtn.style.display = 'none'; // Esconder botão de editar
            saveBtn.style.display = 'inline-block'; // Mostrar botão de salvar
          };
  
          // Botão de Salvar (inicialmente oculto)
          const saveBtn = document.createElement('button');
          saveBtn.textContent = "Salvar";
          saveBtn.style.display = 'none';
          saveBtn.onclick = () => {
            const newTask = input.value;
            if (newTask !== task.task) {
              fetch(`/edit-task/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: newTask })
              })
              .then(response => response.json())
              .then(() => {
                loadTasks();
              });
            } else {
              // Se o usuário não alterou nada, apenas esconde os campos
              taskText.style.display = 'inline-block';
              input.style.display = 'none';
              editBtn.style.display = 'inline-block';
              saveBtn.style.display = 'none';
            }
          };
  
          // Botão de Excluir
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = "Excluir";
          deleteBtn.onclick = () => deleteTask(task.id);
  
          // Adicionar botões no container
          buttonContainer.appendChild(editBtn);
          buttonContainer.appendChild(saveBtn);
          buttonContainer.appendChild(deleteBtn);
  
          // Adicionar elementos ao container principal
          taskContainer.appendChild(taskText);
          taskContainer.appendChild(input);
          taskContainer.appendChild(buttonContainer);
  
          li.appendChild(taskContainer);
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
  