
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
};

type SolarSystemProps = {
  data: CelestialObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  hoveredObjectId: string | null;
  onHoverObject: (id: string | null) => void;
};

const createAsteroidDust = () => {
    const particles = 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);

    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 32;
    textureCanvas.height = 32;
    const context = textureCanvas.getContext('2d');
    if(context) {
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(200, 255, 255, 1)');
        gradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 150, 150, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(textureCanvas);

    const material = new THREE.PointsMaterial({
        color: 0x00bfff,
        size: 0.5,
        map: texture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        sizeAttenuation: true,
    });
    
    const marsOrbit = 90;
    const jupiterOrbit = 145;
    const neptuneOrbit = 290;

    const mainBeltInner = marsOrbit + 5;
    const mainBeltOuter = jupiterOrbit - 15;

    for (let i = 0; i < particles; i++) {
        const zone = Math.random();
        let dist = 0;
        let y = 0;

        if (zone < 0.30) { // 30% in Inner System
            dist = THREE.MathUtils.randFloat(0, mainBeltInner);
            y = THREE.MathUtils.randFloatSpread(4);
        } else if (zone < 0.95) { // 65% in Main Belt (0.30 -> 0.95 is 65%)
            dist = THREE.MathUtils.randFloat(mainBeltInner, mainBeltOuter);
            y = THREE.MathUtils.randFloatSpread(8); 
        } else { // 5% in Outer System
            dist = THREE.MathUtils.randFloat(mainBeltOuter, neptuneOrbit);
            y = THREE.MathUtils.randFloatSpread(20);
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
  const meteorCount = 200;
  const meteors = new THREE.Group();
  const meteorMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    roughness: 1.0,
    metalness: 0.0,
  });

  const marsOrbit = 90;
  const jupiterOrbit = 145;
  const mainBeltInner = marsOrbit + 5;
  const mainBeltOuter = jupiterOrbit - 15;

  for (let i = 0; i < meteorCount; i++) {
    const size = THREE.MathUtils.randFloat(0.05, 0.2);
    const meteorGeometry = new THREE.IcosahedronGeometry(size, 0);
    const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

    const dist = THREE.MathUtils.randFloat(mainBeltInner, mainBeltOuter);
    const angle = Math.random() * Math.PI * 2;
    const y = THREE.MathUtils.randFloatSpread(10);

    meteor.position.set(
      Math.cos(angle) * dist,
      y,
      Math.sin(angle) * dist
    );
    
    meteors.add(meteor);
  }
  return meteors;
}


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
      camera.position.set(0, 150, 400);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 10;
      controls.maxDistance = 4000;
      stateRef.controls = controls;

      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
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
      // Increase threshold for points objects (like the asteroid belt)
      stateRef.raycaster.params.Points.threshold = 5;
      const intersects = stateRef.raycaster.intersectObjects(
        stateRef.clickableObjects,
        true
      );

      if (intersects.length > 0) {
        let currentObject = intersects[0].object;
        // Traverse up to find the group with the ID
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

      stateRef.celestialObjects.forEach((obj) => {
        const body = obj.children.find((c) => (c as THREE.Mesh).isMesh);
        if (obj.userData.rotationSpeed > 0 && body && obj.userData.id === 'sun') {
          // body.rotation.y += obj.userData.rotationSpeed / 100;
        }

        const vector = new THREE.Vector3();
        obj.getWorldPosition(vector);
        const labelPos = vector.clone();

        const objSize = obj.userData.size || 0;
        labelPos.y += objSize;

        newLabels.push({
          id: obj.userData.id,
          name: obj.userData.name,
          color: obj.userData.color,
          position: labelPos,
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

    // --- Scene Cleanup ---
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

    // --- Scene Rebuilding ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const asteroidDust = createAsteroidDust();
    scene.add(asteroidDust);
    clickableObjects.push(asteroidDust);

    const meteors = createMeteors();
    scene.add(meteors);

    data.forEach((objData) => {
      let celestialObj: THREE.Object3D | null = null;
      
      if (objData.type === 'star') {
        const starGroup = new THREE.Group();
        const starGeometry = new THREE.SphereGeometry(objData.size, 32, 32);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700, toneMapped: false });
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.userData.isPlanetBody = true;
        starGroup.add(starMesh);

        const pointLight = new THREE.PointLight(0xffd886, 50, 5000);
        starGroup.add(pointLight);
        celestialObj = starGroup;

      } else if (objData.type === 'planet') {
        const objectGroup = new THREE.Group();
        
        let geometry;
        if (objData.id === 'eurybates') {
          geometry = new THREE.IcosahedronGeometry(objData.size, 0); // Hexagon-like
        } else {
          geometry = new THREE.SphereGeometry(objData.size, 32, 32);
        }

        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(objData.color),
          emissive: objData.id === 'eurybates' ? new THREE.Color(0x000000) : new THREE.Color(objData.color),
          emissiveIntensity: 0.6,
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
        celestialObj = objectGroup;

      }

      if (objData.type === 'planet') {
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

        objData.orbitCurve = ellipse;

        const t = (objData.orbitalOffset || 0) % 1;
        const point = ellipse.getPointAt(t);
        if (celestialObj) {
            celestialObj.position.set(point.x, celestialObj.position.y, point.y);
        }

        const points = ellipse.getPoints(200);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: objData.id === 'eurybates' ? new THREE.Color(0xffffff) : new THREE.Color(objData.color),
          transparent: true,
          opacity: 0.3,
        });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;

        const inclination = THREE.MathUtils.degToRad(objData.orbitalInclination || 0);
        orbit.rotation.z = inclination; 
        if (celestialObj) {
            celestialObj.rotation.z = inclination;
        }

        scene.add(orbit);
        orbitLines.set(objData.id, orbit);
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
            line.material.opacity = isHovered || isSelected ? 0.8 : 0.3;
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

      if (obj.userData.type === 'planet' && body && body.material instanceof THREE.MeshStandardMaterial) {
         if (isSelected) {
            (body.material as THREE.MeshStandardMaterial).emissive.setHex(0xffffff);
            (body.material as THREE.MeshStandardMaterial).emissiveIntensity = 1;
        } else {
            const originalColor = obj.userData.color || 0xaaaaaa;
            const emissiveColor = obj.userData.id === 'eurybates' ? 0x000000 : new THREE.Color(originalColor);
            (body.material as THREE.MeshStandardMaterial).emissive.set(emissiveColor);
            (body.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
        }
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
             obj.material.color.setHex(isBeltSelected ? 0xffffff : 0x00bfff);
        }
    });


  }, [selectedObjectId, stateRef.celestialObjects, stateRef.scene]);

  const displayedLabels = useMemo(() => {
    if (!mountRef.current || !stateRef.camera) return [];
    
    return labels
      .map(label => {
        const vector = label.position.clone().project(stateRef.camera);
        if (vector.z > 1) return null;

        return {
          ...label,
          screenX: (vector.x + 1) / 2 * mountRef.current!.clientWidth,
          screenY: (-vector.y + 1) / 2 * mountRef.current!.clientHeight,
        };
      })
      .filter(Boolean) as (LabelData & { screenX: number; screenY: number })[];
  }, [labels, stateRef.camera]);


  return (
    <div ref={mountRef} className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {displayedLabels.map((label) => (
          <div
            key={label.id}
            className={`absolute p-1 rounded-sm transition-colors duration-300 pointer-events-auto cursor-pointer uppercase tracking-wider text-xs ${
              selectedObjectId === label.id
                ? 'text-primary bg-background/50'
                : 'hover:text-primary'
            }`}
            style={{
              transform: `translate(10px, -50%) translate(${label.screenX}px, ${label.screenY}px)`,
              color: selectedObjectId === label.id ? 'hsl(var(--primary))' : label.color,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectObject(label.id);
            }}
            onMouseEnter={() => onHoverObject(label.id)}
            onMouseLeave={() => onHoverObject(null)}
          >
            {label.name}
          </div>
        ))}
      </div>
    </div>
  );
}
