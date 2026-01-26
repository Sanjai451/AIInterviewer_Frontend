import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Brain, ArrowRight, Users, FileText, MessageSquare, Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center glow-sm">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl">AI Interviewer</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button >Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="glow-sm">Get Started</Button>
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Intelligent Technical
              <span className="gradient-text"> Interviews</span>
              <br />Powered by AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline your hiring process with AI-driven technical assessments. 
              Evaluate candidates efficiently with MCQ tests and in-depth interviews.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button  className="glow">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Technical Hiring
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl glass">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">MCQ Assessments</h3>
              <p className="text-muted-foreground text-sm">
                Automated multiple-choice tests with instant scoring and detailed analytics.
              </p>
            </div>
            <div className="p-6 rounded-2xl glass">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">In-Person Interviews</h3>
              <p className="text-muted-foreground text-sm">
                Open-ended questions to evaluate problem-solving and communication skills.
              </p>
            </div>
            <div className="p-6 rounded-2xl glass">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Role-Based Access</h3>
              <p className="text-muted-foreground text-sm">
                Separate dashboards for HR and candidates with appropriate permissions.
              </p>
            </div>
            <div className="p-6 rounded-2xl glass">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Environment</h3>
              <p className="text-muted-foreground text-sm">
                Fullscreen mode with anti-cheating measures for fair assessments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join companies that are already using AI Interviewer to find the best technical talent.
          </p>
          <Link to="/register">
            <Button  className="glow">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 AI Interviewer. Built for Final Year Project.</p>
        </div>
      </footer>
    </div>
  );
}
