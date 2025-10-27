'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { 
  ShieldCheck, 
  Atom, 
  ArrowLeftRight, 
  CheckCircle2, 
  Coins, 
  Scale, 
  Building2,
  Lock
} from 'lucide-react'

// Copy content - easy to edit
const content = {
  title: "How it works",
  subtitle: "Three simple steps to unlock value hidden in your holdings.",
  steps: [
    {
      id: 1,
      title: "Deposit SPY or GOOGL",
      description: "Deposit SPY or GOOGL into a regulated, tokenized custody rail (offshore)",
      icon: ShieldCheck,
      badge: Lock,
      bullets: [
        { icon: ShieldCheck, text: "Custodied shares" },
        { icon: Building2, text: "Offshore SPV" },
        { icon: CheckCircle2, text: "Proof of reserves" }
      ]
    },
    {
      id: 2,
      title: "Mint component tokens",
      description: "Break apart your bundled asset into individual component tokens",
      icon: Atom,
      badge: Coins,
      bullets: [
        { icon: Atom, text: "SPY → AAPL/MSFT/NVDA/…" },
        { icon: Atom, text: "GOOGL → YT/SEARCH/CLOUD" },
        { icon: Scale, text: "1:1 mint at NAV" }
      ]
    },
    {
      id: 3,
      title: "Trade or Redeem freely",
      description: "Trade individual components or burn them back to reclaim the original asset",
      icon: ArrowLeftRight,
      badge: ArrowLeftRight,
      bullets: [
        { icon: ArrowLeftRight, text: "Free trading" },
        { icon: ArrowLeftRight, text: "Burn to redeem" },
        { icon: Scale, text: "Arb keeps parity" }
      ]
    }
  ]
}

interface StepCardProps {
  step: typeof content.steps[0]
  index: number
  isExpanded?: boolean
  onToggle?: () => void
  isMobile?: boolean
}

