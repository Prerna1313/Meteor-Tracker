
'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CelestialObject } from '@/lib/solar-system-data';

type LabelData = {
  id: string;
  name: string;
  color: string;
  position: THREE.Vector3;
  type: CelestialObject['type'];
};

type SolarSystemProps = {
  data: CelestialObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  hoveredObjectId: string | null;
  onHoverObject: (id: string | null) => void;
};

const AU_SCALE = 15;

const createAsteroidDust = () => {
    const particles = 200000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);

    const material = new THREE.PointsMaterial({
        color: 0x007BA7, // Bright Cerulean
        size: 0.02,
        depthWrite: false,
        transparent: true,
        opacity: 0.45,
        alphaTest: 0.02,
    });
    
    const marsOrbit = 1.524 * AU_SCALE;
    const jupiterOrbit = 5.203 * AU_SCALE;
    const neptuneOrbit = 30.07 * AU_SCALE;
    
    const mainBeltInner = marsOrbit + 0.5 * AU_SCALE;
    const mainBeltOuter = jupiterOrbit - 0.5 * AU_SCALE;
    
    for (let i = 0; i < particles; i++) {
        const zone = Math.random();
        let dist = 0;
        let y = 0;
        const verticalSpread = 50;

        if (zone < 0.05) { // 5% in Inner System
            dist = THREE.MathUtils.randFloat(0, mainBeltInner);
            y = (Math.random() - 0.5) * Math.random() * verticalSpread * 0.1;
        } else if (zone < 0.70) { // 65% in Main Belt (original density)
            const innerBias = Math.pow(Math.random(), 0.5); 
            dist = mainBeltInner + innerBias * (mainBeltOuter - mainBeltInner);
            y = (Math.random() - 0.5) * Math.pow(Math.random(), 2) * verticalSpread;
        } else if (zone < 0.995) { // ~29.5% as Jupiter Trojans (thicker concentration)
            dist = THREE.MathUtils.randFloat(jupiterOrbit - 0.5 * AU_SCALE, jupiterOrbit + 0.5 * AU_SCALE);
            y = (Math.random() - 0.5) * Math.random() * verticalSpread * 1.5;
        } else { // 0.5% in Kuiper Belt region
            dist = THREE.MathUtils.randFloat(jupiterOrbit + 1 * AU_SCALE, neptuneOrbit);
            y = (Math.random() - 0.5) * Math.random() * verticalSpread * 1.2;
        }

        const angle = Math.random() * Math.PI * 2;
        
        positions[i * 3] = Math.cos(angle) * dist;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * dist;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(geometry, material);
    points.userData = { id: 'asteroid_belt', name: 'Asteroid Belt' };
    return points;
};

const createMeteors = () => {
  const meteorCount = 500;
  const meteors = new THREE.Group();
  meteors.userData = { id: 'asteroid_belt', name: 'Asteroid Belt' };
  const meteorMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 1.0,
    metalness: 0.0,
  });

  const marsOrbit = 1.524 * AU_SCALE;
  const jupiterOrbit = 5.203 * AU_SCALE;
  const mainBeltInner = marsOrbit + 0.5 * AU_SCALE;
  const mainBeltOuter = jupiterOrbit - 0.5 * AU_SCALE;

  for (let i = 0; i < meteorCount; i++) {
    const size = THREE.MathUtils.randFloat(0.1, 0.4);
    const meteorGeometry = new THREE.IcosahedronGeometry(size, 0);
    const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

    const dist = THREE.MathUtils.randFloat(mainBeltInner, mainBeltOuter);
    const angle = Math.random() * Math.PI * 2;
    const y = THREE.MathUtils.randFloatSpread(60); // Increased vertical spread

    meteor.position.set(
      Math.cos(angle) * dist,
      y,
      Math.sin(angle) * dist
    );
    
    meteors.add(meteor);
  }
  return meteors;
}

