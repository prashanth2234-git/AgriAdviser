import React from 'react';
import { Sprout } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const CropSummaryCard: React.FC<{ crops: string[] }> = ({ crops }) => {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-900">Tracked Crops</h3>
        <span className="text-xs text-stone-500 font-medium">{crops.length} Variety</span>
      </div>

      {crops.length === 0 ? (
        <p className="text-xs text-stone-500 py-3 text-center">No crops analyzed yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2 pt-1">
          {crops.map((crop) => (
            <Badge key={crop} variant="stone" size="md">
              <Sprout className="w-3.5 h-3.5 text-agri-600 mr-1" />
              {crop}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
