
export type CelestialObject = {
  id: string;
  name: string;
  type: 'star' | 'planet';
  size: number;
  distance: number;
  color: string;
  orbitalSpeed: number;
  rotationSpeed: number;
  textureUrl?: string;
  rings?: { innerRadius: number; outerRadius: number; textureUrl: string; };
  eccentricity?: number;
  description?: string;
  diameter?: number; // in km
  mass?: string; // in 10^24 kg
  dayLength?: number; // in hours
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
    description: 'The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
    diameter: 1392700,
    mass: '1989000',
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
    size: 4,
    distance: 70,
    color: '#FFA500',
    orbitalSpeed: 1.2,
    rotationSpeed: 0.08,
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js_old/master/examples/textures/planets/venus_surface.jpg',
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
    size: 5,
    distance: 100,
    color: '#4682B4',
    orbitalSpeed: 1,
    rotationSpeed: 0.5,
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
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
    size: 3,
    distance: 150,
    color: '#FF4500',
    orbitalSpeed: 0.8,
    rotationSpeed: 0.45,
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars_1k_color.jpg',
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
    size: 10,
    distance: 320,
    color: '#D2B48C',
    orbitalSpeed: 0.4,
    rotationSpeed: 0.8,
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg',
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
    size: 9,
    distance: 450,
    color: '#F0E68C',
    orbitalSpeed: 0.32,
    rotationSpeed: 0.75,
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg',
    rings: { innerRadius: 12, outerRadius: 20, textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/saturn_ring.png' },
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
    size: 7,
    distance: 600,
    color: '#AFEEEE',
    orbitalSpeed: 0.22,
    rotationSpeed: 0.6,
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg',
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
    size: 7,
    distance: 750,
    color: '#3F51B5',
    orbitalSpeed: 0.18,
    rotationSpeed: 0.55,
    textureUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg',
    eccentricity: 0.009,
    description: 'Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. It is 17 times the mass of Earth, slightly more massive than its near-twin Uranus.',
    diameter: 49244,
    mass: '102',
    dayLength: 16.1
  },
];
