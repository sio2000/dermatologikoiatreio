import { memo, Suspense, useCallback, useLayoutEffect, useMemo, useRef, type MutableRefObject, type PointerEvent, type ReactNode } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

const OBJ_URL = new URL('../../assets/uploads_files_130109_Femal_Base_Mesh.obj', import.meta.url).href

const PROBLEM_COLOR = new THREE.Color('#c46b5a')
const HEALTHY_COLOR = new THREE.Color('#f2d8ce')
const PROBLEM_ROUGH = 0.86
const HEALTHY_ROUGH = 0.38
const METALNESS = 0.04
const LERP_SPEED = 0.12
const IDLE_PROGRESS = 0.42

function createBumpTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context')
  const img = ctx.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const v = Math.floor(Math.random() * 220 + 20)
    const o = i * 4
    img.data[o] = img.data[o + 1] = img.data[o + 2] = v
    img.data[o + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.NoColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(8, 8)
  tex.needsUpdate = true
  return tex
}

type SkinModelProps = {
  progressRef: MutableRefObject<number>
}

type TiltRef = MutableRefObject<{ x: number; y: number }>

function ModelTilt({ tiltRef, children }: { tiltRef: TiltRef; children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    const g = group.current
    if (!g) return
    const tx = THREE.MathUtils.clamp(tiltRef.current.x, -1, 1) * 0.14
    const ty = THREE.MathUtils.clamp(tiltRef.current.y, -1, 1) * -0.06
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, tx, 0.1)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, ty, 0.1)
  })
  return <group ref={group}>{children}</group>
}

function CameraRig() {
  const { camera } = useThree()
  useFrame(() => {
    camera.lookAt(0, 0.4, 0)
  })
  return null
}

function SkinModel({ progressRef }: SkinModelProps) {
  const obj = useLoader(OBJLoader, OBJ_URL)
  const bumpMap = useMemo(() => createBumpTexture(), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PROBLEM_COLOR.clone(),
        roughness: PROBLEM_ROUGH,
        metalness: METALNESS,
        bumpMap,
        bumpScale: 0.2,
      }),
    [bumpMap]
  )

  const smoothRef = useRef(IDLE_PROGRESS)
  const colorScratch = useRef(new THREE.Color())

  const root = useMemo(() => {
    const g = obj.clone(true)
    const box = new THREE.Box3().setFromObject(g)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
    const fit = 2.68 / maxDim
    g.position.sub(center)
    g.scale.setScalar(fit)
    g.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.material = material
      }
    })
    return g
  }, [obj, material])

  useLayoutEffect(() => {
    return () => {
      material.dispose()
      bumpMap.dispose()
    }
  }, [bumpMap, material])

  useFrame(() => {
    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1)
    smoothRef.current = THREE.MathUtils.lerp(smoothRef.current, target, LERP_SPEED)

    const p = smoothRef.current
    colorScratch.current.copy(PROBLEM_COLOR).lerp(HEALTHY_COLOR, p)
    material.color.copy(colorScratch.current)
    material.roughness = THREE.MathUtils.lerp(PROBLEM_ROUGH, HEALTHY_ROUGH, p)
    material.bumpScale = THREE.MathUtils.lerp(0.22, 0.03, p)
    const inflam = (1 - p) * 0.055
    material.emissive.setRGB(inflam * 0.9, inflam * 0.2, inflam * 0.15)
  })

  return <primitive object={root} />
}

type SkinSceneProps = SkinModelProps & { tiltRef: TiltRef }

function SkinScene({ progressRef, tiltRef }: SkinSceneProps) {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.58} color="#ffffff" />
      <directionalLight
        position={[2.2, 4.5, 3]}
        intensity={1.15}
        color="#fff8f4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-near={0.5}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <directionalLight position={[-2.5, 2, -1.5]} intensity={0.35} color="#e8e4ff" />
      <Suspense fallback={null}>
        <group position={[0, -0.5, 0]}>
          <ModelTilt tiltRef={tiltRef}>
            <SkinModel progressRef={progressRef} />
          </ModelTilt>
        </group>
      </Suspense>
      <ContactShadows
        position={[0, -0.28, 0]}
        opacity={0.22}
        scale={12}
        blur={2.2}
        far={5}
        color="#8a7a72"
      />
      <Environment preset="studio" environmentIntensity={0.58} />
    </>
  )
}

