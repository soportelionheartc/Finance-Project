import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Upload, X, FileText, Image, Loader2 } from "lucide-react";

export interface UploadedFile {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
}

export interface AddAssetFormProps {
  asset: any;
  setAsset: (asset: any) => void;
  onSubmit: () => void;
  submitLabel?: string;
  disabled?: boolean;
}

export const AddAssetForm: React.FC<AddAssetFormProps> = ({
  asset,
  setAsset,
  onSubmit,
  submitLabel = "Añadir Activo",
  disabled,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Get current file from asset state
  const currentFile: UploadedFile | null = asset.file || null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("El archivo no puede superar los 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Solo se permiten imágenes (JPG, PNG, GIF, WEBP) y PDFs");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al subir el archivo");
      }

      const uploadedFile = await response.json();
      // Store file in asset state
      setAsset({
        ...asset,
        file: {
          id: uploadedFile.id,
          url: uploadedFile.url,
          filename: uploadedFile.filename,
          mimeType: uploadedFile.mimeType,
        },
      });
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Error al subir el archivo",
      );
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveFile = async () => {
    if (!currentFile) return;

    try {
      const response = await fetch(`/api/files/${currentFile.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Remove file from asset state
        setAsset({ ...asset, file: null });
      }
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
    }
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asset-type" className="text-center">
            Tipo
          </Label>
          <Select
            value={asset.type}
            onValueChange={(value) => setAsset({ ...asset, type: value })}
          >
            <SelectTrigger id="asset-type" className="col-span-3">
              <SelectValue placeholder="Seleccionar tipo de activo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="crypto">Criptomoneda</SelectItem>
              <SelectItem value="stock">Acción</SelectItem>
              <SelectItem value="etf">ETF / Fondo</SelectItem>
              <SelectItem value="bond">Renta Fija</SelectItem>
              <SelectItem value="cash">Efectivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asset-name" className="text-center">
            Nombre
          </Label>
          <Input
            id="asset-name"
            placeholder="Ej. Bitcoin"
            className="col-span-3"
            value={asset.name}
            onChange={(e) => setAsset({ ...asset, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asset-symbol" className="text-center">
            Símbolo
          </Label>
          <Input
            id="asset-symbol"
            placeholder="Ej. BTC"
            className="col-span-3"
            value={asset.symbol}
            onChange={(e) => setAsset({ ...asset, symbol: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asset-quantity" className="text-center">
            Cantidad
          </Label>
          <Input
            id="asset-quantity"
            type="number"
            placeholder="Ej. 0.5"
            className="col-span-3"
            value={asset.quantity}
            onChange={(e) => setAsset({ ...asset, quantity: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asset-price" className="text-center">
            Precio Unitario
          </Label>
          <Input
            id="asset-price"
            type="number"
            placeholder="Ej. 65000000"
            className="col-span-3"
            value={asset.price}
            onChange={(e) => setAsset({ ...asset, price: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="asset-date" className="text-center">
            Fecha de Compra
          </Label>
          <Input
            id="asset-date"
            type="date"
            className="col-span-3"
            value={asset.date}
            onChange={(e) => setAsset({ ...asset, date: e.target.value })}
          />
        </div>

        {/* File Upload Section */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="pt-2 text-center">Documento</Label>
          <div className="col-span-3 space-y-2">
            {!currentFile && (
              <>
                <div className="flex items-center gap-2">
                  <Input
                    id="asset-file"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("asset-file")?.click()
                    }
                    disabled={isUploading}
                    className="w-full border-dashed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Adjuntar archivo
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-zinc-500">
                  Máx. 5MB. Formatos: JPG, PNG, GIF, WEBP, PDF
                </p>
              </>
            )}

            {uploadError && (
              <p className="text-xs text-red-500">{uploadError}</p>
            )}

            {/* Display current file */}
            {currentFile && (
              <div className="flex items-center gap-2 rounded bg-zinc-800 p-2">
                {isImage(currentFile.mimeType) ? (
                  <Image className="h-4 w-4 text-blue-400" />
                ) : (
                  <FileText className="h-4 w-4 text-orange-400" />
                )}
                <span className="flex-1 truncate text-sm">
                  {currentFile.filename}
                </span>
                {isImage(currentFile.mimeType) ? (
                  <a
                    href={currentFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs hover:underline"
                  >
                    Ver
                  </a>
                ) : (
                  <a
                    href={currentFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-xs hover:underline"
                  >
                    Descargar
                  </a>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="h-6 w-6 p-0 text-red-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button
        className="bg-primary hover:bg-primary/90 mt-2 w-full text-black"
        onClick={onSubmit}
        disabled={disabled}
      >
        {submitLabel}
      </Button>
    </>
  );
};
