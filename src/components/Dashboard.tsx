import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Droplets, TrendingUp, MapPin, Sunrise, Sunset, Zap, Cloud, Plus, Trash2, AlertTriangle, Calendar, Clock, CheckCircle2, Circle, X, Loader2 } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Plant, Screen, GrowthEntry, User } from '../types';
import { WeatherData } from '../services/weatherService';
import { getLocalDateString, formatDisplayDate } from '../lib/dateUtils';

interface DashboardProps {
  user: User;
  plants: Plant[];
  selectedPlantId: string | null;
  setSelectedPlantId: (id: string) => void;
  setCurrentScreen: (screen: Screen) => void;
  onWaterPlant: (id: string) => void;
  onRecordGrowth: (id: string, value: number) => void;
  onRemovePlant: (id: string) => void;
  onAddTask: (plantId: string, task: any) => void;
  onToggleTask: (plantId: string, taskId: string) => void;
  onDeleteTask: (plantId: string, taskId: string) => void;
  weatherData: WeatherData | null;
  weatherError: boolean;
  taskTypes: string[];
}

export const Dashboard = ({ 
  user,
  plants, 
  selectedPlantId, 
  setSelectedPlantId, 
  setCurrentScreen, 
  onWaterPlant,
  onRecordGrowth,
  onRemovePlant,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  weatherData,
  weatherError,
  taskTypes 
}: DashboardProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [growthInput, setGrowthInput] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ type: 'Water', date: getLocalDateString(), time: '08:00' });
  
  const selectedPlant = plants.find(p => p.id === selectedPlantId) || plants[0];

  const completionPercentage = selectedPlant ? Math.round(Math.min((selectedPlant.lightIntake / selectedPlant.requiredLight) * 100, 100)) : 0;
  const currentLightEfficiency = weatherData 
    ? Math.max(0.1, (weatherData.uvIndex / 5) * (1 - (weatherData.cloudCover / 100)))
    : 1;

  // Prepare chart data with current plant's context
  const growthHistory = selectedPlant ? selectedPlant.growthHistory.map(entry => ({
    ...entry,
    displayDate: formatDisplayDate(entry.date)
  })) : [];

  const handleGrowthSubmit = (e: FormEvent) => {
    e.preventDefault();
    const val = parseFloat(growthInput);
    if (!isNaN(val) && selectedPlant) {
      onRecordGrowth(selectedPlant.id, val);
      setGrowthInput('');
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (plants.length === 0) {
    return (
      <motion.div
        key="empty-dashboard"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-primary/5 rounded-[48px] flex items-center justify-center border-2 border-dashed border-primary/20">
            <Plus className="w-12 h-12 text-primary opacity-20" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        
        <div className="max-w-xs space-y-2">
          <h2 className="text-2xl font-black text-text-dark">Your Garden is Empty</h2>
          <p className="text-secondary font-medium text-sm leading-relaxed">
            Start your botanical journey by adding your first plant. You can also use the camera to identify them!
          </p>
        </div>

        <button 
          onClick={() => setCurrentScreen('ADD_PLANT')}
          className="bg-primary text-white px-10 py-4 rounded-[28px] font-black text-lg shadow-[0_12px_24px_rgba(64,145,108,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus className="w-6 h-6" /> Add Your First Plant
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col gap-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <p className="text-primary font-semibold mb-1">Welcome back, {user.name.split(' ')[0]}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-dark">My Plants</h1>
        </div>
        <button 
          onClick={() => setCurrentScreen('ADD_PLANT')}
          className="bg-primary text-white px-7 py-3.5 rounded-full font-bold shadow-[0_4px_12px_rgba(64,145,108,0.3)] hover:scale-105 transition-all"
        >
          + Add New Plant
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {plants.map(plant => (
            <div 
              key={plant.id} 
              onClick={() => setSelectedPlantId(plant.id)}
              className={`plant-card cursor-pointer relative ${selectedPlantId === plant.id ? 'selected' : ''}`}
            >
              <div className={`status-badge absolute top-5 right-5 ${
                plant.careAlert ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                plant.status === 'Thriving' ? 'bg-primary/10 text-primary' : 
                'bg-surface-container-high text-text-dark'
              }`}>
                {plant.careAlert || plant.status}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-2xl mb-4">
                {plant.emoji}
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">{plant.name}</h3>
              <p className="text-sm text-secondary mb-5">Vibrant & fast-growing. {plant.scientificName}</p>
              <div className="flex flex-wrap gap-3 text-xs font-medium text-text-dark/70">
                {plant.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {plant.location}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5" /> Full Sun
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> {plant.hydration}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card-bg rounded-[24px] p-8 shadow-vibrant flex flex-col gap-6 h-fit sticky top-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-2xl">
              {selectedPlant.emoji}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-dark">{selectedPlant.name} Care</h2>
              <div className="flex items-center gap-2 text-xs text-secondary">
                {selectedPlant.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {selectedPlant.location}
                  </div>
                )}
                <span>•</span>
                <span>
                  {selectedPlant.wateringHistory.length > 0 
                    ? `Last watered: ${new Date(selectedPlant.wateringHistory[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                    : selectedPlant.scientificName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-5 border-b border-outline/20">
            <div className="text-[11px] font-bold text-outline uppercase tracking-wider">Soil Hydration</div>
            <div className="text-sm font-medium text-text-dark">
              {selectedPlant.hydration}% — {selectedPlant.hydration > 70 ? 'Optimal' : selectedPlant.hydration > 40 ? 'Fair' : 'Critical'}
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full transition-all duration-1000 ${selectedPlant.hydration > 40 ? 'bg-primary' : 'bg-red-500'}`} 
                style={{ width: `${selectedPlant.hydration}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-5 border-b border-outline/20">
            <div className="text-[11px] font-bold text-outline uppercase tracking-wider flex items-center justify-between">
              <span>Light Intake (Today)</span>
              {weatherData ? (
                <div className="flex items-center gap-2 text-[10px] text-primary lowercase">
                  <Zap className="w-3 h-3" /> UV Max: {weatherData.uvIndex}
                </div>
              ) : weatherError ? (
                <div className="text-[10px] text-red-400 font-medium lowercase">
                  Connection offline
                </div>
              ) : (
                <div className="animate-pulse text-[10px] text-secondary font-medium lowercase">
                  Syncing solar data...
                </div>
              )}
            </div>
            <div className="text-sm font-medium text-text-dark flex items-center justify-between">
              <span>{completionPercentage}% Complete</span>
              {weatherData ? (
                <div className="flex items-center gap-4 text-[10px] text-secondary">
                  <div className="flex items-center gap-1">
                    <Cloud className="w-3 h-3 text-outline" /> {weatherData.cloudCover}%
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-400" /> {weatherData.humidity}%
                  </div>
                  <div className="flex items-center gap-1">
                    <Sunrise className="w-3 h-3 text-primary" /> {new Date(weatherData.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Sunset className="w-3 h-3 text-primary" /> {new Date(weatherData.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ) : weatherError ? (
                <div className="flex items-center gap-1 text-[8px] text-red-400/80 uppercase tracking-tighter">
                  <AlertTriangle className="w-2.5 h-2.5" /> Sensor link failed
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[8px] text-outline dark:text-secondary opacity-60 dark:opacity-80 uppercase tracking-tighter">
                  <Loader2 className="w-2 h-2 animate-spin" /> Awaiting local forecast
                </div>
              )}
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full transition-all duration-1000 ${weatherData?.isDay ? 'bg-yellow-400' : 'bg-indigo-400'}`} 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            {weatherData && (
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-[10px] text-secondary italic">
                  {weatherData.isDay 
                    ? `Effective energy: ${Math.round((weatherData.uvIndex / 5) * (1 - (weatherData.cloudCover / 100)) * 100)}% coverage today`
                    : "Photosynthesis paused for the night."}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 pb-5 border-b border-outline/20">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-outline uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Growth History
              </div>
              <form onSubmit={handleGrowthSubmit} className="flex items-center gap-2">
                <input 
                  type="number" 
                  step="0.1"
                  value={growthInput}
                  onChange={(e) => setGrowthInput(e.target.value)}
                  placeholder="Height (in)"
                  className="w-20 h-7 text-[10px] px-2 rounded-lg bg-surface-container-high border border-outline/20 focus:outline-none focus:ring-1 focus:ring-primary/30 font-medium text-text-dark placeholder:text-secondary/50 placeholder:italic"
                />
                <button 
                  type="submit"
                  disabled={!growthInput}
                  className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
            
            <div className="w-full mt-2 h-[200px] min-w-0">
              {isMounted && selectedPlant.growthHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={200} minWidth={0} minHeight={0} debounce={50}>
                  <LineChart data={growthHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline)" opacity={0.1} />
                    <XAxis 
                      dataKey="displayDate" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: 'var(--color-secondary)' }}
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--color-card-bg)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-vibrant)',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
                      formatter={(value: number) => [`${value} in`, 'Height']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--color-primary)" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: 'var(--color-primary)', strokeWidth: 2, stroke: 'var(--color-card-bg)' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-secondary text-xs italic opacity-60">
                  <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
                  No growth data yet
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-5 border-b border-outline/20">
            <div className="text-[11px] font-bold text-outline uppercase tracking-wider">Watering History</div>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedPlant.wateringHistory.length > 0 ? (
                selectedPlant.wateringHistory.map((date, i) => (
                  <div key={i} className="px-2 py-1 bg-surface-container-high rounded-md text-[10px] text-text-dark font-medium">
                    {new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' })} {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                ))
              ) : (
                <p className="text-xs text-secondary italic">No history yet</p>
              )}
            </div>
          </div>

            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-bold text-outline uppercase tracking-wider">Optimal Temperature</div>
              <div className="text-sm font-medium text-text-dark">{selectedPlant.minTemp}°C - {selectedPlant.maxTemp}°C</div>
              <p className="text-xs text-secondary mt-1">Keep sheltered from night winds below {selectedPlant.minTemp - 5}°C.</p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-outline uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Scheduled Tasks
                </div>
                <button 
                  onClick={() => setShowTaskModal(true)}
                  className="p-1 px-3 bg-primary/10 text-primary text-[10px] font-bold rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Task
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedPlant.tasks && selectedPlant.tasks.length > 0 ? (
                  selectedPlant.tasks.map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-bg rounded-xl border border-outline/5 hover:border-primary/20 transition-all group/task"
                    >
                      <div 
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => onToggleTask(selectedPlant.id, task.id)}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <Circle className="w-4 h-4 text-outline group-hover/task:text-primary transition-colors" />
                        )}
                        <div className={task.completed ? 'opacity-40' : ''}>
                          <p className={`text-xs font-bold text-text-dark ${task.completed ? 'line-through' : ''}`}>{task.type}</p>
                          <p className="text-[10px] text-secondary">
                            {task.completed && task.completedAt ? (
                              `Completed ${new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            ) : (
                              `${new Date(task.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${task.time}`
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          task.type === 'Water' ? 'bg-blue-500/10 text-blue-500' :
                          task.type === 'Fertilize' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {task.type}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(selectedPlant.id, task.id);
                          }}
                          className="p-1.5 text-outline hover:text-red-500 opacity-0 group-hover/task:opacity-100 transition-all rounded-lg hover:bg-red-50"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-bg rounded-[24px] border border-dashed border-outline/20">
                    <Calendar className="w-8 h-8 text-outline opacity-20 mx-auto mb-2" />
                    <p className="text-[10px] text-secondary italic">No tasks scheduled</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={() => onWaterPlant(selectedPlant.id)}
              className="bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Droplets className="w-5 h-5" />
              Mark as Watered
            </button>
            
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="py-2.5 rounded-xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Remove from Garden
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card-bg rounded-[40px] p-8 max-w-sm w-full shadow-2xl space-y-6 border border-white/5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-dark">Schedule Task</h3>
                <button onClick={() => setShowTaskModal(false)} className="p-2 hover:bg-bg rounded-full text-secondary transition-colors">
                  <X />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-outline uppercase tracking-widest px-1">Task Type</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {taskTypes.map((t) => (
                      <button 
                        key={t}
                        onClick={() => setNewTask({ ...newTask, type: t })}
                        className={`py-3 rounded-[18px] text-xs font-bold transition-all ${
                          newTask.type === t ? 'bg-primary text-white shadow-lg' : 'bg-bg text-secondary border border-outline/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-outline uppercase tracking-widest px-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                        type="date" 
                        value={newTask.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                        className="w-full pl-9 pr-3 py-3 bg-bg border border-outline/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 text-text-dark"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-outline uppercase tracking-widest px-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <input 
                        type="time" 
                        value={newTask.time}
                        onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                        className="w-full pl-9 pr-3 py-3 bg-bg border border-outline/10 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/40 text-text-dark"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onAddTask(selectedPlant.id, {
                    id: Math.random().toString(36).substring(2, 9),
                    ...newTask,
                    completed: false
                  });
                  setShowTaskModal(false);
                }}
                className="w-full py-4 rounded-[24px] bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Schedule Task
              </button>
            </motion.div>
          </motion.div>
        )}

        {showDeleteConfirm && (
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
              className="bg-card-bg rounded-[32px] p-8 max-w-sm w-full shadow-2xl space-y-6 border border-outline/10 text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-dark">Remove {selectedPlant.name}?</h3>
                <p className="text-secondary text-sm font-medium leading-relaxed">
                  Are you sure you want to remove this plant from your garden? This action cannot be undone.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    onRemovePlant(selectedPlant.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
                >
                  Yes, Remove
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
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
