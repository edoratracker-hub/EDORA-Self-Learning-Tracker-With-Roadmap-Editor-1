import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type CardMainProps = {
  content: string;
  image?: string;
  tags?: string[];
};

export const ExploreContentCardMain = ({
  content,
  image,
  tags,
}: CardMainProps) => {
  return (
    <div>
      {/* Post Text Content */}
      <div className="px-5 pb-4 space-y-3">
        <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
          {content}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[11px] font-normal px-2 py-0.5 cursor-pointer hover:bg-accent/20 hover:text-accent transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Featured Image */}
      {image && (
        <div className="relative w-full aspect-video overflow-hidden border-t border-border/40">
          <Image
            src={image}
            alt="Post attachment"
            fill
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      )}
    </div>
  );
};
