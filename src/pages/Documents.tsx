import { useState } from 'react'

export default function Documents() {
  const [progress, setProgress] = useState(0)

  const simulateGenerate = () => {
    setProgress(10)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 10
      })
    }, 200)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="glass-card p-6">
        <div className="font-medium">Upload Template</div>
        <div className="mt-3 border-2 border-dashed border-white/20 rounded-xl p-6 text-center text-white/60">
          Drag & drop files here or click to upload
        </div>
      </div>
      <div className="glass-card p-6">
        <div className="font-medium">Auto-generate Document</div>
        <p className="text-white/70 text-sm mt-2">PDF contracts and property reports from templates.</p>
        <div className="flex items-center gap-3 mt-4">
          <button className="btn-primary" onClick={simulateGenerate}>Generate</button>
          <button className="btn-outline">Preview</button>
        </div>
        <div className="mt-4">
          <div className="w-full h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-white/70 text-sm mt-2">{progress}%</div>
        </div>
      </div>
    </div>
  )
}