const createKuiperMeteors = () => {
  const meteorCount = 200;
  const meteors = new THREE.Group();
  meteors.userData = { id: 'asteroid_belt', name: 'Outer Belt' };
  const meteorMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc, 
    emissive: 0x333333,
    roughness: 0.8,
    metalness: 0.1,
  });

  const jupiterOrbit = 5.203 * AU_SCALE;
  const neptuneOrbit = 30.07 * AU_SCALE;
  const kuiperInner = jupiterOrbit + 2 * AU_SCALE;
  const kuiperOuter = neptuneOrbit + 5 * AU_SCALE;


  for (let i = 0; i < meteorCount; i++) {
    const size = THREE.MathUtils.randFloat(0.2, 0.5);
    const meteorGeometry = new THREE.IcosahedronGeometry(size, 0);
    const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

    const dist = THREE.MathUtils.randFloat(kuiperInner, kuiperOuter);
    const angle = Math.random() * Math.PI * 2;
    const y = THREE.MathUtils.randFloatSpread(80);

    meteor.position.set(
      Math.cos(angle) * dist,
      y,
      Math.sin(angle) * dist
    );
    
    meteors.add(meteor);
  }
  return meteors;
}


const ASTEROID_IDS = ['osiris-apex', 'eurybates', 'orus', 'mathilde', 'patroclus', 'ceres', 'annefrank', 'leucus', 'itokawa', 'eros', 'bennu', 'ryugu', 'donaldjohanson', 'braille', 'polymele', 'lutetia', 'psyche', 'ida', 'gaspra', 'apophis', 'didymos', 'vesta'];
const COMET_IDS = ['churyumov-gerasimenko', 'borrelly', 'hartley2', 'tempel1', 'wild2'];

const CometIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/>
        <path d="M19.41 11H22v2h-2.59l-3.46 3.46-1.42-1.42L19.41 11zM18 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
    </svg>
);


