import { useEffect, useMemo, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { getCroppedImage } from '@/lib/imageCropper';
import { toast } from 'sonner';

interface ImageCropUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  buttonText?: string;
  helperText?: string;
  cropTitle: string;
  cropDescription?: string;
  aspect: number;
  outputWidth: number;
  outputHeight: number;
  previewAspectRatio?: number;
  previewContainerClassName?: string;
  previewClassName?: string;
  imageFit?: 'cover' | 'contain';
}

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export default function ImageCropUploadField({
  value,
  onChange,
  label,
  buttonText = 'Upload Image',
  helperText,
  cropTitle,
  cropDescription,
  aspect,
  outputWidth,
  outputHeight,
  previewAspectRatio,
  previewContainerClassName = 'w-full max-w-sm',
  previewClassName = 'h-40 w-full object-cover rounded-md mt-2',
  imageFit = 'cover',
}: ImageCropUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const previewFitClass = imageFit === 'contain' ? 'object-contain' : 'object-cover';

  const previewClassNameValue = useMemo(
    () => `${previewClassName} ${previewFitClass}`.trim(),
    [previewClassName, previewFitClass],
  );

  const renderedPreviewAspectRatio = previewAspectRatio ?? aspect;

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
      setSourceUrl('');
      setIsSaving(false);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    }
  }, [open]);

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      toast.error('Image must be less than 5MB.');
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setSourceUrl(objectUrl);
    setOpen(true);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
  };

  const handleCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSave = async () => {
    if (!sourceUrl || !croppedAreaPixels) {
      toast.error('Please adjust the crop before saving.');
      return;
    }

    try {
      setIsSaving(true);
      const croppedImage = await getCroppedImage(
        sourceUrl,
        croppedAreaPixels,
        outputWidth,
        outputHeight,
      );
      onChange(croppedImage);
      toast.success('Image cropped and saved successfully.');
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to crop image.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col gap-3">
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground w-fit">
          <Upload className="h-4 w-4" />
          {buttonText}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files?.[0])} />
        </label>
        {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>

      {value && (
        <div
          className={`relative overflow-hidden rounded-md ${previewContainerClassName} ${previewClassNameValue}`.trim()}
          style={{ aspectRatio: String(renderedPreviewAspectRatio) }}
        >
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{cropTitle}</DialogTitle>
            {cropDescription && <p className="text-sm text-muted-foreground">{cropDescription}</p>}
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative h-[420px] w-full overflow-hidden rounded-xl bg-slate-950">
              {sourceUrl && (
                <Cropper
                  image={sourceUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  showGrid
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Zoom</span>
                <span className="text-muted-foreground">{Math.round(zoom * 100)}%</span>
              </div>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.01}
                onValueChange={(values) => setZoom(values[0] ?? 1)}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Crop & Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}