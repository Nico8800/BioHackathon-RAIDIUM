'use client'

import React, { useState } from 'react'
import { Upload, ZoomIn, ChevronRight } from 'lucide-react'
import ThreeScene from './ThreeScene'
import Header from './Header'
import CustomCursor from './CustomCursor'

const MainScene = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Créer l'URL pour l'image
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)  // ⚠️ Vérifiez que cette ligne est présente
    
    setIsLoading(true)
    try {
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)

        setResult(data.report)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        setIsLoading(false)
    }
}

  // Si une image est sélectionnée, afficher la vue d'analyse
  if (selectedImage) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-black">
        <CustomCursor />
        <Header />
        
        {/* Conteneur principal en grille */}
        <div className="mx-auto grid h-screen grid-cols-2 gap-8 px-8 pt-24">
          {/* Panneau gauche - Image */}
          <div className="relative flex flex-col rounded-2xl bg-white/10 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-white">Image source</h2>
              <button className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <ZoomIn className="h-4 w-4 text-white/70" />
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden rounded-xl bg-black/20">
              <img 
                src={selectedImage} 
                alt="Radiographie" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Panneau droit - Résultat */}
          <div className="relative flex flex-col rounded-2xl bg-white/10 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-white">Rapport d'analyse</h2>
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500 [animation-delay:200ms]" />
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500 [animation-delay:400ms]" />
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto rounded-xl bg-black/20 p-6">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-white/50">Analyse en cours...</p>
                </div>
              ) : result ? (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/70">
                  {result}
                </pre>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Interface initiale de upload
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <Header />
      
      
      {/* Background avec Three.js */}
      <div className="absolute right-0 top-0 h-full w-2/3">
        <ThreeScene />
      </div>
      
      {/* Interface principale */}
      <div className="relative z-10 h-full w-full">
        <div className="absolute left-[15%] top-1/2 w-full max-w-lg -translate-y-1/2">
          {/* Logo et titre */}
          <div className="mb-12">
            <h1 className="font-sans text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                LumIA
              </span>
            </h1>
            <p className="mt-3 text-sm font-light tracking-wide text-white/70">
              Intelligence Artificielle pour l'Analyse Radiologique
            </p>
          </div>

          {/* Zone de upload */}
          <div className="overflow-hidden rounded-2xl bg-white/10 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white">
                  Analyse d'image
                </h2>
                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                  DICOM & JPG
                </span>
              </div>
            </div>

            <div className="group relative">
              <input
                type="file"
                onChange={handleUpload}
                accept="image/*,.dcm"
                className="absolute inset-0 z-50 w-full cursor-pointer opacity-0"
                disabled={isLoading}
              />
              <div className="p-8">
                <div className="rounded-xl border-2 border-dashed border-white/20 p-8 transition-all group-hover:border-violet-500/50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-white/5 p-4">
                      <Upload className="h-8 w-8 text-white/40 transition-colors group-hover:text-violet-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">
                        Déposez votre image ici
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        Format DICOM ou JPG (max 20MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainScene