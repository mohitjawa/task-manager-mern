import React from 'react';

const TaskItem = React.memo(function TaskItem({ task, onToggle, onDelete, provided, snapshot }) {
  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} ${snapshot?.isDragging ? 'dragging' : ''}`}
      ref={provided?.innerRef}
      {...(provided?.draggableProps ?? {})}
      {...(provided?.dragHandleProps ?? {})}
    >
      <label>
        <input type="checkbox" checked={!!task.completed} onChange={() => onToggle(task._id)} />
        <span>{task.title}</span>
      </label>
      <button className="delete-btn" onClick={() => onDelete(task._id)}>×</button>
    </div>
  );
});

export default TaskItem;
