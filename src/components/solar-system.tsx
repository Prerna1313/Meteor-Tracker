
'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CelestialObject, CometData } from '@/lib/solar-system-data';
import { Button } from './ui/button';
import { Asterisk } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateComet } from '@/ai/flows/generate-comet-flow';

type LabelData = {
  id: string;
  name: string;
  position: THREE.Vector3;
};

type SolarSystemProps = {
  data: CelestialObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  comets: CometData[];
  onCometsChange: (comets: CometData[]) => void;
};

type Stardust = {
  points: THREE.Points;
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

const createStardust = (count: number): Stardust => {
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const color = new THREE.Color('#1b3984');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = THREE.MathUtils.randFloat(50, 50000);
    const angle = Math.random() * Math.PI * 2;
    
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = THREE.MathUtils.randFloatSpread(5000);
    positions[i3 + 2] = Math.sin(angle) * radius;

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 20,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  const points = new THREE.Points(particles, particleMaterial);
  return { points };
};


const createAsteroidBelt = (count: number) => {
  const baseGeometry = new THREE.IcosahedronGeometry(0.5, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    roughness: 0.8,
  });
  const instancedMesh = new THREE.InstancedMesh(baseGeometry, material, count);
  instancedMesh.userData = { id: 'asteroid_belt', name: 'Asteroid Belt' };

  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const dist = THREE.MathUtils.randFloat(200, 250);
    const angle = Math.random() * Math.PI * 2;
    const y = THREE.MathUtils.randFloatSpread(5);

    dummy.position.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);
    dummy.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    const scale = THREE.MathUtils.randFloat(0.5, 1.5)
    dummy.scale.set(scale, scale, scale);
    dummy.updateMatrix();

    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
  return instancedMesh;
};

