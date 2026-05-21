import { MenuItem } from "../data/menu";

type Props = {
  item: MenuItem;
  className?: string;
  imgClassName?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-32 w-32",
};

export default function ItemImage({ item, className = "", imgClassName = "", size = "md" }: Props) {
  return (
    <div className={`${sizes[size]} flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 ${className}`}>
      <img
        src={item.image}
        alt={item.name}
        className={`h-full w-full object-cover ${imgClassName}`}
        loading="lazy"
      />
    </div>
  );
}
