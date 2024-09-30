import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, GroupProps, MeshProps, useFrame } from '@react-three/fiber'
import React, { Suspense, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { type GLTF, SkeletonUtils } from 'three-stdlib'
import { withBasename } from 'vite-paths'

const caseModel = withBasename('data.glb')

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

const useSwapTexture = (path: string, material: THREE.MeshStandardMaterial) => {
  const colorMap = useTexture(`${path}`)
  useEffect(() => {
    const map = material.map
    if (map) {
      map.image = colorMap.image
      material.needsUpdate = true
    }
  }, [colorMap, material])
  return null
}

const Model: React.FC<GroupProps & { cover: string }> = ({
  cover,
  ...props
}) => {
  const groupRef = useRef<THREE.Group>(null!)
  const { nodes, materials: mat } = useGLTF(
    `${caseModel}?key=${cover}`
  ) as GLTFResult
  const material = mat.Material
  const { geometry } = nodes.Cube
  useSwapTexture(cover, material)
  useFrame((_state, delta) => {
    groupRef.current.rotation.y += delta * 0.45
  })
  return (
    <group
      ref={groupRef}
      {...props}
      dispose={null}
      rotation={[
        Math.PI * (1 / 2) * (28 / 90),
        -Math.PI / 2,
        -Math.PI * (1 / 2) * (5 / 90)
      ]}
    >
      <mesh castShadow receiveShadow geometry={geometry} material={material} />
    </group>
  )
}

type WithPreload<T extends {}> = T & { preload: () => void }

const withModel = (game: string) => {
  const gameWithBase = withBasename(game)
  const GameModel: React.FC<GroupProps> = props => (
    <Model {...props} cover={gameWithBase} />
  )
  const GameModelWithPreload = GameModel as WithPreload<typeof GameModel>
  GameModelWithPreload.preload = () => {
    useGLTF.preload(`${caseModel}?key=${gameWithBase}`)
    useTexture.preload(gameWithBase)
  }
  return GameModel
}

const MarioParty4 = withModel('mp4.jpg')
const SuperSmashBrosMelee = withModel('ssbm.jpg')

const ThreeCanvas: React.FC<{}> = () => (
  <div className="flex-grow max-h-[100vh] h-[100vh]">
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
        <MarioParty4 scale={1.5} position={[-1.75, 0, 0]} />
        <SuperSmashBrosMelee scale={1.5} position={[1.75, 0, 0]} />
      </Suspense>
    </Canvas>
  </div>
)

export default ThreeCanvas
