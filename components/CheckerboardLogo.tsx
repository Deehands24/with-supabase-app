"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CheckerboardLogo() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200); // Logo size
    mountRef.current.appendChild(renderer.domElement);

    // Create checkerboard
    const geometry = new THREE.BoxGeometry(1, 0.1, 1);
    const board = new THREE.Group();

    for (let x = 0; x < 4; x++) {
      for (let z = 0; z < 4; z++) {
        const isWhite = (x + z) % 2 === 0;
        const material = new THREE.MeshPhongMaterial({
          color: isWhite ? 0xFFFFFF : 0x000000,
          shininess: 100,
        });
        const square = new THREE.Mesh(geometry, material);
        square.position.set(x - 1.5, 0, z - 1.5);
        board.add(square);
      }
    }

    scene.add(board);

    // Add lights
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0x404040);
    scene.add(light2);

    camera.position.set(3, 4, 5);
    camera.lookAt(0, 0, 0);

    // Animation
    function animate() {
      requestAnimationFrame(animate);
      board.rotation.y += 0.01;
      
      // Add subtle floating motion
      board.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      
      renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-[200px] h-[200px]" />;
} 