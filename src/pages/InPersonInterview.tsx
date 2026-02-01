import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { 
  Brain, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

export default function InPersonInterview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { interviews, getInPersonQuestions, updateInterviewStatus } = useInterview();
  
  const interview = interviews.find(i => i.id === id);
  const questions = getInPersonQuestions();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [timeLeft, setTimeLeft] = useState((interview?.duration || 45) * 60);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);


  const hasLeftTab = useRef(false);
  const warningCount = useRef(0);
  const tabSwitchTimer = useRef<number | null>(null);

  const forceTerminateInterview = useCallback(() => {
  setIsCompleted(true);
  setScore(0);

  if (id) {
    updateInterviewStatus(id, 'completed', 0, maxScore);
  }

  alert('Interview terminated due to malpractice.');
  navigate('/user/dashboard');
}, [id, navigate, updateInterviewStatus]);

useEffect(() => {
  if (!isStarted || isCompleted) return;

  const handleVisibilityChange = () => {
  if (document.hidden && isStarted && !isCompleted) {
    hasLeftTab.current = true;

    tabSwitchTimer.current = window.setTimeout(() => {
      forceTerminateInterview();
    }, 3000);
  }

  if (!document.hidden && hasLeftTab.current) {
    hasLeftTab.current = false;

    if (tabSwitchTimer.current) {
      clearTimeout(tabSwitchTimer.current);
      tabSwitchTimer.current = null;
    }

    warningCount.current += 1;

    if (warningCount.current <= 2) {
      alert(`Warning ${warningCount.current}/2: Do not switch tabs.`);
    } else {
      forceTerminateInterview();
    }
  }
};



  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (tabSwitchTimer.current) clearTimeout(tabSwitchTimer.current);
  };
}, [isStarted, isCompleted, forceTerminateInterview]);

useEffect(() => {
  if (!isStarted || isCompleted) return;

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      warningCount.current += 1;

      if (warningCount.current <= 2) {
        alert(`Warning ${warningCount.current}/2: Fullscreen exit detected.`);
        document.documentElement.requestFullscreen?.();
      } else {
        forceTerminateInterview();
      }
    }
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);

  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  };
}, [isStarted, isCompleted, forceTerminateInterview]);

useEffect(() => {
  if (!isStarted) return;

  // RESET malpractice tracking
  warningCount.current = 0;
  hasLeftTab.current = false;

  if (tabSwitchTimer.current) {
    clearTimeout(tabSwitchTimer.current);
    tabSwitchTimer.current = null;
  }
}, [isStarted]);

useEffect(() => {
  if (!isCompleted) return;

  warningCount.current = 0;

  if (tabSwitchTimer.current) {
    clearTimeout(tabSwitchTimer.current);
    tabSwitchTimer.current = null;
  }
}, [isCompleted]);



  const maxScore = questions.reduce((acc, q) => acc + q.points, 0);

  // Simple scoring based on answer length and keyword matching
  const calculateScore = useCallback(() => {
    let totalScore = 0;
    questions.forEach((q, idx) => {
      const answer = answers[idx].toLowerCase();
      const wordCount = answer.split(/\s+/).filter(w => w.length > 0).length;
      
      // Base score for having an answer (min words)
      if (wordCount >= 20) {
        let questionScore = q.points * 0.5; // Base 50% for effort
        
        // Bonus for expected topics mentioned
        const topicsFound = q.expectedTopics.filter((topic: string) => 
          answer.includes(topic.toLowerCase())
        ).length;
        const topicBonus = (topicsFound / q.expectedTopics.length) * (q.points * 0.5);
        questionScore += topicBonus;
        
        totalScore += Math.round(questionScore);
      }
    });
    return Math.min(totalScore, maxScore);
  }, [answers, questions, maxScore]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
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
              <MessageSquare className="w-8 h-8 text-primary" />
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
            
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-primary mb-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-semibold">Interview Format</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You will be asked open-ended questions. Provide detailed, thoughtful responses 
                that demonstrate your knowledge and experience.
              </p>
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
            
            <Button onClick={() => setIsStarted(true)} className="w-full glow">
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
                Estimated score: {score} out of {maxScore} points
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                (Final score will be reviewed by HR)
              </p>
            </div>
            
            <Progress value={percentage} className="h-3" />
            
            <div className="text-center p-4 rounded-lg bg-secondary">
              <p className="text-2xl font-bold">{questions.length}</p>
              <p className="text-sm text-muted-foreground">Questions Answered</p>
            </div>
            
            <Button onClick={() => navigate('/user/dashboard')} className="w-full">
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
  const wordCount = answers[currentQuestion].split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="interview-fullscreen flex flex-col ">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-semibold">{interview.title}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 120 ? 'bg-destructive/20 text-destructive' : 'bg-secondary'}`}>
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
      <main className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <Card className="glass max-w-3xl w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Question {currentQuestion + 1}</span>
              <span className="text-sm text-primary">{question.points} points</span>
            </div>
            <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your answer here... Be detailed and thorough in your response."
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswer(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Words: {wordCount}</span>
              <span className={wordCount < 20 ? 'text-yellow-500' : 'text-green-500'}>
                {wordCount < 20 ? 'Aim for at least 20 words' : 'Good length!'}
              </span>
            </div>
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
                    : answers[idx].length > 0
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
