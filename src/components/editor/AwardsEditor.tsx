
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { Award } from "@/types/resume";

const AwardsEditor = () => {
  const { state, dispatch } = useResume();

  const addAward = () => {
    const newAward: Award = {
      title: "",
      date: "",
      awarder: "",
      summary: "",
      visible: true
    };
    dispatch({ type: 'ADD_AWARD', payload: newAward });
  };

  const updateAward = (index: number, field: keyof Award, value: any) => {
    dispatch({ 
      type: 'UPDATE_AWARD', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeAward = (index: number) => {
    dispatch({ type: 'REMOVE_AWARD', payload: index });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Awards & Honors</h2>
        <Button onClick={addAward} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Award</span>
        </Button>
      </div>

      {state.resumeData.awards.map((award, index) => (
        <Card key={index} className="relative">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {award.title || `Award ${index + 1}`}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateAward(index, 'visible', !award.visible)}
                  className="flex items-center space-x-1"
                >
                  {award.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAward(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`award-title-${index}`}>Award Title</Label>
                <Input
                  id={`award-title-${index}`}
                  value={award.title}
                  onChange={(e) => updateAward(index, 'title', e.target.value)}
                  placeholder="Employee of the Year"
                />
              </div>
              <div>
                <Label htmlFor={`award-date-${index}`}>Date Received</Label>
                <Input
                  id={`award-date-${index}`}
                  type="date"
                  value={award.date}
                  onChange={(e) => updateAward(index, 'date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`award-awarder-${index}`}>Awarded By</Label>
              <Input
                id={`award-awarder-${index}`}
                value={award.awarder}
                onChange={(e) => updateAward(index, 'awarder', e.target.value)}
                placeholder="Company Name or Organization"
              />
            </div>

            <div>
              <Label htmlFor={`award-summary-${index}`}>Summary</Label>
              <Textarea
                id={`award-summary-${index}`}
                value={award.summary}
                onChange={(e) => updateAward(index, 'summary', e.target.value)}
                placeholder="Brief description of the award and why it was received..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {state.resumeData.awards.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500 mb-4">No awards added yet</p>
            <Button onClick={addAward} className="flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Add Your First Award</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AwardsEditor;
