import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Brain,
  ArrowRight,
  Users,
  FileText,
  MessageSquare,
  Shield
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050B14] via-[#070F1E] to-[#050B14] text-white">
      {/* HERO */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
        <div className="absolute top-1/3 left-1/4 w-[30rem] h-[30rem] bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-20 relative">
          {/* NAVBAR */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-bold text-xl tracking-wide">
                AI Interviewer
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button className="bg-transparent border border-white/20 hover:bg-white/10 text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>

          {/* HERO CONTENT */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Intelligent Technical
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {' '}Interviews
              </span>
              <br />
              Powered by AI
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Streamline your hiring process with AI-driven technical assessments.
              Evaluate candidates efficiently using MCQs and in-depth interviews.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link to="/register">
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 shadow-xl">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link to="/login">
                <Button className="bg-transparent border border-white/20 hover:bg-white/10 text-white px-6 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need for Technical Hiring
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                MCQ Assessments
              </h3>
              <p className="text-white/60 text-sm">
                Automated multiple-choice tests with instant scoring and analytics.
              </p>
            </div>

            {/* Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                In-Person Interviews
              </h3>
              <p className="text-white/60 text-sm">
                Open-ended questions to evaluate problem-solving and communication.
              </p>
            </div>

            {/* Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Role-Based Access
              </h3>
              <p className="text-white/60 text-sm">
                Separate dashboards for HR and candidates with scalable roles.
              </p>
            </div>

            {/* Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Secure Environment
              </h3>
              <p className="text-white/60 text-sm">
                Fullscreen mode with anti-cheating controls for fairness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Join companies using AI Interviewer to hire smarter and faster.
          </p>

          <Link to="/register">
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 shadow-xl">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/50 text-sm">
          © 2025 AI Interviewer. Built for Final Year Project.
        </div>
      </footer>
    </div>
  );
}
