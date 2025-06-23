
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit2, Trash2, Target, FileText } from 'lucide-react';
import { useResume } from '@/context/ResumeContext';
import { NamedSummary } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';

export const SummarySelector: React.FC = () => {
  const { state, dispatch } = useResume();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSummary, setEditingSummary] = useState<NamedSummary | null>(null);
  const [newSummary, setNewSummary] = useState({
    name: '',
    target: '',
    summary: ''
  });

  const summaries = state.resumeData.summaries || [];
  const activeSummaryId = state.resumeData.activeSummaryId;
  const activeSummary = summaries.find(s => s.id === activeSummaryId);
  const { basics } = state.resumeData;

  const updateBasicsSummary = (value: string) => {
    dispatch({ 
      type: 'UPDATE_BASICS', 
      payload: { summary: value } 
    });
  };

  const handleCreateSummary = () => {
    if (!newSummary.name.trim() || !newSummary.target.trim() || !newSummary.summary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create a summary.",
        variant: "destructive"
      });
      return;
    }

    const summary: NamedSummary = {
      id: Date.now().toString(),
      name: newSummary.name,
      target: newSummary.target,
      summary: newSummary.summary,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    dispatch({
      type: 'ADD_SUMMARY',
      payload: summary
    });

    // Update the current summary in basics
    updateBasicsSummary(newSummary.summary);

    setNewSummary({ name: '', target: '', summary: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Summary Created",
      description: `Created "${newSummary.name}" summary and applied it to your resume.`
    });
  };

  const handleUpdateSummary = () => {
    if (!editingSummary || !newSummary.name.trim() || !newSummary.target.trim() || !newSummary.summary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to update the summary.",
        variant: "destructive"
      });
      return;
    }

    const updatedSummary: NamedSummary = {
      ...editingSummary,
      name: newSummary.name,
      target: newSummary.target,
      summary: newSummary.summary,
      lastUsed: new Date().toISOString()
    };

    dispatch({
      type: 'UPDATE_SUMMARY',
      payload: updatedSummary
    });

    // If this is the active summary, update basics
    if (activeSummaryId === editingSummary.id) {
      updateBasicsSummary(newSummary.summary);
    }

    setEditingSummary(null);
    setNewSummary({ name: '', target: '', summary: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Summary Updated",
      description: `Updated "${newSummary.name}" summary.`
    });
  };

  const handleSelectSummary = (summaryId: string) => {
    const summary = summaries.find(s => s.id === summaryId);
    if (summary) {
      dispatch({
        type: 'SET_ACTIVE_SUMMARY',
        payload: summaryId
      });
      
      updateBasicsSummary(summary.summary);

      // Update last used timestamp
      dispatch({
        type: 'UPDATE_SUMMARY',
        payload: { ...summary, lastUsed: new Date().toISOString() }
      });

      toast({
        title: "Summary Applied",
        description: `Applied "${summary.name}" summary to your resume.`
      });
    }
  };

  const handleDeleteSummary = (summaryId: string) => {
    const summary = summaries.find(s => s.id === summaryId);
    if (summary) {
      dispatch({
        type: 'DELETE_SUMMARY',
        payload: summaryId
      });

      // If this was the active summary, clear the active summary
      if (activeSummaryId === summaryId) {
        dispatch({
          type: 'SET_ACTIVE_SUMMARY',
          payload: undefined
        });
      }

      toast({
        title: "Summary Deleted",
        description: `Deleted "${summary.name}" summary.`
      });
    }
  };

  const startEdit = (summary: NamedSummary) => {
    setEditingSummary(summary);
    setNewSummary({
      name: summary.name,
      target: summary.target,
      summary: summary.summary
    });
    setIsDialogOpen(true);
  };

  const resetDialog = () => {
    setEditingSummary(null);
    setNewSummary({ name: '', target: '', summary: '' });
    setIsDialogOpen(false);
  };

  return (
    <Card data-testid="summary-selector">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Summary</span>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={resetDialog}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="add-summary-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Named Summary
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSummary ? 'Edit Named Summary' : 'Create Named Summary'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="summary-name">Summary Name</Label>
                  <Input
                    id="summary-name"
                    value={newSummary.name}
                    onChange={(e) => setNewSummary({ ...newSummary, name: e.target.value })}
                    placeholder="e.g., 'Tech Startup Focus', 'Enterprise Sales Role'"
                    data-testid="summary-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="summary-target">Target Role/Company</Label>
                  <Input
                    id="summary-target"
                    value={newSummary.target}
                    onChange={(e) => setNewSummary({ ...newSummary, target: e.target.value })}
                    placeholder="e.g., 'Senior Software Engineer at Tech Startups'"
                    data-testid="summary-target-input"
                  />
                </div>
                <div>
                  <Label htmlFor="summary-text">Summary</Label>
                  <Textarea
                    id="summary-text"
                    value={newSummary.summary}
                    onChange={(e) => setNewSummary({ ...newSummary, summary: e.target.value })}
                    placeholder="Write your targeted professional summary..."
                    rows={4}
                    data-testid="summary-text-input"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={resetDialog}>
                    Cancel
                  </Button>
                  <Button onClick={editingSummary ? handleUpdateSummary : handleCreateSummary}>
                    {editingSummary ? 'Update Summary' : 'Create Summary'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="direct" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="direct">
              <FileText className="w-4 h-4 mr-2" />
              Direct Edit
            </TabsTrigger>
            <TabsTrigger value="named">
              <Target className="w-4 h-4 mr-2" />
              Named Summaries ({summaries.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="direct" className="space-y-4">
            <div>
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={basics.summary}
                onChange={(e) => updateBasicsSummary(e.target.value)}
                placeholder="Brief professional summary highlighting your key strengths and experience..."
                rows={4}
                spellCheck={true}
                data-testid="summary-input"
              />
              <p className="text-sm text-gray-500 mt-2">
                Edit your summary directly or use named summaries for different target roles.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="named" className="space-y-4">
            {summaries.length > 0 ? (
              <>
                <div>
                  <Label>Select Active Summary</Label>
                  <Select value={activeSummaryId || ''} onValueChange={handleSelectSummary}>
                    <SelectTrigger data-testid="summary-selector-dropdown">
                      <SelectValue placeholder="Choose a summary to apply" />
                    </SelectTrigger>
                    <SelectContent>
                      {summaries.map((summary) => (
                        <SelectItem key={summary.id} value={summary.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{summary.name}</span>
                            <span className="text-sm text-gray-500">{summary.target}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {activeSummary && (
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-900">Active: {activeSummary.name}</p>
                    <p className="text-sm text-blue-700">{activeSummary.target}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Manage Named Summaries</Label>
                  <div className="space-y-2">
                    {summaries.map((summary) => (
                      <div key={summary.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{summary.name}</p>
                          <p className="text-sm text-gray-500">{summary.target}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(summary)}
                            data-testid={`edit-summary-${summary.id}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSummary(summary.id)}
                            className="text-red-600 hover:text-red-700"
                            data-testid={`delete-summary-${summary.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">No named summaries created yet</p>
                <p className="text-sm">Create targeted summaries for different roles or companies</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
