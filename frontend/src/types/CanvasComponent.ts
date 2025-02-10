export type ComponentType = 'title' | 'text' | 'table' | 'image' | 'signature' | 'qrcode';

export interface CanvasComponent {
  id: string;
  name: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
  };
  content?: {
    text?: string;
    rows?: number;
    columns?: number;
    imageUrl?: string;
    qrData?: string;
  };
}
