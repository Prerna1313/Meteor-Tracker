
export type CelestialObject = {
  id: string;
  name: string;
  type: 'star' | 'planet';
  size: number; // radius in arbitrary units
  distance: number; // distance from sun in arbitrary units
  color: string; // hex color
  orbitalSpeed: number; // arbitrary speed factor
  rotationSpeed: number; // arbitrary speed factor
  textureUrl?: string;
  rings?: { innerRadius: number; outerRadius: number; textureUrl: string; };
  eccentricity?: number;
};

export const solarSystemData: CelestialObject[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    size: 20,
    distance: 0,
    color: '#FFFF8F',
    orbitalSpeed: 0,
    rotationSpeed: 0.05,
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
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury.jpg',
    eccentricity: 0.206
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
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js_old/master/examples/textures/planets/venus_surface.jpg',
    eccentricity: 0.007
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
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    eccentricity: 0.017
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
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg',
    eccentricity: 0.093
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
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg',
    eccentricity: 0.048
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
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg',
    rings: { innerRadius: 12, outerRadius: 20, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/saturn_ring.png' },
    eccentricity: 0.054
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
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg',
    eccentricity: 0.047
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
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg',
    eccentricity: 0.009
  },
];
