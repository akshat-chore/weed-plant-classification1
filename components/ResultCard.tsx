
import React from 'react';
import type { WeedClassification } from '../types';

interface ResultCardProps {
  result: WeedClassification;
}

const getSeverityStyles = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return {
        badge: 'bg-red-100 text-red-800 border-red-300',
        bar: 'bg-red-500',
      };
    case 'medium':
      return {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        bar: 'bg-yellow-500',
      };
    case 'low':
      return {
        badge: 'bg-green-100 text-green-800 border-green-300',
        bar: 'bg-green-500',
      };
    default:
      return {
        badge: 'bg-gray-100 text-gray-800 border-gray-300',
        bar: 'bg-gray-500',
      };
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const confidencePercentage = (result.confidence * 100).toFixed(1);
  const severityStyles = getSeverityStyles(result.severity_level);

  return (
    <div className="mt-6 animate-fade-in space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-text-secondary">{result.is_weed ? 'Identified Weed' : 'Identified Plant'}</p>
            <h2 className="text-2xl font-bold text-secondary">{result.class}</h2>
          </div>
          <div className={`text-sm font-semibold px-4 py-1.5 rounded-full border ${severityStyles.badge}`}>
            Severity: {result.severity_level || 'N/A'}
          </div>
        </div>
        <div className="mt-4">
            <p className="text-sm font-medium text-text-secondary mb-1">Confidence: {confidencePercentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${severityStyles.bar} h-2.5 rounded-full`} style={{ width: `${confidencePercentage}%` }}></div>
            </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-3">Description</h3>
        <p className="text-text-secondary leading-relaxed">{result.description}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-secondary border-b pb-2 mb-3">Recommended Actions</h3>
        <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{result.recommended_actions}</p>
      </div>
    </div>
  );
};
