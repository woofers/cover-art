import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, GroupProps, MeshProps, useFrame } from '@react-three/fiber'
import React, { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import type { GLTF } from 'three-stdlib'
import { withBasename } from 'vite-paths'

const caseModel = withBasename('data.glb')
const texture = withBasename('ssbm.jpg')

useGLTF.preload(caseModel)
useTexture.preload(texture)

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

const useSwapTexture = (path: string, material: THREE.MeshStandardMaterial) => {
  const colorMap = useTexture(path)
  useEffect(() => {
    const map = material.map
    if (map) {
      map.image = colorMap.image
      material.needsUpdate = true
    }
  }, [colorMap, material])
  return null
}

const Model: React.FC<GroupProps> = props => {
  const groupRef = useRef<THREE.Group>(null!)
  const { nodes, materials } = useGLTF(caseModel) as GLTFResult
  useSwapTexture(texture, materials.Material)
  useFrame((_state, delta) => {
    groupRef.current.rotation.y += delta * 0.5
    groupRef.current.rotation.z = -0.1
    groupRef.current.rotation.x = 0.5
  })
  const { geometry } = nodes.Cube

  return (
    <group ref={groupRef} {...props} dispose={null} rotation={[0, -90, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={geometry}
        material={materials.Material}
      />
    </group>
  )
}

export const ThreeCanvas: React.FC<{}> = () => (
  <div className="w-[900px] h-[900px]">
    <Canvas>
      <Suspense fallback={null}>
        <OrbitControls />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Model scale={1.5} position={[0, 0, 0]} />
      </Suspense>
    </Canvas>
  </div>
)
