import React from 'react';
import WorkflowCanvas from './WorkflowCanvas';

const WorkflowEditor = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Workflow Editor</h1>
      <WorkflowCanvas />
    </div>
  );
};

export default WorkflowEditor;
