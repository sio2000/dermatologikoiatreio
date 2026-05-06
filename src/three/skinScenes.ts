import * as THREE from 'three'

export function mountPhilosophyLayers(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const setSize = () => {
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    50,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    100
  )
  camera.position.set(0, 1, 7)

  const layers: THREE.Mesh[] = []
  const layerColors = [0xf5e6dc, 0xedd5c5, 0xe0c0a8]
  const layerOpacities = [0.4, 0.55, 0.7]

  for (let i = 0; i < 3; i++) {
    const geo = new THREE.PlaneGeometry(6, 6, 40, 40)
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(layerColors[i]),
      transparent: true,
      opacity: layerOpacities[i],
      roughness: 0.9,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.z = -i * 0.8
    mesh.rotation.x = 0.3
    scene.add(mesh)
    layers.push(mesh)
  }

  const light = new THREE.DirectionalLight(0xfff0e0, 2.5)
  light.position.set(3, 5, 5)
  scene.add(light)
  scene.add(new THREE.AmbientLight(0xfaf9f7, 0.8))

  const geometries = layers.map((m) => m.geometry as THREE.PlaneGeometry)
  const poses = geometries.map((g) => g.attributes.position)
  const origZ = poses.map((p) =>
    Array.from({ length: p.count }, (_, i) => p.getZ(i)!)
  )

  let t = 0
  let frame = 0
  function animate() {
    frame = requestAnimationFrame(animate)
    t += 0.004
    poses.forEach((p, li) => {
      const mesh = layers[li]!
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i)!
        const y = p.getY(i)!
        const w =
          Math.sin(x * 0.8 + t + li * 0.5) * 0.15 + Math.cos(y * 0.6 + t * 0.7) * 0.1
        p.setZ(i, origZ[li]![i]! + w)
      }
      p.needsUpdate = true
      mesh.geometry.computeVertexNormals()
    })
    camera.position.x = Math.sin(t * 0.12) * 0.4
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
  }
  animate()
  setSize()
  window.addEventListener('resize', setSize)

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', setSize)
    layers.forEach((m) => {
      m.geometry.dispose()
      ;(m.material as THREE.MeshStandardMaterial).dispose()
    })
    renderer.dispose()
  }
}

export function mountCtaGlow(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const setSize = () => {
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    100
  )
  camera.position.set(0, 0, 5)

  const geo = new THREE.PlaneGeometry(18, 10, 60, 40)
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xf0c9b0),
    roughness: 0.8,
    metalness: 0.05,
  })
  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)

  const light1 = new THREE.PointLight(0xffd9b8, 3, 10)
  light1.position.set(2, 2, 3)
  scene.add(light1)
  const light2 = new THREE.PointLight(0xe8b0a0, 2, 8)
  light2.position.set(-3, -1, 2)
  scene.add(light2)
  scene.add(new THREE.AmbientLight(0xfaf9f7, 0.5))

  const pos = geo.attributes.position
  const originalZ = Array.from({ length: pos.count }, (_, i) => pos.getZ(i)!)

  let t = 0
  let frame = 0
  function animate() {
    frame = requestAnimationFrame(animate)
    t += 0.003
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)!
      const y = pos.getY(i)!
      const w =
        Math.sin(x * 0.4 + t * 1.1) * 0.14 + Math.sin(y * 0.6 + t * 0.7) * 0.1
      pos.setZ(i, originalZ[i]! + w)
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
    light1.position.x = Math.sin(t * 0.3) * 3
    light1.position.y = Math.cos(t * 0.2) * 1.5
    light2.position.x = Math.cos(t * 0.25) * 3
    renderer.render(scene, camera)
  }
  animate()
  setSize()
  window.addEventListener('resize', setSize)

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', setSize)
    geo.dispose()
    mat.dispose()
    renderer.dispose()
  }
}
