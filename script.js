document.addEventListener("DOMContentLoaded", loadTasks);
        
        function addTask() {
            let taskInput = document.getElementById("taskInput");
            let taskText = taskInput.value.trim();
            if (taskText === "") return;
            
            let taskList = document.getElementById("taskList");
            let li = document.createElement("li");
            
            li.innerHTML = `
                <span onclick="toggleTask(this)">${taskText}</span>
                <div class="buttons">
                    <button onclick="editTask(this)">✏️</button>
                    <button onclick="removeTask(this)">❌</button>
                </div>
            `;
            
            taskList.appendChild(li);
            saveTasks();
            taskInput.value = "";
        }
        
        function toggleTask(task) {
            task.classList.toggle("done");
            saveTasks();
        }
        
        function editTask(button) {
            let taskSpan = button.parentElement.parentElement.querySelector("span");
            let oldText = taskSpan.innerText;
            let input = document.createElement("input");
            input.type = "text";
            input.value = oldText;
            input.className = "edit-input";
            input.onblur = function() {
                saveEdit(this, taskSpan);
            };
            input.onkeypress = function(event) {
                if (event.key === "Enter") {
                    saveEdit(this, taskSpan);
                }
            };
            
            taskSpan.parentElement.replaceChild(input, taskSpan);
            input.focus();
        }
        
        function saveEdit(input, taskSpan) {
            let newText = input.value.trim();
            if (newText !== "") {
                taskSpan.textContent = newText;
            }
            input.parentElement.replaceChild(taskSpan, input);
            saveTasks();
        }
        
        function removeTask(button) {
            button.parentElement.parentElement.remove();
            saveTasks();
        }
        
        function saveTasks() {
            let tasks = [];
            document.querySelectorAll("#taskList li").forEach(li => {
                let taskText = li.querySelector("span").textContent;
                let isDone = li.querySelector("span").classList.contains("done");
                tasks.push({ text: taskText, done: isDone });
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        
        function loadTasks() {
            let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            let taskList = document.getElementById("taskList");
            taskList.innerHTML = "";
            tasks.forEach(task => {
                let li = document.createElement("li");
                li.innerHTML = `
                    <span onclick="toggleTask(this)" class="${task.done ? 'done' : ''}">${task.text}</span>
                    <div class="buttons">
                        <button onclick="editTask(this)">✏️</button>
                        <button onclick="removeTask(this)">❌</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }
