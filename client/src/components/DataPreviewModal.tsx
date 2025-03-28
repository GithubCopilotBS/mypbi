import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { CSVField } from "@shared/schema";
import { formatFieldValue } from "@/lib/fieldUtils";

interface DataPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvData: any[] | null;
  fields: CSVField[];
}

export function DataPreviewModal({ isOpen, onClose, csvData, fields }: DataPreviewModalProps) {
  if (!csvData || csvData.length === 0) {
    return null;
  }
  
  // Limit to first 100 rows for performance
  const displayData = csvData.slice(0, 100);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-full max-h-[80vh] flex flex-col">
        <DialogHeader className="border-b border-gray-200 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle className="font-semibold text-gray-700">Data Preview</DialogTitle>
            <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="overflow-auto flex-grow p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  {fields.map(field => (
                    <TableHead 
                      key={field.name}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {displayData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {fields.map(field => (
                      <TableCell 
                        key={`${rowIndex}-${field.name}`}
                        className="px-3 py-2 text-sm text-gray-700"
                      >
                        {formatFieldValue(row[field.name], field)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          Showing {displayData.length} of {csvData.length} rows
        </div>
      </DialogContent>
    </Dialog>
  );
}
