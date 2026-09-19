import * as THREE from 'three'

const SIZE = 1024
/** Mid grey is the flat plane: lighter is raised, darker is cut away. */
const FLAT = '#808080'

/**
 * Draws the seal face as a height map on a canvas, which the material reads as
 * a bump map.
 *
 * Doing it this way rather than shipping a modelled mesh or a texture file
 * keeps the whole 3D moment at zero additional network bytes: the geometry is
 * a cylinder and the detail is 60 lines of canvas drawing.
 */
export function createSealBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.CanvasTexture(canvas)

  const c = SIZE / 2

  ctx.fillStyle = FLAT
  ctx.fillRect(0, 0, SIZE, SIZE)

  // The struck rim: a raised bead with a cut channel just inside it.
  ring(ctx, c, 470, 14, '#e6e6e6')
  ring(ctx, c, 446, 6, '#4f4f4f')
  ring(ctx, c, 396, 2, '#9a9a9a')

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Monogram, raised.
  ctx.fillStyle = '#f0f0f0'
  ctx.font = `400 400px "Bodoni Moda", Didot, "Bodoni MT", Georgia, serif`
  ctx.fillText('LP', c, c - 24)

  // Town name, raised but shallower, so it catches the light later than the mark.
  ctx.fillStyle = '#c8c8c8'
  ctx.font = `500 52px "Instrument Sans", system-ui, sans-serif`
  ctx.letterSpacing = '26px'
  ctx.fillText('FIRENZE', c + 13, c + 246)
  ctx.letterSpacing = '0px'

  // A small lozenge above the monogram, the kind of mark a die would carry.
  ctx.save()
  ctx.translate(c, c - 268)
  ctx.rotate(Math.PI / 4)
  ctx.fillStyle = '#dedede'
  ctx.fillRect(-17, -17, 34, 34)
  ctx.restore()

  grain(ctx)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

function ring(ctx: CanvasRenderingContext2D, center: number, radius: number, width: number, color: string) {
  ctx.beginPath()
  ctx.arc(center, center, radius, 0, Math.PI * 2)
  ctx.lineWidth = width
  ctx.strokeStyle = color
  ctx.stroke()
}

/**
 * Cast metal is never perfectly smooth. Without this the disc reads as a CSS
 * gradient with a letter on it, which is exactly the tell we are avoiding.
 */
function grain(ctx: CanvasRenderingContext2D) {
  const image = ctx.getImageData(0, 0, SIZE, SIZE)
  const { data } = image
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 5
    data[i] = clamp((data[i] ?? 0) + noise)
    data[i + 1] = clamp((data[i + 1] ?? 0) + noise)
    data[i + 2] = clamp((data[i + 2] ?? 0) + noise)
  }
  ctx.putImageData(image, 0, 0)
}

function clamp(value: number): number {
  return value < 0 ? 0 : value > 255 ? 255 : value
}
