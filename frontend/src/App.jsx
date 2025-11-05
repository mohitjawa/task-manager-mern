import React from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import ThemeToggle from './components/ThemeToggle';
import './styles/main.css';

function MainUI() {
  const { filter, setFilter, loading } = useTasks();

  return (
    <div className="container">
      <header>
        <h1>Task Manager</h1>
        <ThemeToggle />
      </header>

      <AddTaskForm />

      <div className="filters">
        <button className={filter==='all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter==='pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
        <button className={filter==='completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <div style={{ position: "relative" }}>
        {loading && <div className="loader">Loading...</div>}
        <TaskList />
      </div>

      <footer className="note">Local caching enabled — tasks persist in Local Storage.</footer>
    </div>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <MainUI />
    </TaskProvider>
  );
}
