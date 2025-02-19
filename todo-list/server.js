const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.static('public'));  // Serve arquivos estáticos
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

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na http://localhost:${port}`);
});