type HeroSkinCanvasProps = {
  progressRef: MutableRefObject<number>
  tiltRef: TiltRef
}

export const HeroSkinCanvas = memo(function HeroSkinCanvas({ progressRef, tiltRef }: HeroSkinCanvasProps) {
  return (
    <Canvas
      className="hero-dm-canvas"
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={({ gl, scene }) => {
        scene.background = null
        gl.setClearColor(0x000000, 0)
      }}
      camera={{ position: [0, 0.28, 2.3], fov: 38, near: 0.05, far: 50 }}
    >
      <SkinScene progressRef={progressRef} tiltRef={tiltRef} />
    </Canvas>
  )
})

export function HeroSkinAnalysis() {
  const progressRef = useRef(IDLE_PROGRESS)
  const tiltRef = useRef({ x: 0, y: 0 })

  const updateFromPointer = useCallback((clientX: number, clientY: number, rect: DOMRect) => {
    const nx = (clientX - rect.left) / Math.max(rect.width, 1)
    const ny = (clientY - rect.top) / Math.max(rect.height, 1)
    progressRef.current = THREE.MathUtils.clamp(nx, 0, 1)
    tiltRef.current.x = (nx - 0.5) * 2
    tiltRef.current.y = (ny - 0.5) * 2
  }, [])

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      updateFromPointer(e.clientX, e.clientY, el.getBoundingClientRect())
    },
    [updateFromPointer]
  )

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      updateFromPointer(e.clientX, e.clientY, el.getBoundingClientRect())
    },
    [updateFromPointer]
  )

  const handlePointerLeave = useCallback(() => {
    progressRef.current = IDLE_PROGRESS
    tiltRef.current.x = 0
    tiltRef.current.y = 0
  }, [])

  return (
    <section id="hero" className="hero-dm" aria-label="Hero">
      <div className="hero-dm-main">
        <div className="hero-dm-grid">
          <div className="hero-dm-copy">
            <h1 className="hero-dm-title">
              <span className="hero-dm-title-line">
                Η επιστήμη της δερματολογίας
              </span>
              <span className="hero-dm-title-line">
                συναντά την <em>αισθητική αρμονία</em>.
              </span>
            </h1>
            <p className="hero-dm-lead" id="hero-dm-3d-hint">
              Στην Advanced Derma προσφέρουμε ιατρικά εξατομικευμένες θεραπείες που
              αναδεικνύουν το καλύτερο αποτέλεσμα για την επιδερμίδα σας, με απόλυτη ασφάλεια,
              φυσική αισθητική και σεβασμό στη μοναδικότητα κάθε προσώπου.
            </p>
            <div className="hero-dm-actions">
              <a href="#booking" className="hero-dm-btn hero-dm-btn--primary">
                Κλείστε Ραντεβού
              </a>
              <a href="#doctor" className="hero-dm-btn hero-dm-btn--ghost">
                Γνωρίστε την Ιατρό
              </a>
            </div>
          </div>

          <div className="hero-dm-visual">
            <div
              className="hero-dm-canvas-slot"
              onPointerMove={handlePointerMove}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              aria-describedby="hero-dm-3d-hint"
            >
              <HeroSkinCanvas progressRef={progressRef} tiltRef={tiltRef} />
            </div>
          </div>
        </div>

        <div className="hero-dm-trust" role="presentation">
          <span className="hero-dm-trust-item">✓ ΠΙΣΤΟΠΟΙΗΜΕΝΗ ΕΞΕΙΔΙΚΕΥΣΗ</span>
          <span className="hero-dm-trust-item">✓ ΙΑΤΡΙΚΗ ΑΚΡΙΒΕΙΑ</span>
          <span className="hero-dm-trust-item">✓ ΠΡΟΣΩΠΟΚΕΝΤΡΙΚΗ ΦΡΟΝΤΙΔΑ</span>
        </div>
      </div>
    </section>
  )
}
