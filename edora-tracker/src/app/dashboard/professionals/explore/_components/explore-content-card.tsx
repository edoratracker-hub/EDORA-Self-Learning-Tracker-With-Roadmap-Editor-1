import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ExploreContentCardHeader } from "./explore-content-card-header";
import { ExploreContentCardMain } from "./explore-content-card-main";
import { ExploreContentCardFooter } from "./explore-content-card-footer";

export type ExplorePost = {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    location: string;
  };
  content: string;
  image?: string;
  timeAgo: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
};

export const ExploreContentCard = ({ post }: { post: ExplorePost }) => {
  return (
    <Card className="gap-0 overflow-hidden border-border/60 bg-card hover:border-border transition-colors duration-300">
      <CardHeader className="px-5 pt-5 pb-4">
        <ExploreContentCardHeader author={post.author} timeAgo={post.timeAgo} />
      </CardHeader>

      <CardContent className="p-0">
        <ExploreContentCardMain
          content={post.content}
          image={post.image}
          tags={post.tags}
        />
      </CardContent>

      <CardFooter className="px-5 py-3 border-t border-border/40">
        <ExploreContentCardFooter
          likes={post.likes}
          comments={post.comments}
          shares={post.shares}
        />
      </CardFooter>
    </Card>
  );
};
