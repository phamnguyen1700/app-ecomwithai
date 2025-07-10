import {
    LucideProps,
    Search,
    User,
    ShoppingBag,
    Send,
    Minus,
    Bot,
    Star,
    StarHalf,
    ShoppingBasket,
    Plus,
    Trash2,
    ListOrdered,
    Menu,
    Home,
    Package,
    BarChart,
    ImagePlus,
    Truck,
    ShoppingCart,
    MapPin,
    BadgePercent,
    Box,
} from "lucide-react";

const icons = {
    search: Search,
    user: User,
    shoppingBag: ShoppingBag,
    send: Send,
    minus: Minus,
    bot: Bot,
    star: Star,
    starHalf: StarHalf,
    shoppingBasket: ShoppingBasket,
    plus: Plus,
    trash: Trash2,
    listOrdered: ListOrdered,
    menu: Menu,
    home: Home,
    package: Package,
    barChart: BarChart,
    imagePlus: ImagePlus,
    truck: Truck,
    shoppingCart: ShoppingCart,
    mapPin: MapPin,
    badgePercent: BadgePercent,
    box: Box,
};

interface IconProps extends LucideProps {
    name: keyof typeof icons;
}

export default function Icon({
    name,
    size = 24,
    className,
    color,
    ...props
}: IconProps) {
    const IconComponent = icons[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" không tồn tại.`);
        return null;
    }

    return (
        <div className="flex items-center justify-center">
            <IconComponent
                size={size}
                className={className}
                color={color}
                {...props}
            />
        </div>
    );
}
