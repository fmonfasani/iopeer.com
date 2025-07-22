import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { Card } from '../../ui';

const Marketplace = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar agentes..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
        </div>
      </div>
      
      <Card>
        <Card.Content className="text-center py-12">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Marketplace</h3>
          <p className="text-gray-500">Explora agentes creados por la comunidad</p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Marketplace;
