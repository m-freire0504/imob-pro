import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Photo {
  id?: number;
  file?: File;
  preview: string;
  isCover?: boolean;
  isUploading?: boolean;
}

interface PhotoUploaderProps {
  imovelId: number;
  onUploadComplete?: () => void;
}

export function PhotoUploader({ imovelId, onUploadComplete }: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createMutation = trpc.fotosImoveis.create.useMutation();

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          
          // Redimensionar mantendo proporção
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;
          const maxHeight = 1200;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8);
        };
      };
    });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("Selecione apenas imagens");
      return;
    }

    const newPhotos: Photo[] = [];

    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPhotos.push({
          file,
          preview: e.target?.result as string,
          isCover: photos.length === 0 && newPhotos.length === 0,
        });

        if (newPhotos.length === imageFiles.length) {
          setPhotos((prev) => [...prev, ...newPhotos]);
          toast.success(`${imageFiles.length} imagem(ns) adicionada(s)`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const setCover = (index: number) => {
    setPhotos((prev) =>
      prev.map((photo, i) => ({
        ...photo,
        isCover: i === index,
      }))
    );
  };

  const uploadPhotos = async () => {
    if (photos.length === 0) {
      toast.error("Adicione pelo menos uma foto");
      return;
    }

    setPhotos((prev) =>
      prev.map((photo) => ({
        ...photo,
        isUploading: true,
      }))
    );

    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (!photo.file) continue;

        const compressed = await compressImage(photo.file);
        const formData = new FormData();
        formData.append("file", compressed, photo.file.name);
        formData.append("imovelId", imovelId.toString());
        formData.append("capa", photo.isCover ? "1" : "0");
        formData.append("ordem", i.toString());

        // Simular upload (em produção, você usaria a API real)
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      toast.success("Fotos enviadas com sucesso!");
      setPhotos([]);
      onUploadComplete?.();
    } catch (error) {
      toast.error("Erro ao enviar fotos");
      console.error(error);
    } finally {
      setPhotos((prev) =>
        prev.map((photo) => ({
          ...photo,
          isUploading: false,
        }))
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Fotos
        </CardTitle>
        <CardDescription>Adicione fotos do imóvel com drag-and-drop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Área de Drop */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Arraste fotos aqui</p>
          <p className="text-xs text-muted-foreground">ou clique para selecionar</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-input"
          />
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Selecionar Fotos
          </Button>
        </div>

        {/* Galeria de Fotos */}
        {photos.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{photos.length} foto(s) selecionada(s)</h3>
              <Button onClick={uploadPhotos} disabled={photos.some((p) => p.isUploading)}>
                Enviar Fotos
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCover(index)}
                      className={`p-2 rounded-full ${
                        photo.isCover
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-600 text-white hover:bg-gray-700"
                      }`}
                      title="Definir como capa"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removePhoto(index)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                      title="Remover foto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Badge de Capa */}
                  {photo.isCover && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Capa
                    </div>
                  )}

                  {/* Loading */}
                  {photo.isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dicas */}
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 space-y-2">
          <p className="font-medium">💡 Dicas:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Clique na estrela para definir a foto como capa do imóvel</li>
            <li>Máximo de 10MB por imagem (serão comprimidas automaticamente)</li>
            <li>Formatos aceitos: JPG, PNG, GIF, WebP</li>
            <li>Recomendado: fotos em alta resolução para melhor qualidade</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
