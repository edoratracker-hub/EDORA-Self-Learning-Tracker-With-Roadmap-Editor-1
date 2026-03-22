import { useEffect, useState, type CSSProperties } from 'react';
import {
  EditorRoadmapRenderer,
  type RoadmapRendererProps,
} from './EditorRoadmapRenderer';
import { Spinner } from '../ReactIcons/Spinner';
import {
  clearMigratedRoadmapProgress,
  type ResourceType,
} from '../../lib/resource-progress';
import { getUrlParams } from '../../lib/browser.ts';

type EditorRoadmapProps = {
  resourceId: string;
  resourceType?: ResourceType;
  hasChat?: boolean;
  dimensions: {
    width: number;
    height: number;
  };
  nodes?: any[];
  edges?: any[];
};

export function EditorRoadmap(props: EditorRoadmapProps) {
  const { resourceId, resourceType = 'roadmap', dimensions, nodes, edges } = props;

  const hasDirectData = !!(nodes && nodes.length > 0 && edges);
  const [hasSwitchedRoadmap, setHasSwitchedRoadmap] = useState(false);
  const [isLoading, setIsLoading] = useState(!hasDirectData);
  const [roadmapData, setRoadmapData] = useState<
    Omit<RoadmapRendererProps, 'resourceId'> | undefined
  >(hasDirectData ? { nodes: nodes!, edges: edges!, dimensions } : undefined);

  useEffect(() => {
    clearMigratedRoadmapProgress(resourceType, resourceId);

    const { r: switchRoadmapId } = getUrlParams();

    // If nodes/edges were passed in directly and there is no roadmap switch, use them immediately
    if (!switchRoadmapId && hasDirectData) {
      setRoadmapData({ nodes: nodes!, edges: edges!, dimensions });
      setHasSwitchedRoadmap(false);
      setIsLoading(false);
      return;
    }

    // Fallback: try fetching the local JSON file from /jsons/roadmaps/{id}.json
    const targetId = switchRoadmapId || resourceId;
    setIsLoading(true);

    fetch(`/jsons/roadmaps/${targetId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json && json.nodes && json.edges) {
          setRoadmapData({
            nodes: json.nodes,
            edges: json.edges,
            dimensions: dimensions || { width: 968, height: 2000 },
          });
          setHasSwitchedRoadmap(!!switchRoadmapId);
        } else {
          console.error('JSON loaded but missing nodes/edges:', json);
        }
      })
      .catch((err) => {
        console.error('Failed to load roadmap JSON:', err);
        // If we have direct data as a last resort, use it
        if (hasDirectData) {
          setRoadmapData({ nodes: nodes!, edges: edges!, dimensions });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [resourceId]);

  // Safely fallback dimensions to prevent Uncaught TypeError crashes
  const safeDimensions = dimensions || { width: 1000, height: 800 };
  const aspectRatio = safeDimensions.width / safeDimensions.height;

  if (!roadmapData || isLoading) {
    return (
      <div
        style={
          !hasSwitchedRoadmap
            ? ({
              '--aspect-ratio': aspectRatio,
            } as CSSProperties)
            : undefined
        }
        className={
          'mt-5 flex aspect-[var(--aspect-ratio)] w-full flex-col justify-center'
        }
      >
        <div className="flex w-full justify-center">
          <Spinner
            className="h-6 w-6 animate-spin sm:h-12 sm:w-12"
            isDualRing={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={
        !hasSwitchedRoadmap
          ? ({
            '--aspect-ratio': aspectRatio,
          } as CSSProperties)
          : undefined
      }
      className={
        'mt-5 flex aspect-[var(--aspect-ratio)] w-full flex-col justify-center'
      }
    >
      <EditorRoadmapRenderer
        {...roadmapData}
        dimensions={safeDimensions}
        resourceId={resourceId}
      />
    </div>
  );
}
