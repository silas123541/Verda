import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User as UserIcon, 
  Bell, 
  Moon, 
  HelpCircle, 
  Globe, 
  ChevronRight, 
  Shield, 
  Search,
  Check,
  Loader2,
  Camera,
  Mail,
  Type,
  Download,
  Upload,
  Database,
  RefreshCcw,
  AlertTriangle
} from 'lucide-react';
import { Screen, User, Plant } from '../types';
import { searchLocations } from '../services/weatherService';

interface SettingsProps {
  user: User;
  setUser: (user: User) => void;
  plants: Plant[];
  setPlants: (plants: Plant[]) => void;
  careGuides: any[];
  setCareGuides: (guides: any[]) => void;
  taskTypes: string[];
  setTaskTypes: (types: string[]) => void;
  setCurrentScreen: (screen: Screen) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  autoLocation: boolean;
  setAutoLocation: (val: boolean) => void;
  manualLocation: string;
  setManualLocation: (val: string) => void;
  setActiveToast: (toast: { message: string; sub: string } | null) => void;
}

export const Settings = ({ 
  user,
  setUser,
  plants,
  setPlants,
  careGuides,
  setCareGuides,
  taskTypes,
  setTaskTypes,
  setCurrentScreen, 
  isDarkMode, 
  setIsDarkMode, 
  notificationsEnabled,
  toggleNotifications,
  autoLocation,
  setAutoLocation,
  manualLocation,
  setManualLocation,
  setActiveToast
}: SettingsProps) => {
  const [searchQuery, setSearchQuery] = useState(manualLocation);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [newTaskType, setNewTaskType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setUser({
      ...user,
      name: editName,
      email: editEmail,
      avatar: editAvatar
    });
    setIsEditingProfile(false);
  };

  const handleResetGarden = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleExportData = () => {
    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        user,
        plants,
        careGuides,
        settings: {
          isDarkMode,
          notificationsEnabled,
          autoLocation,
          manualLocation,
          taskTypes
        }
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verda-garden-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setActiveToast({
      message: "Garden Exported",
      sub: "Your backup file has been downloaded."
    });
  };

  const handleImportData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.data) {
          const { data } = json;
          
          if (data.user) setUser(data.user);
          if (data.plants) setPlants(data.plants);
          if (data.careGuides) setCareGuides(data.careGuides);
          
          if (data.settings) {
            if (data.settings.isDarkMode !== undefined) setIsDarkMode(data.settings.isDarkMode);
            if (data.settings.autoLocation !== undefined) setAutoLocation(data.settings.autoLocation);
            if (data.settings.manualLocation !== undefined) setManualLocation(data.settings.manualLocation);
            if (data.settings.taskTypes !== undefined) setTaskTypes(data.settings.taskTypes);
          }

          setActiveToast({
            message: "Garden Imported",
            sub: "Your garden data has been restored successfully."
          });
        } else {
          throw new Error("Invalid backup file format");
        }
      } catch (err) {
        console.error("Import failed:", err);
        setActiveToast({
          message: "Import Failed",
          sub: "The file you selected is not a valid Verda backup."
        });
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  useEffect(() => {
    if (autoLocation) return;
    
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchLocations(searchQuery);
          setSearchResults(results);
          setShowDropdown(results.length > 0);
        } catch (err) {
          console.error("Location search failed", err);
          setSearchResults([]);
          setShowDropdown(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, autoLocation]);

  const handleSelectLocation = (loc: any) => {
    const fullName = `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}, ${loc.country}`;
    setManualLocation(fullName);
    setSearchQuery(fullName);
    setShowDropdown(false);
  };

  const handleAddTaskType = () => {
    const trimmed = newTaskType.trim();
    if (trimmed && !taskTypes.includes(trimmed)) {
      setTaskTypes([...taskTypes, trimmed]);
      setNewTaskType('');
      setActiveToast({
        message: "Task Type Added",
        sub: `"${trimmed}" is now available for scheduling.`
      });
    }
  };

  const handleRemoveTaskType = (type: string) => {
    setTaskTypes(taskTypes.filter(t => t !== type));
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => setCurrentScreen('DASHBOARD')} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
          <X className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-2xl font-bold text-text-dark">Settings</h1>
      </div>

      <div className="bg-card-bg rounded-[32px] p-8 shadow-vibrant space-y-8">
        <div className="pb-8 border-b border-outline/20">
          <AnimatePresence mode="wait">
            {!isEditingProfile ? (
              <motion.div 
                key="profile-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-surface-container-high overflow-hidden border-2 border-primary/20 shadow-inner">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text-dark">{user.name}</h2>
                  <p className="text-secondary">{user.email}</p>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="px-5 py-2.5 bg-primary/10 text-primary rounded-2xl font-bold text-sm hover:bg-primary/20 transition-all"
                >
                  Edit Profile
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="profile-edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      title="Change profile picture"
                    />
                    <div className="w-20 h-20 rounded-full bg-surface-container-high overflow-hidden border-4 border-primary shadow-2xl relative">
                      <img src={editAvatar} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-card-bg z-10 pointer-events-none">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full pl-10 pr-4 py-2.5 bg-bg rounded-xl border border-outline/20 text-text-dark focus:ring-1 focus:ring-primary/20 transition-all font-semibold"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                        type="email" 
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full pl-10 pr-4 py-2.5 bg-bg rounded-xl border border-outline/20 text-text-dark focus:ring-1 focus:ring-primary/20 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveProfile}
                    className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditName(user.name);
                      setEditEmail(user.email);
                      setEditAvatar(user.avatar);
                    }}
                    className="px-6 py-3 bg-surface-container-high text-text-dark rounded-2xl font-bold active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Preferences</h3>
          
          {typeof window !== 'undefined' && window.self !== window.top && (
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-4">
              <p className="text-xs text-primary leading-relaxed">
                <span className="font-bold">Note:</span> You are viewing this in a preview window. Native notifications work best when you <span className="font-bold">open the app in a new tab</span>.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {[
              { 
                icon: Bell, 
                label: 'Notifications', 
                sub: !notificationsEnabled 
                  ? 'Care alerts & growth updates' 
                  : (typeof window !== 'undefined' && "Notification" in window)
                    ? (Notification.permission === 'denied')
                      ? 'Blocked. Try opening in a new tab.'
                      : (Notification.permission === 'default')
                        ? 'Permission requested...'
                        : 'Active (Native + In-App)'
                    : 'Using in-app alerts only', 
                toggle: true, 
                active: notificationsEnabled, 
                onToggle: toggleNotifications 
              },
              { icon: Moon, label: 'Dark Mode', sub: 'Easier on the eyes at night', toggle: true, active: isDarkMode, onToggle: () => setIsDarkMode(!isDarkMode) },
              { 
                icon: Globe, 
                label: 'Automatic Location', 
                sub: autoLocation ? 'Using browser geolocation' : 'Using manual location', 
                toggle: true, 
                active: autoLocation, 
                onToggle: () => setAutoLocation(!autoLocation) 
              },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => item.onToggle?.()}
                className="flex items-center gap-4 p-4 bg-bg rounded-2xl hover:bg-surface-container-high transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-card-bg dark:bg-sidebar-bg flex items-center justify-center text-primary shadow-sm">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-text-dark">{item.label}</p>
                  <p className="text-xs text-secondary">{item.sub}</p>
                </div>
                {item.toggle ? (
                  <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${item.active ? 'bg-primary' : 'bg-outline/30'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-bold text-primary">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {!autoLocation && (
              <div className="p-4 bg-bg rounded-2xl space-y-3 relative">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-card-bg dark:bg-sidebar-bg flex items-center justify-center text-primary shadow-sm">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-text-dark">Manual City</p>
                    <p className="text-xs text-secondary">Search for your location</p>
                  </div>
                </div>
                
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value === '') setShowDropdown(false);
                    }}
                    onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                    placeholder="Enter city name..."
                    className="w-full h-12 px-4 rounded-xl bg-card-bg border border-outline/20 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all pr-10"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-4 right-4 top-[calc(100%-8px)] z-50 bg-card-bg border border-outline/20 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {searchResults.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full text-left p-4 hover:bg-surface-container-high transition-colors flex items-center justify-between group border-b border-outline/10 last:border-0"
                        >
                          <div>
                            <p className="font-bold text-sm text-text-dark group-hover:text-primary transition-colors">
                              {loc.name}
                            </p>
                            <p className="text-[10px] text-secondary">
                              {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                            </p>
                          </div>
                          {manualLocation.includes(loc.name) && manualLocation.includes(loc.country) && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-[10px] text-secondary">Weather data will sync to the selected location.</p>
              </div>
            )}

            <div key="language" className="flex items-center gap-4 p-4 bg-bg rounded-2xl transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-card-bg dark:bg-sidebar-bg flex items-center justify-center text-primary shadow-sm">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-dark">Language</p>
                <p className="text-xs text-secondary">English (US)</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                English
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Garden Customization</h3>
          <div className="p-4 bg-bg rounded-2xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-card-bg dark:bg-sidebar-bg flex items-center justify-center text-primary shadow-sm">
                <Database className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-dark">Custom Task Types</p>
                <p className="text-xs text-secondary">Define labels for your garden schedule</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTaskType}
                onChange={(e) => setNewTaskType(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTaskType()}
                placeholder="e.g., Repot, Mist, Shine..."
                className="flex-1 h-11 px-4 rounded-xl bg-card-bg border border-outline/20 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <button 
                onClick={handleAddTaskType}
                disabled={!newTaskType.trim()}
                className="px-4 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {taskTypes.map((type) => (
                <div 
                  key={type}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-card-bg dark:bg-sidebar-bg border border-outline/20 rounded-lg text-xs font-bold text-text-dark hover:border-primary/50 transition-all"
                >
                  {type}
                  <button 
                    onClick={() => handleRemoveTaskType(type)}
                    className="p-0.5 hover:bg-red-50 hover:text-red-500 rounded text-outline transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Data & Backup</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleExportData}
              className="flex items-center justify-center gap-3 p-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl font-bold transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <span>Export</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-3 p-4 bg-surface-container-high hover:bg-outline/10 text-text-dark rounded-2xl font-bold transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <span>Import</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportData} 
              accept=".json" 
              className="hidden" 
            />
          </div>
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all text-xs"
          >
            <RefreshCcw className="w-3 h-3" />
            Reset all garden data
          </button>
          <p className="text-[10px] text-secondary text-center">Back up your garden plants, guides, and settings to a JSON file.</p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Security & Support</h3>
          <div className="space-y-4">
            {[
              { icon: Shield, label: 'Privacy Policy', sub: 'How we protect your data' },
              { icon: HelpCircle, label: 'Help Center', sub: 'Guides & troubleshooting' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-bg rounded-2xl hover:bg-surface-container-high transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-card-bg dark:bg-sidebar-bg flex items-center justify-center text-primary shadow-sm">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-text-dark">{item.label}</p>
                  <p className="text-xs text-secondary">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-secondary group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card-bg rounded-[32px] p-8 max-w-sm w-full shadow-2xl space-y-6 border border-outline/10 text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-dark">Reset Garden?</h3>
                <p className="text-secondary text-sm font-medium leading-relaxed">
                  This will permanently delete all your plants, custom care guides, and settings. This cannot be undone.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleResetGarden}
                  className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
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
