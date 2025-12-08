"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { uploadBusinessLogo, deleteBusinessLogo } from "@/app/actions/business";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface LogoUploadProps {
  currentLogo: string | null;
  onLogoChange?: () => void;
}

export default function LogoUpload({
  currentLogo,
  onLogoChange,
}: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchroniser l'état local avec la prop currentLogo
  useEffect(() => {
    setPreviewUrl(currentLogo);
  }, [currentLogo]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 5MB)");
      return;
    }

    setIsUploading(true);

    try {
      // Convertir en base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);

        // Upload
        const result = await uploadBusinessLogo(base64String);

        if (result.error) {
          toast.error(result.error);
          setPreviewUrl(currentLogo);
        } else {
          toast.success("Logo mis à jour avec succès");
          onLogoChange?.();
        }
        setIsUploading(false);
      };

      reader.onerror = () => {
        toast.error("Erreur lors de la lecture du fichier");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Erreur lors de l'upload");
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    const result = await deleteBusinessLogo();

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Logo supprimé");
      setPreviewUrl(null);
      onLogoChange?.();
    }
    setIsUploading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="block text-sm font-medium text-foreground">
        Logo de l&apos;entreprise
      </div>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="relative h-32 w-32 rounded-lg border-2 border-dashed border-foreground/20 bg-foreground/5 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Logo de l'entreprise"
                className="h-full w-full object-contain"
              />
              <button
                type="button"
                onClick={handleDelete}
                disabled={isUploading}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600 disabled:opacity-50"
                title="Supprimer le logo"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <ImageIcon className="h-12 w-12 text-foreground/30" />
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-md border border-foreground/20 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload className="h-4 w-4" />
            {isUploading
              ? "Upload en cours..."
              : previewUrl
              ? "Changer le logo"
              : "Ajouter un logo"}
          </label>
          <p className="mt-2 text-xs text-foreground/60">
            PNG, JPG ou GIF (max 5MB)
            <br />
            Recommandé : image carrée, fond transparent
          </p>
        </div>
      </div>

      <p className="text-sm text-foreground/60">
        Votre logo apparaîtra sur tous vos devis pour personnaliser votre image
        de marque.
      </p>
    </div>
  );
}
