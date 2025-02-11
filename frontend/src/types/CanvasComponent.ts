// 컴포넌트 타입 정의
export type ComponentType = 'text' | 'table' | 'image';

// 컴포넌트 기본 인터페이스
export interface ComponentItem {
  id: string;
  name: string;
  type: ComponentType;
}

// 테이블 셀 스타일 타입
export interface TableCellStyle {
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
}

// 캔버스 컴포넌트 인터페이스
export interface CanvasComponent extends ComponentItem {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
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
    tableData?: { [key: string]: string };
    tableCellStyles?: { [key: string]: TableCellStyle };
    imageUrl?: string;
    columnSizes?: string;
    rowSizes?: string;
  };
}

// 컴포넌트 초기 설정
export const INITIAL_COMPONENT_SETTINGS = {
  // 테이블 설정
  TABLE: {
    ROWS: 10,
    COLUMNS: 5,
    WIDTH: 735,
    HEIGHT: 435,
    getDefaultColumnSizes: (columns: number) => Array(columns).fill(Math.floor(100/columns)).join(','),
    getDefaultRowSizes: (rows: number) => Array(rows).fill(Math.floor(100/rows)).join(','),
    DEFAULT_CELL_STYLE: {
      borderTop: '1px solid #000000',
      borderRight: '1px solid #000000',
      borderBottom: '1px solid #000000',
      borderLeft: '1px solid #000000',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontSize: 14,
      fontWeight: 'normal',
      textAlign: 'left',
    } as TableCellStyle,
  },
  // 텍스트 설정
  TEXT: {
    WIDTH: 200,
    HEIGHT: 50,
    STYLE: {
      FONT_SIZE: 16,
      FONT_WEIGHT: 'normal',
      TEXT_ALIGN: 'left',
      COLOR: '#000000',
    },
  },
  // 이미지 설정
  IMAGE: {
    WIDTH: 200,
    HEIGHT: 200,
  },
} as const;

// 컴포넌트 아이콘
export const COMPONENT_ICONS: Record<ComponentType, string> = {
  text: '📝',
  table: '📊',
  image: '🖼️',
} as const;
