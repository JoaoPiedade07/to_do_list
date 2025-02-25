const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Para resolver caminhos de arquivos corretamente
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));  // Serve arquivos estáticos

app.use(express.json());

// Inicializar o banco de dados SQLite
const db = new sqlite3.Database('tasks.db');

// Criar a tabela de tarefas (se não existir)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, task TEXT)");
});

// Rota para pegar as tarefas
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ tasks: rows });
    }
  });
});

// Rota para adicionar uma tarefa
app.post('/add-task', (req, res) => {
  const task = req.body.task;
  const stmt = db.prepare("INSERT INTO tasks (task) VALUES (?)");
  stmt.run(task, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ id: this.lastID, task });
    }
  });
});

// Rota para deletar uma tarefa
app.delete('/delete-task/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tasks WHERE id = ?", id, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Tarefa deletada com sucesso!" });
      }
    });
  });

  // Rota para editar uma tarefa
  app.put('/edit-task/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    db.run("UPDATE tasks SET task = ? WHERE id = ?", [task, id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Tarefa atualizada com sucesso!" });
      }
    });
  });
  
// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
});