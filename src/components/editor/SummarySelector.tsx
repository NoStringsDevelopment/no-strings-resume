import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Target, Trash2, Info } from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { NamedSummary } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';

export const SummarySelector: React.FC = () => {
  const { state, dispatch } = useResume();
  const { toast } = useToast();
  const [currentTarget, setCurrentTarget] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const lastSavedRef = useRef<{ target: string; summary: string }>({ target: '', summary: '' });

  const summaries = state.resumeData.summaries || [];
  const activeSummaryId = state.resumeData.activeSummaryId;
  const activeSummary = summaries.find(s => s.id === activeSummaryId);
  const { basics } = state.resumeData;

  // Initialize current target from active summary or empty
  useEffect(() => {
    if (activeSummary) {
      setCurrentTarget(activeSummary.target);
    }
  }, [activeSummary]);

  // Save when component unmounts or when target/summary changes
  useEffect(() => {
    const shouldSave = currentTarget.trim() && 
                      basics.summary.trim() && 
                      (lastSavedRef.current.target !== currentTarget || 
                       lastSavedRef.current.summary !== basics.summary);
    
    if (shouldSave) {
      saveSummaryForTarget(currentTarget, basics.summary);
      lastSavedRef.current = { target: currentTarget, summary: basics.summary };
    }

    return () => {
      // Save current state when component unmounts
      if (currentTarget.trim() && basics.summary.trim()) {
        saveSummaryForTarget(currentTarget, basics.summary);
      }
    };
  }, [currentTarget, basics.summary]);

  const updateBasicsSummary = (value: string) => {
    dispatch({ 
      type: 'UPDATE_BASICS', 
      payload: { summary: value } 
    });
  };

  const handleTargetChange = (newTarget: string) => {
    if (!newTarget.trim()) {
      setCurrentTarget('');
      return;
    }

    // Save current summary if we have one
    if (currentTarget && basics.summary) {
      saveSummaryForTarget(currentTarget, basics.summary);
    }

    // Load summary for new target
    const existingSummary = summaries.find(s => s.target === newTarget);
    if (existingSummary) {
      updateBasicsSummary(existingSummary.summary);
      dispatch({
        type: 'SET_ACTIVE_SUMMARY',
        payload: existingSummary.id
      });
      
      // Update last used timestamp
      dispatch({
        type: 'UPDATE_SUMMARY',
        payload: { ...existingSummary, lastUsed: new Date().toISOString() }
      });
    } else {
      // Don't clear summary for new target - preserve current content
      dispatch({
        type: 'SET_ACTIVE_SUMMARY',
        payload: undefined
      });
    }

    setCurrentTarget(newTarget);
  };

  const handleTargetInputExit = () => {
    if (currentTarget.trim() && basics.summary.trim()) {
      saveSummaryForTarget(currentTarget, basics.summary);
    }
    setIsEditing(false);
  };

  const saveSummaryForTarget = (target: string, summary: string) => {
    if (!target.trim() || !summary.trim()) return;

    const existingSummary = summaries.find(s => s.target === target);
    
    if (existingSummary) {
      // Update existing summary
      dispatch({
        type: 'UPDATE_SUMMARY',
        payload: {
          ...existingSummary,
          summary,
          lastUsed: new Date().toISOString()
        }
      });
    } else {
      // Create new summary
      const newSummary: NamedSummary = {
        id: Date.now().toString(),
        target,
        summary,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };

      dispatch({
        type: 'ADD_SUMMARY',
        payload: newSummary
      });

      dispatch({
        type: 'SET_ACTIVE_SUMMARY',
        payload: newSummary.id
      });
    }
  };

  const handleSummaryChange = (value: string) => {
    updateBasicsSummary(value);
    
    // Auto-save to current target if we have one
    if (currentTarget.trim()) {
      // Debounce the save to avoid too many updates
      setTimeout(() => {
        saveSummaryForTarget(currentTarget, value);
      }, 500);
    }
  };

  const handleDeleteTarget = () => {
    if (!activeSummary) return;

    dispatch({
      type: 'DELETE_SUMMARY',
      payload: activeSummary.id
    });

    // Clear current state
    setCurrentTarget('');
    updateBasicsSummary('');
    
    toast({
      title: "Target Deleted",
      description: `Deleted "${activeSummary.target}" summary.`
    });
  };

  const availableTargets = summaries.map(s => s.target).sort();

  return (
    <TooltipProvider>
      <Card data-testid="summary-selector">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="target">Target Role/Company</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter a target above to save this summary for future use</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex space-x-2">
              {availableTargets.length > 0 && !isEditing ? (
                <Select value={currentTarget} onValueChange={handleTargetChange}>
                  <SelectTrigger className="flex-1" data-testid="target-selector-dropdown">
                    <SelectValue placeholder="Select a target or type a new one" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTargets.map((target) => (
                      <SelectItem key={target} value={target}>
                        {target}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  ref={targetInputRef}
                  id="target"
                  value={currentTarget}
                  onChange={(e) => setCurrentTarget(e.target.value)}
                  onBlur={handleTargetInputExit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Tab') {
                      handleTargetInputExit();
                      handleTargetChange(currentTarget);
                    }
                  }}
                  placeholder="e.g., Senior Software Engineer at Tech Startups"
                  className="flex-1"
                  data-testid="target-input"
                />
              )}
              
              {availableTargets.length > 0 && !isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  data-testid="edit-target-button"
                >
                  Edit
                </Button>
              )}
              
              {activeSummary && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteTarget}
                  className="text-red-600 hover:text-red-700"
                  data-testid="delete-target-button"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={basics.summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              placeholder="Brief professional summary highlighting your key strengths and experience..."
              rows={4}
              spellCheck={true}
              data-testid="summary-input"
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
