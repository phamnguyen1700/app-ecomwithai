import {
    LucideProps,
    Search,
    User,
    ShoppingBag
  } from "lucide-react";
  
  const icons = {
    search: Search,
    user: User,
    shoppingBag: ShoppingBag
  };
  
  interface IconProps extends LucideProps {
    name: keyof typeof icons;
  }
  
  export default function Icon({
    name,
    size = 24,
    className,
    ...props
  }: IconProps) {
    const IconComponent = icons[name];
  
    if (!IconComponent) {
      console.warn(`Icon "${name}" không tồn tại.`);
      return null;
    }
  
    return (
      <div className="flex items-center justify-center">
        <IconComponent size={size} className={className} {...props} />
      </div>
    );
  }
  