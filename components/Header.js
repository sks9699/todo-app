import React from 'react';

export default function Header() {
  return (
    <div className="flex items-center p-4 bg-white shadow-md border-b border-gray-200">
      <img 
        src="/image.png" 
        alt="Logo" 
        className="h-12 w-12 object-contain" 
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}
