import React, { useState } from 'react';
import { User, Briefcase, Heart, Info } from 'lucide-react';
import { Suspect } from '../types/game';

interface SuspectCardProps {
  suspect: Suspect;
  isInterviewed: boolean;
  onSelect: (suspect: Suspect) => void;
  disabled?: boolean;
}

const characterDescriptions: { [key: string]: string } = {
  zane: "Zane Walker, Luca's lifelong best friend and personal cameraman, was close to him professionally and emotionally.",
  serena: "Serena Wren, Luca's girlfriend, is a self-proclaimed spiritual intuitive who insists she foresaw Luca's death.",
  jasmine: "Jasmine Hart, Zane's girlfriend, was once deeply embedded in Luca's inner circle.",
  logan: "Logan Black, the ship's bartender and a former soldier, is quiet and controlled.",
  nora: "Nora Quinn, a rising influencer and known rival of Luca's, was livestreaming from the main lounge during the time of the murder.",
  troy: "Troy Kane, a former influencer who had fallen from the spotlight, harbored resentment toward Luca. Known for his temper and drinking.",
  evelyn: "Evelyn Stone, Luca's mother, is a poised and charismatic woman whose role in her son's career was both managerial and controlling."
};

export const SuspectCard: React.FC<SuspectCardProps> = ({ 
  suspect, 
  isInterviewed, 
  onSelect, 
  disabled = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCardClick = () => {
    if (!disabled && !isInterviewed) {
      onSelect(suspect);
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="relative">
      <div 
        className={`
          relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer
          ${isInterviewed ? 'opacity-60 ring-2 ring-green-500' : 'hover:shadow-xl hover:scale-105'}
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
        onClick={handleCardClick}
      >
        {isInterviewed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
            Interviewed
          </div>
        )}
        
        {/* Info Icon */}
        <button
          onClick={handleInfoClick}
          className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full transition-colors z-10"
          title="Character Information"
        >
          <Info className="w-3 h-3" />
        </button>
        
        <div className="relative h-48 overflow-hidden">
          <img 
            src={suspect.avatar} 
            alt={suspect.displayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 text-white">
            <h3 className="font-bold text-lg">{suspect.displayName}</h3>
            <p className="text-sm opacity-90">{suspect.occupation}</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{suspect.occupation}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Heart className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{suspect.relationship}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 text-white p-3 rounded-lg shadow-xl z-50 text-sm">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45"></div>
          <p>{characterDescriptions[suspect.name] || "No description available."}</p>
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1 right-1 text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};