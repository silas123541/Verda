import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Camera, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Loader2, 
  Sparkles, 
  Info, 
  ArrowRight,
  Leaf,
  Thermometer,
  Sun,
  Droplet,
  AlertTriangle
} from 'lucide-react';
import { Plant, Screen } from '../types';

interface AddPlantProps {
  setCurrentScreen: (screen: Screen) => void;
  setIsCameraOpen: (open: boolean) => void;
  isIdentifying: boolean;
  isSearching: boolean;
  onSearch: (query: string) => void;
  identifiedPlant: Partial<Plant> | null;
  setIdentifiedPlant: (plant: Partial<Plant> | null) => void;
  handleAddIdentified: () => void;
  onGenerateGuide: (name: string) => void;
  isGeneratingGuide: boolean;
  newPlantLocation: string;
  setNewPlantLocation: (location: string) => void;
}

export const AddPlant = ({ 
  setCurrentScreen, 
  setIsCameraOpen, 
  isIdentifying, 
  isSearching,
  onSearch,
  identifiedPlant, 
  setIdentifiedPlant,
  handleAddIdentified,
  onGenerateGuide,
  isGeneratingGuide,
  newPlantLocation,
  setNewPlantLocation
}: AddPlantProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <motion.div
      key="add-plant"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto space-y-10 pb-20"
    >
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => setCurrentScreen('DASHBOARD')} 
          className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-primary"
        >
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-text-dark">Add New Plant</h1>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary leading-tight">
          Discover your next companion.
        </h2>
        <p className="text-secondary leading-relaxed font-medium max-w-xl">
          Identify a new specimen via photo or search our archives to provide the most accurate care regimen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Identification */}
        <motion.button 
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCameraOpen(true)}
          className="relative h-64 overflow-hidden rounded-[32px] group transition-all bg-primary shadow-vibrant"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-500"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Identify via Photo</span>
          </div>
        </motion.button>

        {/* Manual Search */}
        <div className="h-64 rounded-[32px] bg-card-bg p-8 shadow-vibrant flex flex-col justify-between border border-outline/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-primary" />
                <span className="text-sm font-bold text-text-dark">Search Registry</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-black text-outline opacity-50">Manual Entry</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="pt-2">
              <div className="relative">
                <input 
                  className="w-full bg-bg border border-outline/20 rounded-2xl px-5 py-3.5 placeholder:text-outline/60 focus:ring-1 focus:ring-primary/20 focus:border-primary/40 outline-none text-text-dark font-semibold pr-12 transition-all" 
                  placeholder="e.g. Fiddle Leaf Fig" 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-start gap-3 bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <Info className="w-4 h-4 text-primary mt-0.5" />
            <p className="text-xs text-secondary leading-tight italic font-medium">
              Mapping over <span className="text-primary font-bold">10,000+</span> species across global archives.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {(isIdentifying || isSearching) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card-bg rounded-[32px] p-12 shadow-vibrant flex flex-col items-center justify-center space-y-6 border border-outline/10"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 m-auto w-10 h-10 bg-surface-container-high rounded-full flex items-center justify-center">
                {isIdentifying ? (
                  <Camera className="w-5 h-5 text-primary animate-pulse" />
                ) : (
                  <Search className="w-5 h-5 text-primary animate-pulse" />
                )}
              </div>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-text-dark">
                {isIdentifying ? 'Analyzing Specimen...' : 'Searching Archives...'}
              </h3>
              <p className="text-secondary text-sm font-medium">
                {isIdentifying ? 'Consulting the botanical library' : `Finding details for "${searchQuery}"`}
              </p>
            </div>
          </motion.div>
        )}

        {identifiedPlant && !isIdentifying && !isSearching && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card-bg rounded-[32px] p-8 shadow-vibrant space-y-8 border-2 border-primary/20"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-[28px] bg-surface-container-high flex items-center justify-center text-6xl flex-shrink-0 shadow-inner border border-outline/10">
                {identifiedPlant.emoji}
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-3xl font-extrabold text-text-dark tracking-tight">{identifiedPlant.name}</h4>
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="italic text-primary font-bold text-sm opacity-80">{identifiedPlant.scientificName}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Hydration', val: `${identifiedPlant.hydration}%`, icon: Droplet, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Sunlight', val: `${identifiedPlant.requiredLight}h`, icon: Sun, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Min Temp', val: `${identifiedPlant.minTemp}°C`, icon: Thermometer, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
                    { label: 'Max Temp', val: `${identifiedPlant.maxTemp}°C`, icon: Thermometer, color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-3 rounded-2xl ${stat.color} border border-black/5`}>
                      <div className="flex items-center gap-1.5 mb-1 opacity-70">
                        <stat.icon className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                      </div>
                      <p className="text-lg font-extrabold">{stat.val}</p>
                    </div>
                  ))}
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <input 
                    type="text" 
                    placeholder="Plant location (e.g. Balcony)"
                    value={newPlantLocation}
                    onChange={(e) => setNewPlantLocation(e.target.value)}
                    className="w-full bg-bg border border-outline/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold focus:ring-1 focus:ring-primary/20 outline-none text-text-dark shadow-inner transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <button 
                  onClick={handleAddIdentified}
                  className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-[0_4px_12px_rgba(64,145,108,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Add to Garden
                </button>
                <button 
                  onClick={() => setShowDiscardConfirm(true)}
                  className="px-6 py-4 rounded-2xl bg-surface-container-high text-text-dark font-bold active:scale-95 transition-all text-sm md:text-base whitespace-nowrap"
                >
                  Discard
                </button>
              </div>
              
              <button 
                onClick={() => identifiedPlant.name && onGenerateGuide(identifiedPlant.name)}
                disabled={isGeneratingGuide}
                className="w-full py-4 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-all border border-primary/20 disabled:opacity-50"
              >
                {isGeneratingGuide ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isGeneratingGuide ? 'Generating...' : `Research Guide`}
              </button>
            </div>
          </motion.div>
        )}

        {showDiscardConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card-bg rounded-[32px] p-8 max-w-sm w-full shadow-2xl space-y-6 border border-outline/10"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-text-dark">Discard Identification?</h3>
                <p className="text-secondary text-sm font-medium leading-relaxed">
                  Are you sure you want to discard this plant? You will need to identify it again.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIdentifiedPlant(null);
                    setShowDiscardConfirm(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
                >
                  Yes, Discard
                </button>
                <button
                  onClick={() => setShowDiscardConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-bg text-text-dark font-bold border border-outline/20 hover:bg-surface-container-high transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
