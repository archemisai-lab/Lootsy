import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, X, Check } from 'lucide-react';

interface AvatarCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onClose: () => void;
  language: 'fr' | 'en';
}

const CROP_BOX_SIZE = 280; // Size of square preview container in px
const CROP_DIAMETER = 240; // Diameter of the circle crop area in px
const CROP_RADIUS = CROP_DIAMETER / 2;
const CROP_CENTER = CROP_BOX_SIZE / 2;
const OUTPUT_SIZE = 512; // High-res final square avatar export

export const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
  imageSrc,
  onCropComplete,
  onClose,
  language,
}) => {
  const [imgDim, setImgDim] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ pointerX: number; pointerY: number; startPanX: number; startPanY: number }>({
    pointerX: 0,
    pointerY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);

  const viewportRef = useRef<HTMLDivElement>(null);
  const imgElementRef = useRef<HTMLImageElement>(null);

  const isFr = language === 'fr';

  // Preload and measure the image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImgDim({ width: img.naturalWidth, height: img.naturalHeight });
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Compute base scaling so image initially fills the crop circle
  const baseScale = imgDim
    ? Math.max(CROP_DIAMETER / imgDim.width, CROP_DIAMETER / imgDim.height)
    : 1;

  const baseWidth = imgDim ? imgDim.width * baseScale : CROP_DIAMETER;
  const baseHeight = imgDim ? imgDim.height * baseScale : CROP_DIAMETER;

  // Native wheel zoom listener with preventDefault
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => Math.min(4.0, Math.max(0.4, Number((prev * factor).toFixed(2)))));
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNative);
  }, []);

  // Window-level mouse listeners for seamless drag outside the box
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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  // Touch handlers (pan and pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
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

  const handleTouchMove = (e: React.TouchEvent) => {
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
      const currentDist = Math.hypot(dx, dy);
      const ratio = currentDist / pinchStartDistRef.current;
      const newZoom = Number((pinchStartZoomRef.current * ratio).toFixed(2));
      setZoom(Math.min(4.0, Math.max(0.4, newZoom)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartDistRef.current = null;
  };

  const rotate90 = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetAll = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  // High fidelity canvas export matching DOM preview 1:1
  const handleConfirm = useCallback(() => {
    if (!imgElementRef.current || !imgDim) return;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable high-quality interpolation
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Circular clipping mask
    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Fill dark background for transparent areas
    ctx.fillStyle = '#171513';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Canvas/DOM scale factor
    const canvasRatio = OUTPUT_SIZE / CROP_DIAMETER;

    // 1. Center of canvas
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);

    // 2. Pan translated to canvas space
    ctx.translate(pan.x * canvasRatio, pan.y * canvasRatio);

    // 3. Rotation around center
    ctx.rotate((rotation * Math.PI) / 180);

    // 4. Zoom factor
    ctx.scale(zoom, zoom);

    // 5. Draw image centered
    const canvasBaseWidth = baseWidth * canvasRatio;
    const canvasBaseHeight = baseHeight * canvasRatio;
    ctx.drawImage(
      imgElementRef.current,
      -canvasBaseWidth / 2,
      -canvasBaseHeight / 2,
      canvasBaseWidth,
      canvasBaseHeight
    );

    ctx.restore();

    // Export optimized base64 JPEG
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedUrl);
  }, [baseWidth, baseHeight, imgDim, onCropComplete, pan.x, pan.y, rotation, zoom]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-[#1a1715] border border-[#302923] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2d2722]">
          <div>
            <h3 className="text-sm font-extrabold text-[#F6F0E7]">
              {isFr ? 'Photo de profil' : 'Profile photo'}
            </h3>
            <p className="text-[11px] text-[#B5AA9C]">
              {isFr ? 'Ajustez le cadrage dans le cercle' : 'Adjust framing inside the circle'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#28221d] rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="p-4 flex flex-col items-center justify-center bg-[#12100e]">
          <div
            ref={viewportRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none rounded-xl bg-[#090807] border border-[#26201b]"
            style={{ width: `${CROP_BOX_SIZE}px`, height: `${CROP_BOX_SIZE}px` }}
          >
            {/* The Scaled, Translated and Rotated Image */}
            {imgDim && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${baseWidth}px`,
                  height: `${baseHeight}px`,
                  marginLeft: `-${baseWidth / 2}px`,
                  marginTop: `-${baseHeight / 2}px`,
                  transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                  transformOrigin: 'center center',
                  pointerEvents: 'none',
                }}
              >
                <img
                  ref={imgElementRef}
                  src={imageSrc}
                  alt="Avatar"
                  className="w-full h-full object-fill pointer-events-none select-none block"
                  draggable={false}
                />
              </div>
            )}

            {/* Circular Mask Overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${CROP_BOX_SIZE} ${CROP_BOX_SIZE}`}
            >
              <defs>
                <mask id="avatar-circle-cutout">
                  <rect width={CROP_BOX_SIZE} height={CROP_BOX_SIZE} fill="white" />
                  <circle cx={CROP_CENTER} cy={CROP_CENTER} r={CROP_RADIUS} fill="black" />
                </mask>
              </defs>

              {/* Shading outside the circle */}
              <rect
                width={CROP_BOX_SIZE}
                height={CROP_BOX_SIZE}
                fill="rgba(14, 12, 10, 0.78)"
                mask="url(#avatar-circle-cutout)"
              />

              {/* Precise ring outline */}
              <circle
                cx={CROP_CENTER}
                cy={CROP_CENTER}
                r={CROP_RADIUS}
                fill="none"
                stroke="#FF6538"
                strokeWidth="2"
                className="opacity-90"
              />
            </svg>
          </div>

          <p className="text-[11px] text-[#B5AA9C]/80 pt-2 text-center select-none">
            {isFr ? 'Glisser pour déplacer · Molette pour zoomer' : 'Drag to reposition · Scroll to zoom'}
          </p>
        </div>

        {/* Minimalist Controls */}
        <div className="px-5 py-3.5 space-y-3 border-t border-[#2d2722] bg-[#171513]">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.15).toFixed(2))))}
              className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7] transition-colors"
              title={isFr ? 'Dézoomer' : 'Zoom out'}
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="0.4"
              max="3.5"
              step="0.02"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#FF6538] cursor-pointer h-1.5 bg-[#302923] rounded-lg"
              aria-label="Zoom"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3.5, Number((z + 0.15).toFixed(2))))}
              className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7] transition-colors"
              title={isFr ? 'Zoomer' : 'Zoom in'}
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span className="font-mono text-[11px] text-[#B5AA9C] w-11 text-right tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Secondary Actions (Rotate & Reset) */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <button
              type="button"
              onClick={rotate90}
              className="inline-flex items-center gap-1.5 text-xs text-[#F6F0E7] px-2.5 py-1 rounded bg-[#25201c] hover:bg-[#302923] border border-[#302923] transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#FF6538]" />
              <span>{isFr ? 'Pivoter (+90°)' : 'Rotate (+90°)'}</span>
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 text-[11px] text-[#B5AA9C] hover:text-[#F6F0E7] transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isFr ? 'Réinitialiser' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#2d2722] bg-[#141210] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-[#302923] bg-transparent hover:bg-[#201c19] text-xs font-semibold text-[#B5AA9C] hover:text-[#F6F0E7] transition-colors"
          >
            {isFr ? 'Annuler' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isFr ? 'Valider' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
