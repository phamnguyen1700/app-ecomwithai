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
    Plus
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
    plus: Plus
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
        <IconComponent size={size} className={className} color={color} {...props} />
      </div>
    );
  }
  