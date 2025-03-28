import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { CSVField } from '@shared/schema';
import { determineFieldType } from '@/lib/fieldUtils';

interface UseCSVDataReturn {
  csvData: any[] | null;
  fields: CSVField[];
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
  loadCSV: (file: File) => Promise<void>;
}

export function useCSVData(): UseCSVDataReturn {
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [fields, setFields] = useState<CSVField[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCSV = useCallback(async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject
        });
      });
      
      if (!result.data || result.data.length === 0) {
        throw new Error('The CSV file contains no data or is improperly formatted.');
      }
      
      setCsvData(result.data);
      setFileName(file.name);
      
      // Extract fields and determine their types
      const extractedFields: CSVField[] = [];
      const headerRow = result.meta.fields || [];
      
      // Use sample data to determine field types
      const sampleRow = result.data[0] || {};
      
      headerRow.forEach((name, index) => {
        if (name) {
          extractedFields.push({
            name,
            type: determineFieldType(name, sampleRow[name]),
            index
          });
        }
      });
      
      setFields(extractedFields);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      setCsvData(null);
      setFields([]);
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    csvData,
    fields,
    fileName,
    isLoading,
    error,
    loadCSV
  };
}
