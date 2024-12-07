// services/imageAnalysis.ts
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function analyzeImage(imageBuffer: Buffer) {
  try {
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })

    // Utiliser la méthode custom pour le modèle CXR-LLAVA
    const result = await fetch(
      'https://api-inference.huggingface.co/models/ECOFRI/CXR-LLAVA-v2',
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: {
            image: blob,
            prompt: "Génère un rapport détaillé de cette radiographie thoracique en français."
          }
        }),
      }
    )

    const data = await result.json()
    return data

  } catch (error) {
    console.error('Error in image analysis:', error)
    throw error
  }
}