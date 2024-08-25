import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import * as THREE from 'three'

const Box = (props: ThreeElements['mesh']) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((_state, delta) => (meshRef.current.rotation.x += delta))
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 2.5 : 2}
      onClick={_event => setActive(!active)}
      onPointerOver={_event => setHover(true)}
      onPointerOut={_event => setHover(false)}
    >
      <boxGeometry args={[1, 1.41, 0.0765]} />
      <meshStandardMaterial color={hovered ? '#706F6F' : '#3E3D3D'} />
    </mesh>
  )
}

export const ThreeCanvas: React.FC<{}> = () => (
  <div className="w-[900px] h-[300px]">
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[2.5, 0, 0]} />
      <Box position={[-2.5, 0, 0]} />
    </Canvas>
  </div>
)
