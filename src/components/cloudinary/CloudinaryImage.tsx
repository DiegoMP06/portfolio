import { cn } from "../../lib/utils"

type CloudinaryImageProps = {
    publicId: string
    alt: string
    width?: number
    height?: number
    className?: string
}

export default function CloudinaryImage({
    publicId,
    alt,
    width = 1200,
    height = 675,
    className
}: CloudinaryImageProps) {
    const cloudDomain = import.meta.env.PUBLIC_CLOUDINARY_DOMAIN;
    const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;

    const transformations = `c_fill,w_${width},h_${height},g_auto,f_auto,q_auto`;
    const url = `${cloudDomain}/${cloudName}/image/upload/${transformations}/${publicId}`;

    return (
        <div className="transition-transform duration-300 hover:scale-110">
            <img
                src={url}
                alt={alt}
                loading="lazy"
                className={cn(
                    'w-full h-auto block shadow-2xl rounded-lg border border-stroke',
                    className || ''
                )}
                width={width}
                height={height}
            />
        </div>
    );
}
