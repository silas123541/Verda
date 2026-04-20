export interface WeatherData {
  uvIndex: number;
  sunrise: string;
  sunset: string;
  isDay: boolean;
  cloudCover: number;
  humidity: number;
}

export const searchLocations = async (name: string) => {
  if (!name || name.length < 2) return [];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en&format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    if (!data.results) return [];
    return data.results.map((r: any) => ({
      lat: r.latitude,
      lon: r.longitude,
      name: r.name,
      country: r.country,
      admin1: r.admin1 // State/Region
    }));
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error("Geocoding search timed out");
    } else {
      console.error("Search geocoding error:", err);
    }
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchGeocoding = async (name: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;
    return {
      lat: data.results[0].latitude,
      lon: data.results[0].longitude,
      name: data.results[0].name
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset,uv_index_max&current=is_day,cloud_cover,relative_humidity_2m&timezone=auto`
    );
    if (!response.ok) throw new Error("Weather API failure");
    const data = await response.json();

    return {
      uvIndex: data.daily.uv_index_max[0],
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
      isDay: data.current.is_day === 1,
      cloudCover: data.current.cloud_cover,
      humidity: data.current.relative_humidity_2m,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
