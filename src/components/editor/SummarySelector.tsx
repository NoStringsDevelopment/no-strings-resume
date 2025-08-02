import React, { useState, useEffect, useRef, useCallback } from 'react';
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

// Generate a unique ID with fallback for older browsers
const generateUniqueId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'summary-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export const SummarySelector: React.FC = () => {
  const { state, dispatch } = useResume();
  const { toast } = useToast();
  const [currentTarget, setCurrentTarget] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const summaries = state.resumeData.summaries || [];
  const activeSummaryId = state.resumeData.activeSummaryId;
  const activeSummary = summaries.find(s => s.id === activeSummaryId);
  const { basics } = state.resumeData;

  // Define saveSummaryForTarget function before useEffects that reference it
  const saveSummaryForTarget = useCallback((target: string, summary: string) => {
    // Only save if both target and summary have meaningful content
    if (!target || target.length < 3 || !summary || summary.length < 10) return;

    // Normalize target for consistent comparison
    const normalizedTarget = target.trim();
    
    // Find existing summary by target (case-insensitive)
    const existingSummary = summaries.find(s => 
      s.target.toLowerCase() === normalizedTarget.toLowerCase()
    );
    
    if (existingSummary) {
      // Only update if the summary has actually changed
      if (existingSummary.summary !== summary) {
        dispatch({
          type: 'UPDATE_SUMMARY',
          payload: {
            ...existingSummary,
            target: normalizedTarget, // Update with normalized target
            summary,
            lastUsed: new Date().toISOString()
          }
        });
      }
    } else {
      // Create new summary with unique ID
      const newSummary: NamedSummary = {
        id: generateUniqueId(),
        target: normalizedTarget,
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
  }, [summaries, dispatch]);

  // Initialize current target from active summary or empty
  useEffect(() => {
    if (activeSummary) {
      setCurrentTarget(activeSummary.target);
    }
  }, [activeSummary]);

  // Save when component unmounts or when switching sections
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Save current state when component unmounts if both fields have meaningful content
      if (currentTarget.trim().length > 2 && basics.summary.trim().length > 10) {
        saveSummaryForTarget(currentTarget.trim(), basics.summary.trim());
      }
    };
  }, [basics.summary, currentTarget, saveSummaryForTarget]);

  // Auto-save when target or summary changes (longer debounce for summary persistence)
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    const trimmedTarget = currentTarget.trim();
    const trimmedSummary = basics.summary.trim();
    
    if (trimmedTarget.length > 2 && trimmedSummary.length > 10) {
      saveTimeoutRef.current = setTimeout(() => {
        saveSummaryForTarget(trimmedTarget, trimmedSummary);
      }, 3000); // Extended from 1500ms to 3000ms for better undo/redo persistence
    }
  }, [currentTarget, basics.summary, saveSummaryForTarget]);

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

    // Save current summary if we have meaningful content
    if (currentTarget.trim().length > 2 && basics.summary.trim().length > 10) {
      saveSummaryForTarget(currentTarget.trim(), basics.summary.trim());
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
    const trimmedTarget = currentTarget.trim();
    const trimmedSummary = basics.summary.trim();
    
    if (trimmedTarget.length > 2 && trimmedSummary.length > 10) {
      saveSummaryForTarget(trimmedTarget, trimmedSummary);
    }
    setIsEditing(false);
  };

  const handleSummaryChange = (value: string) => {
    // Direct update without immediate history entry for better undo/redo
    updateBasicsSummary(value);
  };

  const handleDeleteTarget = () => {
    if (!activeSummary) return;

    const targetToDelete = activeSummary.target;

    // Get remaining summaries before deletion
    const remainingSummaries = summaries.filter(s => s.id !== activeSummary.id);
    
    // Delete the current summary
    dispatch({
      type: 'DELETE_SUMMARY',
      payload: activeSummary.id
    });

    // Switch to any existing target if available
    if (remainingSummaries.length > 0) {
      // Try to get the most recently used one, but fallback to any available
      let nextSummary = remainingSummaries.find(s => s.lastUsed);
      if (nextSummary) {
        // Sort by lastUsed if we have timestamps
        const sortedSummaries = remainingSummaries
          .filter(s => s.lastUsed)
          .sort((a, b) => {
            const dateA = new Date(a.lastUsed || a.createdAt).getTime();
            const dateB = new Date(b.lastUsed || b.createdAt).getTime();
            return dateB - dateA;
          });
        nextSummary = sortedSummaries[0] || remainingSummaries[0];
      } else {
        // Just pick the first one if no lastUsed timestamps
        nextSummary = remainingSummaries[0];
      }
      
      setCurrentTarget(nextSummary.target);
      updateBasicsSummary(nextSummary.summary);
      
      dispatch({
        type: 'SET_ACTIVE_SUMMARY',
        payload: nextSummary.id
      });
      
      // Update last used timestamp for the newly selected summary
      dispatch({
        type: 'UPDATE_SUMMARY',
        payload: { ...nextSummary, lastUsed: new Date().toISOString() }
      });
    } else {
      // Only clear if no other summaries exist
      setCurrentTarget('');
      updateBasicsSummary('');
    }
    
    toast({
      title: "Target Deleted",
      description: `Deleted "${targetToDelete}" summary.`
    });
  };

  // Filter out incomplete targets and remove duplicates, sorted by most recently used
  const availableTargets = summaries
    .filter(s => s.target && s.target.length > 2)
    .sort((a, b) => {
      const dateA = new Date(a.lastUsed || a.createdAt).getTime();
      const dateB = new Date(b.lastUsed || b.createdAt).getTime();
      return dateB - dateA;
    })
    .map(s => s.target)
    .filter((target, index, arr) => {
      // Remove duplicates by checking if this is the first occurrence of this target (case-insensitive)
      return arr.findIndex(t => t.toLowerCase() === target.toLowerCase()) === index;
    });

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
                  <p>Enter a target name to save this summary for future use</p>
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
                      if (currentTarget.trim()) {
                        handleTargetChange(currentTarget);
                      }
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
