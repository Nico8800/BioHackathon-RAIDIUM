// components/ThreeScene.tsx
'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ThreeScene = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Création de l'ADN
    const createDNAModel = () => {
      const group = new THREE.Group()
      
      // Paramètres de l'hélice
      const radius = 2
      const height = 8
      const turns = 3
      const pointsPerTurn = 30
      const totalPoints = turns * pointsPerTurn
      
      // Création des deux hélices
      const createHelix = (offset: number, color: string) => {
        const points = []
        const spheres = []
        
        for (let i = 0; i < totalPoints; i++) {
          const angle = (i / pointsPerTurn) * Math.PI * 2
          const y = (i / totalPoints) * height - height / 2
          const x = Math.cos(angle + offset) * radius
          const z = Math.sin(angle + offset) * radius
          
          points.push(new THREE.Vector3(x, y, z))
          
          // Ajouter une sphère à chaque point
          if (i % 2 === 0) {
            const sphereGeometry = new THREE.SphereGeometry(0.2, 8, 8)
            const sphereMaterial = new THREE.MeshBasicMaterial({
              color: color,
              transparent: true,
              opacity: 0.8
            })
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
            sphere.position.set(x, y, z)
            spheres.push(sphere)
          }
        }
        
        // Créer la ligne de l'hélice
        const curve = new THREE.CatmullRomCurve3(points)
        const tubeGeometry = new THREE.TubeGeometry(curve, totalPoints, 0.1, 8, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.5
        })
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
        
        return { tube, spheres }
      }
      
      // Créer les deux brins d'ADN
      const helix1 = createHelix(0, '#8b5cf6')
      const helix2 = createHelix(Math.PI, '#ec4899')
      
      // Ajouter les tubes et les sphères au groupe
      group.add(helix1.tube)
      group.add(helix2.tube)
      helix1.spheres.forEach(sphere => group.add(sphere))
      helix2.spheres.forEach(sphere => group.add(sphere))
      
      // Création des "liaisons" entre les hélices
      for (let i = 0; i < totalPoints; i += 2) {
        const angle = (i / pointsPerTurn) * Math.PI * 2
        const y = (i / totalPoints) * height - height / 2
        const x1 = Math.cos(angle) * radius
        const z1 = Math.sin(angle) * radius
        const x2 = Math.cos(angle + Math.PI) * radius
        const z2 = Math.sin(angle + Math.PI) * radius
        
        const points = []
        points.push(new THREE.Vector3(x1, y, z1))
        points.push(new THREE.Vector3(x2, y, z2))
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({ 
          color: '#ffffff',
          transparent: true,
          opacity: 0.4
        })
        
        const line = new THREE.Line(geometry, material)
        group.add(line)
      }
      
      group.scale.set(0.4, 0.4, 0.4)
      return group
    }

    // Système de particules (gardé de la version précédente)
    const createParticleSystem = (count: number, size: number, color: string, speed: number, radius: number) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      const velocities = new Float32Array(count * 3)
      
      for(let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos((Math.random() * 2) - 1)
        const r = Math.cbrt(Math.random()) * radius

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = r * Math.cos(phi)

        velocities[i * 3] = (Math.random() - 0.5) * speed
        velocities[i * 3 + 1] = (Math.random() - 0.5) * speed
        velocities[i * 3 + 2] = (Math.random() - 0.5) * speed
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      
      const material = new THREE.PointsMaterial({
        size,
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      const points = new THREE.Points(geometry, material)

      return {
        points,
        geometry,
        material,
        velocities,
        speed,
      }
    }

    // Création des systèmes de particules
    const particleSystems = [
      createParticleSystem(1000, 0.02, '#8b5cf6', 0.002, 4),
      createParticleSystem(500, 0.015, '#ec4899', 0.003, 3),
      createParticleSystem(200, 0.03, '#ffffff', 0.004, 5),
    ]

    // Ajout des systèmes de particules à la scène
    particleSystems.forEach(system => scene.add(system.points))

    // Création et ajout du modèle d'ADN
    const dnaModel = createDNAModel()
    scene.add(dnaModel)

    camera.position.z = 4

    // Animation
    const animate = () => {
      const time = Date.now() * 0.001

      // Animation des particules
      particleSystems.forEach(system => {
        const positions = system.geometry.attributes.position.array as Float32Array
        const velocities = system.velocities

        for(let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i] * system.speed
          positions[i + 1] += velocities[i + 1] * system.speed
          positions[i + 2] += velocities[i + 2] * system.speed

          const limit = 5
          for(let j = 0; j < 3; j++) {
            if (positions[i + j] > limit) positions[i + j] = -limit
            if (positions[i + j] < -limit) positions[i + j] = limit
          }
        }

        system.geometry.attributes.position.needsUpdate = true
        system.points.rotation.x += 0.0003
        system.points.rotation.y += 0.0005
      })

      // Animation de l'ADN
      if (dnaModel) {
        dnaModel.rotation.y += 0.005
        // Léger mouvement de balancement
        dnaModel.rotation.x = Math.sin(time * 0.5) * 0.1
        dnaModel.position.y = Math.sin(time) * 0.1
      }

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Gestion des événements
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1

      if (dnaModel) {
        dnaModel.rotation.y += mousePosition.current.x * 0.01
        dnaModel.rotation.x += mousePosition.current.y * 0.01
      }
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      
      // Nettoyage
      particleSystems.forEach(system => {
        system.geometry.dispose()
        system.material.dispose()
        scene.remove(system.points)
      })
      
      dnaModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (child.material instanceof THREE.Material) {
            child.material.dispose()
          }
        }
      })
      
      scene.remove(dnaModel)
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}

export default ThreeScene