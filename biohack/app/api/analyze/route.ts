// // app/api/analyze/route.ts
// import { NextResponse } from 'next/server'
// import { pipeline } from '@huggingface/transformers'

// export async function POST(req: Request) {
//   try {
//     const data = await req.formData()
//     const file = data.get('image') as File
//     if (!file) {
//       return NextResponse.json({ error: 'No image provided' }, { status: 400 })
//     }

//     // TODO: La connexion avec le modèle
//     const imageBuffer = Buffer.from(await file.arrayBuffer())

//     // Configuration pour CXR-LLAVA
//     const query = "Génère un rapport détaillé de cette radiographie thoracique en français."

//     // Ici nous devrons implémenter la logique d'appel au modèle
//     // Pour l'instant, retournons une réponse simulée
//     return NextResponse.json({
//       success: true,
//       report: "Simulation de rapport..."
//     })
//   } catch (error) {
//     console.error('Error processing image:', error)
//     return NextResponse.json({ error: 'Error processing image' }, { status: 500 })
//   }
// }



import { NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(req: Request) {
    try {
        const data = await req.formData()
        const file = data.get('image') as Blob
        if (!file) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 })
        }

        // Convertir l'image en buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Prétraiter l'image: conversion en niveaux de gris et redimensionnement 512x512
        const processedImage = await sharp(buffer)
            .grayscale()
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            })
            .toBuffer()

        // Convertir le buffer en base64
        const base64Image = processedImage.toString('base64')

        // Faire l'appel à l'API Hugging Face
        const response = await fetch(
            "https://api-inference.huggingface.co/models/ECOFRI/CXR-LLAVA-v2",
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: {
                        image: base64Image,
                        prompt: "Écris un rapport détaillé en français de cette radiographie thoracique. Sois précis et utilise un format structuré."
                    }
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`API returned status code ${response.status}`)
        }

        const result = await response.json()

        return NextResponse.json({
            success: true,
            report: result.text || result
        })

    } catch (error) {
        console.error('Error processing image:', error)
        return NextResponse.json({ 
            error: 'Error processing image',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}