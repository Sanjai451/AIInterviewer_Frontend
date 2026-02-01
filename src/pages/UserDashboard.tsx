import { useAuth } from '../contexts/AuthContext';
import { useInterview } from '../contexts/InterviewContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Brain, 
  LogOut, 
  Clock, 
  FileText, 
  MessageSquare, 
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { getInterviewsForUser } = useInterview();
  const navigate = useNavigate();

  const interviews = user ? getInterviewsForUser(user.id) : [];
  const pendingInterviews = interviews.filter(i => i.status === 'pending');
  const completedInterviews = interviews.filter(i => i.status === 'completed');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const startInterview = (interviewId: string, type: string) => {
    navigate(`/interview/${type}/${interviewId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="border border-yellow-500 text-yellow-500 bg-transparent">Pending</Badge>;
      case 'completed':
        return <Badge className="border border-green-500 text-green-500 bg-transparent">Completed</Badge>;
      case 'in-progress':
        return <Badge className="border border-blue-500 text-blue-500 bg-transparent">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-50 to-slate-50 text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="font-semibold">AI Interviewer</h1>
              <p className="text-xs text-gray-500">Candidate Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Button onClick={handleLogout} className="h-10 w-10 p-0">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingInterviews.length}</p>
                  <p className="text-sm text-gray-500">Pending Interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedInterviews.length}</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{interviews.length}</p>
                  <p className="text-sm text-gray-500">Total Assigned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Interviews */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Your Interviews</h2>
          {interviews.length === 0 ? (
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">No interviews assigned yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {interviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {interview.type === 'mcq' ? (
                          <FileText className="h-5 w-5 text-blue-600" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-blue-600" />
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
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {interview.duration} mins
                        </span>
                        <span>{interview.totalQuestions} Questions</span>
                        <Badge className="border border-gray-200 bg-white text-gray-700">
                          {interview.type === 'mcq' ? 'MCQ' : 'In-Person'}
                        </Badge>
                      </div>

                      {interview.status === 'pending' && (
                        <Button
                          onClick={() => startInterview(interview.id, interview.type)}
                          className="shadow-sm hover:shadow-md"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start Interview
                        </Button>
                      )}

                      {interview.status === 'completed' && (
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">
                            {interview.score}/{interview.maxScore}
                          </p>
                          <p className="text-xs text-gray-500">Score</p>
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
