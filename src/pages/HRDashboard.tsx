import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useInterview } from '../contexts/InterviewContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Brain, 
  LogOut, 
  Plus,
  Users,
  FileText, 
  MessageSquare, 
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

// import { InterviewType } from '../types';

type InterviewType = 'mcq' | 'in-person';

export default function HRDashboard() {
  const { user, logout } = useAuth();
  const { interviews, addInterview, getInterviewsCreatedBy } = useInterview();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<InterviewType>('mcq');
  const [duration, setDuration] = useState('30');
  const [assignedToEmail, setAssignedToEmail] = useState('');

  const myInterviews = user ? getInterviewsCreatedBy(user.id) : [];
  const completedInterviews = myInterviews.filter(i => i.status === 'completed');
  const pendingInterviews = myInterviews.filter(i => i.status === 'pending');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateInterview = () => {
    if (!user) return;
    
    addInterview({
      title,
      description,
      type,
      assignedTo: assignedToEmail, // In real app, this would be user ID lookup
      assignedBy: user.id,
      status: 'pending',
      duration: parseInt(duration),
      totalQuestions: type === 'mcq' ? 5 : 5,
    });
    
    setTitle('');
    setDescription('');
    setType('mcq');
    setDuration('30');
    setAssignedToEmail('');
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge className="border-green-500 text-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="border-primary text-primary">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const averageScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.reduce((acc, i) => acc + ((i.score || 0) / (i.maxScore || 1)) * 100, 0) / completedInterviews.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">AI Interviewer</h1>
              <p className="text-xs text-muted-foreground">HR Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="glow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Assign Interview
                </Button>
              </DialogTrigger>
              <DialogContent className="glass bg-gradient-to-r from-slate-50 to-slate-50">
                <DialogHeader>
                  <DialogTitle>Assign New Interview</DialogTitle>
                  <DialogDescription>Create and assign an interview to a candidate</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Interview Title</Label>
                    <Input
                      placeholder="Frontend Developer Assessment"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Brief description of the interview..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Interview Type</Label>
                      <Select value={type} onValueChange={(v: string) => setType(v as InterviewType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">MCQ Assessment</SelectItem>
                          <SelectItem value="in-person">In-Person Interview</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (mins)</Label>
                      <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Candidate Email</Label>
                    <Input
                      type="email"
                      placeholder="candidate@example.com"
                      value={assignedToEmail}
                      onChange={(e) => setAssignedToEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateInterview} className="w-full">
                    Create & Assign Interview
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myInterviews.length}</p>
                  <p className="text-muted-foreground text-sm">Total Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingInterviews.length}</p>
                  <p className="text-muted-foreground text-sm">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
          {/* <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedInterviews.length}</p>
                  <p className="text-muted-foreground text-sm">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                  <p className="text-muted-foreground text-sm">Avg. Score</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Interviews List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Interviews</h2>
          {myInterviews.length === 0 ? (
            <Card className="glass">
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No interviews created yet</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Interview
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myInterviews.map((interview) => (
                <Card key={interview.id} className="glass hover:glow-sm transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {interview.type === 'mcq' ? (
                          <FileText className="w-5 h-5 text-primary" />
                        ) : (
                          <MessageSquare className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <CardTitle className="text-lg">{interview.title}</CardTitle>
                          <CardDescription>{interview.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(interview.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {interview.duration} mins
                        </span>
                        <span>{interview.totalQuestions} Questions</span>
                        <Badge>
                          {interview.type === 'mcq' ? 'MCQ' : 'In-Person'}
                        </Badge>
                      </div>
                      {interview.status === 'completed' && (
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-500">
                            {interview.score}/{interview.maxScore}
                          </p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
