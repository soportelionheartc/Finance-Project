import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface AddAssetFormProps {
    asset: any;
    setAsset: (asset: any) => void;
    onSubmit: () => void;
    submitLabel?: string;
    disabled?: boolean;
}

export const AddAssetForm: React.FC<AddAssetFormProps> = ({ asset, setAsset, onSubmit, submitLabel = "Añadir Activo", disabled }) => (
    <>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset-type" className="text-center">Tipo</Label>
                <Select value={asset.type} onValueChange={value => setAsset({ ...asset, type: value })}>
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
                <Label htmlFor="asset-name" className="text-center">Nombre</Label>
                <Input
                    id="asset-name"
                    placeholder="Ej. Bitcoin"
                    className="col-span-3"
                    value={asset.name}
                    onChange={e => setAsset({ ...asset, name: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset-symbol" className="text-center">Símbolo</Label>
                <Input
                    id="asset-symbol"
                    placeholder="Ej. BTC"
                    className="col-span-3"
                    value={asset.symbol}
                    onChange={e => setAsset({ ...asset, symbol: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset-quantity" className="text-center">Cantidad</Label>
                <Input
                    id="asset-quantity"
                    type="number"
                    placeholder="Ej. 0.5"
                    className="col-span-3"
                    value={asset.quantity}
                    onChange={e => setAsset({ ...asset, quantity: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset-price" className="text-center">Precio Unitario</Label>
                <Input
                    id="asset-price"
                    type="number"
                    placeholder="Ej. 65000000"
                    className="col-span-3"
                    value={asset.price}
                    onChange={e => setAsset({ ...asset, price: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset-date" className="text-center">Fecha de Compra</Label>
                <Input
                    id="asset-date"
                    type="date"
                    className="col-span-3 "
                    value={asset.date}
                    onChange={e => setAsset({ ...asset, date: e.target.value })}
                />
            </div>
        </div>
        <Button
            className="bg-primary hover:bg-primary/90 text-black w-full mt-2"
            onClick={onSubmit}
            disabled={disabled}
        >
            {submitLabel}
        </Button>
    </>
);
