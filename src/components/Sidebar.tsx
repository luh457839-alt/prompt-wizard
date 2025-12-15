// React import removed (automatic JSX runtime)
import { Sparkles, ChevronRight } from 'lucide-react';
import type { WizardConfig } from '../types';
import { clsx } from 'clsx';

interface SidebarProps {
  wizards: WizardConfig[];
  activeWizardId?: string;
  onSelect: (wizard: WizardConfig) => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  wizards, 
  activeWizardId, 
  onSelect,
  className 
}) => {
  return (
    <div className={clsx("flex flex-col h-full bg-white border-r border-gray-200", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl shadow-blue-200 shadow-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Prompt Wizard</h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Beta</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-xs font-semibold text-gray-400 px-2 mb-2 uppercase tracking-wider">
          Available Wizards
        </div>
        
        {wizards.map((wizard) => {
          const isActive = activeWizardId === wizard.id;
          return (
            <button
              key={wizard.id}
              onClick={() => onSelect(wizard)}
              className={clsx(
                "w-full group relative flex items-center p-3 rounded-xl transition-all duration-200 text-left border",
                isActive 
                  ? "bg-blue-50 border-blue-200 shadow-sm" 
                  : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
              )}
            >
              <span className="text-xl mr-3">{wizard.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className={clsx(
                  "font-semibold text-sm truncate transition-colors",
                  isActive ? "text-blue-700" : "text-gray-700"
                )}>
                  {wizard.title}
                </h3>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {wizard.description}
                </p>
              </div>
              
              {/* Desktop Indicator */}
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
              
              {/* Mobile/Hover Indicator */}
              <ChevronRight 
                size={16} 
                className={clsx(
                  "text-gray-300 transition-transform",
                  isActive ? "opacity-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                )} 
              />
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <p className="text-xs text-center text-gray-400">
          v1.0.0 • Engineering Team
        </p>
      </div>
    </div>
  );
};