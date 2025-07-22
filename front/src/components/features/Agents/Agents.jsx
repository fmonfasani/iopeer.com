import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Card, Button } from '../../ui';

const Agents = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mis Agentes</h1>
        <Button>
          <Plus size={18} />
          Crear Agente
        </Button>
      </div>
      
      <Card>
        <Card.Content className="text-center py-12">
          <Users className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Agentes IA</h3>
          <p className="text-gray-500">Aquí aparecerán tus agentes cuando los crees</p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Agents;
