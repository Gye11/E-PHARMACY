declare module 'react-ellipsis-text' {
  import type { ComponentType, HTMLAttributes } from 'react';

  interface EllipsisTextProps extends HTMLAttributes<HTMLSpanElement> {
    text: string;
    length: number;
    tail?: string;
    tailClassName?: string;
  }

  const EllipsisText: ComponentType<EllipsisTextProps>;

  export default EllipsisText;
}
