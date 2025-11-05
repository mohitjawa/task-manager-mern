import React, { useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';
import { useTasks } from '../context/TaskContext';

export default function TaskList() {
  const { filtered, toggleComplete, removeTask, reorder } = useTasks();

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;
    const srcIdx = result.source.index;
    const destIdx = result.destination.index;
    const newList = Array.from(filtered);
    const [moved] = newList.splice(srcIdx, 1);
    newList.splice(destIdx, 0, moved);
    // update order and call reorder (TaskContext handles API/local)
    reorder(newList.map((t, i) => ({ ...t, order: i })));
  }, [filtered, reorder]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {filtered.map((task, idx) => (
              <Draggable key={task._id} draggableId={String(task._id)} index={idx}>
                {(prov, snapshot) => (
                  <TaskItem
                    task={task}
                    onToggle={toggleComplete}
                    onDelete={removeTask}
                    provided={prov}
                    snapshot={snapshot}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
