const express = require("express");
const app = express();
const PORT = 3000;

//Middleware
app.use(express.json());

// Tableau en mémoire
let tasks = [];
let idCounter = 1;

// Accueil
app.get("/", (req, res) => {
  res.send("Bienvenue sur mon API de tâches !");
});

// Lire toutes les tâches + filtrage par statut
app.get("/tasks", (req, res) => {
  const { status } = req.query;

  if (status) {
    const filteredTasks = tasks.filter(
      (t) => t.completed.toLowerCase() === status.toLowerCase()
    );
    return res.json(filteredTasks);
  }

  res.json(tasks);
});

// Ajouter une tâche
app.post("/tasks", (req, res) => {
  const { title, completed = 0 } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Le champ 'title' est requis" });
  }

  const newTask = {
    id: idCounter++,
    title,
    completed: Number(completed) === 1 ? "completed" : "not completed",
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Modifier une tâche
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Tâche introuvable" });
  }

  const { title, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// Supprimer une tâche
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = tasks.length;

  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: "Tâche introuvable" });
  }

  res.status(204).end();
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en ligne : http://localhost:${PORT}`);
});
