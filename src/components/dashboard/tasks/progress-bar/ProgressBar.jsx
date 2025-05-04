import React from 'react';

const ProgressBar = ({ subtasks = [] }) => {
  const total = subtasks.length;
  const completed = subtasks.filter(st => st.status === 'Completado').length;
  const percent = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="mt-4">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-[#52B788] h-2 rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
      <p className="text-xs mt-1 text-gray-500">{Math.round(percent)}% Completado</p>
    </div>
  );
};

export default ProgressBar;
