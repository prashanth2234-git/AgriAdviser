import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Zap,
  Droplets,
  Layers,
  Bug,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { ADVISORY_DOMAINS, ADVISORY_DOMAIN_METADATA, AdvisoryDomain } from '@shared/constants';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const capabilities = [
    {
      title: 'Growth Phenology & Crop Suitability',
      description: 'Stage-by-stage agronomic guidance from germination to flowering and harvest maturity.',
      icon: Sprout,
      color: 'bg-agri-50 text-agri-600',
    },
    {
      title: 'Edaphic Soil Chemistry & Conditioning',
      description: 'Balancing soil pH, micronutrient lockups, and organic amendment strategies.',
      icon: Layers,
      color: 'bg-earth-100 text-earth-700',
    },
    {
      title: 'Precision Water & Irrigation Scheduling',
      description: 'Optimize water efficiency tailored to drip, furrow, sprinkler, and rainfed setups.',
      icon: Droplets,
      color: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Integrated Pest & Disease Management',
      description: 'Targeted bio-controls and threshold monitoring without dangerous chemical guesswork.',
      icon: Bug,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Input Field & Crop Context',
      desc: 'Enter your crop name, phenological stage, location, soil characteristics, and observed field symptoms.',
    },
    {
      step: '02',
      title: 'Gemini Agronomic Reasoning',
      desc: 'Our backend constructs a strict agricultural prompt combining your parameters with scientific decision-support bounds.',
    },
    {
      step: '03',
      title: 'Schema-Validated Output',
      desc: 'Zod verifies every recommendation, nutrient ratio, and risk assessment before storing in PostgreSQL.',
    },
    {
      step: '04',
      title: 'Prioritized Farmer Action Plan',
      desc: 'Receive clear immediate (24-48h), 7-day, and 30-day tasks formatted for easy practical execution.',
    },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-50 border border-agri-200 text-agri-800 text-xs font-semibold mb-6 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-agri-600 animate-pulse" />
            AI-Powered Agriculture Decision Support System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 max-w-4xl mx-auto leading-[1.15]">
            Smarter Farming Decisions with{' '}
            <span className="text-agri-600 underline decoration-agri-200 underline-offset-8">
              Reliable AI Agronomy
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Personalized, cautious, and structured crop advisory tailored to your exact soil type, irrigation,
            crop phenology, and symptoms. Zero guesswork. 100% actionable.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? '/advisory/new' : '/register'}>
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                {isAuthenticated ? 'Create New Advisory' : 'Start Free Advisory'}
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In to Dashboard
                </Button>
              </Link>
            )}
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-agri-600" />
              <span>Strict Zod Schema Validation</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-agri-600" />
              <span>Isolated PostgreSQL Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-agri-600" />
              <span>Server-Side Gemini Reasoning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Scientific Agronomy at Your Fingertips
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
            Built from the ground up to respect environmental sustainability, farmer economics, and biological thresholds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div key={cap.title} className="card p-6 flex flex-col justify-between hover:border-agri-300">
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cap.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-2">{cap.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{cap.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-100/60 py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-agri-700 tracking-wider uppercase">User Journey</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-1">
              How the Advisory Engine Operates
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              A transparent, safe, and reproducible workflow for precision agriculture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflowSteps.map((step) => (
              <div key={step.step} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm relative">
                <span className="text-3xl font-extrabold text-agri-600/30 mb-2 block">{step.step}</span>
                <h3 className="text-base font-bold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Domains Carousel/Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-agri-700 tracking-wider uppercase">Advisory Coverage</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-1">
            Supported Agronomic Domains
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Dynamic reasoning tailored to the specific problem facing your fields today.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {ADVISORY_DOMAINS.map((domain: AdvisoryDomain) => {
            const meta = ADVISORY_DOMAIN_METADATA[domain];
            return (
              <div
                key={domain}
                className="card p-4 text-center flex flex-col items-center justify-center hover:border-agri-300"
              >
                <div className="w-10 h-10 rounded-xl bg-agri-50 text-agri-700 flex items-center justify-center mb-2">
                  <Sprout className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-stone-900 leading-snug">{meta.label}</h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-agri-700 to-agri-900 text-white p-8 sm:p-14 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to safeguard your crop yield?
            </h2>
            <p className="text-xs sm:text-sm text-agri-100 leading-relaxed">
              Create your account in seconds and receive structured, prioritized crop advice for your farm today.
            </p>
            <div className="pt-4 flex justify-center">
              <Link to={isAuthenticated ? '/advisory/new' : '/register'}>
                <Button
                  size="lg"
                  className="bg-white text-agri-900 hover:bg-stone-100 shadow-md font-bold"
                  rightIcon={<ChevronRight className="w-5 h-5" />}
                >
                  {isAuthenticated ? 'Go to Advisory Form' : 'Register Farmer Account'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
