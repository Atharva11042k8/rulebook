import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { ChevronDown, GripVertical, Plus, Trash2, X } from 'lucide-react';
import { Rule, Point } from '../types';
import { useStore } from '../store';
import { Button } from './Button';

interface RuleCardProps {
  rule: Rule;
  isDragging?: boolean;
}

export const RuleCard: React.FC<RuleCardProps> = ({ rule }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateRule, deleteRule, addPoint, updatePoint, deletePoint, reorderPoints } = useStore();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateRule(rule.id, { title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateRule(rule.id, { description: e.target.value });
  };

  const handlePointReorder = (newPoints: Point[]) => {
    reorderPoints(rule.id, newPoints);
  };

  const handleDeleteRule = () => {
    if (window.confirm("Are you sure you want to delete this entire rule?")) {
      deleteRule(rule.id);
    }
  };

  const handleDeletePoint = (pointId: string) => {
    if (window.confirm("Are you sure you want to delete this point?")) {
      deletePoint(rule.id, pointId);
    }
  };

  // Toggle expansion handler
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        bg-surface border border-zinc-800 rounded-2xl overflow-hidden shadow-lg transition-colors
        ${isExpanded ? 'ring-1 ring-zinc-700 bg-surfaceHighlight/50' : 'hover:bg-surfaceHighlight'}
      `}
    >
      {/* Header Area - Clickable for expansion */}
      <div 
        className="p-1 flex items-start gap-2 cursor-pointer"
        onClick={toggleExpand}
      >
        <div 
          className="mt-4 ml-2 text-zinc-600 cursor-grab active:cursor-grabbing hover:text-zinc-400 p-1"
          onClick={(e) => e.stopPropagation()} // Prevent drag handle click from toggling
        >
          <GripVertical size={20} />
        </div>
        
        <div className="flex-1 py-4 pr-4">
          <div className="flex items-center justify-between gap-4">
            <input
              value={rule.title}
              onChange={handleTitleChange}
              className="bg-transparent text-lg font-bold text-zinc-100 placeholder-zinc-600 focus:outline-none focus:placeholder-zinc-700 w-full hover:bg-zinc-800/50 rounded px-1 -ml-1 transition-colors"
              placeholder="Rule Title"
              onClick={(e) => e.stopPropagation()} // Prevent input click from toggling
            />
            <div className="flex items-center gap-1">
               <div
                className="p-2 text-zinc-400"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>
            </div>
          </div>
          
          {!isExpanded && (
            <p className="text-zinc-500 text-sm mt-1 line-clamp-1">
              {rule.description || "No description provided."}
            </p>
          )}

          {!isExpanded && rule.points.length > 0 && (
             <div className="flex gap-2 mt-3 overflow-hidden">
                <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full">
                  {rule.points.length} points
                </span>
             </div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 space-y-4 cursor-default" onClick={(e) => e.stopPropagation()}>
              <textarea
                value={rule.description}
                onChange={handleDescriptionChange}
                placeholder="Add a detailed description or philosophy behind this rule..."
                className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm text-zinc-300 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-600 min-h-[80px]"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                  <span>Points</span>
                </div>

                <Reorder.Group axis="y" values={rule.points} onReorder={handlePointReorder} className="space-y-2">
                  {rule.points.map((point) => (
                    <Reorder.Item
                      key={point.id}
                      value={point}
                      className="bg-zinc-900/40 rounded-lg p-2 flex items-center gap-3 group border border-transparent hover:border-zinc-800"
                    >
                      <GripVertical size={16} className="text-zinc-700 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Checkbox removed completely */}
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0 ml-1" />

                      <input
                        value={point.text}
                        onChange={(e) => updatePoint(rule.id, point.id, { text: e.target.value })}
                        className="bg-transparent w-full text-sm focus:outline-none text-zinc-200"
                        placeholder="Rule point..."
                      />

                      <button 
                        onClick={() => handleDeletePoint(point.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-900/20 hover:text-rose-400 rounded transition-all"
                        title="Delete Point"
                      >
                        <X size={16} />
                      </button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2 border border-dashed border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50"
                    onClick={() => addPoint(rule.id)}
                >
                    <Plus size={16} className="mr-2" /> Add Point
                </Button>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <Button variant="danger" size="sm" onClick={handleDeleteRule}>
                    <Trash2 size={16} className="mr-2" /> Delete Rule
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};