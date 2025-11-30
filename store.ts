import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { RuleBookData, Rule, Point } from './types';
import { INITIAL_DATA } from './data';

interface AppState {
  data: RuleBookData;
  history: RuleBookData[];
  future: RuleBookData[];
  searchQuery: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  addRule: () => void;
  updateRule: (id: string, updates: Partial<Rule>) => void;
  deleteRule: (id: string) => void;
  reorderRules: (newRules: Rule[]) => void;
  
  addPoint: (ruleId: string) => void;
  updatePoint: (ruleId: string, pointId: string, updates: Partial<Point>) => void;
  deletePoint: (ruleId: string, pointId: string) => void;
  reorderPoints: (ruleId: string, newPoints: Point[]) => void;
  
  importData: (newData: RuleBookData) => void;
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void; // Internal helper to push to history
}

export const useStore = create<AppState>((set, get) => ({
  data: INITIAL_DATA,
  history: [],
  future: [],
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  saveSnapshot: () => {
    set((state) => {
      const newHistory = [...state.history, state.data];
      // Limit history size to 50
      if (newHistory.length > 50) newHistory.shift();
      return {
        history: newHistory,
        future: [] // Clear future on new action
      };
    });
  },

  addRule: () => {
    get().saveSnapshot();
    set((state) => {
      const newRule: Rule = {
        id: uuidv4(),
        title: "New Rule",
        description: "",
        points: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        data: {
          ...state.data,
          rules: [newRule, ...state.data.rules],
          meta: { ...state.data.meta, updatedAt: new Date().toISOString() }
        }
      };
    });
  },

  updateRule: (id, updates) => {
    get().saveSnapshot();
    set((state) => ({
      data: {
        ...state.data,
        rules: state.data.rules.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r),
        meta: { ...state.data.meta, updatedAt: new Date().toISOString() }
      }
    }));
  },

  deleteRule: (id) => {
    get().saveSnapshot();
    set((state) => ({
      data: {
        ...state.data,
        rules: state.data.rules.filter(r => r.id !== id),
        meta: { ...state.data.meta, updatedAt: new Date().toISOString() }
      }
    }));
  },

  reorderRules: (newRules) => {
    get().saveSnapshot(); 
    set((state) => ({
      data: { ...state.data, rules: newRules }
    }));
  },

  addPoint: (ruleId) => {
    get().saveSnapshot();
    set((state) => ({
      data: {
        ...state.data,
        rules: state.data.rules.map(r => {
          if (r.id === ruleId) {
            return {
              ...r,
              points: [...r.points, { id: uuidv4(), text: "", done: false }],
              updatedAt: new Date().toISOString()
            };
          }
          return r;
        })
      }
    }));
  },

  updatePoint: (ruleId, pointId, updates) => {
    get().saveSnapshot();
    set((state) => ({
      data: {
        ...state.data,
        rules: state.data.rules.map(r => {
          if (r.id === ruleId) {
            return {
              ...r,
              points: r.points.map(p => p.id === pointId ? { ...p, ...updates } : p),
              updatedAt: new Date().toISOString()
            };
          }
          return r;
        })
      }
    }));
  },

  deletePoint: (ruleId, pointId) => {
    get().saveSnapshot();
    set((state) => ({
      data: {
        ...state.data,
        rules: state.data.rules.map(r => {
          if (r.id === ruleId) {
            return {
              ...r,
              points: r.points.filter(p => p.id !== pointId),
              updatedAt: new Date().toISOString()
            };
          }
          return r;
        })
      }
    }));
  },

  reorderPoints: (ruleId, newPoints) => {
    get().saveSnapshot();
    set((state) => ({
      data: {
        ...state.data,
        rules: state.data.rules.map(r => r.id === ruleId ? { ...r, points: newPoints } : r)
      }
    }));
  },

  importData: (newData) => {
    get().saveSnapshot();
    set({ data: newData });
  },

  undo: () => {
    set((state) => {
      if (state.history.length === 0) return {};
      const previous = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      return {
        data: previous,
        history: newHistory,
        future: [state.data, ...state.future]
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return {};
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        data: next,
        history: [...state.history, state.data],
        future: newFuture
      };
    });
  },
}));