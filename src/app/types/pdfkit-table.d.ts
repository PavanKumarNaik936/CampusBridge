// types/pdfkit-table.d.ts

import type PDFDocument from "pdfkit";

declare module "pdfkit" {
  interface TableColumn {
    label: string;
    property: string;
    width?: number;
    renderer?: (value: any, index: number, row: any) => string;
  }

  interface TableOptions {
    headers: TableColumn[];
    datas: any[];
    options?: {
      width?: number;
      columnSpacing?: number;
      padding?: number;
    };
  }

  interface PDFDocument {
    table: (table: TableOptions, options?: any) => Promise<void>;
  }
}