const CometGenerator = ({
  open,
  onOpenChange,
  onCometGenerated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCometGenerated: (comet: CometData) => void;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Comet name must be at least 2 characters.',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const newComet = await generateComet(values.name);
      onCometGenerated(newComet);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to generate comet:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate a Comet</DialogTitle>
          <DialogDescription>
            Create a new comet to add to the solar system. The AI will generate
            its orbital parameters.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comet Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Comet Stardust" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export function SolarSystem({
  data,
  selectedObjectId,
  onSelectObject,
  comets,
  onCometsChange,
}: SolarSystemProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<LabelData[]>([]);
  const [isCometGeneratorOpen, setIsCometGeneratorOpen] = useState(false);

  const stateRef = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, 1, 0.1, 100000),
    controls: null as OrbitControls | null,
    raycaster: new THREE.Raycaster(),
    textureLoader: new THREE.TextureLoader(),
    clickableObjects: [] as THREE.Object3D[],
    celestialObjects: new Map<string, THREE.Object3D>(),
    stardustSystem: null as Stardust | null,
    cometObjects: new Map<string, THREE.Object3D>(),
  }).current;

  const handleCometGenerated = useCallback(
    (newComet: CometData) => {
      onCometsChange([...comets, newComet]);
    },
    [comets, onCometsChange]
  );

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
      controls.maxDistance = 10000;
      stateRef.controls = controls;

      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      
      const stardust = createStardust(100000);
      scene.add(stardust.points);
      stateRef.stardustSystem = stardust;
      
      const asteroidBelt = createAsteroidBelt(1500);
      scene.add(asteroidBelt);
      stateRef.clickableObjects.push(asteroidBelt);
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

    const clock = new THREE.Clock();
    const animate = () => {
      if (!stateRef.renderer) return;
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const newLabels: LabelData[] = [];

      stateRef.celestialObjects.forEach((obj) => {
        const {
          id,
          type,
          orbitalSpeed,
          rotationSpeed,
          distance,
          eccentricity = 0,
        } = obj.userData;
        const planetBody = obj.children.find((c) => c.userData.isPlanetBody);

        if (id === 'sun') {
          obj.position.set(0, 0, 0);
        } else if (type === 'planet' && orbitalSpeed > 0) {
          const semiMajorAxis = distance;
          const semiMinorAxis =
            semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
          const angle = elapsedTime * (orbitalSpeed / 50);
          const focusOffset = eccentricity * semiMajorAxis;

          const x = Math.cos(angle) * semiMajorAxis - focusOffset;
          const z = Math.sin(angle) * semiMinorAxis;
          obj.position.set(x, 0, z);
        }

        if (rotationSpeed > 0 && planetBody) {
          planetBody.rotation.y += rotationSpeed / 100;
        }

        const vector = new THREE.Vector3();
        obj.getWorldPosition(vector);
        const labelPos = vector.clone();

        const objSize = obj.userData.size || 0;
        labelPos.y += objSize;

        newLabels.push({
          id: obj.userData.id,
          name: obj.userData.name,
          position: labelPos,
        });
      });
      
      stateRef.cometObjects.forEach((cometObj) => {
        const { perihelion, aphelion, inclination, orbitalPeriod } = cometObj.userData.orbital;
        const semiMajorAxis = (perihelion + aphelion) / 2;
        const eccentricity = (aphelion - perihelion) / (aphelion + perihelion);
        const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
        const angle = (elapsedTime / (orbitalPeriod * 365.25 / 100)) * (Math.PI * 2);
        const focusOffset = eccentricity * semiMajorAxis;

        const x = Math.cos(angle) * semiMajorAxis - focusOffset;
        const z = Math.sin(angle) * semiMinorAxis;
        
        cometObj.position.set(x, 0, z);
        cometObj.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination * (Math.PI / 180));
        
        const vector = new THREE.Vector3();
        cometObj.getWorldPosition(vector);
        const labelPos = vector.clone();
        labelPos.y += 2; // offset for label
        
        newLabels.push({ id: cometObj.userData.id, name: cometObj.userData.name, position: labelPos });
      });

      setLabels(newLabels);
      controls.update();
      renderer.render(stateRef.scene, stateRef.camera);
    };
    const animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (stateRef.renderer) {
        stateRef.renderer.domElement.removeEventListener('click', handleClick);
      }
      controls?.dispose();
    };
  }, [stateRef, onSelectObject, comets, onCometsChange]);

  useEffect(() => {
    const { scene, clickableObjects, celestialObjects } = stateRef;
    
    // Clear old objects
    celestialObjects.forEach(obj => scene.remove(obj));
    celestialObjects.clear();
    stateRef.clickableObjects = stateRef.clickableObjects.filter(obj => obj.userData.id === 'asteroid_belt');


    const textures = new Map<string, THREE.Texture>();
    data.forEach((objData) => {
      let celestialObj: THREE.Object3D | null = null;
      if (objData.textureUrl && !textures.has(objData.id)) {
        textures.set(
          objData.id,
          stateRef.textureLoader.load(objData.textureUrl)
        );
      }
      if (objData.rings?.textureUrl && !textures.has(`${objData.id}-ring`)) {
        textures.set(
          `${objData.id}-ring`,
          stateRef.textureLoader.load(objData.rings.textureUrl)
        );
      }

      if (objData.type === 'star') {
        const starGroup = new THREE.Group();
        const glow = createSunGlow();
        if (glow) starGroup.add(glow);

        const pointLight = new THREE.PointLight(0xffffff, 3.5, 4000);
        starGroup.add(pointLight);
        celestialObj = starGroup;
      } else if (objData.type === 'planet') {
        const objectGroup = new THREE.Group();
        const geometry = new THREE.SphereGeometry(objData.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({
          map: textures.get(objData.id),
          roughness: 0.9,
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
            map: textures.get(`${objData.id}-ring`),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
          });
          const rings = new THREE.Mesh(ringGeometry, ringMaterial);
          rings.rotation.x = Math.PI / 2;
          body.add(rings);
        }

        const semiMajorAxis = objData.distance;
        const eccentricity = objData.eccentricity ?? 0;
        const semiMinorAxis =
          semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
        const focusOffset = eccentricity * semiMajorAxis;

        const ellipse = new THREE.EllipseCurve(
          -focusOffset,
          0,
          semiMajorAxis,
          semiMinorAxis,
          0,
          2 * Math.PI,
          false,
          0
        );

        const points = ellipse.getPoints(200);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: 0xeeeeee,
          transparent: true,
          opacity: 0.3,
        });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);

        celestialObj = objectGroup;
      }

      if (celestialObj) {
        celestialObj.userData = { ...objData };
        scene.add(celestialObj);
        celestialObjects.set(objData.id, celestialObj);
        celestialObj.traverse((child) => clickableObjects.push(child));
      }
    });
  }, [data, stateRef]);

  useEffect(() => {
    const { scene, clickableObjects, cometObjects } = stateRef;

    // Clear old comets
    cometObjects.forEach(obj => {
      scene.remove(obj);
      const orbit = obj.userData.orbitLine;
      if (orbit) scene.remove(orbit);
    });
    cometObjects.clear();
    
    // Filter out old comet objects from clickableObjects
    stateRef.clickableObjects = stateRef.clickableObjects.filter(obj => !obj.userData.isComet);


    comets.forEach(cometData => {
        const cometGroup = new THREE.Group();
        const headGeometry = new THREE.IcosahedronGeometry(cometData.size, 0);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, flatShading: true });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        cometGroup.add(head);

        const { perihelion, aphelion, inclination } = cometData.orbital;
        const semiMajorAxis = (perihelion + aphelion) / 2;
        const eccentricity = (aphelion - perihelion) / (aphelion + perihelion);
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
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x66ddff, transparent: true, opacity: 0.5 });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        orbit.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination * (Math.PI / 180));
        scene.add(orbit);

        cometGroup.userData = { ...cometData, isComet: true, orbitLine: orbit };
        scene.add(cometGroup);
        cometObjects.set(cometData.id, cometGroup);
        clickableObjects.push(cometGroup);
    });

  }, [comets, stateRef]);

  useEffect(() => {
    stateRef.celestialObjects.forEach((obj, id) => {
      const isSelected = id === selectedObjectId;
      const body = obj.children.find((c) => (c as THREE.Mesh).isMesh) as
        | THREE.Mesh
        | undefined;
      let meshToHighlight = obj.userData.type === 'star' ? undefined : body;

      if (
        meshToHighlight &&
        meshToHighlight.material instanceof THREE.MeshStandardMaterial
      ) {
        meshToHighlight.material.emissive.setHex(isSelected ? 0x7dffff : 0x000000);
        meshToHighlight.material.emissiveIntensity = isSelected ? 0.6 : 0;
      }

      if (obj.userData.type === 'star') {
        const glow = obj.children.find((c) => c instanceof THREE.Sprite);
        if (glow) {
          (glow as THREE.Sprite).material.opacity = isSelected ? 1 : 0.7;
        }
      }
    });

    stateRef.cometObjects.forEach((obj, id) => {
        const isSelected = id === selectedObjectId;
        const head = obj.children[0] as THREE.Mesh;
        if (head && head.material instanceof THREE.MeshStandardMaterial) {
            head.material.emissive.setHex(isSelected ? 0x66ddff : 0x000000);
            head.material.emissiveIntensity = isSelected ? 0.8 : 0;
        }
    });

    const belt = stateRef.scene.getObjectByProperty('userData.id', 'asteroid_belt') as THREE.InstancedMesh;
    if (belt && belt.material instanceof THREE.MeshStandardMaterial) {
        belt.material.color.setHex(selectedObjectId === 'asteroid_belt' ? 0x66ddff : 0xaaaaaa);
    }


  }, [selectedObjectId, stateRef.celestialObjects, stateRef.cometObjects, stateRef.scene]);

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
      {selectedObjectId === 'sun' && (
        <Button
          className="fixed top-20 left-4 z-50"
          onClick={() => setIsCometGeneratorOpen(true)}
        >
          <Asterisk className="w-4 h-4 mr-2" />
          Generate Comet
        </Button>
      )}
      <CometGenerator
        open={isCometGeneratorOpen}
        onOpenChange={setIsCometGeneratorOpen}
        onCometGenerated={handleCometGenerated}
      />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {displayedLabels.map((label) => (
          <div
            key={label.id}
            className={`absolute text-xs p-1 rounded-sm transition-colors duration-300 pointer-events-auto cursor-pointer ${
              selectedObjectId === label.id
                ? 'text-primary bg-background/50 font-bold'
                : 'text-white/80 hover:text-primary'
            }`}
            style={{
              transform: `translate(10px, -50%) translate(${label.screenX}px, ${label.screenY}px)`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectObject(label.id);
            }}
          >
            {label.name}
          </div>
        ))}
      </div>
    </div>
  );
}
