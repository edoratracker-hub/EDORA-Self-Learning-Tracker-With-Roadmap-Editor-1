import { Bell, Check, FolderKanbanIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/classname.ts';
import { isLoggedIn } from '../../lib/jwt.ts';
import { showLoginPopup } from '../../lib/popup.ts';

export function EmptyProjects() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsSubscribed(isLoggedIn());
    setIsLoading(false);
  }, []);

  return (
    <div className="relative mt-2.5 mb-5 flex min-h-[400px] flex-col items-center justify-center rounded-lg " style={{ background: 'var(--background)' }}>
      <FolderKanbanIcon className="h-14 w-14 text-gray-300" strokeWidth={1.5} />
      <h2 className="mt-2 mb-0.5 text-center text-base font-medium text-gray-300 sm:text-xl">
        <span className="hidden sm:inline">Projects are coming soon!</span>
        <span className="inline sm:hidden">Coming soon!</span>
      </h2>
    </div>
  );
}
