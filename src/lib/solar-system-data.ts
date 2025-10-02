'use client';
import * as THREE from 'three';

export type CelestialObject = {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'region' | 'comet';
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

// Using a logarithmic scale for distance for better visualization
// New distance = 50 * log(real_distance_in_au) + 50
// This compresses the vast distances of outer planets
const scaleFactor = 60;
const offset = 40;

const logScale = (au: number) => {
    if (au <= 0) return offset;
    return scaleFactor * Math.log(au) + offset;
}

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
    description: 'The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
    diameter: 1392700,
    mass: '1989000',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    size: 0.5,
    distance: logScale(0.39),
    color: '#9C27B0', // Purple
    orbitalSpeed: 1.6,
    rotationSpeed: 0.1,
    eccentricity: 0.206,
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
    distance: logScale(0.72),
    color: '#FFC107', // Dark Yellow
    orbitalSpeed: 1.2,
    rotationSpeed: 0.08,
    eccentricity: 0.007,
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
    distance: logScale(1) + 5,
    color: '#2196F3', // Shiny Blue
    orbitalSpeed: 1,
    rotationSpeed: 0.5,
    eccentricity: 0.017,
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
    distance: logScale(1.52) + 10,
    color: '#FF9800', // Light Orange
    orbitalSpeed: 0.8,
    rotationSpeed: 0.45,
    eccentricity: 0.093,
    description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being only larger than Mercury. In English, Mars carries the name of the Roman god of war and is often referred to as the "Red Planet".',
    diameter: 6779,
    mass: '0.642',
    dayLength: 24.7
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    size: 5,
    distance: logScale(5.2),
    color: '#FF5722', // Dark Orange
    orbitalSpeed: 0.4,
    rotationSpeed: 0.8,
    eccentricity: 0.048,
    description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined, but slightly less than one-thousandth the mass of the Sun.',
    diameter: 139820,
    mass: '1898',
    dayLength: 9.9
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    size: 4,
    distance: logScale(9.58),
    color: '#FFC107', // Dark Yellow
    orbitalSpeed: 0.32,
    rotationSpeed: 0.75,
    rings: { innerRadius: 6, outerRadius: 10, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/saturn_ring.png' },
    eccentricity: 0.054,
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
    distance: logScale(19.22),
    color: '#009688', // Bluish Green
    orbitalSpeed: 0.22,
    rotationSpeed: 0.6,
    eccentricity: 0.047,
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
    distance: logScale(30.05),
    color: '#673AB7', // Violet
    orbitalSpeed: 0.18,
    rotationSpeed: 0.55,
    eccentricity: 0.009,
    description: 'Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth, slightly more massive than its near-twin Uranus.',
    diameter: 49244,
    mass: '102',
    dayLength: 16.1
  },
  {
    id: 'polymele',
    name: 'Polymele',
    type: 'comet',
    size: 0.5,
    distance: logScale(5.2),
    color: '#E0E0E0',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.2,
    eccentricity: 0.08,
    orbitalInclination: 2.9,
    orbitalOffset: 0.16, // To place it ahead of Jupiter
    description: 'Polymele is a P-type Jupiter trojan asteroid, approximately 21 kilometers in diameter. It is one of the targets of the Lucy mission.'
  },
  {
    id: 'eurybates',
    name: 'Eurybates',
    type: 'comet',
    size: 0.8,
    distance: logScale(5.2),
    color: '#E0E0E0',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.2,
    eccentricity: 0.09,
    orbitalInclination: 5.1,
    orbitalOffset: 0.17, // Slightly different position from Polymele
    description: 'Eurybates is a C-type Jupiter trojan and the largest member of the only confirmed disruptive collisional family in the Trojan population. It has a small satellite, Queta. It is a target of the Lucy mission.'
  },
  {
    id: 'leucus',
    name: 'Leucus',
    type: 'comet',
    size: 0.6,
    distance: logScale(5.2),
    color: '#E0E0E0',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.1,
    eccentricity: 0.06,
    orbitalInclination: 11.5,
    orbitalOffset: 0.18,
    description: 'Leucus is a D-type Jupiter trojan, a slow rotator, taking approximately 446 hours per revolution. It is a target of the Lucy mission.'
  },
  {
    id: 'hartley2',
    name: 'Hartley 2',
    type: 'comet',
    size: 0.2,
    distance: logScale(3.46), // Its average distance
    color: '#E0E0E0',
    orbitalSpeed: 0.5,
    rotationSpeed: 0.5,
    eccentricity: 0.695,
    orbitalInclination: 13.6,
    description: '103P/Hartley, also known as Hartley 2, is a small periodic comet with an orbital period of 6.46 years. It was discovered by Malcolm Hartley in 1986.'
  },
];
