import { cn } from '../../lib/classname.ts';

type CategoryFilterButtonProps = {
  category: string;
  selected: boolean;
  onClick: () => void;
};

export function CategoryFilterButton(props: CategoryFilterButtonProps) {
  const { category, selected, onClick } = props;

  return (
    <button
      className={cn(
        'mr-2 rounded-sm py-1.5 pr-3 text-center text-sm transition-all sm:text-right',
        selected
          ? 'scale-105 bg-gradient-to-l from-gray-600 to-gray-950 font-bold text-white shadow'
          : 'hover:blur-0 text-gray-400 opacity-100 blur-[.6px] hover:opacity-80',
      )}
      type="button"
      onClick={onClick}
    >
      {category}
    </button>
  );
}
