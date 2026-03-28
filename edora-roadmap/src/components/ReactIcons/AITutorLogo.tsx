import type { SVGProps } from 'react';

type AITutorLogoProps = SVGProps<SVGSVGElement> & { className?: string };

export function AITutorLogo(props: AITutorLogoProps) {
  return (
    <img
      src="/logo.jpg"
      alt="EDORA AI Tutor Logo"
      className={props.className}
      style={{
        width: props.width || '100%',
        height: props.height || '100%',
        objectFit: 'contain',
        borderRadius: '4px',
      }}
    />
  );
}
