'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CelestialObject } from '@/lib/solar-system-data';

type LabelData = {
  id: string;
  name: string;
  position: THREE.Vector3;
};

type SolarSystemProps = {
  data: CelestialObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
};

type Stardust = {
  points: THREE.Points;
  velocities: THREE.Vector3[];
};


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
  gradient.addColorStop(0.1, 'rgba(255, 255, 220, 1)');
  gradient.addColorStop(0.4, 'rgba(255, 220, 180, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 180, 100, 0)');

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
  sprite.scale.set(150, 150, 1);
  return sprite;
};

const createStardust = (count: number, size: number, spread: number, opacity: number): Stardust => {
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const velocities: THREE.Vector3[] = [];

  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const x = THREE.MathUtils.randFloatSpread(spread);
    const y = THREE.MathUtils.randFloatSpread(spread);
    const z = THREE.MathUtils.randFloatSpread(spread);
    positions.set([x, y, z], i * 3);

    color.setHSL(Math.random(), 0.1, Math.random() * 0.4 + 0.3);
    colors.set([color.r, color.g, color.b], i * 3);

    sizes[i] = Math.random() * size;

    velocities.push(
      new THREE.Vector3(
        THREE.MathUtils.randFloat(-0.05, 0.05),
        THREE.MathUtils.randFloat(-0.05, 0.05),
        THREE.MathUtils.randFloat(-0.05, 0.05)
      )
    );
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: size,
    vertexColors: true,
    transparent: true,
    opacity: opacity,
    depthWrite: false,
    sizeAttenuation: true
  });

  const points = new THREE.Points(particles, particleMaterial);
  return { points, velocities };
};


