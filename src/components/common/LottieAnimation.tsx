
'use client';

import type { LottieComponentProps } from 'lottie-react';
import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface LottieAnimationProps extends HTMLAttributes<HTMLDivElement> {
  animationPath?: string; // URL to Lottie JSON
  animationData?: object; // Direct Lottie JSON data
  loop?: boolean;
  autoplay?: boolean;
  width?: string | number;
  height?: string | number;
  lottieClassName?: string; // Class for the Lottie component itself
  message?: string;
  messageClassName?: string; // For customizing message style, e.g., text size
  'data-ai-hint'?: string; // For the Lottie file itself
}

export function LottieAnimation({
  animationPath,
  animationData,
  loop = true,
  autoplay = true,
  width = 150, // Default width for generic loaders
  height = 150, // Default height for generic loaders
  lottieClassName,
  message,
  messageClassName = "text-xl text-muted-foreground", // Default message style
  "data-ai-hint": dataAiHint,
  className, // This className is for the root div of this LottieAnimation component
  ...rest
}: LottieAnimationProps) {

  if (!animationPath && !animationData) {
    // Fallback for developer error: animation source not provided
    return (
      <div className={cn("flex flex-col items-center justify-center", className)} {...rest}>
        <p className="text-destructive">Lottie Error: Animation source not provided.</p>
        {message && <span className={cn("mt-4", messageClassName)}>{message}</span>}
      </div>
    );
  }
  
  // `lottie-react` uses `animationData` for passed JSON object and `path` for URL.
  // Prioritize `animationData` if both are provided.
  const lottiePlayerProps: Partial<LottieComponentProps> = animationData 
    ? { animationData } 
    : { path: animationPath };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)} data-ai-hint={dataAiHint} {...rest}>
      <Lottie
        {...lottiePlayerProps}
        loop={loop}
        autoplay={autoplay}
        style={{ width, height }}
        className={lottieClassName}
      />
      {message && <span className={cn("mt-4", messageClassName)}>{message}</span>}
    </div>
  );
}
