import React, { useState, useCallback } from 'react';
import { useTasks } from '../context/TaskContext';
import { FiPlus } from "react-icons/fi"; // Add icon

export default function AddTaskForm() {
  const [value, setValue] = useState('');
  const { addTask } = useTasks();

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    addTask(trimmed);
    setValue('');
  }, [value, addTask]);

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <input
        aria-label="Add new task"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Add a task..."
        className="add-input"
      />

      <button
        type="submit"
        className={`add-btn ${!value.trim() ? "disabled" : ""}`}
        disabled={!value.trim()}
      >
        <FiPlus size={18} />
      </button>
    </form>
  );
}
