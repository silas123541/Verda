import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Screen, Plant, User } from './types';
import { INITIAL_PLANTS, CARE_GUIDES } from './constants';
import { Droplets, Scissors, Utensils, Layers } from 'lucide-react';

// Components
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { ProfileSetup } from './components/ProfileSetup';
import { CameraCapture } from './components/CameraCapture';
import { Dashboard } from './components/Dashboard';
import { AddPlant } from './components/AddPlant';
import { CareGuides } from './components/CareGuides';
import { Settings } from './components/Settings';
import { Toast } from './components/Toast';
import { fetchWeatherData, fetchGeocoding, WeatherData } from './services/weatherService';

// --- AI Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  // --- State ---
  const [currentScreen, setCurrentScreen] = useState<Screen>('DASHBOARD');
  const [plants, setPlants] = useState<Plant[]>(() => {
    const saved = localStorage.getItem('plants');
    return saved ? JSON.parse(saved) : INITIAL_PLANTS;
  });
  const [careGuides, setCareGuides] = useState<any[]>(() => {
    const saved = localStorage.getItem('careGuides');
    return saved ? JSON.parse(saved) : [];
  });
  const [userTaskTypes, setUserTaskTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem('userTaskTypes');
    return saved ? JSON.parse(saved) : ['Water', 'Fertilize', 'Prune', 'Nutrient'];
  });
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>('1');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved === 'true';
  });
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [guideSearchQuery, setGuideSearchQuery] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
  const [identifiedPlant, setIdentifiedPlant] = useState<Partial<Plant> | null>(null);
  const [newPlantLocation, setNewPlantLocation] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved === 'true';
  });
  const [activeToast, setActiveToast] = useState<{ message: string; sub: string } | null>(null);

  // Auto-dismiss toast after 3.5 seconds
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const [lastNotifiedPlantId, setLastNotifiedPlantId] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [autoLocation, setAutoLocation] = useState(true);
  const [manualLocation, setManualLocation] = useState('New York');
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {
      name: 'Jamie Botanical',
      email: 'jamie.garden@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
    };
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('plants', JSON.stringify(plants));
  }, [plants]);

  useEffect(() => {
    localStorage.setItem('careGuides', JSON.stringify(careGuides));
  }, [careGuides]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('userTaskTypes', JSON.stringify(userTaskTypes));
  }, [userTaskTypes]);

  // Fetch weather data based on geolocation OR manual location
  const refreshWeather = useCallback(async (auto: boolean, manual: string) => {
    setWeatherError(false);
    const handleFallback = async () => {
      try {
        const coords = await fetchGeocoding(manual);
        if (coords) {
          const data = await fetchWeatherData(coords.lat, coords.lon);
          setWeatherData(data);
          setWeatherError(false);
        } else {
          setWeatherError(true);
        }
      } catch (err) {
        console.error("Manual location weather failed:", err);
        setWeatherError(true);
      }
    };

    if (auto && "geolocation" in navigator) {
      // Use a timeout for geolocation as it can hang in iframes
      const geoTimeout = setTimeout(() => {
        console.warn("Geolocation timed out, falling back to manual");
        handleFallback();
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          clearTimeout(geoTimeout);
          try {
            const data = await fetchWeatherData(position.coords.latitude, position.coords.longitude);
            setWeatherData(data);
          } catch (err) {
            console.error("Failed to fetch weather:", err);
            handleFallback();
          }
        },
        async (err) => {
          clearTimeout(geoTimeout);
          console.error("Geolocation error:", err);
          handleFallback();
        },
        { timeout: 10000 }
      );
    } else {
      handleFallback();
    }
  }, []);

  useEffect(() => {
    const hasInitializedProfile = localStorage.getItem('hasInitializedProfile');
    const savedAutoLoc = localStorage.getItem('autoLocation') !== 'false';
    const savedManualLoc = localStorage.getItem('manualLocation') || 'New York';
    
    setAutoLocation(savedAutoLoc);
    setManualLocation(savedManualLoc);
    
    if (!hasInitializedProfile) {
      setIsProfileSetupOpen(true);
    }
    
    // We handle notificationsEnabled initialization in useState, but we still check for permission
    if (notificationsEnabled && "Notification" in window && Notification.permission === "default") {
      // Don't auto-request on mount to avoid blocking, user should toggle in settings
    }

    refreshWeather(savedAutoLoc, savedManualLoc);
  }, [refreshWeather, notificationsEnabled]);

  // Sync weather when location settings change
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshWeather(autoLocation, manualLocation);
    }, 1000); // 1s debounce
    return () => clearTimeout(timer);
  }, [autoLocation, manualLocation, refreshWeather]);

  // Check for low hydration and notify
  useEffect(() => {
    if (notificationsEnabled) {
      const thirstyPlants = plants.filter(p => p.hydration < 30 && p.status !== 'Thriving');
      
      if (thirstyPlants.length > 0) {
        const plant = thirstyPlants[0]; // Just notify for the first one to avoid spam
        
        if (plant.id !== lastNotifiedPlantId) {
          const title = `Plant Alert: ${plant.name}`;
          const body = `${plant.name} is thirsty (${plant.hydration}%). It needs some water!`;

          // 1. Try Native Notification
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              new Notification(title, { body, icon: '/favicon.ico' });
            } catch (e) {
              console.warn("Native notification failed, falling back to toast");
            }
          }

          // 2. Always show in-app Toast as well (better for iframe/preview)
          setActiveToast({ message: title, sub: body });
          setLastNotifiedPlantId(plant.id);
        }
      } else {
        setLastNotifiedPlantId(null);
      }
    }
  }, [plants, notificationsEnabled, lastNotifiedPlantId]);

  // --- Hydration Decay ---
  const syncHydration = useCallback(() => {
    setPlants(prevPlants => {
      const now = new Date();
      let changed = false;
      
      const updated = prevPlants.map(plant => {
        // Base rate: ~20% per day for Medium need
        // Low: ~10% per day (0.0069), Medium: ~20% per day (0.0138), High: ~35% per day (0.0243)
        let decayRatePerMinute = 0.0138; 
        if (plant.wateringNeed === 'Low') decayRatePerMinute = 0.0069;
        if (plant.wateringNeed === 'High') decayRatePerMinute = 0.0243;

        // Adjust rate based on environmental conditions
        if (weatherData) {
          // UV index increases evaporation significantly (UV 0-10)
          const uvFactor = 1 + (weatherData.uvIndex / 10);
          // Humidity decreases evaporation (Humidity 0-100)
          // 50% humidity is baseline (factor 1.0)
          const humidityFactor = Math.max(0.1, (100 - weatherData.humidity) / 50);
          
          decayRatePerMinute *= (uvFactor * humidityFactor);
        }
        
        const lastUpdate = new Date(plant.lastHydrationUpdate);
        const lastLightUpdateDate = plant.lastLightUpdate ? new Date(plant.lastLightUpdate) : lastUpdate;
        const diffMinutes = Math.max(0, (now.getTime() - lastUpdate.getTime()) / (1000 * 60));

        let updatedPlant = { ...plant };

        // --- 1. Accumulate Light Intake ---
        const lastLightDateStr = lastLightUpdateDate.toDateString();
        const isNewDay = lastLightDateStr !== now.toDateString();

        if (isNewDay) {
          updatedPlant.lightIntake = 0;
          updatedPlant.lastLightUpdate = now.toISOString();
          changed = true;
        }

        let sunrise: Date;
        let sunset: Date;
        let cloudFactor = 1.0;

        if (weatherData) {
          sunrise = new Date(weatherData.sunrise);
          sunset = new Date(weatherData.sunset);
          cloudFactor = 1 - (weatherData.cloudCover / 100 * 0.7);
        } else {
          // Standard astronomical fallback (6 AM to 7 PM)
          sunrise = new Date(now);
          sunrise.setHours(6, 0, 0, 0);
          sunset = new Date(now);
          sunset.setHours(19, 0, 0, 0);
          cloudFactor = 0.8; // Assume moderate clear-ish day as baseline
        }
        
        // Calculate overlap between [lastLightUpdateDate, now] and [sunrise, sunset]
        const windowStart = new Date(Math.max(lastLightUpdateDate.getTime(), sunrise.getTime()));
        const windowEnd = new Date(Math.min(now.getTime(), sunset.getTime()));
        
        if (windowEnd > windowStart) {
          const daylightMinutesPassed = (windowEnd.getTime() - windowStart.getTime()) / (1000 * 60);
          const lightGain = (daylightMinutesPassed / 60) * cloudFactor;
          
          updatedPlant = {
            ...updatedPlant,
            lightIntake: Number((updatedPlant.lightIntake + lightGain).toFixed(3)),
            lastLightUpdate: now.toISOString()
          };
          changed = true;
        } else if (updatedPlant.lastLightUpdate !== now.toISOString()) {
          // Update timestamp even if no light gained (e.g., night time) to maintain check-in sync
          updatedPlant.lastLightUpdate = now.toISOString();
          changed = true;
        }

        // --- 2. Update Status based on Light ---
        const sunsetTime = weatherData ? new Date(weatherData.sunset) : null;
        const isLate = sunsetTime ? now > sunsetTime : now.getHours() >= 19;
        
        if (isLate && updatedPlant.lightIntake < updatedPlant.requiredLight) {
          if (updatedPlant.status === 'Thriving') {
            updatedPlant.status = 'Attention';
            updatedPlant.careAlert = 'Insufficient Light';
            changed = true;
          }
        }
        
        // --- 3. Hydration Decay ---
        if (diffMinutes >= 1) {
          let sunrise: Date;
          let sunset: Date;

          if (weatherData) {
            sunrise = new Date(weatherData.sunrise);
            sunset = new Date(weatherData.sunset);
          } else {
            sunrise = new Date(now);
            sunrise.setHours(6, 0, 0, 0);
            sunset = new Date(now);
            sunset.setHours(19, 0, 0, 0);
          }

          // Calculate daylight and night minutes for the decay window
          const windowStart = lastUpdate.getTime();
          const windowEnd = now.getTime();
          
          let daylightMinutes = 0;
          let nightMinutes = 0;
          
          // Simple approximation of daylight overlap
          const dayStart = sunrise.getTime();
          const dayEnd = sunset.getTime();
          
          const intersectionStart = Math.max(windowStart, dayStart);
          const intersectionEnd = Math.min(windowEnd, dayEnd);
          
          if (intersectionEnd > intersectionStart) {
            daylightMinutes = (intersectionEnd - intersectionStart) / (1000 * 60);
          }
          nightMinutes = diffMinutes - daylightMinutes;

          // Apply 1.5x multiplier for daylight evaporation (simplified)
          const baseRate = decayRatePerMinute;
          const weightedLoss = (daylightMinutes * baseRate * 1.5) + (nightMinutes * baseRate);
          
          const newHydration = Math.max(0, updatedPlant.hydration - weightedLoss);
          
          if (newHydration !== updatedPlant.hydration) {
            changed = true;
            let newStatus = updatedPlant.status;
            let newAlert = updatedPlant.careAlert;
            
            if (newHydration < 20) {
              newStatus = 'Thirsty';
              newAlert = 'Needs Water';
            } else if (newHydration < 45 && updatedPlant.status === 'Thriving') {
              newStatus = 'Attention';
              newAlert = 'Getting Dry';
            }

            updatedPlant = { 
              ...updatedPlant, 
              hydration: Number(newHydration.toFixed(2)),
              lastHydrationUpdate: now.toISOString(),
              status: newStatus as any,
              careAlert: newAlert
            };
          }
        }
        return updatedPlant;
      });
      
      return changed ? updated : prevPlants;
    });
  }, [weatherData]);

  useEffect(() => {
    // Initial sync on mount
    syncHydration();

    const DECAY_INTERVAL = 60 * 1000; // Check every minute
    const interval = setInterval(syncHydration, DECAY_INTERVAL);
    
    return () => clearInterval(interval);
  }, [syncHydration]);

  // --- Task Reminders ---
  useEffect(() => {
    if (!notificationsEnabled) return;

    const REMINDER_INTERVAL = 60 * 1000; // Check every minute

    const interval = setInterval(() => {
      const now = new Date();
      let hasChanges = false;

      const updatedPlants = plants.map(plant => {
        let plantTasksChanged = false;
        const updatedTasks = (plant.tasks || []).map(task => {
          if (!task.completed && !task.notified) {
            const taskDateTime = new Date(`${task.date}T${task.time}`);
            if (now >= taskDateTime) {
              const taskTypeDisplay = (typeof task.type === 'string' ? task.type : 'scheduled task').toLowerCase();
              const title = `Task Due: ${task.type}`;
              const body = `It's time to ${taskTypeDisplay} your ${plant.name}!`;

              // 1. Native Notification
              if ("Notification" in window && Notification.permission === "granted") {
                try {
                  new Notification(title, { body, icon: '/favicon.ico' });
                } catch (e) {
                  console.warn("Native notification failed");
                }
              }

              // 2. In-app Toast
              setActiveToast({ message: title, sub: body });
              
              plantTasksChanged = true;
              return { ...task, notified: true };
            }
          }
          return task;
        });

        if (plantTasksChanged) {
          hasChanges = true;
          return { ...plant, tasks: updatedTasks };
        }
        return plant;
      });

      if (hasChanges) {
        setPlants(updatedPlants);
      }
    }, REMINDER_INTERVAL);

    return () => clearInterval(interval);
  }, [plants, notificationsEnabled]);

  // --- Task Cleanup ---
  useEffect(() => {
    const CLEANUP_INTERVAL = 60 * 1000; // Check every minute
    const EXPIRE_TIME = 12 * 60 * 60 * 1000; // 12 hours

    const interval = setInterval(() => {
      const now = Date.now();
      let hasChanges = false;

      const updatedPlants = plants.map(plant => {
        const filteredTasks = (plant.tasks || []).filter(task => {
          if (task.completed && task.completedAt) {
            const completionTime = new Date(task.completedAt).getTime();
            return (now - completionTime) < EXPIRE_TIME;
          }
          return true;
        });

        if (filteredTasks.length !== (plant.tasks?.length || 0)) {
          hasChanges = true;
          return { ...plant, tasks: filteredTasks };
        }
        return plant;
      });

      if (hasChanges) {
        setPlants(updatedPlants);
      }
    }, CLEANUP_INTERVAL);

    return () => clearInterval(interval);
  }, [plants]);

  // --- Callbacks ---
  const completeProfileSetup = useCallback(() => {
    localStorage.setItem('hasInitializedProfile', 'true');
    setIsProfileSetupOpen(false);
  }, []);

  const toggleNotifications = useCallback(async () => {
    console.log("Toggling notifications. Current state:", notificationsEnabled);
    
    if (!notificationsEnabled) {
      if (!("Notification" in window)) {
        console.warn("Notifications not supported in this browser");
        return;
      }
      
      try {
        const permission = await Notification.requestPermission();
        console.log("Notification permission result:", permission);
        
        if (permission === "granted") {
          setNotificationsEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          setActiveToast({ 
            message: "Notifications Enabled", 
            sub: "You will now receive native and in-app alerts." 
          });
        } else {
          console.warn("Notification permission denied. This is common in preview iframes.");
          setNotificationsEnabled(true);
          localStorage.setItem('notificationsEnabled', 'true');
          setActiveToast({ 
            message: "In-App Alerts Active", 
            sub: "Native notifications are blocked in this preview. Open in a new tab to enable them." 
          });
        }
      } catch (err) {
        console.error("Error requesting notification permission:", err);
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        setActiveToast({ 
          message: "In-App Alerts Active", 
          sub: "Using in-app notifications for this environment." 
        });
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  }, [notificationsEnabled]);

  // --- Helpers ---
  const parseAIJSON = (text: string) => {
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?|```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (err) {
      console.error("JSON Parse Error:", err, "Original text:", text);
      throw new Error("Failed to parse AI response as JSON");
    }
  };

  const searchPlants = async (query: string) => {
    setIsSearching(true);
    setIdentifiedPlant(null);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: `Find details for the plant "${query}". Return JSON with: 
            name, 
            scientificName, 
            emoji (a relevant single emoji), 
            status (one of: 'Thriving', 'Attention', 'Thirsty', 'Low Humidity', 'Nutrient Alert', 'Harvest Ready'),
            careAlert (optional, only if there is an active issue like 'Needs Water' or 'Pest Alert'), 
            growth (height in inches, number), 
            hydration (number 0-100), 
            wateringNeed (one of: 'Low', 'Medium', 'High' based on species frequency needs),
            lightIntake (number 0-12),
            requiredLight (optimal daily hours, number 1-12),
            minTemp (minimum optimal degrees Celsius, number),
            maxTemp (maximum optimal degrees Celsius, number). 
            Ensure the scientific name is accurate.`
          }
        ]
      });

      const result = parseAIJSON(response.text);
      setIdentifiedPlant({
        id: Math.random().toString(36).substring(2, 11),
        name: result.name,
        scientificName: result.scientificName,
        emoji: result.emoji || '🌿',
        careAlert: result.careAlert,
        growth: result.growth || 50,
        hydration: 100,
        lastHydrationUpdate: new Date().toISOString(),
        lightIntake: result.lightIntake || 6,
        requiredLight: result.requiredLight || 8,
        minTemp: result.minTemp || 18,
        maxTemp: result.maxTemp || 28,
        wateringHistory: [],
        growthHistory: [
          { date: new Date().toISOString().split('T')[0], value: result.growth || 50 }
        ],
        status: result.status || 'Thriving',
        wateringNeed: result.wateringNeed || 'Medium',
        type: 'Plant',
        image: `https://picsum.photos/seed/${result.name}/800/600`,
        tasks: []
      });
    } catch (err) {
      console.error("Search error:", err);
      setActiveToast({
        message: "Search Error",
        sub: "Could not find plant details. Please try again."
      });
    } finally {
      setIsSearching(false);
    }
  };

  const generateCareGuide = async (plantName: string) => {
    setIsGeneratingGuide(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: `Generate a comprehensive care guide for the plant "${plantName}". 
            Return JSON with the following structure:
            {
              "id": "unique-id",
              "name": "Plant Name",
              "title": "Catchy Guide Title",
              "description": "Brief overview of care",
              "icon": "Emoji icon",
              "supplies": [
                { "label": "Supply Name", "sub": "Short tip", "checked": false }
              ],
              "steps": [
                { 
                  "title": "Step Title", 
                  "description": "Detailed instructions", 
                  "theme": "ONE OF: WATER, PRUNE, SOIL, LIGHT, HARVEST, HEALTH, GENERAL"
                }
              ]
            }
            Ensure the JSON is valid and the content is helpful for a home gardener. 
            CRITICAL: Assign each step a 'theme' from the list above that best matches the care action.`
          }
        ]
      });

      const result = parseAIJSON(response.text);
      
      const THEME_IMAGES: Record<string, string> = {
        'WATER': '1585320806297-9794b3e4eeae',
        'PRUNE': '1592419044706-39796d40f98c',
        'SOIL': '1444858291040-58f756a3bdd6',
        'LIGHT': '1501004318641-739e5539f990',
        'HARVEST': '1598170845058-32b9d6a5da37',
        'HEALTH': '1591857177580-dc32d7abc4b7',
        'GENERAL': '1520302630591-fd1c66ed8181'
      };

      // Smart mapping for generated guides
      const newGuide = {
        ...result,
        supplies: (result.supplies || []).map((s: any) => {
          let icon = 'droplets';
          const label = (typeof s.label === 'string' ? s.label : '').toLowerCase();
          if (label.includes('scissors') || label.includes('snips') || label.includes('prun')) icon = 'scissors';
          if (label.includes('fertilizer') || label.includes('feed') || label.includes('food')) icon = 'droplets';
          if (label.includes('basket') || label.includes('pot') || label.includes('container')) icon = 'utensils';
          if (label.includes('mulch') || label.includes('soil') || label.includes('layer')) icon = 'layers';
          return { ...s, icon };
        }),
        steps: (result.steps || []).map((step: any) => {
          const photoId = THEME_IMAGES[step.theme] || THEME_IMAGES.GENERAL;
          return {
            ...step,
            image: `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800`
          };
        })
      };

      setCareGuides([newGuide, ...careGuides]);
      setSelectedGuideId(newGuide.id);
      setGuideSearchQuery('');
      setCurrentScreen('TOMATO_CARE');
    } catch (err) {
      console.error("Guide generation error:", err);
      setActiveToast({
        message: "Generation Failed",
        sub: "A specialized care guide couldn't be generated right now."
      });
    } finally {
      setIsGeneratingGuide(false);
    }
  };

  const identifyPlant = async (base64: string) => {
    setIsCameraOpen(false);
    setIsIdentifying(true);
    setIdentifiedPlant(null);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64
            }
          },
          {
            text: `Identify this plant. Return JSON with: 
            name, 
            scientificName, 
            emoji (a relevant single emoji), 
            status (one of: 'Thriving', 'Attention', 'Thirsty', 'Low Humidity', 'Nutrient Alert', 'Harvest Ready'),
            careAlert (optional, only if there is an active issue like 'Needs Water' or 'Pest Alert'), 
            growth (height in inches, number), 
            hydration (number 0-100), 
            wateringNeed (one of: 'Low', 'Medium', 'High' based on species frequency needs),
            lightIntake (number 0-12),
            requiredLight (optimal daily hours, number 1-12),
            minTemp (minimum optimal degrees Celsius, number),
            maxTemp (maximum optimal degrees Celsius, number).`
          }
        ]
      });

      const result = parseAIJSON(response.text);
      setIdentifiedPlant({
        id: Math.random().toString(36).substring(2, 11),
        name: result.name,
        scientificName: result.scientificName,
        emoji: result.emoji || '🌿',
        careAlert: result.careAlert,
        growth: result.growth || 50,
        hydration: 100,
        lastHydrationUpdate: new Date().toISOString(),
        lightIntake: result.lightIntake || 6,
        requiredLight: result.requiredLight || 8,
        minTemp: result.minTemp || 18,
        maxTemp: result.maxTemp || 28,
        wateringHistory: [],
        growthHistory: [
          { date: new Date().toISOString().split('T')[0], value: result.growth || 50 }
        ],
        status: result.status || 'Thriving',
        wateringNeed: result.wateringNeed || 'Medium',
        type: 'Plant',
        image: `https://picsum.photos/seed/${result.name}/800/600`,
        tasks: []
      });
    } catch (err) {
      console.error("Identification error:", err);
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleAddIdentified = () => {
    if (identifiedPlant) {
      setPlants([{ ...identifiedPlant, location: newPlantLocation } as Plant, ...plants]);
      setIdentifiedPlant(null);
      setNewPlantLocation('');
      setCurrentScreen('DASHBOARD');
    }
  };

  const handleWaterPlant = (id: string) => {
    setPlants(plants.map(p => {
      if (p.id === id) {
        return {
          ...p,
          hydration: 100,
          lastHydrationUpdate: new Date().toISOString(),
          status: 'Thriving',
          careAlert: undefined,
          careAction: undefined,
          wateringHistory: [new Date().toISOString(), ...p.wateringHistory].slice(0, 10)
        };
      }
      return p;
    }));
  };

  const handleRecordGrowth = (id: string, value: number) => {
    setPlants(plants.map(p => {
      if (p.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const history = [...p.growthHistory];
        const existingIndex = history.findIndex(h => h.date === today);
        
        if (existingIndex !== -1) {
          history[existingIndex].value = value;
        } else {
          history.push({ date: today, value });
        }

        return {
          ...p,
          growth: value,
          growthHistory: history.sort((a, b) => a.date.localeCompare(b.date)).slice(-10)
        };
      }
      return p;
    }));
  };
  
  const handleRemovePlant = (id: string) => {
    setPlants(plants.filter(p => p.id !== id));
    if (selectedPlantId === id) {
      setSelectedPlantId(plants.filter(p => p.id !== id)[0]?.id || null);
    }
  };

  const handleAddTask = (plantId: string, task: any) => {
    setPlants(plants.map(p => {
      if (p.id === plantId) {
        return { ...p, tasks: [...(p.tasks || []), task] };
      }
      return p;
    }));
  };

  const handleToggleTask = (plantId: string, taskId: string) => {
    setPlants(plants.map(p => {
      if (p.id === plantId) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              const newCompleted = !t.completed;
              return { 
                ...t, 
                completed: newCompleted,
                completedAt: newCompleted ? new Date().toISOString() : undefined
              };
            }
            return t;
          })
        };
      }
      return p;
    }));
  };

  const handleDeleteTask = (plantId: string, taskId: string) => {
    setPlants(plants.map(p => {
      if (p.id === plantId) {
        return {
          ...p,
          tasks: (p.tasks || []).filter(t => t.id !== taskId)
        };
      }
      return p;
    }));
  };

  const handleRemoveGuide = (guideId: string) => {
    setCareGuides(prev => prev.filter(g => g.id !== guideId));
    setSelectedGuideId(null);
    setActiveToast({
      message: "Guide Removed",
      sub: "The care guide has been deleted from your library."
    });
  };

  return (
    <div className={`fixed inset-0 w-full overflow-hidden bg-bg transition-colors duration-300 flex ${isDarkMode ? 'dark' : ''}`}>
      {isCameraOpen && <CameraCapture onCapture={identifyPlant} onClose={() => setIsCameraOpen(false)} />}
      <Sidebar activeTab={currentScreen} onTabChange={setCurrentScreen} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        <main className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-10 pb-[calc(100px+env(safe-area-inset-bottom))] md:pb-10 overscroll-contain">
          <AnimatePresence mode="wait">
            {currentScreen === 'DASHBOARD' && (
              <Dashboard 
                user={user}
                plants={plants} 
                selectedPlantId={selectedPlantId} 
                setSelectedPlantId={setSelectedPlantId} 
                setCurrentScreen={setCurrentScreen} 
                onWaterPlant={handleWaterPlant}
                onRecordGrowth={handleRecordGrowth}
                onRemovePlant={handleRemovePlant}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                weatherData={weatherData}
                weatherError={weatherError}
                taskTypes={userTaskTypes}
              />
            )}

            {currentScreen === 'ADD_PLANT' && (
              <AddPlant 
                setCurrentScreen={setCurrentScreen}
                setIsCameraOpen={setIsCameraOpen}
                isIdentifying={isIdentifying}
                isSearching={isSearching}
                onSearch={searchPlants}
                identifiedPlant={identifiedPlant}
                setIdentifiedPlant={setIdentifiedPlant}
                handleAddIdentified={handleAddIdentified}
                onGenerateGuide={generateCareGuide}
                isGeneratingGuide={isGeneratingGuide}
                newPlantLocation={newPlantLocation}
                setNewPlantLocation={setNewPlantLocation}
              />
            )}

            {currentScreen === 'TOMATO_CARE' && (
              <CareGuides 
                setCurrentScreen={setCurrentScreen}
                selectedGuideId={selectedGuideId}
                setSelectedGuideId={setSelectedGuideId}
                guideSearchQuery={guideSearchQuery}
                setGuideSearchQuery={setGuideSearchQuery}
                careGuides={careGuides}
                onGenerateGuide={generateCareGuide}
                isGenerating={isGeneratingGuide}
                onRemoveGuide={handleRemoveGuide}
              />
            )}

            {currentScreen === 'SETTINGS' && (
              <Settings 
                user={user}
                setUser={setUser}
                plants={plants}
                setPlants={setPlants}
                careGuides={careGuides}
                setCareGuides={setCareGuides}
                taskTypes={userTaskTypes}
                setTaskTypes={setUserTaskTypes}
                setCurrentScreen={setCurrentScreen}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                notificationsEnabled={notificationsEnabled}
                toggleNotifications={toggleNotifications}
                autoLocation={autoLocation}
                setAutoLocation={(val) => {
                  setAutoLocation(val);
                  localStorage.setItem('autoLocation', String(val));
                }}
                manualLocation={manualLocation}
                setManualLocation={(val) => {
                  setManualLocation(val);
                  localStorage.setItem('manualLocation', val);
                }}
                setActiveToast={setActiveToast}
              />
            )}
          </AnimatePresence>
        </main>

        <MobileNav activeTab={currentScreen} onTabChange={setCurrentScreen} />
      </div>

      <AnimatePresence>
        {isProfileSetupOpen && (
          <ProfileSetup 
            user={user}
            onUpdate={setUser}
            onComplete={completeProfileSetup}
          />
        )}
      </AnimatePresence>

      <Toast 
        isVisible={!!activeToast}
        message={activeToast?.message || ''}
        subMessage={activeToast?.sub || ''}
        onClose={() => setActiveToast(null)}
      />
    </div>
  );
}
