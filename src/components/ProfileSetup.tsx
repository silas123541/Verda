import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Camera, Mail, Type, Sprout, Sparkles, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface ProfileSetupProps {
  user: User;
  onUpdate: (user: User) => void;
  onComplete: () => void;
}

export const ProfileSetup = ({ user, onUpdate, onComplete }: ProfileSetupProps) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(user.name === 'Jamie Botanical' ? '' : user.name);
  const [email, setEmail] = useState(user.email === 'jamie.garden@example.com' ? '' : user.email);
  const [avatar, setAvatar] = useState(user.avatar);

  const steps = [
    {
      title: "Welcome to Verda",
      subtitle: "The Journey Begins",
      description: "Before we step into your digital sanctuary, let's personalize your botanical identity.",
      type: 'welcome'
    },
    {
      title: "What's Your Name?",
      subtitle: "Identity",
      description: "How should Verda address you during your morning garden checks?",
      type: 'input',
      field: 'name',
      icon: Type,
      placeholder: 'Enter your name...',
      value: name,
      setValue: setName
    },
    {
      title: "Botanical Contact",
      subtitle: "Reach",
      description: "Where should we send your seasonal care guides and hydration alerts?",
      type: 'input',
      field: 'email',
      icon: Mail,
      placeholder: 'Enter your email...',
      value: email,
      setValue: setEmail
    },
    {
      title: "Choose Your Avatar",
      subtitle: "Visual Soul",
      description: "Select a profile picture that represents your connection to nature.",
      type: 'avatar'
    }
  ];

  const current = steps[step];

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onUpdate({ name, email, avatar });
      onComplete();
    }
  };

  const isNextDisabled = () => {
    if (current.type === 'input') {
      return !current.value.trim();
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#081C15]/60 backdrop-blur-2xl transition-colors duration-1000" />
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "circOut" }}
          className="bg-card-bg rounded-[48px] p-10 md:p-14 max-w-xl w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-8 border-4 border-white/5"
        >
          <div className="relative">
            <motion.div 
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className={`w-28 h-28 bg-primary/10 rounded-[40px] flex items-center justify-center text-primary shadow-inner border border-white/10`}
            >
              {current.type === 'welcome' && <LeafIcon className="w-12 h-12" />}
              {current.field === 'name' && <Type className="w-12 h-12" />}
              {current.field === 'email' && <Mail className="w-12 h-12" />}
              {current.type === 'avatar' && (
                <div className="w-full h-full p-2">
                   <img src={avatar} className="w-full h-full object-cover rounded-[32px]" />
                </div>
              )}
            </motion.div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 text-primary/40"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>

          <div className="space-y-3 w-full">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
              {current.subtitle}
            </p>
            <h2 className="text-4xl font-black text-text-dark tracking-tight leading-tight">
              {current.title}
            </h2>
            <p className="text-secondary leading-relaxed font-medium text-lg max-w-sm mx-auto">
              {current.description}
            </p>

            {current.type === 'input' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 relative max-w-sm mx-auto w-full"
              >
                <current.icon className="absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 w-5 h-5 text-primary" />
                <input 
                  type={current.field === 'email' ? 'email' : 'text'}
                  value={current.value}
                  onChange={(e) => current.setValue(e.target.value)}
                  placeholder={current.placeholder}
                  autoFocus
                  className="w-full pl-12 pr-4 py-5 bg-bg rounded-2xl border-2 border-outline/10 text-text-dark focus:border-primary focus:outline-none transition-all font-bold text-lg"
                />
              </motion.div>
            )}

            {current.type === 'avatar' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 grid grid-cols-4 gap-4 max-w-sm mx-auto"
              >
                {[
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
                ].map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => setAvatar(url)}
                    className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all ${avatar === url ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={url} className="w-full h-full object-cover" />
                  </button>
                ))}
                <div className="relative aspect-square">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    title="Upload profile picture"
                  />
                  <div className="w-full h-full rounded-2xl bg-bg border-2 border-dashed border-outline/30 flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all pointer-events-none">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="w-full pt-4">
            <motion.button 
              whileHover={isNextDisabled() ? {} : { scale: 1.02 }}
              whileTap={isNextDisabled() ? {} : { scale: 0.98 }}
              onClick={handleNext}
              disabled={isNextDisabled()}
              className={`w-full py-5 rounded-[28px] ${isNextDisabled() ? 'bg-outline/20 text-text-dark/20 cursor-not-allowed' : 'bg-primary text-white shadow-xl shadow-primary/30'} font-black text-xl flex items-center justify-center gap-3 group transition-all`}
            >
              {step === steps.length - 1 ? "Complete Setup" : "Next Step"}
              <ArrowRight className={`w-5 h-5 ${isNextDisabled() ? '' : 'group-hover:translate-x-1'} transition-transform`} />
            </motion.button>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            {steps.map((_, i) => (
              <motion.div 
                key={i} 
                animate={{
                  width: i === step ? 32 : 8,
                  backgroundColor: i === step ? 'var(--color-primary)' : 'rgba(0,0,0,0.1)'
                }}
                className={`h-2 rounded-full`} 
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const LeafIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C10 14.5 10.5 14 11 12.5" />
  </svg>
);
