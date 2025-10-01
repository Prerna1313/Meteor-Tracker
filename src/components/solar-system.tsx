'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import type { CelestialObject } from '@/lib/solar-system-data';

type SolarSystemProps = {
  data: CelestialObject[];
  onSelectObject: (id: string | null) => void;
  selectedObjectId: string | null;
};

export function SolarSystem({ data, onSelectObject, selectedObjectId }: SolarSystemProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const clickableObjectsRef = useRef<THREE.Mesh[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!mountRef.current || rendererRef.current) return;

    // Basic setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(0, 150, 250);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Label Renderer
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    mountRef.current.appendChild(labelRenderer.domElement);
    labelRendererRef.current = labelRenderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 50;
    controls.maxDistance = 1000;
    controlsRef.current = controls;

    // Raycaster for clicking
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
        if (!mountRef.current) return;
        const rect = mountRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(clickableObjectsRef.current);

        if (intersects.length > 0) {
            onSelectObject(intersects[0].object.userData.id);
        } else {
            onSelectObject(null);
        }
    };
    renderer.domElement.addEventListener('click', handleClick);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (!rendererRef.current) return; // Stop animation if cleaned up
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      scene.children.forEach(obj => {
        if (obj instanceof THREE.Mesh) {
            if (obj.userData.type === 'planet') {
                const angle = elapsedTime * (obj.userData.orbitalSpeed / 20);
                obj.position.x = Math.cos(angle) * obj.userData.distance;
                obj.position.z = Math.sin(angle) * obj.userData.distance;
                obj.rotation.y += obj.userData.rotationSpeed / 20;
            } else if (obj.userData.type === 'star') {
                obj.rotation.y += (obj.userData.rotationSpeed / 20);
            }
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      controlsRef.current?.dispose();
      if (rendererRef.current) {
        rendererRef.current.domElement.removeEventListener('click', handleClick);
        if (mountRef.current && rendererRef.current.domElement) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
       if (labelRendererRef.current) {
        if (mountRef.current && labelRendererRef.current.domElement){
           mountRef.current.removeChild(labelRendererRef.current.domElement);
        }
        labelRendererRef.current = null;
      }
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if(Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });
      sceneRef.current = null;
    };
  }, [onSelectObject]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    
    // Clear existing objects but keep ambient light
    const lights = scene.children.filter(c => c.type.includes('Light'));
    const objectsToRemove = scene.children.filter(c => !c.type.includes('Light'));

    objectsToRemove.forEach(child => {
        scene.remove(child);
        // Clean up geometries, materials, and labels
        if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else if(child.material) {
                child.material.dispose();
            }
        }
        child.traverse(object => {
            if (object instanceof CSS2DObject) {
                object.removeFromParent();
            }
        });
    });
    
    clickableObjectsRef.current = [];
    if(lights.length === 0) scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    data.forEach(objData => {
      if (objData.type === 'star') {
        const geometry = new THREE.SphereGeometry(objData.size, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: objData.color });
        const star = new THREE.Mesh(geometry, material);
        star.userData = { id: objData.id, type: 'star', rotationSpeed: objData.rotationSpeed, originalColor: objData.color };
        scene.add(star);
        clickableObjectsRef.current.push(star);
        
        const pointLight = new THREE.PointLight(0xFFFFFF, 3, 3000);
        star.add(pointLight);

        const labelDiv = document.createElement('div');
        labelDiv.className = 'text-accent font-bold p-2 rounded-md bg-background/30 text-sm whitespace-nowrap';
        labelDiv.textContent = objData.name;
        const label = new CSS2DObject(labelDiv);
        label.position.set(0, objData.size + 5, 0);
        star.add(label);

      } else if (objData.type === 'planet') {
        const geometry = new THREE.SphereGeometry(objData.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: objData.color, roughness: 0.8 });
        const planet = new THREE.Mesh(geometry, material);
        
        planet.userData = { ...objData, originalColor: objData.color };
        scene.add(planet);
        clickableObjectsRef.current.push(planet);

        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
          new THREE.Path().absarc(0, 0, objData.distance, 0, Math.PI * 2, false).getSpacedPoints(128)
        );
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xEEEEEE, transparent: true, opacity: 0.2 });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit); // Add orbit directly to the scene

        const labelDiv = document.createElement('div');
        labelDiv.className = 'text-foreground p-1 rounded-md bg-background/30 text-xs whitespace-nowrap';
        labelDiv.textContent = objData.name;
        const label = new CSS2DObject(labelDiv);
        label.position.set(0, objData.size + 2, 0);
        planet.add(label);

        if (objData.meteors.length > 0) {
          const meteorMaterial = new THREE.MeshStandardMaterial({color: 0xaaaaaa, roughness: 0.9});
          const meteorGeometry = new THREE.IcosahedronGeometry(0.5, 0);
          const instancedMesh = new THREE.InstancedMesh(meteorGeometry, meteorMaterial, objData.meteors.length);
          
          const dummy = new THREE.Object3D();
          objData.meteors.forEach((meteor, i) => {
            const angle = Math.random() * Math.PI * 2;
            const radius = objData.size + 5 + Math.random() * 5;
            dummy.position.set(
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * 5,
              Math.sin(angle) * radius
            );
            dummy.scale.setScalar(meteor.size * 0.1);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
          });
          planet.add(instancedMesh);
        }
      }
    });

  }, [data]);
  
  useEffect(() => {
    clickableObjectsRef.current.forEach(obj => {
      const isSelected = obj.userData.id === selectedObjectId;
      if (obj.material instanceof THREE.MeshStandardMaterial || obj.material instanceof THREE.MeshBasicMaterial) {
         if (isSelected) {
            obj.material.color.set(0x7DF9FF); // accent color
         } else {
            obj.material.color.set(obj.userData.originalColor);
         }
      }
    });
  }, [selectedObjectId]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
}
