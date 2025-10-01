'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CelestialObject } from '@/lib/solar-system-data';

export type LabelData = {
  id: string;
  name: string;
  position: THREE.Vector3;
};

type SolarSystemProps = {
  data: CelestialObject[];
  onSelectObject: (id: string | null) => void;
  selectedObjectId: string | null;
};

// Helper function to create a glowing sprite for the Sun
const createSunGlow = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  gradient.addColorStop(0.1, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 143, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 143, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(120, 120, 1);
  return sprite;
};

const createSaturnRings = (innerRadius: number, outerRadius: number) => {
    const segments = 64;
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++){
      v3.fromBufferAttribute(pos, i);
      (geometry.attributes.uv as THREE.BufferAttribute).setXY(i, v3.length() < innerRadius + 1 ? 0 : 1, 1);
    }

    const texture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/saturn_ring.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
};


// Function to create the Asteroid Belt
const createAsteroidBelt = (scene: THREE.Scene) => {
  const asteroidCount = 10000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(asteroidCount * 3);
  const angles = new Float32Array(asteroidCount);
  const radii = new Float32Array(asteroidCount);
  const speeds = new Float32Array(asteroidCount);

  const innerRadius = 180;
  const outerRadius = 260;

  for (let i = 0; i < asteroidCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = THREE.MathUtils.randFloat(-2, 2);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    angles[i] = angle;
    radii[i] = radius;
    speeds[i] = THREE.MathUtils.randFloat(0.05, 0.15);
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('angle', new THREE.BufferAttribute(angles, 1));
  particles.setAttribute('radius', new THREE.BufferAttribute(radii, 1));
  particles.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x666666,
    size: 0.3,
    transparent: true,
    opacity: 0.6,
  });

  const asteroidBelt = new THREE.Points(particles, particleMaterial);
  asteroidBelt.userData = { id: 'asteroid-belt', type: 'asteroid-belt' };
  scene.add(asteroidBelt);
  return asteroidBelt;
};

// Function to create the stardust background
const createStardust = (scene: THREE.Scene) => {
  const starCount = 5000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(4000);
    const y = THREE.MathUtils.randFloatSpread(4000);
    const z = THREE.MathUtils.randFloatSpread(4000);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8,
  });

  const stardust = new THREE.Points(particles, particleMaterial);
  scene.add(stardust);
  return stardust;
};


