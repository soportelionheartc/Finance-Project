import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AddAssetForm } from "./add-asset-form";
import { useState } from "react";

interface Asset {
    type: string;
    name: string;
    symbol: string;
    quantity: number;
    unitPrice: number;
    purchaseDate: string;
}

interface NewPortfolioModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (portfolioName: string, assets: Asset[]) => void;
}

export const NewPortfolioModal: React.FC<NewPortfolioModalProps> = ({ open, onClose, onSave }) => {
    const [portfolioName, setPortfolioName] = useState("");
    const [assets, setAssets] = useState<Asset[]>([]);
    const [asset, setAsset] = useState<any>({
        type: "crypto",
        name: "",
        symbol: "",
        quantity: "",
        price: "",
        date: ""
    });

    const addAsset = () => {
        if (!asset.name || !asset.symbol || !asset.quantity || !asset.price || !asset.date) return;
        setAssets([
            ...assets,
            {
                type: asset.type,
                name: asset.name,
                symbol: asset.symbol,
                quantity: Number(asset.quantity),
                unitPrice: Number(asset.price),
                purchaseDate: asset.date
            }
        ]);
        setAsset({ type: "crypto", name: "", symbol: "", quantity: "", price: "", date: "" });
    };

    const removeAsset = (index: number) => {
        setAssets(assets.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!portfolioName || assets.length === 0) return;
        onSave(portfolioName, assets);
        setPortfolioName("");
        setAssets([]);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Nuevo Portafolio</DialogTitle>
                </DialogHeader>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold text-center mb-4">Nombre del portafolio</label>
                    <Input
                        value={portfolioName}
                        onChange={e => setPortfolioName(e.target.value)}
                        placeholder="Ej: Portafolio Cripto"
                        className="bg-black border-zinc-700 text-[#ffd700]"
                    />
                </div>
                <div className="mb-2">
                    <label className="block mb-1 font-semibold text-center">Añadir Nuevo Activo</label>
                    <AddAssetForm asset={asset} setAsset={setAsset} onSubmit={addAsset} submitLabel="Añadir Activo" />
                    <ul className="space-y-1 mt-2">
                        {assets.map((a, i) => (
                            <li key={i} className="flex justify-between items-center bg-zinc-900 px-2 py-1 rounded">
                                <span>{a.type} - {a.name} ({a.symbol}) - {a.quantity} × ${a.unitPrice} - {a.purchaseDate}</span>
                                <Button size="sm" variant="ghost" onClick={() => removeAsset(i)} className="text-red-400">Eliminar</Button>
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} className="bg-[#ffd700] text-[#1a1400] font-bold">Guardar</Button>
                    <Button variant="outline" onClick={onClose} className="border-[#ffd700] text-[#ffd700] mb-4">Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
