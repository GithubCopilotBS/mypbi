import { useState } from "react";
import { CSVField } from "@shared/schema";
import { Search, Table } from "lucide-react";
import { filterFieldsByType, getFieldIconClass } from "@/lib/fieldUtils";
import { Input } from "@/components/ui/input";

interface FieldsSidebarProps {
  fields: CSVField[];
  fileName: string | null;
  onViewDataPreview: () => void;
}

export function FieldsSidebar({ fields, fileName, onViewDataPreview }: FieldsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFields = searchTerm 
    ? fields.filter(field => field.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : fields;
  
  const dimensionFields = filterFieldsByType(filteredFields, "dimension");
  const measureFields = filterFieldsByType(filteredFields, "measure");
  const dateFields = filterFieldsByType(filteredFields, "date");
  
  const renderFieldItem = (field: CSVField) => {
    const iconClass = getFieldIconClass(field.type);
    const IconComponent = field.type === 'dimension' 
      ? "i" 
      : field.type === 'measure' 
        ? "i" 
        : "i";
    
    return (
      <div
        key={field.name}
        className="px-2 py-1.5 bg-white border border-gray-200 rounded text-sm flex items-center justify-between cursor-grab hover:bg-blue-50 hover:border-blue-200 shadow-sm"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("application/json", JSON.stringify(field));
          e.dataTransfer.effectAllowed = "copy";
        }}
      >
        <div className="flex items-center">
          <i className={`${iconClass} text-xs mr-2`}></i>
          <span>{field.name}</span>
        </div>
        <i className="fas fa-ellipsis-v text-gray-400 text-xs"></i>
      </div>
    );
  };
  
  return (
    <aside id="fields-sidebar" className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">Fields</h2>
        <div className="text-xs text-gray-500 mt-1" id="file-info">
          {fileName ? `File: ${fileName}` : "No file loaded"}
        </div>
      </div>
      
      <div className="px-2 py-3 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search fields..."
            className="w-full rounded-md border border-gray-300 pl-8 pr-4 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-2" />
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {/* Dimensions section */}
        <div className="py-2 px-3 border-b border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</h3>
          <div id="dimension-fields" className="mt-2 space-y-1">
            {dimensionFields.length > 0 
              ? dimensionFields.map(renderFieldItem)
              : <div className="text-gray-300 text-xs italic px-2 py-1">No fields available</div>
            }
          </div>
        </div>
        
        {/* Measures section */}
        <div className="py-2 px-3 border-b border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Measures</h3>
          <div id="measure-fields" className="mt-2 space-y-1">
            {measureFields.length > 0 
              ? measureFields.map(renderFieldItem)
              : <div className="text-gray-300 text-xs italic px-2 py-1">No fields available</div>
            }
          </div>
        </div>
        
        {/* Dates section */}
        <div className="py-2 px-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</h3>
          <div id="date-fields" className="mt-2 space-y-1">
            {dateFields.length > 0 
              ? dateFields.map(renderFieldItem)
              : <div className="text-gray-300 text-xs italic px-2 py-1">No fields available</div>
            }
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500">Data preview</span>
          <button 
            className="text-xs text-primary hover:text-blue-700 flex items-center"
            onClick={onViewDataPreview}
          >
            <Table className="h-3 w-3 mr-1" /> View
          </button>
        </div>
      </div>
    </aside>
  );
}
