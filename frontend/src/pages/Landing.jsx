import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import ChatWindow from '../components/chatbot/ChatWindow';
import { ShieldCheck, Clock, BarChart2, MessageSquare, ArrowRight } from 'lucide-react';
import './Landing.css';

const FEATURES = [
  { icon: ShieldCheck, title: 'Transparent Workflow', desc: 'Track your complaint every step of the way. Know exactly who is handling it and when it will be resolved.' },
  { icon: Clock,       title: 'Quick Resolution',    desc: 'Reduced bottlenecks mean faster fixes. Assigned staff get immediate access to new issues.' },
  { icon: BarChart2,  title: 'Data-Driven Insights', desc: 'Admins view detailed analytics to identify recurring problems and improve campus facilities.' },
  { icon: MessageSquare, title: 'AI Assistant',      desc: 'Get instant answers to common questions with our integrated RAG-powered chatbot.' },
];

const STEPS = [
  { n: '01', title: 'Submit',        desc: 'Log in and fill out a quick form describing your issue. Attach photos or PDFs as needed.' },
  { n: '02', title: 'Staff Assigned', desc: 'The system routes your ticket and a staff member is assigned to investigate.' },
  { n: '03', title: 'Resolved',      desc: 'The issue is fixed and status is updated. You have full visibility throughout.' },
];

const Landing = () => (
  <div className="landing fade-in">
    <Navbar />

    <main>
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content fade-in-up">
          <div className="landing-eyebrow">ASTU SMART COMPLAINT SYSTEM</div>
          <h1 className="landing-heading">
            Issue Tracking<br />for a Better Campus
          </h1>
          <p className="landing-subheading">
            A transparent, accountable, and efficient way to submit and track complaints
            at Adama Science and Technology University.
          </p>
          <div className="landing-cta-group">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started <ArrowRight size={14} style={{ marginLeft: 6 }} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section" id="features">
        <div className="landing-section-header">
          <div className="landing-eyebrow">CAPABILITIES</div>
          <h2>Why ASTU Tracker?</h2>
          <p>Designed to provide a seamless experience for students and staff alike.</p>
        </div>
        <div className="landing-grid">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div className="landing-card" key={title}>
              <div className="landing-card-icon">
                <Icon size={18} />
              </div>
              <h3 className="landing-card-title">{title}</h3>
              <p className="landing-card-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="landing-section">
        <div className="landing-section-header">
          <div className="landing-eyebrow">PROCESS</div>
          <h2>How It Works</h2>
          <p>Three simple steps to resolve your issues.</p>
        </div>
        <div className="landing-steps">
          {STEPS.map(({ n, title, desc }) => (
            <div className="landing-step" key={n}>
              <div className="landing-step-num">{n}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-section">
        <div className="landing-cta-card">
          <h2>Ready to make a difference?</h2>
          <p>Join the platform and help us improve our campus environment.</p>
          <Link to="/register">
            <Button variant="primary" size="lg">Create Account</Button>
          </Link>
        </div>
      </section>

      {/* AI Assistant — visible to all, auth-guarded on send */}
      <section className="landing-section" id="assistant">
        <div className="landing-section-header">
          <div className="landing-eyebrow">AI SUPPORT</div>
          <h2>Ask Our Assistant</h2>
          <p>Get instant answers about campus policies, complaint procedures, and more.</p>
        </div>
        <div className="landing-chat-wrapper">
          <ChatWindow />
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Landing;
