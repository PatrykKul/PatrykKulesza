declare module 'react-katex' {
  import { ComponentType } from 'react';

  interface KatexOptions {
    displayMode?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    macros?: object;
    minRuleThickness?: number;
    colorIsTextColor?: boolean;
    maxSize?: number;
    maxExpand?: number;
    strict?: boolean;
    trust?: boolean;
    globalGroup?: boolean;
  }

  interface MathComponentProps {
    math?: string;
    children?: string;
    settings?: KatexOptions;
    renderError?: (error: Error) => React.ReactNode;
  }

  export const InlineMath: ComponentType<MathComponentProps>;
  export const BlockMath: ComponentType<MathComponentProps>;
}