'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
  selector: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="sidebar-nav"]',
    title: 'Navigation',
    description:
      'Use the sidebar to switch between the Dashboard, Projects, and Landscape Analysis views.',
    position: 'right',
  },
  {
    selector: '[data-tour="dashboard-cards"]',
    title: 'Fund Health Metrics',
    description:
      'These cards show key portfolio metrics at a glance — total hectares, active projects, carbon impact, and more.',
    position: 'bottom',
  },
  {
    selector: '[data-tour="portfolio-map"]',
    title: 'Portfolio Map',
    description:
      'The interactive map shows all project locations. Click a marker to view project details.',
    position: 'top',
  },
  {
    selector: '[data-tour="project-table"]',
    title: 'Project Status',
    description:
      'Track every project\'s status, compliance, and key data points in this table. Click a row to drill into project details.',
    position: 'top',
  },
  {
    selector: '[data-tour="sidebar-projects"]',
    title: 'Project Quick-Nav',
    description:
      'Jump directly to any project profile using this expandable list in the sidebar.',
    position: 'right',
  },
  {
    selector: '[data-tour="header-actions"]',
    title: 'Notifications & Settings',
    description:
      'Check notifications and access settings here. The orange dot indicates unread alerts.',
    position: 'bottom',
  },
];

const STORAGE_KEY = 'ci-fund-tour-completed';

export function useTour() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      // small delay so the page renders first
      const t = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const startTour = useCallback(() => setShowTour(true), []);
  const endTour = useCallback(() => setShowTour(false), []);

  return { showTour, startTour, endTour };
}

interface GuidedTourProps {
  active: boolean;
  onEnd: () => void;
}

export default function GuidedTour({ active, onEnd }: GuidedTourProps) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[step];

  const measureTarget = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(currentStep.selector);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    measureTarget();
    const handleResize = () => measureTarget();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [active, step, measureTarget]);

  function finish() {
    localStorage.setItem(STORAGE_KEY, 'true');
    setStep(0);
    onEnd();
  }

  function next() {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  if (!active || !currentStep) return null;

  const pad = 8;
  const spotStyle = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : { top: '50%', left: '50%', width: 0, height: 0 };

  // Compute tooltip position
  function tooltipStyle(): React.CSSProperties {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    const gap = 16;
    const pos = currentStep.position || 'bottom';
    switch (pos) {
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + gap + pad,
          transform: 'translateY(-50%)',
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          right: window.innerWidth - rect.left + gap + pad,
          transform: 'translateY(-50%)',
        };
      case 'top':
        return {
          bottom: window.innerHeight - rect.top + gap + pad,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
      default:
        return {
          top: rect.bottom + gap + pad,
          left: rect.left + rect.width / 2,
          transform: 'translateX(-50%)',
        };
    }
  }

  return (
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: 'auto' }}>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={finish}
      />

      {/* Spotlight cutout */}
      {rect && (
        <div
          className="absolute rounded-[var(--radius-md)] transition-all duration-300 ease-out"
          style={{
            ...spotStyle,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.50)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute w-[320px] bg-ci-white rounded-[var(--radius-lg)] shadow-lg p-5 z-[10000] transition-all duration-300"
        style={{ ...tooltipStyle(), pointerEvents: 'auto' }}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-ci-green" />
            <span className="text-xs font-semibold text-ci-green uppercase tracking-wider">
              Step {step + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={finish}
            className="p-1 rounded-full hover:bg-ci-gray-100 transition-colors"
          >
            <X size={14} className="text-ci-gray-500" />
          </button>
        </div>

        <h3
          className="text-base font-bold text-ci-charcoal mb-1.5"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {currentStep.title}
        </h3>
        <p className="text-sm text-ci-gray-500 leading-relaxed mb-4">
          {currentStep.description}
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === step
                  ? 'w-6 bg-ci-green'
                  : i < step
                  ? 'w-1.5 bg-ci-green/40'
                  : 'w-1.5 bg-ci-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={finish}
            className="text-xs text-ci-gray-500 hover:text-ci-gray-700 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={prev}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-ci-gray-700 rounded-[var(--radius-md)] hover:bg-ci-gray-100 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <ChevronLeft size={14} />
                Back
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-1 px-4 py-1.5 text-sm font-semibold text-white bg-ci-green rounded-[var(--radius-md)] hover:bg-ci-green-dark transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {step === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
              {step < TOUR_STEPS.length - 1 && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
