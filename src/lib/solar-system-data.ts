'use client';
import * as THREE from 'three';

export type CelestialObject = {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'region';
  size: number;
  distance: number;
  color: string;
  orbitalSpeed: number;
  rotationSpeed: number;
  rings?: { innerRadius: number; outerRadius: number; textureUrl: string; };
  eccentricity?: number;
  description?: string;
  diameter?: number; // in km
  mass?: string; // in 10^24 kg
  dayLength?: number; // in hours
  orbitCurve?: THREE.EllipseCurve;
  orbitalInclination?: number; // Add inclination for comets
  orbitalOffset?: number; // to offset position in orbit
};

// Simplified scaling for better visual separation
const AU = 15; // Arbitrary unit for spacing

export const solarSystemData: CelestialObject[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    size: 8,
    distance: 0,
    color: '#FFD700',
    orbitalSpeed: 0,
    rotationSpeed: 0.05,
    description: 'The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
    diameter: 1392700,
    mass: '1989000',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    size: 0.5,
    distance: 2.5 * AU,
    color: '#9C27B0', // Purple
    orbitalSpeed: 1.6,
    rotationSpeed: 0.1,
    eccentricity: 0.206,
    orbitalOffset: 0.1,
    description: 'Mercury is the smallest planet in the Solar System and nearest to the Sun. Its orbit takes 87.97 Earth days, the shortest of all the Sun\'s planets.',
    diameter: 4879,
    mass: '0.330',
    dayLength: 4222.6
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    size: 1,
    distance: 4 * AU,
    color: '#FFC107', // Dark Yellow
    orbitalSpeed: 1.2,
    rotationSpeed: 0.08,
    eccentricity: 0.007,
    orbitalOffset: 0.7,
    description: 'Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the second-brightest natural object in the night sky after the Moon, Venus can cast shadows and can be, on rare occasion, visible to the naked eye in broad daylight.',
    diameter: 12104,
    mass: '4.87',
    dayLength: 2802.0
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    size: 1,
    distance: 5.5 * AU,
    color: '#2196F3', // Shiny Blue
    orbitalSpeed: 1,
    rotationSpeed: 0.5,
    eccentricity: 0.017,
    orbitalOffset: 0.4,
    description: 'Our home, Earth, is the third planet from the Sun and the only astronomical object known to harbor life. About 29.2% of Earth\'s surface is land consisting of continents and islands.',
    diameter: 12742,
    mass: '5.97',
    dayLength: 24.0
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    size: 0.7,
    distance: 7 * AU,
    color: '#FF9800', // Light Orange
    orbitalSpeed: 0.8,
    rotationSpeed: 0.45,
    eccentricity: 0.093,
    orbitalOffset: 0.9,
    description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being only larger than Mercury. In English, Mars carries the name of the Roman god of war and is often referred to as the "Red Planet".',
    diameter: 6779,
    mass: '0.642',
    dayLength: 24.7
  },
  {
    id: 'ceres',
    name: 'Ceres',
    type: 'planet',
    size: 0.3,
    distance: 8 * AU,
    color: '#888888',
    orbitalSpeed: 0.5,
    rotationSpeed: 0.2,
    eccentricity: 0.079,
    orbitalOffset: 0.95,
    description: 'Ceres is the largest object in the asteroid belt between Mars and Jupiter and the only dwarf planet located in the inner Solar System. It is a C-type asteroid.',
    diameter: 940,
  },
  {
    id: 'annefrank',
    name: 'Annefrank',
    type: 'planet',
    size: 0.1,
    distance: 8.2 * AU,
    color: '#888888',
    orbitalSpeed: 0.48,
    rotationSpeed: 0.2,
    eccentricity: 0.064,
    orbitalOffset: 0.45,
    description: 'Annefrank is a main-belt asteroid discovered in 1942. It was named in memory of Anne Frank, the famous diarist who died in the Holocaust.',
    diameter: 4.8,
  },
  {
    id: 'mathilde',
    name: 'Mathilde',
    type: 'planet',
    size: 0.2,
    distance: 9 * AU,
    color: '#888888',
    orbitalSpeed: 0.42,
    rotationSpeed: 0.2,
    eccentricity: 0.267,
    orbitalOffset: 0.3,
    description: '253 Mathilde is a main-belt asteroid discovered in 1885. It has a relatively elliptical orbit that takes it as far as the orbit of Mars. It is a C-type asteroid.',
    diameter: 53,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    size: 5,
    distance: 10 * AU,
    color: '#FF5722', // Dark Orange
    orbitalSpeed: 0.4,
    rotationSpeed: 0.8,
    eccentricity: 0.048,
    orbitalOffset: 0.25,
    description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined, but slightly less than one-thousandth the mass of the Sun.',
    diameter: 139820,
    mass: '1898',
    dayLength: 9.9
  },
  {
    id: 'eurybates',
    name: 'Eurybates',
    type: 'planet',
    size: 0.3,
    distance: 9.9 * AU,
    color: '#888888',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.2,
    eccentricity: 0.048,
    orbitalOffset: 0.21,
    description: 'Eurybates is a Greek Jupiter Trojan asteroid. It is a C-type asteroid and one of the targets of the Lucy mission. It has a small satellite, named Queta.',
    diameter: 64,
  },
  {
    id: 'patroclus',
    name: 'Patroclus',
    type: 'planet',
    size: 0.4,
    distance: 10.1 * AU,
    color: '#888888',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.2,
    eccentricity: 0.048,
    orbitalOffset: 0.6,
    description: 'Patroclus is a large binary Jupiter Trojan asteroid. It is a P-type asteroid, which are reddish in color, and are among the darkest objects in the solar system.',
    diameter: 140,
  },
    {
    id: 'orus',
    name: 'Orus',
    type: 'planet',
    size: 0.2,
    distance: 9.8 * AU,
    color: '#888888',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.2,
    eccentricity: 0.048,
    orbitalOffset: 0.18,
    description: 'Orus is a Jupiter Trojan from the Greek camp, approximately 51 kilometers in diameter. It is a D-type asteroid, which are very dark and reddish in appearance.',
    diameter: 51,
  },
  {
    id: 'leucus',
    name: 'Leucus',
    type: 'planet',
    size: 0.2,
    distance: 9.7 * AU,
    color: '#888888',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.2,
    eccentricity: 0.048,
    orbitalOffset: 0.15,
    description: 'Leucus is another Jupiter Trojan from the Greek camp. It is a D-type asteroid, characterized by its very slow rotation, taking about 446 hours to complete one revolution.',
    diameter: 40,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    size: 4,
    distance: 12.5 * AU,
    color: '#FFC107', // Dark Yellow
    orbitalSpeed: 0.32,
    rotationSpeed: 0.75,
    rings: { innerRadius: 6, outerRadius: 10, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/saturn_ring.png' },
    eccentricity: 0.054,
    orbitalOffset: 0.6,
    description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine times that of Earth. It only has one-eighth the average density of Earth; however, with its larger volume, Saturn is over 95 times more massive.',
    diameter: 116460,
    mass: '568',
    dayLength: 10.7
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    size: 3,
    distance: 15 * AU,
    color: '#009688', // Bluish Green
    orbitalSpeed: 0.22,
    rotationSpeed: 0.6,
    eccentricity: 0.047,
    orbitalOffset: 0.85,
    description: 'Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. Uranus is similar in composition to Neptune, and both have bulk chemical compositions which differ from that of the larger gas giants Jupiter and Saturn.',
    diameter: 50724,
    mass: '86.8',
    dayLength: 17.2
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    size: 3,
    distance: 17.5 * AU,
    color: '#673AB7', // Violet
    orbitalSpeed: 0.18,
    rotationSpeed: 0.55,
    eccentricity: 0.009,
    orbitalOffset: 0.05,
    description: 'Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth, slightly more massive than its near-twin Uranus.',
    diameter: 49244,
    mass: '102',
    dayLength: 16.1
  },
];
