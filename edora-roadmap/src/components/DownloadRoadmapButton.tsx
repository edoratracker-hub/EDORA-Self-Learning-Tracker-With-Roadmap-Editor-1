import { Download } from 'lucide-react';
import { isLoggedIn } from '../lib/jwt.ts';
import { useEffect, useState } from 'react';
import { getUrlParams } from '../lib/browser.ts';

type DownloadRoadmapButtonProps = {
  roadmapId: string;
};

export function DownloadRoadmapButton(props: DownloadRoadmapButtonProps) {
  const { roadmapId } = props;

  const [url, setUrl] = useState<string>('#');

  useEffect(() => {
    const params = getUrlParams();
    const roadmapSlug = params?.r || roadmapId;
    setUrl(`/pdfs/roadmaps/${roadmapSlug}.pdf`);
  }, []);

  return (
    <a
      className="inline-flex items-center justify-center rounded-md border-white px-3 py-1.5 text-xs font-medium sm:text-sm"
      aria-label="Download Roadmap"
      target="_blank"
      href={url}
    >
      <Download className="h-4 w-4" />
      <span className="ml-2 hidden sm:inline">Download</span>
    </a>
  );
}
