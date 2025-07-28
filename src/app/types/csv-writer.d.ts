// types/csv-writer.d.ts
declare module "csv-writer" {
    export function createObjectCsvStringifier(config: {
      header: { id: string; title: string }[];
    }): {
      getHeaderString(): string;
      stringifyRecords(records: Record<string, any>[]): string;
    };
  }
  