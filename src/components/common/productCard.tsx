import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/assests/icons";
import { IProduct } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IProductCardProps {
  product: IProduct;
  onCompare?: (product: IProduct) => void;
}

export default function ProductCard({ product, onCompare }: IProductCardProps) {
  const router = useRouter();
  console.log(product);
  
  // const productImage =
  //   product.images?.[0] && product.images[0].trim() !== ""
  //     ? product.images[0]
  //     : "/assets/blank.png";

  const handleCardClick = () => {
    router.push(`/commercial/products/${product._id}`);
  };

  return (
    <Card
      className="w-full max-w-xs border border-gray-200 rounded-none shadow-md overflow-hidden hover:border-black hover:border-2 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-64">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="rounded-t-lg border border-gray-200 object-cover"
          sizes="100%"
        />

        <button
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking heart
            onCompare?.(product); // Truyền sản phẩm vào CompareDialog
          }}
        >
          {/* <Icon name="compare" className="w-5 h-5 text-gray-700" /> */}
        </button>
      </div>

      <CardContent className="p-4">
        <h3 className="text-md font-light line-clamp-1 mb-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          {/* <p className="text-sm font-semibold">{formatMoney(product.price)}</p> */}
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                name="star"
                className={`w-4 h-4 ${i < Math.round(product?.rating || 0) ? "text-yellow-500" : "text-gray-300"}`}
              />
            ))}
            <span className="text-sm font-light ml-1">{product?.rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
