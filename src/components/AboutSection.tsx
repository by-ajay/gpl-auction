import React from 'react';
import { HIGHLIGHT_CARDS } from '../data/eventData';
import { BrainCircuit, Gavel, Building2, CheckCircle2, Award, Leaf, Sprout, Trees } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BrainCircuit,
  Gavel,
  Building2,
};

interface AboutSectionProps {
  overallBudget?: number;
  isDarkMode: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ overallBudget = 1000000, isDarkMode }) => {
  return (
    <section
      id="about"
      className={`py-12 sm:py-16 relative border-b overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#04130d] border-emerald-950/60 text-slate-200' : 'bg-[#f4f9f5] border-emerald-200/80 text-slate-800'
      }`}
    >
      {/* Subtle blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-fine opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-['Space_Mono'] uppercase tracking-wider mb-4 border ${
              isDarkMode
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-emerald-100/80 border-emerald-300 text-emerald-800'
            }`}
          >
            <img
              src="/nss-logo.svg"
              alt="NSS Logo"
              className="w-4 h-4 object-contain rounded-full shrink-0"
            />
            <span>EVENT OVERVIEW // GREEN PREMIER LEAGUE</span>
          </div>

          <h2
            className={`font-['Chakra_Petch'] font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            ABOUT GREEN PREMIER LEAGUE
          </h2>
          <p className="text-emerald-500 font-['Chakra_Petch'] text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span>&ldquo;Bid Green, Build Change&rdquo;</span>
          </p>
          <p className="text-base sm:text-lg font-sans leading-relaxed">
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Green Premier League
            </span>{' '}
            is an immersive, environmental and civic strategy auction league organized under the aegis of the National Service Scheme (NSS), designed to challenge participants on sustainable growth, ecological stewardship, and visionary public allocation.
          </p>
          <p className="mt-3 text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            Rather than passive theoretical debates, student teams step directly into the boots of green architects and civic stewards. Equipped with an equal treasury allocation of ₹{overallBudget.toLocaleString()}, delegations navigate real-world trade-offs: balancing renewable energy microgrids, flood catchment wetlands, urban reforestation, and circular resource loops. Each resource is exclusive and awarded to only one winning team.
          </p>
        </div>

        {/* Three Highlight Cards: 01 THINK, 02 BID, 03 BUILD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {HIGHLIGHT_CARDS.map((card, idx) => {
            const IconComponent = iconMap[card.iconName] || BrainCircuit;

            return (
              <div
                key={card.number}
                id={`about-card-${card.number}`}
                className={`group relative rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-[#072116]/80 border-emerald-900/60 hover:border-emerald-500/60 shadow-md shadow-black/30'
                    : 'bg-white border-emerald-200/80 hover:border-emerald-500/50 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Number & Corner Marker */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-900/30 dark:border-emerald-900/30">
                  <span className="font-['Space_Mono'] font-bold text-3xl text-emerald-500 tracking-tighter">
                    {card.number}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isDarkMode
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                {/* Title and Subtitle */}
                <h3
                  className={`font-['Chakra_Petch'] font-bold text-2xl tracking-wide uppercase mb-2 group-hover:text-emerald-500 transition-colors ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {card.title}
                </h3>
                <h4 className="font-['Space_Mono'] text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-4">
                  {card.subtitle}
                </h4>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed">
                  {card.description}
                </p>

                {/* Bottom accent indicator */}
                <div className="mt-6 pt-4 border-t border-emerald-900/30 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>PILLAR {idx + 1} OF 3</span>
                  <span className="text-emerald-500 font-bold group-hover:translate-x-1 transition-transform">
                    ECO STRATEGY →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Civic Insight Banner */}
        <div
          className={`mt-12 rounded-xl border p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-['Space_Mono'] ${
            isDarkMode
              ? 'bg-[#072116]/60 border-emerald-900/50 text-slate-300'
              : 'bg-emerald-50/70 border-emerald-200 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              Organized as a flagship collegiate green strategy & environmental policy simulation.
            </span>
          </div>
          <div className="flex items-center gap-2 text-emerald-500 font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Open to all student delegations</span>
          </div>
        </div>
      </div>
    </section>
  );
};
