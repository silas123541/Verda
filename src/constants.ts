import { 
  Scissors, 
  Droplets, 
  Utensils, 
  Layers,
  Sun,
  Droplet,
  Wind,
  Cloud
} from 'lucide-react';
import { Plant } from './types';

export const CARE_GUIDES = [
  {
    id: 'tomato',
    name: 'Roma Tomato',
    title: 'Mastering Your Tomato Harvest',
    description: 'Transition from plant maintenance to a bountiful yield by focusing on pruning, organic feeding, and identifying the perfect moment to pick.',
    icon: '🍅',
    supplies: [
      { icon: 'scissors', label: 'Clean Garden Snips', sub: 'Sanitize before use', checked: true },
      { icon: 'droplets', label: 'Organic 4-6-8 Fertilizer', sub: 'Low Nitrogen for fruit', checked: false },
      { icon: 'utensils', label: 'Breathable Baskets', sub: 'Prevent bruising', checked: false },
    ],
    steps: [
      {
        title: 'Prune the Suckers',
        description: "Identify 'suckers'—the small shoots growing in the crotch between the main stem and a leaf branch. Pinch them off when they are small (under 2 inches) to redirect the plant's energy toward ripening fruit rather than growing more leaves.",
        theme: 'PRUNE'
      },
      {
        title: 'Morning Watering',
        description: 'Water deeply at the base of the plant early in the morning. Avoid wetting the leaves to prevent fungal diseases like blight.',
        theme: 'WATER'
      }
    ]
  },
  {
    id: 'basil',
    name: 'Sweet Basil',
    title: 'Bushy Basil Secrets',
    description: 'Learn how to keep your basil productive all summer long by preventing flowering and encouraging lateral growth.',
    icon: '🌿',
    supplies: [
      { icon: 'scissors', label: 'Precision Snips', sub: 'For delicate stems', checked: true },
      { icon: 'droplets', label: 'Fish Emulsion', sub: 'High nitrogen for leaves', checked: false },
    ],
    steps: [
      {
        title: 'Pinch the Tops',
        description: 'Once your basil is 6 inches tall, pinch off the top set of leaves. This forces the plant to branch out, creating a bushier, more productive plant.',
        theme: 'PRUNE'
      },
      {
        title: 'Remove Flower Buds',
        description: 'As soon as you see flower buds forming, pinch them off. Flowering changes the leaf flavor to be more bitter and stops leaf production.',
        theme: 'HEALTH'
      }
    ]
  },
  {
    id: 'carrot',
    name: 'Orange Carrots',
    title: 'Perfect Root Development',
    description: 'Carrots require loose soil and consistent moisture. Discover the tricks to growing straight, sweet roots.',
    icon: '🥕',
    supplies: [
      { icon: 'droplets', label: 'Consistent Water', sub: 'Prevent splitting', checked: true },
      { icon: 'layers', label: 'Mulch Layer', sub: 'Keep shoulders covered', checked: false },
    ],
    steps: [
      {
        title: 'Thinning Seedlings',
        description: 'When seedlings are 2 inches tall, thin them to 3 inches apart. This ensures each root has enough space to grow without competition.',
        theme: 'SOIL'
      },
      {
        title: 'Hilling Shoulders',
        description: 'If you see the orange tops (shoulders) popping out of the soil, cover them with more soil or mulch to prevent them from turning green and bitter.',
        theme: 'HARVEST'
      }
    ]
  }
];

export const INITIAL_PLANTS: Plant[] = [];
