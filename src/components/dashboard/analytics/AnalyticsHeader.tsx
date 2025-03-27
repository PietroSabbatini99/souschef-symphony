
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export const AnalyticsHeader: React.FC = () => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <p className="text-gray-600">Insights about your cooking habits and dietary goals</p>
      </div>
      <Badge className="bg-souschef-red/10 text-souschef-red border-souschef-red/20 px-3 py-1.5 flex items-center gap-1.5">
        <Sparkles size={14} />
        Beta
      </Badge>
    </div>
  );
};
