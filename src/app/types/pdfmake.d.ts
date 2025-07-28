declare module 'pdfmake' {
    import { TDocumentDefinitions } from 'pdfmake/interfaces';
    import type { Buffer } from 'buffer';
  
    interface Fonts {
      [key: string]: {
        normal: Buffer;
        bold?: Buffer;
        italics?: Buffer;
        bolditalics?: Buffer;
      };
    }
  
    interface CreatePdfKitDocument {
      createPdfKitDocument(docDefinition: TDocumentDefinitions): import("pdfkit");
    }
  
    class PdfPrinter {
      constructor(fonts: Fonts);
      createPdfKitDocument(docDefinition: TDocumentDefinitions): import("pdfkit");
    }
  
    export default PdfPrinter;
  }
  