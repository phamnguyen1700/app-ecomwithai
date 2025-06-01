import Image from "next/image";
import { formatMoney } from "@/hooks/formatMoney";

interface CartProductItemProps {
  image: string;
  name: string;
  quantity: number;
  price: number;
}

export default function CartProductItem({ image, name, quantity, price }: CartProductItemProps) {
  return (
    <div className="flex items-center border-b last:border-b-0 py-2">
      <div className="w-14 h-14 flex-shrink-0 relative">
        <Image src={image || '/assets/blank.png'} alt={name} fill className="object-cover rounded" />
      </div>
      <div className="flex-1 ml-3 flex flex-col justify-between h-full">
        <div className="font-medium text-xs line-clamp-1">{name}</div>
        <div className="text-[10px] text-gray-500 mt-1">Số lượng: {quantity}</div>
      </div>
      <div className="ml-auto flex flex-col justify-end h-full">
        <span className="text-xs font-semibold text-right">{formatMoney(price)}</span>
      </div>
    </div>
  );
} 