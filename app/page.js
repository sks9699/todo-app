'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TodoList from '@/components/TodoList';
import TodoDetails from '@/components/TodoDetails';
import axios from 'axios';

export default function Home() {
  const [todosObj, setTodosObj] = useState({ todos: [] });
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:4000/api/todos');
        setTodosObj(response.data);
        
        // Access the first todo correctly
        const firstTodo = response.data.todos && response.data.todos.length > 0 ? response.data.todos[0] : null;
        setSelectedTodo(firstTodo);
        
      } catch (err) {
        console.error('Failed to fetch todos', err);
        setError('Failed to fetch todos.');
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r bg-gray-50 overflow-y-auto">
          {loading ? (
            <p>Loading todos...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <TodoList todosObj={todosObj} onSelectTodo={setSelectedTodo} />
          )}
        </div>
        <div className="flex-1 p-4 bg-white overflow-y-auto">
          {selectedTodo ? (
            <TodoDetails selectedTodo={selectedTodo} />
          ) : (
            <p>Select a Todo to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}
