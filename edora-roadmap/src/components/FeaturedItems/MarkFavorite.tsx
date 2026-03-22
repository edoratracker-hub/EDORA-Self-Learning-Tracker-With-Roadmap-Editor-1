import { useState } from 'react';
import { FavoriteIcon } from './FavoriteIcon';
import { cn } from '../../lib/classname';

type MarkFavoriteType = {
  resourceType: string;
  resourceId: string;
  className?: string;
};

export function MarkFavorite({
  resourceId,
  resourceType,
  className,
}: MarkFavoriteType) {
  const localStorageKey = `${resourceType}-${resourceId}-favorite`;
  const [isFavorite, setIsFavorite] = useState(
    localStorage.getItem(localStorageKey) === '1',
  );

  function toggleFavoriteHandler(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    localStorage.setItem(localStorageKey, newValue ? '1' : '0');
  }

  return (
    <button
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={toggleFavoriteHandler}
      tabIndex={-1}
      className={cn(
        'absolute top-1.5 right-1.5 z-30 focus:outline-0',
        isFavorite ? '' : 'opacity-30 hover:opacity-100',
        className,
      )}
      data-is-favorite={isFavorite}
    >
      <FavoriteIcon isFavorite={isFavorite} />
    </button>
  );
}
