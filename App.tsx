import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { Reorder, motion } from 'framer-motion';
import { Plus, Download, Upload, Code, RotateCcw, RotateCw, Search, Book } from 'lucide-react';
import { RuleCard } from './components/RuleCard';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { JsonEditor } from './components/JsonEditor';
import { Input } from './components/Input';
import { RuleBookData } from './types';

function App() {
  const { 
    data, 
    addRule, 
    reorderRules, 
    undo, 
    redo, 
    history, 
    future,
    searchQuery,
    setSearchQuery,
    importData
  } = useStore();
  
  const [isJsonModalOpen, setJsonModalOpen] = useState(false);
  
  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Derived state for filtering
  const filteredRules = data.rules.filter(rule => {
    const query = searchQuery.toLowerCase();
    return (
      rule.title.toLowerCase().includes(query) || 
      rule.description.toLowerCase().includes(query) ||
      rule.points.some(p => p.text.toLowerCase().includes(query))
    );
  });

  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ultimate-rule-book-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as RuleBookData;
        // Basic validation
        if (json.rules && Array.isArray(json.rules)) {
            importData(json);
        } else {
            alert("Invalid format: Missing rules array");
        }
      } catch (err) {
        alert("Failed to parse JSON");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-950">
              <Book size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg hidden sm:block tracking-tight">Rule Book</span>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <Input 
              className="pl-9 bg-surfaceHighlight border-transparent focus:bg-zinc-800"
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex gap-1 mr-2 border-r border-zinc-800 pr-2">
              <Button variant="ghost" size="icon" onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)">
                <RotateCcw size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Shift+Z)">
                <RotateCw size={18} />
              </Button>
            </div>

            <Button variant="primary" size="icon" onClick={addRule} className="sm:hidden">
                <Plus size={20} />
            </Button>
            <Button variant="primary" onClick={addRule} className="hidden sm:inline-flex">
                <Plus size={18} className="mr-2" /> New Rule
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {filteredRules.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-lg mb-4">No rules found.</p>
            {searchQuery ? (
               <Button variant="ghost" onClick={() => setSearchQuery('')}>Clear Search</Button>
            ) : (
               <Button variant="primary" onClick={addRule}>Create your first rule</Button>
            )}
          </div>
        ) : (
          <Reorder.Group axis="y" values={data.rules} onReorder={reorderRules} className="space-y-6">
            {filteredRules.map((rule) => (
              <Reorder.Item key={rule.id} value={rule} dragListener={false}>
                <RuleCard rule={rule} />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </main>

      {/* Footer / Controls */}
      <footer className="border-t border-zinc-800 py-6 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-400">{data.meta.title}</span> v{data.meta.version}
          </div>
          
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="sm" onClick={() => setJsonModalOpen(true)}>
                <Code size={16} className="mr-2" /> Raw JSON
             </Button>
             
             <label className="cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none h-8 px-3 text-xs bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                <Upload size={16} className="mr-2" /> Import
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
             </label>

             <Button variant="ghost" size="sm" onClick={handleExport}>
                <Download size={16} className="mr-2" /> Export
             </Button>
          </div>
        </div>
      </footer>

      {/* JSON Editor Modal */}
      <Modal 
        isOpen={isJsonModalOpen} 
        onClose={() => setJsonModalOpen(false)} 
        title="Raw Data Editor"
      >
        <p className="text-zinc-400 mb-4 text-sm">
          Directly edit your rule book data. Validation is applied automatically. 
          Use carefully!
        </p>
        <JsonEditor onClose={() => setJsonModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default App;