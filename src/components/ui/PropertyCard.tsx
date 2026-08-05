import Image from "next/image";
import { cn } from "@/lib/utils";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  imageUrl: string;
  beds: number;
  baths: number;
  sqft: number;
}

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <div 
      className={cn(
        "group relative w-full overflow-hidden cursor-pointer rounded-none",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-110"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        />
        
        {/* Overlay gradient that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      </div>

      {/* Persistent Info (Below image by default, but floating on hover in some designs. Here we'll do an elegant overlay reveal) */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end translate-y-8 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:translate-y-0 group-hover:opacity-100 z-10">
        <h3 className="text-2xl font-serif text-white tracking-tight mb-1">{property.title}</h3>
        <p className="text-white/80 text-sm font-light tracking-wide mb-4">{property.location}</p>
        
        <div className="flex items-center justify-between text-white text-sm border-t border-white/20 pt-4">
          <div className="flex gap-4">
            <span>{property.beds} Beds</span>
            <span>{property.baths} Baths</span>
            <span>{property.sqft} SqFt</span>
          </div>
          <span className="font-medium tracking-wider">{property.price}</span>
        </div>
      </div>
      
      {/* Default visible info for accessibility and clean layout when not hovering */}
      <div className="mt-4 transition-opacity duration-500 group-hover:opacity-0">
        <h3 className="text-xl font-serif text-foreground tracking-tight">{property.title}</h3>
        <div className="flex justify-between items-center mt-1">
          <p className="text-muted-foreground text-sm font-light">{property.location}</p>
          <p className="text-foreground text-sm font-medium">{property.price}</p>
        </div>
      </div>
    </div>
  );
}
