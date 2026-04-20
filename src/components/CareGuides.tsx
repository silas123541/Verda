import { motion } from 'motion/react';
import { 
  X, 
  Search, 
  ChevronRight, 
  Utensils, 
  CheckCircle2, 
  Circle, 
  Calendar,
  Sparkles,
  Loader2,
  Scissors,
  Droplets,
  Layers,
  Trash2,
  Sun,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { Screen } from '../types';

const IconResolver = ({ name, className }: { name: any, className?: string }) => {
  const icons: Record<string, any> = {
    scissors: Scissors,
    droplets: Droplets,
    utensils: Utensils,
    layers: Layers,
    sparkles: Sparkles,
    calendar: Calendar,
    sun: Sun,
    trash2: Trash2,
    activity: Activity,
    check: CheckCircle2
  };
  
  const iconName = typeof name === 'string' ? name.toLowerCase() : '';
  const IconComponent = icons[iconName] || Sparkles;
  return <IconComponent className={className} />;
};

interface CareGuidesProps {
  setCurrentScreen: (screen: Screen) => void;
  selectedGuideId: string | null;
  setSelectedGuideId: (id: string | null) => void;
  guideSearchQuery: string;
  setGuideSearchQuery: (query: string) => void;
  careGuides: any[];
  onGenerateGuide: (name: string) => void;
  isGenerating: boolean;
  onRemoveGuide: (id: string) => void;
}

const ProtocolVisual = ({ theme, index, guideId }: { theme: string, index: number, guideId: string }) => {
  const isTomato = guideId === 'tomato';
  const isBasil = guideId === 'basil';
  
  const getThemeColor = () => {
    switch(theme) {
      case 'WATER': return '#3B82F6';
      case 'LIGHT': return '#F59E0B';
      case 'PRUNE': return '#EF4444';
      case 'HEALTH': return '#10B981';
      case 'HARVEST': return isTomato ? '#FF6321' : isBasil ? '#4ADE80' : '#10B981';
      case 'SOIL': return '#8B5CF6';
      case 'NUTRIENTS': return '#FACC15';
      case 'EXPECTATIONS': return '#6366F1';
      default: return '#10B981';
    }
  };

  const themeColor = getThemeColor();

  return (
    <div className="rounded-[32px] aspect-[16/9] shadow-vibrant relative group-img border-2 border-outline/10 bg-bg p-4 sm:p-6 flex items-center justify-center mb-6 overflow-hidden">
      {/* Base Grid - Common but subtle */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[30px] overflow-hidden" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}>
      </div>

      {/* DISTINCT LAYOUTS BASED ON THEME */}
      
      {theme === 'WATER' && (
        <div className="w-full h-full flex items-center justify-around relative scale-90 sm:scale-100">
          <div className="flex flex-col items-center gap-2">
            <div className="w-1.5 h-32 bg-surface-container-high rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ height: '20%' }}
                animate={{ height: ['20%', '60%', '20%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 w-full bg-blue-500"
              />
            </div>
            <span className="text-[8px] font-mono text-secondary">SAT_LVL</span>
          </div>
          <div className="relative">
             <div className="absolute -inset-8 bg-blue-500/10 blur-xl rounded-full"></div>
             <IconResolver name="droplets" className="w-16 h-16 text-blue-500 relative z-10" />
          </div>
          <div className="grid grid-cols-2 gap-2 opacity-30">
            {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500" />)}
          </div>
        </div>
      )}

      {theme === 'PRUNE' && (
        <div className="w-full h-full flex items-center justify-center relative scale-90 sm:scale-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] h-[1px] border-t-2 border-dashed border-red-500/30"></div>
          </div>
          <div className="flex items-center gap-4 sm:gap-12 relative z-10 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-red-500/20 flex items-center justify-center bg-card-bg shrink-0">
              <IconResolver name="scissors" className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <div className="h-2 w-24 sm:w-32 bg-red-500/20 rounded-full overflow-hidden">
                <motion.div animate={{ x: [-100, 100, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="h-full w-20 bg-red-500/40" />
              </div>
              <div className="h-2 w-20 sm:w-24 bg-red-500/10 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {theme === 'LIGHT' && (
        <div className="w-full h-full flex items-center justify-center relative">
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center opacity-[0.08]"
          >
            {[...Array(24)].map((_, i) => (
              <div key={i} className="absolute w-[1px] h-[85%] bg-amber-400 origin-center" style={{ transform: `rotate(${i * 15}deg)` }} />
            ))}
          </motion.div>
          
          <div className="relative p-6 sm:p-10 rounded-full bg-amber-500/5 border border-amber-500/10 scale-90 sm:scale-100">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <IconResolver name="sun" className="w-16 h-16 sm:w-24 sm:h-24 text-amber-500" />
            </motion.div>
            
            <motion.div 
              animate={{ 
                scale: [1.1, 1.4, 1.1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-amber-500/30"
            />
          </div>
        </div>
      )}

      {theme === 'HEALTH' && (
        <div className="w-full h-full flex items-center justify-center gap-4 sm:gap-8 relative px-4 sm:px-12 scale-90 sm:scale-100">
          <div className="flex-1 h-24 sm:h-32 bg-emerald-950/20 rounded-2xl overflow-hidden relative border border-emerald-500/20 shadow-inner">
             <div className="absolute inset-0 flex items-center">
                <motion.div 
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-[200%] h-full flex shrink-0"
                >
                  <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 400 60" 
                    className="text-emerald-500 opacity-60"
                  >
                    <path
                      d="M0 30 L40 30 L45 20 L50 45 L55 5 L60 35 L65 30 L100 30 L105 10 L110 50 L115 30 L200 30 L240 30 L245 20 L250 45 L255 5 L260 35 L265 30 L300 30 L305 10 L310 50 L315 30 L400 30"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 400 60" 
                    className="text-emerald-500 opacity-60"
                  >
                    <path
                      d="M0 30 L40 30 L45 20 L50 45 L55 5 L60 35 L65 30 L100 30 L105 10 L110 50 L115 30 L200 30 L240 30 L245 20 L250 45 L255 5 L260 35 L265 30 L300 30 L305 10 L310 50 L315 30 L400 30"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </motion.div>
             </div>
             
             {/* Scanning Line */}
             <motion.div 
                animate={{ x: ['-10%', '110%', '-10%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-1 bg-emerald-400/30 blur-sm z-20"
             />
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <IconResolver name="activity" className="w-20 h-20 text-emerald-500 shrink-0 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
          </motion.div>
        </div>
      )}

      {theme === 'SOIL' && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 sm:gap-6 relative scale-90 sm:scale-100">
          <div className="w-full max-w-[240px] sm:max-w-[280px] space-y-3 px-4">
            <div className="h-6 bg-purple-900/40 rounded-lg flex items-center px-3 border border-purple-500/20 overflow-hidden relative">
              <motion.div 
                animate={{ width: ['30%', '80%', '30%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="h-1 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]" 
              />
            </div>
            
            <motion.div 
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="h-12 bg-purple-700/30 rounded-xl flex items-center px-4 border border-purple-500/30 shadow-lg justify-between"
            >
               <IconResolver name="layers" className="w-6 h-6 text-purple-400" />
               <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-purple-400/40 rounded-full" 
                    />
                  ))}
               </div>
            </motion.div>
            
            <div className="h-8 bg-purple-500/10 rounded-lg flex items-center px-3 border border-purple-500/10 relative overflow-hidden">
               <motion.div 
                 animate={{ x: ['-100%', '100%', '-100%'] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" 
               />
            </div>
          </div>
          <span className="font-mono text-[9px] text-purple-400 tracking-[0.4em] animate-pulse">STRATA_SCANNING_IN_PROGRESS</span>
        </div>
      )}

      {theme === 'HARVEST' && (
        <div className="w-full h-full flex items-center justify-center relative scale-75 sm:scale-100">
          <div className="w-32 sm:w-48 h-32 sm:h-48 rounded-full border border-primary/10 flex items-center justify-center relative">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full"
            />
            
            <motion.div 
               animate={{ 
                 scale: [1, 1.08, 1],
                 backgroundColor: ['rgba(16,185,129,0.05)', 'rgba(16,185,129,0.15)', 'rgba(16,185,129,0.05)']
               }} 
               transition={{ duration: 2.5, repeat: Infinity }}
               className="w-32 h-32 rounded-full border-2 border-primary/10 flex items-center justify-center shadow-inner"
            >
               <motion.div
                 animate={{ y: [-2, 2, -2] }}
                 transition={{ duration: 2, repeat: Infinity }}
               >
                 <IconResolver name="check" className="w-16 h-16 text-primary filter drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
               </motion.div>
            </motion.div>
            
            <motion.div 
               animate={{ 
                 rotate: [-45, -30, -45], 
                 scale: [0.9, 1.1, 0.9],
                 x: [0, 4, 0],
                 y: [0, -4, 0]
               }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-4 -right-4 bg-card-bg border border-primary/30 p-3 rounded-2xl shadow-2xl z-20"
            >
               <ArrowUpRight className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </div>
      )}

      {theme === 'NUTRIENTS' && (
        <div className="w-full h-full flex items-center justify-center gap-8 relative scale-90 sm:scale-100">
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 border border-dashed border-amber-500/20 rounded-full"
            />
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 border border-dashed border-amber-500/30 rounded-full"
            />
            <div className="relative z-10 w-24 h-24 rounded-3xl bg-amber-500/5 border-2 border-amber-500/20 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  filter: ['drop-shadow(0 0 0px #F59E0B)', 'drop-shadow(0 0 10px #F59E0B)', 'drop-shadow(0 0 0px #F59E0B)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <IconResolver name="sparkles" className="w-12 h-12 text-amber-500" />
              </motion.div>
            </div>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  rotate: [i * 90, i * 90 + 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 w-4 h-4"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 -translate-x-[40px]" />
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-24 h-1.5 bg-amber-500/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ x: ['-100%', '100%', '-100%'] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                  className="h-full w-12 bg-amber-500/40"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {theme === 'EXPECTATIONS' && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 relative scale-95 sm:scale-100">
          <div className="w-full max-w-[320px] bg-indigo-500/5 rounded-2xl p-4 border border-indigo-500/10 relative overflow-hidden">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                 <IconResolver name="calendar" className="w-5 h-5 text-indigo-500" />
               </div>
               <div className="flex-1 space-y-1">
                 <div className="h-2 w-2/3 bg-indigo-500/20 rounded-full" />
                 <div className="h-1.5 w-1/2 bg-indigo-500/10 rounded-full" />
               </div>
             </div>
             <div className="h-3 w-full bg-indigo-950/20 rounded-full overflow-hidden border border-indigo-500/20 relative">
               <motion.div
                 animate={{ x: ['-120%', '120%', '-120%'] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-x-0 h-full bg-indigo-500/20 blur-md"
               />
               <motion.div
                 animate={{ width: ['10%', '90%', '10%'] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
               />
             </div>
             <div className="mt-4 flex justify-between opacity-30">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="w-1 h-3 bg-indigo-500 rounded-full" />
               ))}
             </div>
          </div>
          <motion.span 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-mono text-[8px] text-indigo-400 tracking-[0.5em]"
          >
            TEMPORAL_PROJECTION_ACTIVE
          </motion.span>
        </div>
      )}

      {(!theme || theme === 'GENERAL' || theme === 'SYSTEM') && (
        <div className="w-full h-full flex items-center justify-center gap-4 sm:gap-10 scale-90 sm:scale-100">
           <div className="flex flex-col gap-2 sm:gap-3">
              <motion.div 
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20" 
              />
              <div className="w-12 sm:w-16 h-2 bg-primary/10 rounded-full overflow-hidden">
                <motion.div animate={{ x: [-60, 60, -60] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="h-full w-8 bg-primary/30" />
              </div>
           </div>
           
           <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                filter: ['hue-rotate(0deg)', 'hue-rotate(20deg)', 'hue-rotate(0deg)']
              }}
              transition={{ duration: 5, repeat: Infinity }}
           >
             <IconResolver name="sparkles" className="w-16 h-16 sm:w-24 sm:h-24 text-primary filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
           </motion.div>
           
           <div className="flex flex-col gap-2 sm:gap-3">
              <div className="w-12 sm:w-16 h-2 bg-primary/10 rounded-full overflow-hidden">
                <motion.div animate={{ x: [60, -60, 60] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="h-full w-8 bg-primary/30" />
              </div>
              <motion.div 
                animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.6, 0.3, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20" 
              />
           </div>
        </div>
      )}

      {/* METADATA OVERLAYS (Common but dynamic) */}
      <div className="absolute left-6 top-6 flex flex-col gap-1 opacity-20 hidden sm:flex">
        <div className="w-8 h-1 bg-gray-500 rounded-full"></div>
        <div className="text-[7px] font-mono font-bold text-secondary uppercase tracking-[0.3em]">
          {theme} PROTOCOL
        </div>
      </div>

      <div className="absolute right-6 bottom-6 font-mono text-[9px] text-secondary/40 text-right hidden sm:block">
        VER: 2.0.4-SC-ACC<br/>
        ID: {String(index + 1).padStart(3, '0')}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: `${themeColor}40` }}></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: `${themeColor}40` }}></div>
    </div>
  );
};

export const CareGuides = ({ 
  setCurrentScreen, 
  selectedGuideId, 
  setSelectedGuideId, 
  guideSearchQuery, 
  setGuideSearchQuery,
  careGuides,
  onGenerateGuide,
  isGenerating,
  onRemoveGuide
}: CareGuidesProps) => {
  const filteredGuides = careGuides.filter(guide => {
    const name = guide.name || '';
    const title = guide.title || '';
    const query = guideSearchQuery.toLowerCase();
    return (
      (typeof name === 'string' && name.toLowerCase().includes(query)) ||
      (typeof title === 'string' && title.toLowerCase().includes(query))
    );
  });

  const selectedGuide = careGuides.find(g => g.id === selectedGuideId);

  return (
    <motion.div
      key="care-guides"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-4xl mx-auto space-y-10"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => {
            if (selectedGuideId) setSelectedGuideId(null);
            else setCurrentScreen('DASHBOARD');
          }} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
            {selectedGuideId ? <ChevronRight className="w-6 h-6 text-primary rotate-180" /> : <X className="w-6 h-6 text-primary" />}
          </button>
          <h1 className="text-2xl font-bold text-text-dark">
            {selectedGuideId ? 'Care Guide' : 'Botanical Library'}
          </h1>
        </div>
        {!selectedGuideId && (
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input 
              type="text" 
              placeholder="Search guides..."
              value={guideSearchQuery}
              onChange={(e) => setGuideSearchQuery(e.target.value)}
              className="w-full bg-card-bg border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark shadow-sm"
            />
          </div>
        )}
      </div>

      {!selectedGuideId ? (
        <div className="space-y-8">
          <div className="md:hidden">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input 
                type="text" 
                placeholder="Search guides..."
                value={guideSearchQuery}
                onChange={(e) => setGuideSearchQuery(e.target.value)}
                className="w-full bg-card-bg border-none rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredGuides.map(guide => (
              <button 
                key={guide.id}
                onClick={() => setSelectedGuideId(guide.id)}
                className="bg-card-bg p-6 rounded-[32px] shadow-vibrant hover:scale-[1.02] transition-all text-left group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-3xl group-hover:bg-primary/10 transition-colors">
                    {guide.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-dark">{guide.name}</h3>
                    <p className="text-xs text-secondary">Expert Guide</p>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-primary mb-2 leading-tight">{guide.title}</h4>
                <p className="text-sm text-secondary line-clamp-2 leading-relaxed">{guide.description}</p>
              </button>
            ))}
            {filteredGuides.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-secondary">
                  {guideSearchQuery ? <Search className="w-10 h-10" /> : <Sparkles className="w-10 h-10 text-primary" />}
                </div>
                <div className="space-y-2">
                  <p className="text-secondary font-medium text-lg">
                    {guideSearchQuery 
                      ? `No guides found for "${guideSearchQuery}"` 
                      : "Your Botanical Library is empty"}
                  </p>
                  <p className="text-secondary/60 text-sm">
                    {guideSearchQuery 
                      ? "But don't worry, our AI can generate one for you!" 
                      : "Search for a plant above or use the button below to generate your first guide!"}
                  </p>
                </div>
                
                {(guideSearchQuery || careGuides.length === 0) && (
                  <div className="flex flex-col items-center gap-4">
                    {!guideSearchQuery && careGuides.length === 0 && (
                      <div className="relative w-full max-w-xs md:hidden mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                        <input 
                          type="text" 
                          placeholder="Type a plant name..."
                          value={guideSearchQuery}
                          onChange={(e) => setGuideSearchQuery(e.target.value)}
                          className="w-full bg-card-bg border-none rounded-2xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark shadow-sm"
                        />
                      </div>
                    )}
                    <button 
                      onClick={() => onGenerateGuide(guideSearchQuery || "General Plant")}
                      disabled={isGenerating || (!guideSearchQuery && careGuides.length === 0)}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Guide...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          {guideSearchQuery ? `Generate "${guideSearchQuery}" Guide` : "Search to Generate Guide"}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : selectedGuide && (
        <>
          <header>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
              <Utensils className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Peak Harvest Season</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-text-dark mb-4 leading-tight break-words">{selectedGuide.title}</h2>
            <p className="text-secondary max-w-xl text-lg leading-relaxed">{selectedGuide.description}</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <aside className="md:col-span-4 space-y-6">
              <div className="bg-card-bg rounded-[24px] p-8 shadow-vibrant">
                <h3 className="text-primary font-bold text-xl mb-6">Seasonal Supplies</h3>
                <ul className="flex flex-col gap-4">
                  {selectedGuide.supplies.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 p-3 bg-bg rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-card-bg dark:bg-sidebar-bg flex items-center justify-center text-primary shadow-sm">
                        <IconResolver name={item.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-text-dark">{item.label}</p>
                        <p className="text-[10px] text-secondary uppercase tracking-wider">{item.sub}</p>
                      </div>
                      {item.checked ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-outline/30" />}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <section className="md:col-span-8 space-y-12">
              {selectedGuide.steps.map((step, i) => (
                <div key={i} className="flex gap-4 sm:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm sm:text-lg shrink-0">{i + 1}</div>
                    {i < selectedGuide.steps.length - 1 && (
                      <div className="w-[1px] sm:w-[2px] flex-grow bg-outline/20 my-2 rounded-full"></div>
                    )}
                  </div>
                  <div className="pb-8 flex-1">
                    <ProtocolVisual 
                      theme={step.theme} 
                      index={i} 
                      guideId={selectedGuide.id} 
                    />
                    <h4 className="text-xl sm:text-2xl font-bold text-text-dark mb-3 break-words">{step.title}</h4>
                    <p className="text-secondary leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}

              <div className="pt-8">
                <button 
                  onClick={() => onRemoveGuide(selectedGuide.id)}
                  className="w-full h-14 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/20"
                >
                  <Trash2 className="w-5 h-5" />
                  Remove from Botanical Library
                </button>
              </div>
            </section>
          </div>
        </>
      )}
    </motion.div>
  );
};
