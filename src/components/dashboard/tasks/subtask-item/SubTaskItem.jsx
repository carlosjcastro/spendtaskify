import React from 'react';
import { AiOutlineCheckCircle, AiOutlineClockCircle } from 'react-icons/ai';

const SubTaskItem = ({ subtask }) => {
  const Icon = subtask.status === 'Completado' ? AiOutlineCheckCircle : AiOutlineClockCircle;

  return (
    <div className="flex items-center gap-2 mt-2">
      <Icon className="text-gray-200" />
      <span className="text-gray-200 text-sm">{subtask.title}</span>
    </div>
  );
};

export default SubTaskItem;
