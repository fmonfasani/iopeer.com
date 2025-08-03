

// ============================================
// front/src/components/ui/LoadingStates.jsx
// Estados de loading específicos para diferentes contextos
// ============================================

import React, { useState, useEffect } from 'react';
import { Users, Database, Zap, Settings } from 'lucide-react';
import Skeleton from './Skeleton';

export const AgentsLoadingState = () => {
  const buttonSkeleton = [{ size: 'w-32 h-10' }];

  const cardSkeleton = {
    header: [
      { size: 'w-32 h-6' },
      { size: 'w-16 h-4' }
    ],
    body: [
      { size: 'w-full h-4', className: 'mb-2' },
      { size: 'w-3/4 h-4', className: 'mb-4' }
    ],
    footer: [
      { size: 'w-20 h-4' },
      { size: 'w-24 h-4' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mis Agentes</h1>
        {buttonSkeleton.map((cfg, idx) => (
          <Skeleton key={idx} {...cfg} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              {cardSkeleton.header.map((cfg, idx) => (
                <Skeleton key={idx} {...cfg} />
              ))}
            </div>
            {cardSkeleton.body.map((cfg, idx) => (
              <Skeleton key={idx} {...cfg} />
            ))}
            <div className="flex justify-between">
              {cardSkeleton.footer.map((cfg, idx) => (
                <Skeleton key={idx} {...cfg} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardLoadingState = () => {
  const heroSkeletons = [
    { size: 'w-48 h-10', className: 'mb-4 mx-auto' },
    { size: 'w-96 h-6', className: 'mx-auto' }
  ];

  const overviewSkeleton = {
    lines: [
      { size: 'w-32 h-6', className: 'mb-2' },
      { size: 'w-24 h-4' }
    ],
    icon: { shape: 'circle', size: 'w-8 h-8' }
  };

  const statCardSkeleton = {
    lines: [
      { size: 'w-20 h-4', className: 'mb-2' },
      { size: 'w-16 h-8' }
    ],
    icon: { size: 'w-8 h-8' }
  };

  const detailHeader = [{ size: 'w-32 h-6', className: 'mb-4' }];
  const detailItem = [
    { size: 'w-full h-4', className: 'mb-2' },
    { size: 'w-3/4 h-4' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        {heroSkeletons.map((cfg, idx) => (
          <Skeleton key={idx} {...cfg} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            {overviewSkeleton.lines.map((cfg, idx) => (
              <Skeleton key={idx} {...cfg} />
            ))}
          </div>
          <Skeleton {...overviewSkeleton.icon} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                {statCardSkeleton.lines.map((cfg, idx) => (
                  <Skeleton key={idx} {...cfg} />
                ))}
              </div>
              <Skeleton {...statCardSkeleton.icon} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {detailHeader.map((cfg, idx) => (
          <Skeleton key={idx} {...cfg} />
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg">
              {detailItem.map((cfg, idx) => (
                <Skeleton key={idx} {...cfg} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MarketplaceLoadingState = () => {
  const headerSkeletons = [
    { size: 'w-32 h-8' },
    { size: 'w-48 h-10' }
  ];

  const heroSkeletons = [
    { size: 'w-48 h-6', className: 'mb-2 bg-white/20' },
    { size: 'w-96 h-4', className: 'bg-white/20' }
  ];

  const productSkeleton = {
    avatar: { shape: 'circle', size: 'w-8 h-8' },
    title: [
      { size: 'w-24 h-5', className: 'mb-1' },
      { size: 'w-20 h-3' }
    ],
    description: { size: 'w-full h-4', className: 'mb-4' },
    tags: Array.from({ length: 3 }).map(() => ({ size: 'w-12 h-5', className: 'rounded-full' })),
    button: { size: 'w-full h-10' }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {headerSkeletons.map((cfg, idx) => (
          <Skeleton key={idx} {...cfg} />
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
        {heroSkeletons.map((cfg, idx) => (
          <Skeleton key={idx} {...cfg} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton {...productSkeleton.avatar} />
                <div>
                  {productSkeleton.title.map((cfg, idx) => (
                    <Skeleton key={idx} {...cfg} />
                  ))}
                </div>
              </div>
            </div>
            <Skeleton {...productSkeleton.description} />
            <div className="flex flex-wrap gap-1 mb-4">
              {productSkeleton.tags.map((cfg, idx) => (
                <Skeleton key={idx} {...cfg} />
              ))}
            </div>
            <Skeleton {...productSkeleton.button} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Hook para loading inteligente
// ============================================

export const useSmartLoading = (loadingTime = 500) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer;
    
    if (isLoading) {
      // Solo mostrar loading si toma más tiempo del esperado
      timer = setTimeout(() => {
        setShowLoading(true);
      }, loadingTime);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, loadingTime]);

  return {
    isLoading,
    showLoading,
    startLoading: () => setIsLoading(true),
    stopLoading: () => setIsLoading(false)
  };
};
