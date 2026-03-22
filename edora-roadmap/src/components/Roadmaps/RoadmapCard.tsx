import { useIsMounted } from '../../hooks/use-is-mounted';
import { MarkFavorite } from '../FeaturedItems/MarkFavorite';
import type { GroupType } from './RoadmapsPage';

type RoadmapCardProps = {
  roadmap: GroupType['roadmaps'][number];
};

export function RoadmapCard(props: RoadmapCardProps) {
  const { roadmap } = props;

  const isMounted = useIsMounted();

  return (
    <a
      key={roadmap.link}
      className="relative rounded-md px-3 py-2 text-left text-sm text-white shadow-xs transition-all hover:bg-gray-800 hover:shadow-sm"
      href={roadmap.link}
    >
      {roadmap.title}

      {isMounted && (
        <MarkFavorite
          resourceId={roadmap.link.split('/').pop()!}
          resourceType="roadmap"
          className="data-[is-favorite=true]:opacity-35"
        />
      )}
    </a>
  );
}
