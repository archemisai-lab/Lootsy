import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCw, ZoomIn, ZoomOut, RotateCcw, X, Check, Move } from 'lucide-react';

interface AvatarCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onClose: () => void;
  language: 'fr' | 'en';
}

const VIEWPORT_SIZE = 300; // CSS pixels display size of square canvas
const CROP_RADIUS = 125; // Radius of circular crop area in viewport CSS pixels (diameter = 250px)
const OUTPUT_SIZE = 512; // Exported square resolution with crisp circular avatar

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  imageSrc,
  onCropComplete,
  onClose,
  language,
}) => {
  const isFr = language === 'fr';

  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [baseScale, setBaseScale] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    startPanX: number;
    startPanY: number;
  }>({ pointerX: 0, pointerY: 0, startPanX: 0, startPanY: 0 });

  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);

  // 1. Load image and compute initial scale so it comfortably covers the crop circle
  useEffect(() => {
    let isCancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isCancelled) return;
      setImageElement(img);

      // Base scale fits the smallest dimension to the crop circle diameter
      // This works gracefully for tiny 60x60 images up to 4000px high-res images
      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      const initialScale = (CROP_RADIUS * 2) / Math.max(1, minDim);

      setBaseScale(initialScale);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
    };

    img.src = imageSrc;
    return () => {
      isCancelled = true;
    };
  }, [imageSrc]);

  // 2. Render real-time canvas preview
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support devicePixelRatio for sharp, retina rendering
    const dpr = window.devicePixelRatio || 1;
    const renderSize = VIEWPORT_SIZE * dpr;

    if (canvas.width !== renderSize || canvas.height !== renderSize) {
      canvas.width = renderSize;
      canvas.height = renderSize;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Background fill of viewport
    ctx.fillStyle = '#0f0d0b';
    ctx.fillRect(0, 0, VIEWPORT_SIZE, VIEWPORT_SIZE);

    const cx = VIEWPORT_SIZE / 2;
    const cy = VIEWPORT_SIZE / 2;

    // --- Draw the transformed image ---
    ctx.save();
    // 1. Move origin to center of viewport
    ctx.translate(cx, cy);
    // 2. Apply user pan in screen coordinates
    ctx.translate(pan.x, pan.y);
    // 3. Rotate around center
    ctx.rotate((rotation * Math.PI) / 180);
    // 4. Scale (base scale * user zoom)
    const effectiveScale = baseScale * zoom;
    ctx.scale(effectiveScale, effectiveScale);

    // 5. Draw image centered
    const w = imageElement.naturalWidth;
    const h = imageElement.naturalHeight;
    ctx.drawImage(imageElement, -w / 2, -h / 2, w, h);
    ctx.restore();

    // --- Draw Circular Cutout Mask (Darkens area outside crop circle) ---
    ctx.save();
    ctx.fillStyle = 'rgba(12, 10, 9, 0.78)';
    ctx.beginPath();
    // Outer rectangle
    ctx.rect(0, 0, VIEWPORT_SIZE, VIEWPORT_SIZE);
    // Inner circle cutout (counter-clockwise creates a transparent window)
    ctx.arc(cx, cy, CROP_RADIUS, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill('evenodd');
    ctx.restore();

    // --- Subtle rule-of-thirds grid while dragging ---
    if (isDragging) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, CROP_RADIUS, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(246, 240, 231, 0.16)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      const step = (CROP_RADIUS * 2) / 3;
      const startX = cx - CROP_RADIUS;
      const startY = cy - CROP_RADIUS;

      // Vertical thirds
      ctx.beginPath();
      ctx.moveTo(startX + step, cy - CROP_RADIUS);
      ctx.lineTo(startX + step, cy + CROP_RADIUS);
      ctx.moveTo(startX + step * 2, cy - CROP_RADIUS);
      ctx.lineTo(startX + step * 2, cy + CROP_RADIUS);

      // Horizontal thirds
      ctx.moveTo(cx - CROP_RADIUS, startY + step);
      ctx.lineTo(cx + CROP_RADIUS, startY + step);
      ctx.moveTo(cx - CROP_RADIUS, startY + step * 2);
      ctx.lineTo(cx + CROP_RADIUS, startY + step * 2);
      ctx.stroke();

      ctx.restore();
    }

    // --- Crisp Lootsy orange circular border ---
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, CROP_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#FF6538';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4 Subtle cardinal alignment ticks on the ring
    const tickLen = 6;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    // Top
    ctx.moveTo(cx, cy - CROP_RADIUS - 1);
    ctx.lineTo(cx, cy - CROP_RADIUS + tickLen);
    // Bottom
    ctx.moveTo(cx, cy + CROP_RADIUS + 1);
    ctx.lineTo(cx, cy + CROP_RADIUS - tickLen);
    // Left
    ctx.moveTo(cx - CROP_RADIUS - 1, cy);
    ctx.lineTo(cx - CROP_RADIUS + tickLen, cy);
    // Right
    ctx.moveTo(cx + CROP_RADIUS + 1, cy);
    ctx.lineTo(cx + CROP_RADIUS - tickLen, cy);
    ctx.stroke();

    ctx.restore();

    ctx.restore();
  }, [baseScale, imageElement, isDragging, pan.x, pan.y, rotation, zoom]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // 3. Pointer & Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.pointerX;
      const dy = e.clientY - dragStartRef.current.pointerY;
      setPan({
        x: dragStartRef.current.startPanX + dx,
        y: dragStartRef.current.startPanY + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        pointerX: e.touches[0].clientX,
        pointerY: e.touches[0].clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
      pinchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDistRef.current = Math.hypot(dx, dy);
      pinchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.pointerX;
      const dy = e.touches[0].clientY - dragStartRef.current.pointerY;
      setPan({
        x: dragStartRef.current.startPanX + dx,
        y: dragStartRef.current.startPanY + dy,
      });
    } else if (e.touches.length === 2 && pinchStartDistRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchStartDistRef.current;
      const nextZoom = Number((pinchStartZoomRef.current * ratio).toFixed(2));
      setZoom(Math.min(5.0, Math.max(0.3, nextZoom)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartDistRef.current = null;
  };

  // Wheel listener with passive: false to prevent scrolling parent container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => Math.min(5.0, Math.max(0.3, Number((prev * factor).toFixed(2)))));
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Quick Action Buttons
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  // 4. Export high-definition square image with exact 1:1 mathematical match to the preview
  const handleConfirm = useCallback(() => {
    if (!imageElement) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = OUTPUT_SIZE;
    exportCanvas.height = OUTPUT_SIZE;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Exact scale factor between output canvas and preview crop circle
    const exportRadius = OUTPUT_SIZE / 2; // 256
    const k = exportRadius / CROP_RADIUS; // 256 / 125 = 2.048

    // Circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(exportRadius, exportRadius, exportRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Dark solid background behind any transparent areas
    ctx.fillStyle = '#141210';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Apply the EXACT same transformation multiplied by k
    ctx.translate(exportRadius, exportRadius);
    ctx.translate(pan.x * k, pan.y * k);
    ctx.rotate((rotation * Math.PI) / 180);
    const effectiveScale = baseScale * zoom * k;
    ctx.scale(effectiveScale, effectiveScale);

    // Draw image centered
    const w = imageElement.naturalWidth;
    const h = imageElement.naturalHeight;
    ctx.drawImage(imageElement, -w / 2, -h / 2, w, h);
    ctx.restore();

    // Export high-quality PNG with exact fidelity
    const croppedUrl = exportCanvas.toDataURL('image/png');
    onCropComplete(croppedUrl);
  }, [baseScale, imageElement, onCropComplete, pan.x, pan.y, rotation, zoom]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-sm bg-[#161311] border border-[#2d2722] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2a2420]">
          <div>
            <h3 className="text-sm font-extrabold text-[#F6F0E7] tracking-tight">
              {isFr ? 'Ajuster la photo' : 'Adjust photo'}
            </h3>
            <p className="text-[11px] text-[#B5AA9C]">
              {isFr ? 'Glissez pour cadrer votre avatar' : 'Drag to frame your avatar'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#25201c] rounded-lg transition-colors cursor-pointer"
            aria-label={isFr ? 'Fermer' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Canvas */}
        <div className="p-4 flex flex-col items-center justify-center bg-[#0d0b0a]">
          <div
            className="relative rounded-xl overflow-hidden border border-[#2a2420] shadow-inner select-none"
            style={{ width: `${VIEWPORT_SIZE}px`, height: `${VIEWPORT_SIZE}px`, touchAction: 'none' }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full h-full block ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ width: `${VIEWPORT_SIZE}px`, height: `${VIEWPORT_SIZE}px` }}
            />

            {!isDragging && (
              <div className="absolute top-2.5 right-2.5 pointer-events-none opacity-60">
                <span className="p-1 rounded bg-black/60 text-[#B5AA9C] text-[10px] flex items-center gap-1 font-mono">
                  <Move className="w-3 h-3" />
                  <span>Pan</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls Section */}
        <div className="px-5 py-3.5 space-y-3.5 border-t border-[#2a2420] bg-[#161311]">
          {/* Zoom Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#B5AA9C]">
              <span className="font-medium">{isFr ? 'Zoom' : 'Zoom'}</span>
              <span className="font-mono text-[#F6F0E7] tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.3, Number((z - 0.15).toFixed(2))))}
                className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#25201c] rounded transition-colors cursor-pointer"
                title={isFr ? 'Dézoomer' : 'Zoom out'}
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="0.3"
                max="4.0"
                step="0.02"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-[#FF6538] cursor-pointer h-1.5 bg-[#2a2420] rounded-lg"
                aria-label="Zoom control"
              />

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(4.0, Number((z + 0.15).toFixed(2))))}
                className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#25201c] rounded transition-colors cursor-pointer"
                title={isFr ? 'Zoomer' : 'Zoom in'}
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions (Rotate & Reset) */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleRotate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#221e1a] hover:bg-[#2c2621] border border-[#2f2822] text-xs font-semibold text-[#F6F0E7] transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#FF6538]" />
              <span>{isFr ? 'Pivoter 90°' : 'Rotate 90°'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent hover:bg-[#221e1a] border border-[#2f2822] text-xs font-medium text-[#B5AA9C] hover:text-[#F6F0E7] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isFr ? 'Recentrer' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#2a2420] bg-[#141210] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-[#2f2822] bg-transparent hover:bg-[#221e1a] text-xs font-semibold text-[#B5AA9C] hover:text-[#F6F0E7] transition-colors cursor-pointer"
          >
            {isFr ? 'Annuler' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isFr ? 'Enregistrer' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
