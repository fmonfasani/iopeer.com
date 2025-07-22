import React from 'react';
import { Users, Plus } from 'lucide-react';

const Agents = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mis Agentes</h1>
        <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded">
          <Plus size={18} />
          Crear Agente
        </button>
      </div>

      <div className="border rounded-lg p-6 text-center">
        <Users className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Agentes IA</h3>
        <p className="text-gray-500">Aquí aparecerán tus agentes cuando los crees</p>
      </div>
    </div>
  );
};

export default Agents;
