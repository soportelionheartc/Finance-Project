import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AddAssetForm, UploadedFile } from "./add-asset-form";
import { useState } from "react";
import { FileText, Image } from "lucide-react";

interface Asset {
  type: string;
  name: string;
  symbol: string;
  quantity: number;
  unitPrice: number;
  purchaseDate: string;
  file: UploadedFile | null;
}

interface NewPortfolioModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (portfolioName: string, assets: Asset[]) => void;
}

const initialAssetState = {
  type: "crypto",
  name: "",
  symbol: "",
  quantity: "",
  price: "",
  date: "",
  file: null,
};

export const NewPortfolioModal: React.FC<NewPortfolioModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [portfolioName, setPortfolioName] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [asset, setAsset] = useState<any>(initialAssetState);

  const addAsset = () => {
    if (
      !asset.name ||
      !asset.symbol ||
      !asset.quantity ||
      !asset.price ||
      !asset.date
    )
      return;
    setAssets([
      ...assets,
      {
        type: asset.type,
        name: asset.name,
        symbol: asset.symbol,
        quantity: Number(asset.quantity),
        unitPrice: Number(asset.price),
        purchaseDate: asset.date,
        file: asset.file || null,
      },
    ]);
    // Reset form including file
    setAsset(initialAssetState);
  };

  const removeAsset = async (index: number) => {
    const removedAsset = assets[index];
    // Delete associated file if exists
    if (removedAsset.file) {
      try {
        await fetch(`/api/files/${removedAsset.file.id}`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch (error) {
        console.error("Error al eliminar archivo:", error);
      }
    }
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!portfolioName || assets.length === 0) return;
    onSave(portfolioName, assets);
    setPortfolioName("");
    setAssets([]);
    setAsset(initialAssetState);
    onClose();
  };

  const handleClose = async () => {
    // Delete any files from assets that weren't saved
    for (const a of assets) {
      if (a.file) {
        try {
          await fetch(`/api/files/${a.file.id}`, {
            method: "DELETE",
            credentials: "include",
          });
        } catch (error) {
          console.error("Error al eliminar archivo:", error);
        }
      }
    }
    // Also delete current form file if exists
    if (asset.file) {
      try {
        await fetch(`/api/files/${asset.file.id}`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch (error) {
        console.error("Error al eliminar archivo:", error);
      }
    }
    setPortfolioName("");
    setAssets([]);
    setAsset(initialAssetState);
    onClose();
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-100 bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nuevo Portafolio</DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[60dvh] overflow-y-auto px-4">
          <div className="mb-4">
            <label className="mb-4 block text-center font-semibold">
              Nombre del portafolio
            </label>
            <Input
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
              placeholder="Ej: Portafolio Cripto"
              className="border-zinc-700 bg-black text-[#ffd700]"
            />
          </div>
          <div className="mb-2">
            <label className="mb-1 block text-center font-semibold">
              Añadir Nuevo Activo
            </label>
            <AddAssetForm
              asset={asset}
              setAsset={setAsset}
              onSubmit={addAsset}
              submitLabel="Añadir Activo"
            />
            <ul className="mt-2 space-y-1">
              {assets.map((a, i) => (
                <li
                  key={i}
                  className="flex flex-col rounded bg-zinc-800 px-2 py-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {a.type} - {a.name} ({a.symbol}) - {a.quantity} × $
                      {a.unitPrice}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAsset(i)}
                      className="text-red-400"
                    >
                      Eliminar
                    </Button>
                  </div>
                  {a.file && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                      {isImage(a.file.mimeType) ? (
                        <Image className="h-3 w-3" />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                      <span className="truncate">{a.file.filename}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            className="bg-[#ffd700] font-bold text-[#1a1400]"
          >
            Guardar
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            className="mb-4 border-[#ffd700] text-[#ffd700]"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