export function SolarSystem({ data, selectedObjectId, onSelectObject }: SolarSystemProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<LabelData[]>([]);
  
  const stateRef = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, 1, 0.1, 20000),
    controls: null as OrbitControls | null,
    raycaster: new THREE.Raycaster(),
    textureLoader: new THREE.TextureLoader(),
    clickableObjects: [] as THREE.Object3D[],
    celestialObjects: new Map<string, THREE.Object3D>(),
    stardustSystems: [] as Stardust[],
  }).current;

  useEffect(() => {
    if (!mountRef.current || stateRef.renderer) return;

    const { scene, camera } = stateRef;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    stateRef.renderer = renderer;

    camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
    camera.position.set(0, 150, 400);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 10000;
    stateRef.controls = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    
    const stardust1 = createStardust(20000, 1.0, 10000, 0.5);
    const stardust2 = createStardust(5000, 2.0, 10000, 0.8);
    scene.add(stardust1.points, stardust2.points);
    stateRef.stardustSystems.push(stardust1, stardust2);


    const textures = new Map<string, THREE.Texture>();

    data.forEach(objData => {
        let celestialObj: THREE.Object3D | null = null;
        if (objData.textureUrl && !textures.has(objData.id)) {
            textures.set(objData.id, stateRef.textureLoader.load(objData.textureUrl));
        }
        if (objData.rings?.textureUrl && !textures.has(`${objData.id}-ring`)) {
            textures.set(`${objData.id}-ring`, stateRef.textureLoader.load(objData.rings.textureUrl));
        }

        if (objData.type === 'star') {
            const starGroup = new THREE.Group();
            const glow = createSunGlow();
            if (glow) starGroup.add(glow);
            
            const pointLight = new THREE.PointLight(0xFFFFFF, 3.5, 4000);
            starGroup.add(pointLight);
            celestialObj = starGroup;
        } else if (objData.type === 'planet') {
            const objectGroup = new THREE.Group();
            const geometry = new THREE.SphereGeometry(objData.size, 32, 32);
            const material = new THREE.MeshStandardMaterial({ map: textures.get(objData.id), roughness: 0.9 });
            const body = new THREE.Mesh(geometry, material);
            body.userData.isPlanetBody = true;
            objectGroup.add(body);

            if (objData.rings) {
                const ringGeometry = new THREE.RingGeometry(objData.rings.innerRadius, objData.rings.outerRadius, 64);
                const pos = ringGeometry.attributes.position;
                const v3 = new THREE.Vector3();
                for (let i = 0; i < pos.count; i++){
                    v3.fromBufferAttribute(pos, i);
                    (ringGeometry.attributes.uv as THREE.BufferAttribute).setXY(i, v3.length() < objData.rings.innerRadius + 1 ? 0 : 1, 1);
                }
                const ringMaterial = new THREE.MeshBasicMaterial({
                    map: textures.get(`${objData.id}-ring`),
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = Math.PI / 2;
                body.add(rings);
            }
            
            const semiMajorAxis = objData.distance;
            const eccentricity = objData.eccentricity ?? 0;
            const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
            const focusOffset = eccentricity * semiMajorAxis;

            const ellipse = new THREE.EllipseCurve(
                -focusOffset, 0,
                semiMajorAxis, semiMinorAxis,
                0, 2 * Math.PI,
                false, 0
            );

            const points = ellipse.getPoints(200);
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xEEEEEE, transparent: true, opacity: 0.3 });
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);

            celestialObj = objectGroup;
        }

        if (celestialObj) {
            celestialObj.userData = { ...objData };
            scene.add(celestialObj);
            stateRef.celestialObjects.set(objData.id, celestialObj);
            celestialObj.traverse(child => stateRef.clickableObjects.push(child));
        }
    });


    const handleClick = (event: MouseEvent) => {
        if (!mountRef.current) return;
        const mouse = new THREE.Vector2();
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        stateRef.raycaster.setFromCamera(mouse, camera);
        const intersects = stateRef.raycaster.intersectObjects(stateRef.clickableObjects, true);

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
    renderer.domElement.addEventListener('click', handleClick, false);

    const handleResize = () => {
        if (!mountRef.current || !stateRef.renderer) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        stateRef.renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    const animate = () => {
      if (!stateRef.renderer) return;
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const newLabels: LabelData[] = [];

      stateRef.celestialObjects.forEach(obj => {
        const { id, type, orbitalSpeed, rotationSpeed, distance, eccentricity = 0 } = obj.userData;
        const planetBody = obj.children.find(c => c.userData.isPlanetBody);

        if (id !== 'sun' && type === 'planet' && orbitalSpeed > 0) {
            const semiMajorAxis = distance;
            const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
            const angle = elapsedTime * (orbitalSpeed / 50);
            const focusOffset = eccentricity * semiMajorAxis;

            const x = Math.cos(angle) * semiMajorAxis - focusOffset;
            const z = Math.sin(angle) * semiMinorAxis;
            obj.position.set(x, 0, z);
        }
        
        if (id === 'sun') {
          obj.position.set(0,0,0);
        }
            
        if (rotationSpeed > 0 && planetBody) {
          planetBody.rotation.y += rotationSpeed / 100;
        }

        const vector = new THREE.Vector3();
        obj.getWorldPosition(vector);
        const labelPos = vector.clone();
        
        const objSize = obj.userData.size || 0;
        labelPos.y += objSize;

        newLabels.push({ id: obj.userData.id, name: obj.userData.name, position: labelPos });
      });

      // Animate stardust
      stateRef.stardustSystems.forEach(system => {
          const positions = system.points.geometry.attributes.position as THREE.BufferAttribute;
          const spread = 10000;
          for (let i = 0; i < positions.count; i++) {
              const velocity = system.velocities[i];
              positions.setXYZ(
                  i,
                  positions.getX(i) + velocity.x,
                  positions.getY(i) + velocity.y,
                  positions.getZ(i) + velocity.z
              );

              if (positions.getX(i) < -spread / 2) positions.setX(i, spread / 2);
              if (positions.getX(i) > spread / 2) positions.setX(i, -spread / 2);
              if (positions.getY(i) < -spread / 2) positions.setY(i, spread / 2);
              if (positions.getY(i) > spread / 2) positions.setY(i, -spread / 2);
              if (positions.getZ(i) < -spread / 2) positions.setZ(i, spread / 2);
              if (positions.getZ(i) > spread / 2) positions.setZ(i, -spread / 2);
          }
          positions.needsUpdate = true;
      });


      setLabels(newLabels);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      stateRef.renderer = null;
    };
  }, [data, onSelectObject, stateRef]);

  useEffect(() => {
    stateRef.celestialObjects.forEach((obj, id) => {
        const isSelected = id === selectedObjectId;
        const body = obj.children.find(c => (c as THREE.Mesh).isMesh) as THREE.Mesh | undefined;
        let meshToHighlight = obj.userData.type === 'star' ? undefined : body;

        if (meshToHighlight && meshToHighlight.material instanceof THREE.MeshStandardMaterial) {
            meshToHighlight.material.emissive.setHex(isSelected ? 0x7DF9FF : 0x000000);
            meshToHighlight.material.emissiveIntensity = isSelected ? 0.6 : 0;
        }
        
        if (obj.userData.type === 'star') {
            const glow = obj.children.find(c => c instanceof THREE.Sprite);
            if (glow) {
                (glow as THREE.Sprite).material.opacity = isSelected ? 1 : 0.7;
            }
        }
    });
  }, [selectedObjectId, stateRef.celestialObjects]);


  return (
    <div ref={mountRef} className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {labels.map(label => {
          if (!mountRef.current || !stateRef.camera) return null;
          
          const vector = label.position.clone().project(stateRef.camera);
          if (vector.z > 1) return null; 

          const screenX = (vector.x + 1) / 2 * mountRef.current.clientWidth;
          const screenY = (-vector.y + 1) / 2 * mountRef.current.clientHeight;

          return (
            <div
              key={label.id}
              className={`absolute text-xs p-1 rounded-sm transition-colors duration-300 pointer-events-auto cursor-pointer ${
                selectedObjectId === label.id
                  ? 'text-primary bg-background/50 font-bold'
                  : 'text-white/80 hover:text-primary'
              }`}
              style={{
                transform: `translate(10px, -50%) translate(${screenX}px, ${screenY}px)`,
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
