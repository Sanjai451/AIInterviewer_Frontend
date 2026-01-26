import { useState, useEffect, useCallback, type Key } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { 
  Brain, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export default function MCQInterview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { interviews, getMCQQuestions, updateInterviewStatus } = useInterview();
  
  const interview = interviews.find(i => i.id === id);
  const questions = getMCQQuestions();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState((interview?.duration || 30) * 60);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const calculateScore = useCallback(() => {
    let totalScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        totalScore += q.points;
      }
    });
    return totalScore;
  }, [answers, questions]);

  const maxScore = questions.reduce((acc, q) => acc + q.points, 0);

  const submitInterview = useCallback(() => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsCompleted(true);
    
    if (id) {
      updateInterviewStatus(id, 'completed', finalScore, maxScore);
    }
  }, [calculateScore, id, maxScore, updateInterviewStatus]);

  // Timer
  useEffect(() => {
    if (!isStarted || isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          submitInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isStarted, isCompleted, submitInterview]);

  // Fullscreen handling
  useEffect(() => {
    if (isStarted && !isCompleted) {
      document.documentElement.requestFullscreen?.();
    }
    
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
  }, [isStarted, isCompleted]);

  // Prevent tab switching
  useEffect(() => {
    if (!isStarted || isCompleted) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Could add warning or auto-submit here
        console.warn('Tab switching detected!');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isStarted, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Interview not found</p>
      </div>
    );
  }

  // Start screen
  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="glass max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{interview.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-center">{interview.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-2xl font-bold">{questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary">
                <p className="text-2xl font-bold">{interview.duration}</p>
                <p className="text-sm text-muted-foreground">Minutes</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Important Instructions</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• This is a single-attempt interview</li>
                <li>• The test will run in fullscreen mode</li>
                <li>• Do not switch tabs or exit fullscreen</li>
                <li>• Auto-submit on timer expiry</li>
              </ul>
            </div>
            
            <Button onClick={() => setIsStarted(true)} className="w-full glow" >
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completion screen
  if (isCompleted) {
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="glass max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Interview Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-5xl font-bold gradient-text">{percentage}%</p>
              <p className="text-muted-foreground mt-2">
                You scored {score} out of {maxScore} points
              </p>
            </div>
            
            <Progress value={percentage} className="h-3" />
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-green-500/10">
                <p className="text-2xl font-bold text-green-500">
                  {answers.filter((a, i) => a === questions[i].correctAnswer).length}
                </p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10">
                <p className="text-2xl font-bold text-destructive">
                  {answers.filter((a, i) => a !== questions[i].correctAnswer).length}
                </p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
            </div>
            
            <Button onClick={() => navigate('/user/dashboard')} className="w-full" >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Interview screen
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="interview-fullscreen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-semibold">{interview.title}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 60 ? 'bg-destructive/20 text-destructive' : 'bg-secondary'}`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="px-6 py-3 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="glass max-w-2xl w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Question {currentQuestion + 1}</span>
              <span className="text-sm text-primary">{question.points} points</span>
            </div>
            <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion]?.toString() ?? ''}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {question.options.map((option: any, idx: Key) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${
                    answers[currentQuestion] === idx ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => handleAnswer(idx.toString())}
                >
                  <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                  <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  idx === currentQuestion
                    ? 'bg-primary text-primary-foreground'
                    : answers[idx] !== null
                    ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          {currentQuestion === questions.length - 1 ? (
            <Button onClick={submitInterview} className="glow">
              Submit Interview
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
