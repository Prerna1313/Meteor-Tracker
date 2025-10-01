'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import type { CelestialObject } from '@/lib/solar-system-data';

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
  gradient.addColorStop(0.1, 'rgba(255, 255, 143, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 143, 0.5)');
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
  sprite.scale.set(100, 100, 1); // Adjust size of the glow
  return sprite;
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
  const stateRef = useRef({
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000),
    renderer: null as THREE.WebGLRenderer | null,
    labelRenderer: null as CSS2DRenderer | null,
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

    camera.position.set(0, 150, 400);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    stateRef.renderer = renderer;

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);
    stateRef.labelRenderer = labelRenderer;

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
        const intersects = raycaster.intersectObjects(stateRef.clickableObjects);

        if (intersects.length > 0) {
            onSelectObject(intersects[0].object.userData.id);
        } else {
            onSelectObject(null);
        }
    };
    renderer.domElement.addEventListener('click', handleClick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    const animate = () => {
      if (!stateRef.renderer) return;
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      stateRef.celestialObjects.forEach(obj => {
        if (obj.userData.type === 'planet' && obj.userData.orbitalSpeed > 0) {
            const angle = elapsedTime * (obj.userData.orbitalSpeed / 10);
            obj.position.x = Math.cos(angle) * obj.userData.distance;
            obj.position.z = Math.sin(angle) * obj.userData.distance;
        }
        if (obj.userData.rotationSpeed > 0) {
          obj.rotation.y += obj.userData.rotationSpeed / 50;
        }
      });

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
      
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current) {
        if(renderer.domElement) mountRef.current.removeChild(renderer.domElement);
        if(labelRenderer.domElement) mountRef.current.removeChild(labelRenderer.domElement);
      }
      renderer.dispose();
      stateRef.renderer = null;
    };
  }, [onSelectObject, raycaster, stateRef]);

  // Update scene when data changes
  useEffect(() => {
    const { scene, celestialObjects, orbitLines, clickableObjects } = stateRef;

    // --- Cleanup previous objects ---
    celestialObjects.forEach(obj => {
        obj.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else if (child.material) {
                    child.material.dispose();
                }
            }
             if (child instanceof CSS2DObject) {
                child.element.remove();
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
        stateRef.clickableObjects.push(celestialObj);
        
        // Label
        const labelDiv = document.createElement('div');
        labelDiv.className = objData.type === 'star' 
          ? 'text-accent font-bold p-2 rounded-md bg-background/30 text-sm whitespace-nowrap' 
          : 'text-foreground p-1 rounded-md bg-background/30 text-xs whitespace-nowrap backdrop-blur-sm';
        labelDiv.textContent = objData.name;
        const label = new CSS2DObject(labelDiv);
        const labelOffset = objData.type === 'star' ? objData.size + 5 : objData.size + 2;
        label.position.set(0, labelOffset, 0);
        celestialObj.add(label);
      }
    });

  }, [data, stateRef]);
  
  // Highlight selected object
  useEffect(() => {
    stateRef.celestialObjects.forEach((obj, id) => {
      const isSelected = id === selectedObjectId;
      const mesh = obj as THREE.Mesh;

      if (mesh && mesh.material) {
        // Only apply emissive to MeshStandardMaterial (planets)
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          if (isSelected) {
            mesh.material.emissive.setHex(0x7DF9FF); // Accent color
            mesh.material.emissiveIntensity = 0.5;
          } else {
            mesh.material.emissive.setHex(0x000000);
          }
        }
      }
    });
  }, [selectedObjectId, stateRef.celestialObjects]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
}
