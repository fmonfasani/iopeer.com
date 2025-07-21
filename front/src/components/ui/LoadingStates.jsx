import React from 'react';

export const AgentCardSkeleton = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
      <div className="flex space-x-1">
        <div className="w-4 h-4 bg-slate-700 rounded"></div>
        <div className="w-4 h-4 bg-slate-700 rounded"></div>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="h-5 bg-slate-700 rounded w-3/4"></div>
      <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-700 rounded"></div>
        <div className="h-3 bg-slate-700 rounded w-5/6"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-6 bg-slate-700 rounded w-16"></div>
        <div className="h-6 bg-slate-700 rounded w-12"></div>
        <div className="h-6 bg-slate-700 rounded w-20"></div>
      </div>
      <div className="h-10 bg-slate-700 rounded mt-4"></div>
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 animate-pulse">
    <div className="text-center">
      <div className="w-16 h-16 bg-slate-700 rounded-xl mx-auto mb-4"></div>
      <div className="h-6 bg-slate-700 rounded w-3/4 mx-auto mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-slate-700 rounded"></div>
        <div className="h-3 bg-slate-700 rounded w-5/6 mx-auto"></div>
      </div>
      <div className="h-6 bg-slate-700 rounded w-24 mx-auto"></div>
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
    <div className="mb-6">
      <div className="h-6 bg-slate-700 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-3/4"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-slate-700/30 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
            <div className="w-12 h-4 bg-slate-700 rounded"></div>
          </div>
          <div className="h-8 bg-slate-700 rounded w-16 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-20"></div>
        </div>
      ))}
    </div>
    
    <div className="mt-6 pt-6 border-t border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 bg-slate-700 rounded w-32"></div>
        <div className="h-4 bg-slate-700 rounded w-24"></div>
      </div>
      <div className="h-16 bg-slate-700 rounded"></div>
    </div>
  </div>
);

export const SearchSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-16 bg-slate-800 rounded-2xl mb-4"></div>
    <div className="h-4 bg-slate-700 rounded w-64 mx-auto"></div>
  </div>
);

export const FullPageLoader = ({ message = "Cargando AgentHub..." }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative mb-8">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.15s' }}></div>
      </div>
      
      <h2 className="text-xl font-semibold text-white mb-2">{message}</h2>
      <p className="text-slate-400">Preparando la mejor experiencia para ti...</p>
      
      <div className="mt-8 flex justify-center space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

export default {
  AgentCardSkeleton,
  CategoryCardSkeleton,
  StatsSkeleton,
  SearchSkeleton,
  FullPageLoader
};
