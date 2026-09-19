'use client'

import { Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createSealBumpTexture } from './seal-texture'

function Seal({ onReady }: { onReady: () => void }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const [bump, setBump] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    let cancelled = false
    // Wait for Bodoni before drawing the monogram, otherwise the die gets
    // struck in whatever fallback serif happened to be ready.
    const draw = () => {
      if (cancelled) return
      setBump(createSealBumpTexture())
      onReady()
    }
    if (document.fonts?.ready) {
      void document.fonts.ready.then(draw)
    } else {
      draw()
    }
    return () => {
      cancelled = true
    }
  }, [onReady])

  useEffect(() => () => bump?.dispose(), [bump])

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const node = group.current
    if (!node) return
    const t = state.clock.elapsedTime

    // The seal leans toward the cursor, it does not follow it. Heavy damping
    // plus a slow idle drift so it is never perfectly still and never busy.
    const targetX = pointer.current.y * 0.17 + Math.sin(t * 0.24) * 0.022
    const targetY = pointer.current.x * 0.25 + Math.sin(t * 0.17) * 0.03

    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, targetX, 1.9, delta)
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, targetY, 1.9, delta)
  })

  if (!bump) return null

  return (
    <group ref={group}>
      {/*
        The struck face is its own disc rather than the cap of the cylinder.
        A cylinder's cap UVs are laid out in its local XZ plane, so once the
        mesh is turned to face the camera the monogram arrives rotated a quarter
        turn. CircleGeometry maps the unit square straight onto the face, which
        is exactly what the canvas draws into.
      */}
      <mesh position={[0, 0, 0.066]}>
        <circleGeometry args={[1, 192]} />
        <meshStandardMaterial
          color="#a3814e"
          metalness={0.9}
          roughness={0.33}
          bumpMap={bump}
          bumpScale={7}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* The blank body behind it, so the seal has an edge and some weight. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.13, 192]} />
        <meshStandardMaterial color="#8a6b3f" metalness={0.95} roughness={0.42} envMapIntensity={1} />
      </mesh>
    </group>
  )
}

export default function SealScene({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.75]}
      camera={{ fov: 30, position: [0, 0, 4.4] }}
      // The seal is decoration: the headline and the booking link are real DOM.
      aria-hidden
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.12} />
      {/* The key: low and hard from the left, so the emboss throws a long shadow. */}
      <directionalLight position={[-3.4, 1.9, 2.2]} intensity={2.6} />
      {/* A cold sliver from behind-right to separate the rim from the photograph. */}
      <directionalLight position={[3.2, -1.4, -1.8]} intensity={0.75} color="#cfe0ff" />

      {/*
        A procedural studio, four soft strips in a cube render target. Gives the
        brass something to reflect without downloading an HDRI.
      */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[-2.4, 1.6, 2]} scale={[4, 6, 1]} />
        <Lightformer
          form="rect"
          intensity={0.8}
          position={[2.6, 0.4, 1.4]}
          scale={[3, 4, 1]}
          color="#9fb6d8"
        />
        <Lightformer form="ring" intensity={1.1} position={[0, 2.6, -1.6]} scale={3} />
        <Lightformer form="rect" intensity={0.45} position={[0, -2.4, 1]} scale={[6, 2, 1]} color="#8a6b3f" />
      </Environment>

      <Seal onReady={onReady} />
    </Canvas>
  )
}