function StepCard({ step, index, isExpanded = false, onToggle, isMobile = false }: StepCardProps) {
  const IconComponent = step.icon
  const BadgeComponent = step.badge
  const shouldReduceMotion = useReducedMotion()

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 16 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.12
      }
    }
  }

  const hoverVariants = {
    hover: {
      scale: shouldReduceMotion ? 1 : 1.01,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={hoverVariants}
      viewport={{ once: true, margin: "-100px" }}
      className={`
        relative group cursor-pointer
        ${isMobile ? 'w-full' : 'flex-1'}
        ${isMobile && !isExpanded ? 'opacity-60' : ''}
      `}
      onClick={isMobile ? onToggle : undefined}
    >
      {/* Glass panel */}
      <div className={`
        relative bg-white dark:bg-slate-900/40 
        rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50
        p-8 backdrop-blur-sm
        transition-all duration-300
        group-hover:shadow-xl group-hover:border-gray-300/70 dark:group-hover:border-slate-600/70
        ${step.id === 3 ? 'ring-2 ring-blue-100 dark:ring-blue-900/30' : ''}
      `}>
        {/* Step chip */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="
            w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400
            flex items-center justify-center text-white font-bold text-sm
            shadow-lg
          ">
            {step.id}
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="
            w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400
            flex items-center justify-center text-white
            shadow-lg
          ">
            <IconComponent size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-[40ch] mx-auto">
            {step.description}
          </p>
        </div>

        {/* Micro bullets */}
        <div className="mt-6 space-y-2">
          {step.bullets.map((bullet, bulletIndex) => {
            const BulletIcon = bullet.icon
            return (
              <div key={bulletIndex} className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <BulletIcon size={12} />
                <span className="font-medium">{bullet.text}</span>
              </div>
            )
          })}
        </div>

        {/* Special visual for step 1 - Deposit process */}
        {step.id === 1 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Deposit Process</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="w-12 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-blue-800 text-xs font-bold">SPY</span>
                  </div>
                  <span className="text-xs text-gray-600">Your Asset</span>
                </div>
                <div className="text-gray-400 text-lg">→</div>
                <div className="text-center">
                  <div className="w-12 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-green-800 text-xs font-bold">🔒</span>
                  </div>
                  <span className="text-xs text-gray-600">Custody</span>
                </div>
                <div className="text-gray-400 text-lg">→</div>
                <div className="text-center">
                  <div className="w-12 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                    <span className="text-purple-800 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-xs text-gray-600">Secured</span>
                </div>
              </div>
              <div className="text-center text-xs text-gray-500">
                Offshore SPV • Regulated Custody • Proof of Reserves
              </div>
            </div>
          </div>
        )}

        {/* Special visual for step 2 - Component breakdown */}
        {step.id === 2 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Breakdown Process</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">SPY ($500)</span>
                <span className="text-gray-400">→</span>
                <div className="flex gap-1">
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">AAPL</div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">MSFT</div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">NVDA</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">GOOGL ($150)</span>
                <span className="text-gray-400">→</span>
                <div className="flex gap-1">
                  <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">YT</div>
                  <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">SEARCH</div>
                  <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">CLOUD</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Special visual for step 3 - Component flow */}
        {step.id === 3 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Component Flow</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">SPY</div>
              <div className="text-gray-400 text-xs">→</div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">AAPL</div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">MSFT</div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">NVDA</div>
              <div className="text-gray-400 text-xs">→</div>
              <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">BURN</div>
              <div className="text-gray-400 text-xs">→</div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">SPY</div>
            </div>
          </div>
        )}

        {/* Mobile expand indicator */}
        {isMobile && (
          <div className="absolute top-4 right-4">
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center
              transition-colors duration-200
              ${isExpanded ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}
            `}>
              <div className={`
                w-2 h-2 rounded-full
                transition-colors duration-200
                ${isExpanded ? 'bg-blue-600' : 'bg-gray-400'}
              `} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface HowItWorksProps {
  variant?: 'horizontal' | 'vertical'
  onCtaClick?: () => void
}

export default function HowItWorks({ variant, onCtaClick }: HowItWorksProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedStep, setExpandedStep] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleStepToggle = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? 0 : stepId)
  }

  // SVG illustration for desktop
  const ProcessIllustration = () => (
    <div className="hidden xl:block absolute right-8 top-1/2 transform -translate-y-1/2">
      <svg width="240" height="140" viewBox="0 0 240 140" className="opacity-70">
        <defs>
          <linearGradient id="tokenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="componentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        
        {/* Parent token - SPY */}
        <rect x="20" y="50" width="50" height="25" rx="12" fill="url(#tokenGradient)" stroke="#1e40af" strokeWidth="2"/>
        <text x="45" y="66" textAnchor="middle" className="text-sm fill-white font-bold">SPY</text>
        
        {/* Arrow to split */}
        <path d="M80 62 L100 62" stroke="#6366f1" strokeWidth="3" markerEnd="url(#arrowhead)" />
        <text x="90" y="55" textAnchor="middle" className="text-xs fill-gray-600 font-semibold">BREAK</text>
        
        {/* Split tokens - Components */}
        <rect x="110" y="20" width="35" height="18" rx="9" fill="url(#componentGradient)" stroke="#059669" strokeWidth="1"/>
        <text x="127" y="32" textAnchor="middle" className="text-xs fill-white font-bold">AAPL</text>
        
        <rect x="110" y="45" width="35" height="18" rx="9" fill="url(#componentGradient)" stroke="#059669" strokeWidth="1"/>
        <text x="127" y="57" textAnchor="middle" className="text-xs fill-white font-bold">MSFT</text>
        
        <rect x="110" y="70" width="35" height="18" rx="9" fill="url(#componentGradient)" stroke="#059669" strokeWidth="1"/>
        <text x="127" y="82" textAnchor="middle" className="text-xs fill-white font-bold">NVDA</text>
        
        <rect x="110" y="95" width="35" height="18" rx="9" fill="url(#componentGradient)" stroke="#059669" strokeWidth="1"/>
        <text x="127" y="107" textAnchor="middle" className="text-xs fill-white font-bold">REST</text>
        
        {/* Arrow to recombine */}
        <path d="M155 62 L175 62" stroke="#6366f1" strokeWidth="3" markerEnd="url(#arrowhead)" />
        <text x="165" y="55" textAnchor="middle" className="text-xs fill-gray-600 font-semibold">BURN</text>
        
        {/* Recombined token */}
        <rect x="185" y="50" width="50" height="25" rx="12" fill="url(#tokenGradient)" stroke="#1e40af" strokeWidth="2"/>
        <text x="210" y="66" textAnchor="middle" className="text-sm fill-white font-bold">SPY</text>
        
        {/* Labels */}
        <text x="45" y="45" textAnchor="middle" className="text-xs fill-gray-500 font-medium">Deposit</text>
        <text x="127" y="10" textAnchor="middle" className="text-xs fill-gray-500 font-medium">Components</text>
        <text x="210" y="45" textAnchor="middle" className="text-xs fill-gray-500 font-medium">Redeem</text>
        
        {/* Arrow marker definition */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
          </marker>
        </defs>
      </svg>
    </div>
  )

  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Steps Container */}
        <div ref={containerRef} className="relative">
          {isMobile ? (
            /* Mobile: Vertical Timeline */
            <div className="space-y-8">
              {content.steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Vertical connector line */}
                  {index < content.steps.length - 1 && (
                    <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-indigo-500 to-cyan-400 opacity-30" />
                  )}
                  
                  <StepCard
                    step={step}
                    index={index}
                    isExpanded={expandedStep === step.id}
                    onToggle={() => handleStepToggle(step.id)}
                    isMobile={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Desktop: Horizontal Timeline */
            <div className="flex items-start space-x-8 relative">
              {/* Horizontal connector line */}
              <div className="absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 opacity-30">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 1.5, delay: 0.5 }}
                  style={{ originX: 0 }}
                />
              </div>

              {content.steps.map((step, index) => (
                <StepCard
                  key={step.id}
                  step={step}
                  index={index}
                  isMobile={false}
                />
              ))}

              {/* Process illustration */}
              <ProcessIllustration />
            </div>
          )}
        </div>

        {/* CTA Button */}
        {onCtaClick && (
          <div className="text-center mt-12">
            <button
              onClick={onCtaClick}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </section>
  )
}