export function SolarSystem({
  data,
  selectedObjectId,
  onSelectObject,
  hoveredObjectId,
  onHoverObject,
}: SolarSystemProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<LabelData[]>([]);

  const stateRef = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, 1, 0.1, 100000),
    controls: null as OrbitControls | null,
    raycaster: new THREE.Raycaster(),
    textureLoader: new THREE.TextureLoader(),
    clickableObjects: [] as THREE.Object3D[],
    celestialObjects: new Map<string, THREE.Object3D>(),
    orbitLines: new Map<string, THREE.Line>(),
    clock: new THREE.Clock(),
    startTime: Date.now(),
  }).current;

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;

    const init = () => {
      if (!mountRef.current || stateRef.renderer) return;

      const { scene, camera } = stateRef;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);
      stateRef.renderer = renderer;

      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.position.set(0, 40, 120);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      controls = new OrbitControls(camera, renderer.domElement);
      controls.domElement.style.touchAction = 'none';
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 10;
      controls.maxDistance = 10000;
      stateRef.controls = controls;
    };

    if (!stateRef.renderer) {
      init();
    }

    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current || !stateRef.renderer) return;
      const mouse = new THREE.Vector2();
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      stateRef.raycaster.setFromCamera(mouse, stateRef.camera);
      stateRef.raycaster.params.Points.threshold = 5;
      const intersects = stateRef.raycaster.intersectObjects(
        stateRef.clickableObjects,
        true
      );

      if (intersects.length > 0) {
        let currentObject = intersects[0].object;
        while (currentObject.parent && !currentObject.userData.id) {
          currentObject = currentObject.parent;
        }
        onSelectObject(currentObject.userData.id || null);
      } else {
        onSelectObject(null);
      }
    };
    if (stateRef.renderer) {
      stateRef.renderer.domElement.addEventListener('click', handleClick, false);
    }

    const handleResize = () => {
      if (!mountRef.current || !stateRef.renderer) return;
      stateRef.camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      stateRef.camera.updateProjectionMatrix();
      stateRef.renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!stateRef.renderer) return;
      const animationFrameId = requestAnimationFrame(animate);
      const newLabels: LabelData[] = [];
      
      const timeSpeed = 0.1;
      const d = (Date.now() - stateRef.startTime) / (1000 * 60 * 60 * 24);

      stateRef.celestialObjects.forEach((objGroup, id) => {
        const objData = objGroup.userData as CelestialObject;
        if (objData.type === 'planet' || objData.type === 'comet') {
          const a = objData.semiMajorAxis;
          const e = objData.eccentricity ?? 0;
          const i = THREE.MathUtils.degToRad(objData.orbitalInclination ?? 0);
          const L = THREE.MathUtils.degToRad(objData.meanLongitude);
          const varpi = THREE.MathUtils.degToRad(objData.longitudeOfPerihelion);
          const Omega = THREE.MathUtils.degToRad(objData.longitudeOfAscendingNode);

          const P = objData.orbitalSpeed; // Period in years
          
          // Mean anomaly M
          const M0 = L - varpi;
          const n = (2 * Math.PI) / (P * 365.25); // Mean motion in radians/day
          let M = (M0 + n * d * timeSpeed) % (2 * Math.PI);
          if (M < 0) M += 2 * Math.PI;

          // Solve Kepler's equation for E (Eccentric Anomaly)
          let E = M;
          for (let k = 0; k < 5; k++) {
              E = M + e * Math.sin(E);
          }

          // True anomaly nu
          const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
          // Heliocentric distance r
          const r = a * (1 - e * Math.cos(E));

          const argOfPeri = varpi - Omega;

          // Position in orbital plane
          const x_orb = r * Math.cos(nu);
          const y_orb = r * Math.sin(nu);

          // Rotate to ecliptic coordinates
          const x_ecl = x_orb * (Math.cos(argOfPeri) * Math.cos(Omega) - Math.sin(argOfPeri) * Math.sin(Omega) * Math.cos(i)) - y_orb * (Math.sin(argOfPeri) * Math.cos(Omega) + Math.cos(argOfPeri) * Math.sin(Omega) * Math.cos(i));
          const z_ecl = x_orb * (Math.cos(argOfPeri) * Math.sin(Omega) + Math.sin(argOfPeri) * Math.cos(Omega) * Math.cos(i)) + y_orb * (Math.cos(argOfPeri) * Math.cos(Omega) * Math.cos(i) - Math.sin(argOfPeri) * Math.sin(Omega));
          const y_ecl = x_orb * (Math.sin(argOfPeri) * Math.sin(i)) + y_orb * (Math.cos(argOfPeri) * Math.sin(i));


          objGroup.position.set(
            x_ecl * AU_SCALE, 
            y_ecl * AU_SCALE,
            z_ecl * AU_SCALE
          );
        }
        
        const vector = new THREE.Vector3();
        objGroup.getWorldPosition(vector);
        const labelPos = vector.clone();

        const objSize = objGroup.userData.size || 0;
        labelPos.y += objSize;

        newLabels.push({
          id: objGroup.userData.id,
          name: objGroup.userData.name,
          color: objGroup.userData.color,
          position: labelPos,
          type: objGroup.userData.type,
        });
      });
      
      setLabels(newLabels);
      controls.update();
      renderer.render(stateRef.scene, stateRef.camera);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    };
    const cleanupAnimation = animate();

    return () => {
      cleanupAnimation();
      window.removeEventListener('resize', handleResize);
      if (stateRef.renderer) {
        stateRef.renderer.domElement.removeEventListener('click', handleClick);
      }
      controls?.dispose();
    };
  }, [stateRef, onSelectObject, data]);

  useEffect(() => {
    const { scene, clickableObjects, celestialObjects, orbitLines } = stateRef;

    while (scene.children.length > 0) {
      const child = scene.children[0];
      scene.remove(child);
      if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Line) {
          const material = (child as any).material;
          if (Array.isArray(material)) {
              material.forEach(m => m.dispose());
          } else if (material) {
              material.dispose();
          }
          (child as any).geometry?.dispose();
      }
    }
    celestialObjects.clear();
    clickableObjects.length = 0;
    orbitLines.clear();

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const sunLight = new THREE.PointLight(0xffd886, 5000, 10000);
    scene.add(sunLight);

    const asteroidDust = createAsteroidDust();
    scene.add(asteroidDust);
    clickableObjects.push(asteroidDust);

    const meteors = createMeteors();
    scene.add(meteors);
    clickableObjects.push(meteors);

    const kuiperMeteors = createKuiperMeteors();
    scene.add(kuiperMeteors);
    clickableObjects.push(kuiperMeteors);

    data.forEach((objData) => {
      let celestialObj: THREE.Object3D | null = null;
      let objectGroup = new THREE.Group();
      
      if (objData.type === 'star') {
        const starGeometry = new THREE.SphereGeometry(objData.size, 32, 32);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700, toneMapped: false });
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        objectGroup.add(starMesh);
        celestialObj = objectGroup;

      } else if (objData.type === 'planet' || objData.type === 'comet') {
        let geometry;
        const isAsteroid = ASTEROID_IDS.includes(objData.id);
        const isComet = COMET_IDS.includes(objData.id);

        if (isAsteroid || isComet) {
          geometry = new THREE.IcosahedronGeometry(objData.size, 0); 
        } else {
          geometry = new THREE.SphereGeometry(objData.size, 32, 32);
        }

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(objData.color),
          emissive: (isAsteroid || isComet) ? new THREE.Color(0x000000) : new THREE.Color(objData.color),
          emissiveIntensity: (isAsteroid || isComet) ? 0 : 0.6,
          roughness: (isAsteroid || isComet) ? 1 : 0.5,
          metalness: 0,
        });
        const body = new THREE.Mesh(geometry, material);
        body.userData.isPlanetBody = true;
        objectGroup.add(body);

        if (objData.rings) {
          const ringGeometry = new THREE.RingGeometry(
            objData.rings.innerRadius,
            objData.rings.outerRadius,
            64
          );
          const pos = ringGeometry.attributes.position;
          const v3 = new THREE.Vector3();
          for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            (ringGeometry.attributes.uv as THREE.BufferAttribute).setXY(
              i,
              v3.length() < objData.rings.innerRadius + 1 ? 0 : 1,
              1
            );
          }
          const ringMaterial = new THREE.MeshBasicMaterial({
            map: stateRef.textureLoader.load(objData.rings.textureUrl),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
          });
          const rings = new THREE.Mesh(ringGeometry, ringMaterial);
          rings.rotation.x = Math.PI / 2;
          body.add(rings);
        }
        
        const a = objData.semiMajorAxis;
        const e = objData.eccentricity ?? 0;
        const i = THREE.MathUtils.degToRad(objData.orbitalInclination ?? 0);
        const Omega = THREE.MathUtils.degToRad(objData.longitudeOfAscendingNode);
        const varpi = THREE.MathUtils.degToRad(objData.longitudeOfPerihelion);

        const curvePoints: THREE.Vector3[] = [];
        const argOfPeri = varpi - Omega;
        
        const pointCount = 200;
        const orbitSections = isComet ? pointCount / 2 : pointCount;
        for (let j = 0; j <= orbitSections; j++) {
            const M = (j / pointCount) * 2 * Math.PI;
            let E = M;
            for (let k = 0; k < 5; k++) {
              E = M + e * Math.sin(E);
            }
            const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
            const r = a * (1 - e * Math.cos(E));
            
            const x_orb = r * Math.cos(nu);
            const y_orb = r * Math.sin(nu);
    
            const x_ecl = x_orb * (Math.cos(argOfPeri) * Math.cos(Omega) - Math.sin(argOfPeri) * Math.sin(Omega) * Math.cos(i)) - y_orb * (Math.sin(argOfPeri) * Math.cos(Omega) + Math.cos(argOfPeri) * Math.sin(Omega) * Math.cos(i));
            const z_ecl = x_orb * (Math.cos(argOfPeri) * Math.sin(Omega) + Math.sin(argOfPeri) * Math.cos(Omega) * Math.cos(i)) + y_orb * (Math.cos(argOfPeri) * Math.cos(Omega) * Math.cos(i) - Math.sin(argOfPeri) * Math.sin(Omega));
            const y_ecl = x_orb * (Math.sin(argOfPeri) * Math.sin(i)) + y_orb * (Math.cos(argOfPeri) * Math.sin(i));


            curvePoints.push(new THREE.Vector3(x_ecl * AU_SCALE, y_ecl * AU_SCALE, z_ecl * AU_SCALE));
        }
        
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        
        let opacity = 0.9;
        let color = objData.color;
        if (isAsteroid || isComet) {
            opacity = 0.4;
            color = '#888888';
        }

        if (objData.id === 'earth') opacity = 0.9;

        const orbitMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity: opacity,
        });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

        scene.add(orbitLine);
        
        orbitLines.set(objData.id, orbitLine);
        celestialObj = objectGroup;
      }

      if (celestialObj) {
        if(objData.id === 'sun') {
            celestialObj.position.set(0, 0, 0);
        }
        celestialObj.userData = { ...objData };
        scene.add(celestialObj);
        celestialObjects.set(objData.id, celestialObj);
        clickableObjects.push(celestialObj);
      }
    });
  }, [data, stateRef]);

  useEffect(() => {
    stateRef.orbitLines.forEach((line, id) => {
        const isHovered = id === hoveredObjectId;
        const isSelected = id === selectedObjectId;
        
        if(line.material instanceof THREE.LineBasicMaterial) {
            let baseOpacity = 0.9;
            if (ASTEROID_IDS.includes(id) || COMET_IDS.includes(id)) baseOpacity = 0.4;
            if (id === 'earth') baseOpacity = 0.9;
            line.material.opacity = isHovered || isSelected ? 1.0 : baseOpacity;
            line.material.needsUpdate = true;
        }
    });
  }, [hoveredObjectId, selectedObjectId, stateRef.orbitLines]);

  useEffect(() => {
    stateRef.celestialObjects.forEach((obj, id) => {
      const isSelected = id === selectedObjectId;
      const body = obj.children.find((c) => (c as THREE.Mesh).isMesh) as
        | THREE.Mesh
        | undefined;

      if (body?.material instanceof THREE.MeshStandardMaterial) {
        const isAsteroid = ASTEROID_IDS.includes(obj.userData.id) || COMET_IDS.includes(obj.userData.id);
        if (isSelected) {
          (body.material as THREE.MeshStandardMaterial).emissive.setHex(0xffffff);
          (body.material as THREE.MeshStandardMaterial).emissiveIntensity = 1;
        } else {
            const originalColor = obj.userData.color || 0xaaaaaa;
            const emissiveColor = isAsteroid ? 0x000000 : new THREE.Color(originalColor);
            (body.material as THREE.MeshStandardMaterial).emissive.set(emissiveColor);
            (body.material as THREE.MeshStandardMaterial).emissiveIntensity = isAsteroid ? 0 : 0.6;
        }
        body.material.needsUpdate = true;
      }

      if (obj.userData.type === 'star') {
        const starMesh = obj.children.find(c => c instanceof THREE.Mesh);
        if (starMesh && starMesh.material instanceof THREE.MeshBasicMaterial) {
            starMesh.material.color.set(isSelected ? 0xFFFFFF : 0xFFD700);
        }
      }
    });
    
    const isBeltSelected = selectedObjectId === 'asteroid_belt';
    const belt = stateRef.scene.getObjectsByProperty('userData.id', 'asteroid_belt');
    belt.forEach(obj => {
        if(obj instanceof THREE.Points && obj.material instanceof THREE.PointsMaterial) {
             obj.material.color.setHex(isBeltSelected ? 0xffffff : 0x007BA7);
             obj.material.opacity = isBeltSelected ? 0.7 : 0.45; // Use updated base opacity
        }
        if (obj instanceof THREE.Group && selectedObjectId === 'asteroid_belt') {
             obj.children.forEach(child => {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                     child.material.emissive.setHex(0xffffff);
                     child.material.emissiveIntensity = 0.5;
                }
             })
        } else if (obj instanceof THREE.Group) {
            obj.children.forEach(child => {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                     child.material.emissive.setHex(0x000000);
                     child.material.emissiveIntensity = 0;
                }
             })
        }
    });

  }, [selectedObjectId, stateRef.celestialObjects, stateRef.scene]);

  const displayedLabels = useMemo(() => {
    if (!mountRef.current || !stateRef.camera) return [];
  
    const screenLabels = labels
      .map(label => {
        const vector = label.position.clone().project(stateRef.camera);
        // Don't display labels that are behind the camera
        if (vector.z > 1) return null;
  
        return {
          ...label,
          screenX: (vector.x + 1) / 2 * mountRef.current!.clientWidth,
          screenY: (-vector.y + 1) / 2 * mountRef.current!.clientHeight,
        };
      })
      .filter(Boolean) as (LabelData & { screenX: number; screenY: number })[];
  
    // Filter out overlapping labels
    const nonOverlappingLabels: (LabelData & { screenX: number; screenY: number })[] = [];
    const labelSpacing = 20; // Minimum pixel distance between labels
  
    // Sort by some criteria, e.g. planets first, then by distance from camera
    screenLabels.sort((a, b) => {
        const aData = data.find(d => d.id === a.id);
        const bData = data.find(d => d.id === b.id);
        if (aData?.type === 'planet' && bData?.type !== 'planet') return -1;
        if (aData?.type !== 'planet' && bData?.type === 'planet') return 1;
        return a.position.distanceTo(stateRef.camera.position) - b.position.distanceTo(stateRef.camera.position);
    });

    for (const label of screenLabels) {
      let overlaps = false;
      for (const existingLabel of nonOverlappingLabels) {
        const dx = label.screenX - existingLabel.screenX;
        const dy = label.screenY - existingLabel.screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < labelSpacing) {
          overlaps = true;
          break;
        }
      }
  
      if (!overlaps) {
        nonOverlappingLabels.push(label);
      }
    }
  
    return nonOverlappingLabels;
  }, [labels, stateRef.camera, data]);

  const getLabelColor = (label: LabelData) => {
    if (selectedObjectId === label.id) {
      return 'hsl(var(--primary))';
    }
    if (ASTEROID_IDS.includes(label.id)) {
      return '#FFFFFF';
    }
    if (COMET_IDS.includes(label.id)) {
      return '#FFFFFF';
    }
    return label.color;
  };

  return (
    <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-10">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {displayedLabels.map((label) => {
          const isAsteroid = ASTEROID_IDS.includes(label.id);
          const isComet = label.type === 'comet';
          return (
            <div
              key={label.id}
              className={`absolute flex items-center gap-1.5 p-1 rounded-sm transition-all duration-300 pointer-events-auto cursor-pointer uppercase tracking-wider text-xs hover:font-bold ${
                isAsteroid || isComet ? 'font-normal' : 'font-medium'
              } ${
                (hoveredObjectId && hoveredObjectId !== label.id) || (selectedObjectId && selectedObjectId !== label.id) ? 'opacity-50' : 'opacity-100'
              }`}
              style={{
                transform: `translate(10px, -50%) translate(${label.screenX}px, ${label.screenY}px)`,
                color: getLabelColor(label),
                opacity: (selectedObjectId && selectedObjectId !== label.id) ? 0.5 : 1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectObject(label.id);
              }}
              onMouseEnter={() => onHoverObject(label.id)}
              onMouseLeave={() => onHoverObject(null)}
            >
              {isComet && <CometIcon className="w-4 h-4" />}
              {label.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

    