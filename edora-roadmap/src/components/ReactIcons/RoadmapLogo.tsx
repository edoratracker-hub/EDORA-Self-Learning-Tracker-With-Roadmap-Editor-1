import type { SVGProps } from 'react';

type RoadmapLogoIconProps = SVGProps<SVGSVGElement> & {
  color?: 'white' | 'black';
  className?: string;
};

export function RoadmapLogoIcon(props: RoadmapLogoIconProps) {
  const { color = 'white', className, ...rest } = props;

  return (
    <img
      src="/logo.jpg"
      alt="EDORA Logo"
      className={className}
      style={{
        width: rest.width || '30px',
        height: rest.height || '30px',
        objectFit: 'contain',
        borderRadius: '4px',
      }}
    />
  );
}
