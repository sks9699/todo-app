import React from 'react';

export default function TodoList({ todosObj = {}, onSelectTodo }) {
  const todos = Array.isArray(todosObj.todos) ? todosObj.todos : [];

  return (
    <div className="">
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center">No todos available</p>
      ) : (
        todos.map((todo) => (
          <div
            key={todo._id}
            className="p-4 mb-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100 transition-transform transform hover:scale-105"
            onClick={() => onSelectTodo(todo)}
          >
            <h3 className="font-bold text-lg">{todo.title}</h3>
            <p className="text-sm text-gray-500 truncate">{todo.description}</p>
            <span className="text-xs text-gray-400">{new Date(todo.date).toLocaleDateString()}</span>
          </div>
        ))
      )}
    </div>
  );
}
