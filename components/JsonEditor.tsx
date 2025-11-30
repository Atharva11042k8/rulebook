import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Button } from './Button';
import { AlertTriangle, Check, RefreshCw } from 'lucide-react';

interface JsonEditorProps {
  onClose: () => void;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ onClose }) => {
  const { data, importData } = useStore();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setValue(JSON.stringify(data, null, 2));
  }, [data]);

  const validateJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Basic schema validation
      if (!parsed.meta || !parsed.rules || !Array.isArray(parsed.rules)) {
        throw new Error("Missing 'meta' object or 'rules' array.");
      }
      
      // Validate Rules
      parsed.rules.forEach((rule: any, index: number) => {
        if (!rule.id || !rule.title) throw new Error(`Rule at index ${index} missing id or title`);
        if (!Array.isArray(rule.points)) throw new Error(`Rule '${rule.title}' missing points array`);
      });

      setIsValid(true);
      setError(null);
      return parsed;
    } catch (e: any) {
      setIsValid(false);
      setError(e.message);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    validateJson(newVal);
  };

  const handleSave = () => {
    const parsed = validateJson(value);
    if (parsed) {
      importData(parsed);
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4">
        <textarea
          className="w-full h-[60vh] bg-transparent text-zinc-300 font-mono text-sm resize-none focus:outline-none"
          value={value}
          onChange={handleChange}
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-900/10 p-3 rounded-lg border border-rose-900/20">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button 
          variant={isValid ? "primary" : "secondary"} 
          onClick={handleSave}
          disabled={!isValid}
        >
          {isValid ? <Check size={16} className="mr-2" /> : <AlertTriangle size={16} className="mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};