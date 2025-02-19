document.addEventListener("DOMContentLoaded", loadTasks);
        
        function addTask() {
            let taskInput = document.getElementById("taskInput");
            let taskText = taskInput.value.trim();
            if (taskText === "") return;
            
            let taskList = document.getElementById("taskList");
            let li = document.createElement("li");
            
            li.innerHTML = `
                <span onclick="toggleTask(this)">${taskText}</span>
                <button onclick="removeTask(this)">❌</button>
            `;
            
            taskList.appendChild(li);
            saveTasks();
            taskInput.value = "";
        }
        
        function toggleTask(task) {
            task.classList.toggle("done");
            saveTasks();
        }
        
        function removeTask(button) {
            button.parentElement.remove();
            saveTasks();
        }
        
        function saveTasks() {
            let tasks = [];
            document.querySelectorAll("#taskList li").forEach(li => {
                tasks.push({ text: li.innerText.replace("❌", ""), done: li.firstChild.classList.contains("done") });
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        
        function loadTasks() {
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            let taskList = document.getElementById("taskList");
            tasks.forEach(task => {
                let li = document.createElement("li");
                li.innerHTML = `
                    <span onclick="toggleTask(this)" class="${task.done ? 'done' : ''}">${task.text}</span>
                    <button onclick="removeTask(this)">❌</button>
                `;
                taskList.appendChild(li);
            });
        }