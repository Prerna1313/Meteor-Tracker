export type MeteorData = {
  id: string;
  size: number;
  trajectory: string;
  composition: string;
};

export type CometData = {
  id: string;
  name: string;
  size: number; // radius in km
  composition: string;
  orbitalPeriod: number; // in years
  trajectory: string;
};


export type CelestialObject = {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'asteroid-belt';
  size: number; // radius in arbitrary units
  distance: number; // distance from sun in arbitrary units
  color: string; // hex color
  orbitalSpeed: number; // arbitrary speed factor
  rotationSpeed: number; // arbitrary speed factor
  meteors: MeteorData[];
  comets?: CometData[];
  rings?: { innerRadius: number; outerRadius: number };
};

export const initialSolarSystemData: CelestialObject[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    size: 20,
    distance: 0,
    color: '#FFFF8F',
    orbitalSpeed: 0,
    rotationSpeed: 0.05,
    meteors: [],
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    size: 2,
    distance: 40,
    color: '#A9A9A9',
    orbitalSpeed: 1.6,
    rotationSpeed: 0.1,
    meteors: [],
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    size: 4,
    distance: 70,
    color: '#FFA500',
    orbitalSpeed: 1.2,
    rotationSpeed: 0.08,
    meteors: [],
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    size: 5,
    distance: 100,
    color: '#4682B4',
    orbitalSpeed: 1,
    rotationSpeed: 0.5,
    meteors: [],
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    size: 3,
    distance: 150,
    color: '#FF4500',
    orbitalSpeed: 0.8,
    rotationSpeed: 0.45,
    meteors: [],
  },
  {
    id: 'asteroid-belt',
    name: 'Asteroid Belt',
    type: 'asteroid-belt',
    size: 0.1, 
    distance: 220, // Average distance
    color: '#FFFFFF',
    orbitalSpeed: 0.5,
    rotationSpeed: 0,
    meteors: [], 
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    size: 10,
    distance: 320,
    color: '#D2B48C',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.8,
    meteors: [],
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    size: 9,
    distance: 450,
    color: '#F0E68C',
    orbitalSpeed: 0.32,
    rotationSpeed: 0.75,
    meteors: [],
    rings: { innerRadius: 12, outerRadius: 20 },
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    size: 7,
    distance: 600,
    color: '#AFEEEE',
    orbitalSpeed: 0.22,
    rotationSpeed: 0.6,
    meteors: [],
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    size: 7,
    distance: 750,
    color: '#3F51B5',
    orbitalSpeed: 0.18,
    rotationSpeed: 0.55,
    meteors: [],
  },
];
