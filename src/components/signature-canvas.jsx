import { useRef, useState, useEffect } from "react"

export function SignatureCanvas({ value, onChange, disabled = false }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  // Load existing signature value into canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (value) {
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        setIsEmpty(false)
      }
      img.src = value
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setIsEmpty(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startDrawing = (e) => {
    if (disabled) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const pos = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
    setIsEmpty(false)
  }

  const draw = (e) => {
    if (!isDrawing || disabled) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const pos = getPos(e, canvas)
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#1f2937"
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (onChange) {
      onChange(canvasRef.current.toDataURL("image/png"))
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    if (onChange) onChange("")
  }

  return (
    <div className="relative select-none">
      <canvas
        ref={canvasRef}
        width={600}
        height={160}
        className={`w-full rounded-lg bg-white touch-none ${
          disabled ? "pointer-events-none opacity-70" : "cursor-crosshair"
        }`}
        style={{ border: "1px solid #d1d5db" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {!disabled && !isEmpty && (
        <button
          type="button"
          onClick={clear}
          className="absolute top-2 right-2 text-xs text-gray-500 hover:text-red-500 bg-white border border-gray-200 hover:border-red-300 px-2 py-1 rounded transition-colors"
        >
          Clear
        </button>
      )}
      {isEmpty && !disabled && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 text-sm italic">Draw your signature here</p>
        </div>
      )}
    </div>
  )
}
