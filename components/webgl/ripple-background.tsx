"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"

const RippleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isSupported, setIsSupported] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG) {
      return
    }

    const loadThree = async () => {
      try {
        const THREE = await import("three")
        setIsSupported(true)

        const canvas = canvasRef.current
        if (!canvas) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Simple ripple shader
        const geometry = new THREE.PlaneGeometry(20, 20, 100, 100)
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          },
          vertexShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vec3 pos = position;
              pos.z += sin(pos.x * 2.0 + time) * 0.1;
              pos.z += sin(pos.y * 2.0 + time * 0.8) * 0.1;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            varying vec2 vUv;
            void main() {
              vec2 center = vec2(0.5, 0.5);
              float dist = distance(vUv, center);
              float ripple = sin(dist * 20.0 - time * 2.0) * 0.5 + 0.5;
              gl_FragColor = vec4(0.1, 0.2, 0.4, ripple * 0.1);
            }
          `,
          transparent: true,
        })

        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)
        camera.position.z = 5

        const animate = () => {
          material.uniforms.time.value += 0.01
          renderer.render(scene, camera)
          requestAnimationFrame(animate)
        }
        animate()

        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
          material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight)
        }
        window.addEventListener("resize", handleResize)

        return () => {
          window.removeEventListener("resize", handleResize)
          renderer.dispose()
        }
      } catch (error) {
        console.warn("WebGL not supported:", error)
      }
    }

    loadThree()
  }, [prefersReducedMotion])

  if (prefersReducedMotion || !process.env.NEXT_PUBLIC_FEATURE_WEBGL_BG || !isSupported) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none opacity-30"
      style={{ mixBlendMode: "multiply" }}
    />
  )
}

export default RippleBackground
