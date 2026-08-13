import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import {
  Zap, Brain, TrendingUp, Eye, Users, Activity, Shield,
  ArrowRight, Play, Send, X, Minus, Bot, Upload,
  BarChart2, BookOpen, ChevronRight, Lock, Cpu, CheckCircle
} from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Advanced deep learning models for accurate spine assessment' },
  { icon: TrendingUp, title: 'Longitudinal Monitoring', desc: 'Track progression and compare with previous clinical records' },
  { icon: Eye, title: 'Explainable AI', desc: 'Transparent predictions with visual explanations you can trust' },
  { icon: Activity, title: 'Continuous Learning', desc: 'Improves over time with doctor feedback and real-world data' },
]

const featureCards = [
  { icon: Upload, title: 'Upload & Analyze', desc: 'Upload X-ray or MRI scans and get AI-powered analysis within seconds.' },
  { icon: BarChart2, title: 'Severity Assessment', desc: 'Get severity grading and risk assessment with confidence scores.' },
  { icon: TrendingUp, title: 'Progression Tracking', desc: 'Compare with previous records and visualize disease progression.' },
  { icon: BookOpen, title: 'Clinical Reports', desc: 'Generate explainable reports with insights and recommendations.' },
  { icon: Brain, title: 'Knowledge Retrieval', desc: 'RAG-powered retrieval of similar cases, guidelines, and medical knowledge.' },
]

const stats = [
  { value: '5,000+', label: 'Patients Analyzed', sub: 'And growing every day', icon: Users },
  { value: '12,000+', label: 'Analyses Performed', sub: 'Across many hospitals', icon: Activity },
  { value: '95%+', label: 'AI Accuracy', sub: 'Validated by experts', icon: CheckCircle },
  { value: '100%', label: 'Data Security', sub: 'HIPAA Compliant', icon: Shield },
]

const suggestedQuestions = [
  'How does SpineLIT work?',
  'What types of scans can I upload?',
  'How accurate is the AI analysis?',
  'How is my data protected?',
  'Talk to a human',
]

const chatHistory = [
  { from: 'bot', text: "Hello! 👋\nI'm your SpineLIT assistant.\nHow can I help you today?", time: '10:30 AM' },
  { from: 'user', text: 'What is SpineLIT?', time: '10:31 AM' },
  { from: 'bot', text: 'SpineLIT is an AI-powered clinical decision support system that analyzes spine scans, assesses severity, monitors progression, and provides explainable insights to assist doctors in better clinical decisions.', time: '10:31 AM' },
]

const navLinks = ['Home', 'About', 'How It Works', 'Features', 'For Doctors', 'Resources', 'Contact']

export default function HomePage() {
  const [chatOpen, setChatOpen] = useState(true)
  const [chatMessage, setChatMessage] = useState('')

  return (
    <div className="min-h-screen font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="SpineLIT Logo" style={{ height: '60px' }} className="w-auto object-contain" />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link, i) => (
              <button
                key={link}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${i === 0
                  ? 'text-indigo-600 border-b-2 border-indigo-600 rounded-none'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="animate-fadeInUp">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-medium mb-6">
                <Zap size={12} className="text-indigo-500" />
                AI-Powered Clinical Decision Support
              </div>

              <h1 className="text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                Intelligent{' '}
                <span className="gradient-text">Spine Analysis.</span>
                <br />
                Better Clinical Decisions.
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-lg">
                SpineLIT uses advanced AI and explainable intelligence to analyze spine scans, assess severity, monitor progression, and assist doctors in making confident, data-driven decisions.
              </p>

              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 text-sm"
                >
                  <Zap size={16} /> Start Analysis <ArrowRight size={14} />
                </Link>
                <button className="inline-flex items-center gap-2 px-7 py-3.5 text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-700 transition-all text-sm">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Play size={10} className="text-indigo-600 ml-0.5" />
                  </div>
                  Learn More
                </button>
              </div>
            </div>

            {/* Right - Feature list + Spine image */}
            <div className="relative animate-fadeInUp delay-200">
              <div className="grid grid-cols-1 gap-3 mb-6">
                {features.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white shadow-sm card-lift">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-semibold text-sm">{title}</p>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label, sub, icon: Icon }, i) => (
              <div
                key={label}
                className={`flex items-center gap-4 p-5 rounded-2xl ${i === 0 ? 'bg-slate-50' : ''} animate-fadeInUp`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                  <p className="text-slate-700 text-sm font-semibold">{label}</p>
                  <p className="text-slate-400 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Powerful Features for Better Spine Care
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {featureCards.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 border border-slate-100 card-lift animate-fadeInUp shadow-sm"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-slate-900 font-semibold text-sm mb-2">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-10 px-6 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Lock size={22} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Secure. Compliant. Trusted.</h3>
              <p className="text-slate-400 text-sm mt-0.5">Your patient data is protected with enterprise-grade security and privacy standards.</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Shield size={18} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">HIPAA</p>
                <p className="text-slate-400 text-xs">Compliant</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Cpu size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AES-256</p>
                <p className="text-slate-400 text-xs">Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slideInRight">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0">
                <Bot size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">SpineLIT Assistant</p>
                <p className="text-indigo-100 text-[11px] font-medium mt-1">Your AI Healthcare Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft" />
              <span className="text-indigo-100 text-[11px] font-medium">Online</span>
              <button onClick={() => setChatOpen(false)} className="ml-1 text-indigo-100 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-3 max-h-64 overflow-y-auto bg-slate-50">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'items-start gap-2'}`}>
                {msg.from === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot size={15} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3.5 py-2.5 text-xs leading-relaxed ${msg.from === 'bot' ? 'chat-bubble-bot text-slate-800 font-medium' : 'chat-bubble-user font-medium'}`}>
                  {msg.text.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                  <p className={`text-[9px] mt-1 ${msg.from === 'bot' ? 'text-slate-400' : 'text-indigo-200'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-slate-100 bg-white flex items-center gap-2">
            <input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-slate-50"
            />
            <button className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md hover:bg-indigo-700 transition-all">
              <Send size={13} className="text-white" />
            </button>
          </div>
          <p className="text-center text-[9px] text-slate-400 pb-2 bg-white">
            This AI assistant can make mistakes. Please verify important information.
          </p>
        </div>
      )}

      {/* Chat toggle when closed */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-indigo-600 border-2 border-white shadow-xl shadow-indigo-500/40 flex items-center justify-center hover:scale-105 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
            <Bot size={22} className="text-indigo-600" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">3</span>
        </button>
      )}
    </div>
  )
}
