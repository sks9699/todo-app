// import { useState } from 'react';
// import { TrashIcon } from '@heroicons/react/24/outline';
//  // Ensure to install @heroicons/react if not already

// export default function TodoDetails({ selectedTodo, onDeleteTodo }) {
//   const [title, setTitle] = useState(selectedTodo.title);
//   const [description, setDescription] = useState(selectedTodo.description);

//   return (
//     <div className="w-full md:w-2/3 p-4 bg-gray-50 rounded-lg shadow-md">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold">Todo Details</h2>
//         <button
//           onClick={() => onDeleteTodo(selectedTodo)}
//           className="text-red-600 hover:text-red-800"
//           aria-label="Delete Todo"
//         >
//           <TrashIcon className="h-6 w-6" />
//         </button>
//       </div>
//       <input
//         type="text"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         placeholder="Title"
//       />
//       <textarea
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         rows="10"
//         placeholder="Description"
//       ></textarea>
//       {/* Optionally, add a toolbar or buttons for text formatting here */}
//     </div>
//   );
// }

// components/TodoDetails.js
import React, { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function TodoDetails({ selectedTodo, onUpdate, onDelete }) {
  const [title, setTitle] = useState(selectedTodo.title);
  const [description, setDescription] = useState(selectedTodo.description);

  useEffect(() => {
    setTitle(selectedTodo.title);
    setDescription(selectedTodo.description);
  }, [selectedTodo]);

  const handleUpdate = async () => {
    try {
      // Check if selectedTodo and its _id are valid
      if (!selectedTodo || !selectedTodo._id) {
        console.error('Invalid Todo ID');
        return;
      }
  
      // Perform the update request
      await axios.put(`http://localhost:5000/api/todos/${selectedTodo._id}`, { title, description });
      
      // Call onUpdate to refresh the data or perform any necessary actions
      onUpdate();
    } catch (error) {
      console.error('Error updating todo:', error); // Log detailed error
    }
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/todos/${selectedTodo._id}`);
    onDelete(selectedTodo);
  };

  return (
    <div className="w-full md:w-2/3 p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Todo Details</h2>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
          aria-label="Delete Todo"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="10"
        placeholder="Description"
      ></textarea>
      <button onClick={handleUpdate} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Update
      </button>
    </div>
  );
}