export function SolarSystem({ data, onSelectObject, selectedObjectId }: SolarSystemProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const stateRef = useRef({
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, 1, 0.1, 5000),
    renderer: null as THREE.WebGLRenderer | null,
    controls: null as OrbitControls | null,
    clickableObjects: [] as THREE.Object3D[],
    celestialObjects: new Map<string, THREE.Object3D>(),
    orbitLines: new Map<string, THREE.Line>(),
    asteroidBelt: null as THREE.Points | null,
    stardust: null as THREE.Points | null,
  }).current;
  
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  
  useEffect(() => {
    if (!mountRef.current || stateRef.renderer) return;

    const { scene, camera } = stateRef;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    stateRef.renderer = renderer;

    camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.position.set(0, 400, 700);
    camera.lookAt(0,0,0);
    camera.updateProjectionMatrix();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 10;
    controls.maxDistance = 3000;
    stateRef.controls = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    stateRef.stardust = createStardust(scene);


    const handleClick = (event: MouseEvent) => {
        if (!mountRef.current) return;
        const mouse = new THREE.Vector2();
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(stateRef.clickableObjects, true);

        if (intersects.length > 0) {
            const firstIntersect = intersects[0].object;
            let objectId = firstIntersect.userData.id;

            // Traverse up to find parent group if it's part of a composite object (like Saturn's rings)
            let currentObject = firstIntersect;
            while (currentObject.parent && !currentObject.userData.id) {
              currentObject = currentObject.parent;
            }
            objectId = currentObject.userData.id;
            
            if (objectId) {
              onSelectObject(objectId);
            } else {
              onSelectObject(null);
            }

        } else {
            onSelectObject(null);
        }
    };
    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!mountRef.current || !stateRef.renderer) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      stateRef.renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    const animate = () => {
      if (!stateRef.renderer || !stateRef.controls) return;
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const newLabels: LabelData[] = [];

      stateRef.celestialObjects.forEach(obj => {
        if (obj.userData.type === 'planet' && obj.userData.orbitalSpeed > 0) {
            const angle = elapsedTime * (obj.userData.orbitalSpeed / 10);
            obj.position.x = Math.cos(angle) * obj.userData.distance;
            obj.position.z = Math.sin(angle) * obj.userData.distance;
        }
        if (obj.userData.rotationSpeed > 0) {
          obj.rotation.y += obj.userData.rotationSpeed / 50;
        }
        
        if (obj.userData.type === 'planet' || obj.userData.type === 'star') {
          const vector = new THREE.Vector3();
          obj.getWorldPosition(vector);
          vector.project(camera);
          newLabels.push({ id: obj.userData.id, name: obj.userData.name, position: vector });
        }
      });

      setLabels(newLabels);


      if (stateRef.asteroidBelt) {
        const positions = stateRef.asteroidBelt.geometry.getAttribute('position');
        const angles = stateRef.asteroidBelt.geometry.getAttribute('angle');
        const radii = stateRef.asteroidBelt.geometry.getAttribute('radius');
        const speeds = stateRef.asteroidBelt.geometry.getAttribute('speed');

        for (let i = 0; i < positions.count; i++) {
          const newAngle = (angles.getX(i) + elapsedTime * speeds.getX(i)) % (Math.PI * 2);
          positions.setX(i, Math.cos(newAngle) * radii.getX(i));
          positions.setZ(i, Math.sin(newAngle) * radii.getX(i));
        }
        positions.needsUpdate = true;
      }
      
      stateRef.controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (stateRef.controls) stateRef.controls.dispose();
      if (stateRef.renderer) renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current && stateRef.renderer?.domElement) {
        mountRef.current.removeChild(stateRef.renderer.domElement);
      }
      if (stateRef.renderer) stateRef.renderer.dispose();
      stateRef.renderer = null;
    };
  }, [onSelectObject, raycaster, stateRef]);

  // Update scene when data changes
  useEffect(() => {
    const { scene, celestialObjects, orbitLines } = stateRef;

    // --- Cleanup previous objects ---
    celestialObjects.forEach(obj => {
        obj.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if(child.geometry) child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => { if(m.map) m.map.dispose(); m.dispose() });
                } else if (child.material) {
                    if(child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            } else if (child instanceof THREE.Sprite) {
                if(child.material.map) child.material.map.dispose();
                child.material.dispose();
            }
        });
        scene.remove(obj);
    });
    celestialObjects.clear();
    stateRef.clickableObjects = [];

    orbitLines.forEach(line => {
      scene.remove(line);
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    });
    orbitLines.clear();
    
    if (stateRef.asteroidBelt) {
      scene.remove(stateRef.asteroidBelt);
      stateRef.asteroidBelt.geometry.dispose();
      (stateRef.asteroidBelt.material as THREE.Material).dispose();
      stateRef.asteroidBelt = null;
    }
    // --- End Cleanup ---

    data.forEach(objData => {
      let celestialObj: THREE.Object3D | null = null;
      
      if (objData.type === 'star') {
        const geometry = new THREE.SphereGeometry(objData.size, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: objData.color });
        const star = new THREE.Mesh(geometry, material);
        
        const glow = createSunGlow();
        if (glow) star.add(glow);
        
        const pointLight = new THREE.PointLight(0xFFFFFF, 300, 4000);
        star.add(pointLight);

        celestialObj = star;
      } else if (objData.type === 'planet') {
        const geometry = new THREE.SphereGeometry(objData.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: objData.color, roughness: 0.8 });
        const planet = new THREE.Mesh(geometry, material);

        if (objData.rings) {
          const rings = createSaturnRings(objData.rings.innerRadius, objData.rings.outerRadius);
          planet.add(rings);
        }
        
        celestialObj = planet;

        // Orbit line
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
          new THREE.Path().absarc(0, 0, objData.distance, 0, Math.PI * 2, false).getSpacedPoints(128)
        );
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xEEEEEE, transparent: true, opacity: 0.2 });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbitLines.set(objData.id, orbit);
      } else if (objData.type === 'asteroid-belt') {
        stateRef.asteroidBelt = createAsteroidBelt(scene);
      }

      if (celestialObj) {
        celestialObj.userData = { ...objData, originalColor: new THREE.Color(objData.color) };
        scene.add(celestialObj);
        celestialObjects.set(objData.id, celestialObj);
        // Only make stars and planets clickable, not belts.
        if (objData.type === 'star' || objData.type === 'planet') {
          // Add the main celestial object and its children (like rings) to clickable objects
          celestialObj.traverse(child => {
            stateRef.clickableObjects.push(child);
          });
        }
      }
    });

  }, [data, stateRef]);
  
  // Highlight selected object
  useEffect(() => {
    stateRef.celestialObjects.forEach((obj, id) => {
      const isSelected = id === selectedObjectId;
      const mesh = obj as THREE.Mesh;

      if (mesh && mesh.material) {
        // Planets
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          if (isSelected) {
            mesh.material.emissive.setHex(0x7DF9FF); // Accent color
            mesh.material.emissiveIntensity = 0.7;
          } else {
            mesh.material.emissive.setHex(0x000000);
          }
        }
         // Sun
        else if (mesh.material instanceof THREE.MeshBasicMaterial && obj.userData.type === 'star') {
           const glow = obj.children.find(c => c instanceof THREE.Sprite);
            if(glow) {
               (glow as THREE.Sprite).material.opacity = isSelected ? 1 : 0.5;
            }
        }
      }
    });
  }, [selectedObjectId, stateRef.celestialObjects]);

  return (
    <div ref={mountRef} className="absolute top-0 left-0 w-full h-full">
      {/* Labels are rendered here as HTML elements on top of the canvas */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {labels.map(label => {
          if (!mountRef.current) return null;
          // Hide labels that are behind the camera (or too far to the side)
          if (label.position.z > 1 || Math.abs(label.position.x) > 1.1 || Math.abs(label.position.y) > 1.1) return null;

          // Convert normalized device coordinates to screen coordinates
          const screenX = (label.position.x + 1) / 2 * mountRef.current.clientWidth;
          const screenY = (-label.position.y + 1) / 2 * mountRef.current.clientHeight;

          return (
            <div
              key={label.id}
              className={`absolute text-xs p-1 rounded-sm transition-colors duration-300 pointer-events-auto cursor-pointer ${
                selectedObjectId === label.id
                  ? 'text-primary bg-background/50'
                  : 'text-white/80'
              }`}
              style={{
                transform: `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`,
                left: 0,
                top: 0,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectObject(label.id)
              }}
            >
              {label.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
