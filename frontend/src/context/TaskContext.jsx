import React, { createContext, useContext, useEffect, useCallback, useMemo, useState } from 'react';
import * as api from '../api';
import useLocalStorage from '../hooks/useLocalStorage';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [localTasks, setLocalTasks] = useLocalStorage('tasks_cache', []);
  const [tasks, setTasks] = useState(localTasks || []);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, completed, pending

  useEffect(() => {
    // load from server then update local cache
    let mounted = true;
    setLoading(true);
    api.fetchTasks()
      .then(data => {
        if (!mounted) return;
        setTasks(data);
        setLocalTasks(data);
      })
      .catch(err => {
        // on error, keep using local cache
        console.warn('Failed to fetch tasks, using local cache', err);
      })
      .finally(()=> mounted && setLoading(false));
    return () => { mounted = false; };
  }, [setLocalTasks]);

  // Add
  const addTask = useCallback(async (title) => {
    // optimistic local update
    const newTaskLocal = { _id: `local-${Date.now()}`, title, completed: false, createdAt: new Date().toISOString(), order: tasks.length };
    setTasks(prev => {
      const next = [...prev, newTaskLocal];
      setLocalTasks(next);
      return next;
    });
    try {
      const created = await api.createTask({ title, order: tasks.length });
      // replace local temporary id with server id
      setTasks(prev => prev.map(t => (t._id === newTaskLocal._id ? created : t)));
      setLocalTasks(prev => prev.map(t => (t._id === newTaskLocal._id ? created : t)));
    } catch (e) {
      console.error('Create failed', e);
    }
  }, [tasks, setLocalTasks]);

  const toggleComplete = useCallback(async (id) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
    setLocalTasks(prev => prev.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
    try {
      const target = tasks.find(t => t._id === id);
      if (!target) return;
      await api.updateTask(id, { completed: !target.completed });
    } catch (e) {
      console.warn('Toggle failed', e);
    }
  }, [tasks, setLocalTasks]);

  const removeTask = useCallback(async (id) => {
    setTasks(prev => prev.filter(t => t._id !== id));
    setLocalTasks(prev => prev.filter(t => t._id !== id));
    try {
      await api.deleteTask(id);
    } catch (e) {
      console.warn('Delete failed', e);
    }
  }, [setLocalTasks]);

  const reorder = useCallback(async (orderedTasks) => {
    // orderedTasks is an array of task objects in new order
    setTasks(orderedTasks);
    setLocalStorageOrdered(orderedTasks);
    // call API reorder with server IDs only
    try {
      const orderedIds = orderedTasks.map(t => t._id);
      await api.reorderTasks(orderedIds);
    } catch (e) {
      console.warn('Reorder failed', e);
    }
  }, []);

  // helper to save order to localStorage
  const setLocalStorageOrdered = (orderedTasks) => {
    setLocalTasks(orderedTasks);
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return tasks;
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks.filter(t => !t.completed);
  }, [tasks, filter]);

  const value = {
    tasks,
    filtered,
    loading,
    filter, setFilter,
    addTask, toggleComplete, removeTask, reorder,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
