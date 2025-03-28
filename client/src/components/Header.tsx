import { Button } from "@/components/ui/button";
import { PlusCircle, Download, FileSpreadsheet } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
  onNewChartClick: () => void;
  onExportClick: () => void;
}

export function Header({ onUploadClick, onNewChartClick, onExportClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800 mr-6">CSV Visualization App</h1>
        <div className="hidden md:flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-sm text-gray-600 hover:text-primary"
            onClick={onNewChartClick}
          >
            <PlusCircle className="h-4 w-4 mr-1" /> New Chart
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-sm text-gray-600 hover:text-primary"
            onClick={onExportClick}
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        <Button 
          variant="default" 
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 flex items-center"
          onClick={onUploadClick}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
      </div>
    </header>
  );
}
