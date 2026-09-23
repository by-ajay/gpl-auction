import React, { useState } from 'react';
import { RULES_LIST } from '../data/eventData';
import {
  Coins,
  Megaphone,
  Lock,
  TrendingUp,
  Calculator,
  BotOff,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Coins,
  Megaphone,
  Lock,
  TrendingUp,
  Calculator,
  BotOff,
};

interface RulesSectionProps {
  isDarkMode: boolean;
  overallBudget?: number;
}

export const RulesSection: React.FC<RulesSectionProps> = ({ isDarkMode, overallBudget = 1000000 }) => {
  const [activeRuleNumber, setActiveRuleNumber] = useState<number | null>(null);

  return (
    <section
      id="rules"
      className={`py-24 relative border-b overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#03130c] border-emerald-950/60 text-slate-200' : 'bg-[#f0fbf4] border-emerald-200/80 text-slate-800'
      }`}
    >
      {/* Background blueprint elements */}
      <div className="absolute inset-0 bg-blueprint-fine opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Space_Mono'] uppercase tracking-wider mb-4 border ${
              isDarkMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>AUCTION PROTOCOLS • ALLOCATED BUDGET: ₹{overallBudget.toLocaleString()}</span>
          </div>

          <h2
            className={`font-['Chakra_Petch'] font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            HOW IT WORKS & OFFICIAL RULES
          </h2>
          <p className="text-base text-slate-400 font-sans leading-relaxed">
            Core principles governing the auction floor and strategic decision-making. Review each rule thoroughly before bidding starts.
          </p>
        </div>

        {/* Rules Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RULES_LIST.map((rule) => {
            const Icon = iconMap[rule.iconName] || ShieldCheck;

            return (
              <div
                key={rule.number}
                id={`rule-step-${rule.number}`}
                onMouseEnter={() => setActiveRuleNumber(rule.number)}
                onMouseLeave={() => setActiveRuleNumber(null)}
                className={`group relative rounded-2xl p-6 transition-all duration-300 border flex flex-col justify-between hover:-translate-y-1 ${
                  rule.highlight
                    ? isDarkMode
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-emerald-50/60 border-emerald-400 shadow-md'
                    : isDarkMode
                    ? 'bg-[#041d13]/70 border-emerald-950 hover:border-emerald-800/80 hover:bg-[#072418]'
                    : 'bg-white border-emerald-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar: Step Number & Icon */}
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700/30">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 font-mono font-bold text-xs flex items-center justify-center">
                        0{rule.number}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">RULE</span>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        rule.highlight
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-300 group-hover:text-emerald-400'
                          : 'bg-slate-100 text-slate-700 group-hover:text-emerald-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-['Chakra_Petch'] font-bold text-lg uppercase tracking-wide mb-2 group-hover:text-emerald-500 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {rule.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                    {rule.description}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="mt-5 pt-3 border-t border-slate-700/30 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>STEP 0{rule.number} OF 06</span>
                  {rule.highlight && (
                    <span className="text-emerald-500 font-bold uppercase tracking-wider">
                      ETHICAL MANDATE
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Prohibition Callout */}
        <div
          className={`mt-12 rounded-2xl border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDarkMode
              ? 'bg-[#041a12]/80 border-cyan-500/40 text-slate-200'
              : 'bg-cyan-50/70 border-cyan-300 text-slate-800'
          }`}
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1 sm:mt-0">
              <BotOff className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  CRITICAL MANDATE: ZERO AI ASSISTANCE
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">• Pure Human Strategic Thinking</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-sans">
                Generative AI tools (ChatGPT, Claude, Gemini, etc.) are strictly prohibited during the event. Teams will be disqualified if AI output is detected. The competition values authentic human empathy, civic insight, and strategic collaboration.
              </p>
            </div>
          </div>

          <div
            className={`shrink-0 flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-950 text-emerald-400 border-emerald-900/60'
                : 'bg-white text-emerald-700 border-emerald-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Event Proctors Verify Compliance</span>
          </div>
        </div>
      </div>
    </section>
  );
};
