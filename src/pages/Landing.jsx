import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Clock, BarChart, MessageSquare, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page fade-in">
      <Navbar />
      
      <main>
        <section className="hero-section">
          <div className="hero-glow-orb"></div>
          <div className="hero-container slide-up">
            <h1 className="hero-title">
              Smart Issue Tracking for a <br/><span className="text-highlight text-gradient text-glow">Better Campus</span>
            </h1>
            <p className="hero-subtitle">
              A transparent, accountable, and efficient way to submit and track complaints at Adama Science and Technology University.
            </p>
            <div className="hero-actions">
              <NavLink to="/register">
                <Button size="lg" variant="primary">
                  Get Started <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </Button>
              </NavLink>
              <NavLink to="/login">
                <Button size="lg" variant="secondary">Login</Button>
              </NavLink>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="features-section" id="features">
          <div className="section-container">
            <div className="section-header">
              <h2>Why use ASTU Tracker?</h2>
              <p>Designed to provide a seamless experience for students and staff alike.</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card glass-panel">
                <div className="feature-icon-wrapper neon-glow">
                  <ShieldCheck size={28} className="feature-icon" />
                </div>
                <h3>Transparent Workflow</h3>
                <p>Track your complaint every step of the way. Know exactly who is handling it and when it will be resolved.</p>
              </div>
              
              <div className="feature-card glass-panel">
                <div className="feature-icon-wrapper neon-glow">
                  <Clock size={28} className="feature-icon" />
                </div>
                <h3>Quick Resolution</h3>
                <p>Reduced bottlenecks mean faster fixes. Assigned staff get instant notifications for new issues.</p>
              </div>
              
              <div className="feature-card glass-panel">
                <div className="feature-icon-wrapper neon-glow">
                  <BarChart size={28} className="feature-icon" />
                </div>
                <h3>Data-Driven Insights</h3>
                <p>Admins can view detailed analytics to identify recurring problems and improve campus facilities.</p>
              </div>
              
              <div className="feature-card glass-panel">
                <div className="feature-icon-wrapper neon-glow">
                  <MessageSquare size={28} className="feature-icon" />
                </div>
                <h3>AI Assistant</h3>
                <p>Get instant answers to common questions with our integrated AI support chatbot.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="how-it-works-section">
          <div className="section-container">
            <div className="section-header">
              <h2>How It Works</h2>
              <p>Three simple steps to resolve your issues.</p>
            </div>
            
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <h3>Submit Complaint</h3>
                <p>Log in and fill out a quick form describing your issue. You can even attach photos or PDFs.</p>
              </div>
              <div className="step-connector"></div>
              <div className="step-item">
                <div className="step-number">2</div>
                <h3>Staff Assigned</h3>
                <p>The system routes your ticket to the appropriate department and a staff member is assigned to fix it.</p>
              </div>
              <div className="step-connector"></div>
              <div className="step-item">
                <div className="step-number">3</div>
                <h3>Resolved</h3>
                <p>The issue is fixed, the status is updated to Resolved, and you get notified instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section relative overflow-hidden">
          <div className="hero-glow-orb" style={{ top: '50%', opacity: 0.5 }}></div>
          <div className="cta-container glass-panel relative z-10 p-12 rounded-2xl mx-auto max-w-4xl">
            <h2 className="text-gradient">Ready to make a difference?</h2>
            <p>Join the platform and help us improve our campus environment.</p>
            <NavLink to="/register">
              <Button size="lg" variant="primary">Create Student Account</Button>
            </NavLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
