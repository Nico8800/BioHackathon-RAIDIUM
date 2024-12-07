import { Metadata } from 'next'
import MainScene from '@/components/MainScene'

export const metadata: Metadata = {
  title: 'LumIA',
  description: 'Analyse de radiographies thoraciques par IA',
}

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <MainScene />
    </main>
  )
}