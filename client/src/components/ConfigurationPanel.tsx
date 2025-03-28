import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CSVField, ChartConfig } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { suggestChartType } from "@/lib/chartUtils";

interface ConfigurationPanelProps {
  visible: boolean;
  onClose: () => void;
  config: ChartConfig;
  onConfigUpdate: (config: ChartConfig) => void;
  allFields: CSVField[];
}

export function ConfigurationPanel({ 
  visible, 
  onClose, 
  config, 
  onConfigUpdate, 
  allFields 
}: ConfigurationPanelProps) {
  const [localConfig, setLocalConfig] = useState<ChartConfig>(config);
  
  // Update local config when the input config changes
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);
  
  const handleDropField = (e: React.DragEvent<HTMLDivElement>, dropZone: 'xAxis' | 'yAxis' | 'colorBy' | 'filters') => {
    e.preventDefault();
    try {
      const fieldData = JSON.parse(e.dataTransfer.getData("application/json")) as CSVField;
      
      // Update local config with the dropped field
      const updatedConfig = { ...localConfig };
      
      if (dropZone === 'xAxis' || dropZone === 'yAxis' || dropZone === 'colorBy') {
        updatedConfig[dropZone] = fieldData;
      } else if (dropZone === 'filters') {
        updatedConfig.filters = [...(updatedConfig.filters || []), fieldData];
      }
      
      // If both x and y are set, suggest a chart type
      if (dropZone === 'xAxis' || dropZone === 'yAxis') {
        if (updatedConfig.xAxis && updatedConfig.yAxis) {
          updatedConfig.type = suggestChartType(updatedConfig.xAxis, updatedConfig.yAxis);
        }
      }
      
      setLocalConfig(updatedConfig);
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-primary", "bg-blue-50");
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("border-primary", "bg-blue-50");
  };
  
  const handleRemoveField = (zone: 'xAxis' | 'yAxis' | 'colorBy') => {
    const updatedConfig = { ...localConfig };
    delete updatedConfig[zone];
    setLocalConfig(updatedConfig);
  };
  
  const handleRemoveFilter = (fieldName: string) => {
    const updatedConfig = { ...localConfig };
    updatedConfig.filters = updatedConfig.filters?.filter(f => f.name !== fieldName) || [];
    setLocalConfig(updatedConfig);
  };
  
  const handleApply = () => {
    onConfigUpdate(localConfig);
  };
  
  const handleReset = () => {
    setLocalConfig(config);
  };
  
  const renderFieldChip = (field: CSVField | undefined, zone: 'xAxis' | 'yAxis' | 'colorBy') => {
    if (!field) return null;
    
    const iconClass = field.type === 'dimension' 
      ? 'fas fa-tag text-blue-500'
      : field.type === 'measure'
        ? 'fas fa-hashtag text-green-500'
        : 'fas fa-calendar text-purple-500';
    
    return (
      <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
        <i className={`${iconClass} mr-1`}></i>
        <span>{field.name}</span>
        <button 
          className="ml-1 text-blue-500 hover:text-blue-700"
          onClick={() => handleRemoveField(zone)}
        >
          <i className="fas fa-times-circle"></i>
        </button>
      </div>
    );
  };
  
  return (
    <aside 
      id="config-panel" 
      className={`w-80 bg-white border-l border-gray-200 ${visible ? 'flex' : 'hidden'} md:flex flex-col h-full`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">Chart Properties</h2>
        <button 
          className="text-gray-400 hover:text-gray-600 p-1"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="overflow-y-auto flex-grow p-4">
        {/* Chart Type Selection */}
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</Label>
          <div className="grid grid-cols-4 gap-2">
            <button 
              className={`p-2 border ${localConfig.type === 'bar' ? 'border-primary bg-blue-50' : 'border-gray-200'} rounded hover:bg-gray-50 flex flex-col items-center justify-center`}
              onClick={() => setLocalConfig({ ...localConfig, type: 'bar' })}
            >
              <i className={`fas fa-chart-bar ${localConfig.type === 'bar' ? 'text-primary' : 'text-gray-400'} text-lg`}></i>
              <span className="text-xs mt-1 text-gray-600">Bar</span>
            </button>
            <button 
              className={`p-2 border ${localConfig.type === 'line' ? 'border-primary bg-blue-50' : 'border-gray-200'} rounded hover:bg-gray-50 flex flex-col items-center justify-center`}
              onClick={() => setLocalConfig({ ...localConfig, type: 'line' })}
            >
              <i className={`fas fa-chart-line ${localConfig.type === 'line' ? 'text-primary' : 'text-gray-400'} text-lg`}></i>
              <span className="text-xs mt-1 text-gray-600">Line</span>
            </button>
            <button 
              className={`p-2 border ${localConfig.type === 'pie' ? 'border-primary bg-blue-50' : 'border-gray-200'} rounded hover:bg-gray-50 flex flex-col items-center justify-center`}
              onClick={() => setLocalConfig({ ...localConfig, type: 'pie' })}
            >
              <i className={`fas fa-chart-pie ${localConfig.type === 'pie' ? 'text-primary' : 'text-gray-400'} text-lg`}></i>
              <span className="text-xs mt-1 text-gray-600">Pie</span>
            </button>
            <button 
              className={`p-2 border ${localConfig.type === 'scatter' ? 'border-primary bg-blue-50' : 'border-gray-200'} rounded hover:bg-gray-50 flex flex-col items-center justify-center`}
              onClick={() => setLocalConfig({ ...localConfig, type: 'scatter' })}
            >
              <i className={`fas fa-braille ${localConfig.type === 'scatter' ? 'text-primary' : 'text-gray-400'} text-lg`}></i>
              <span className="text-xs mt-1 text-gray-600">Scatter</span>
            </button>
          </div>
        </div>
        
        {/* Drop Zones */}
        <div className="border border-gray-200 rounded-md mb-6">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
            Data Binding
          </div>
          
          <div className="p-4 space-y-4">
            {/* X-Axis Drop Zone */}
            <div>
              <Label className="block text-xs font-medium text-gray-500 mb-1">X-Axis (Categories)</Label>
              <div 
                className="border border-dashed border-gray-300 rounded-md p-2 min-h-[40px] bg-gray-50 flex items-center" 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropField(e, 'xAxis')}
              >
                {localConfig.xAxis 
                  ? renderFieldChip(localConfig.xAxis, 'xAxis')
                  : <div className="w-full text-center text-xs text-gray-400">Drag dimension here</div>
                }
              </div>
            </div>
            
            {/* Y-Axis Drop Zone */}
            <div>
              <Label className="block text-xs font-medium text-gray-500 mb-1">Y-Axis (Values)</Label>
              <div 
                className="border border-dashed border-gray-300 rounded-md p-2 min-h-[40px] bg-gray-50 flex items-center"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropField(e, 'yAxis')}
              >
                {localConfig.yAxis 
                  ? renderFieldChip(localConfig.yAxis, 'yAxis')
                  : <div className="w-full text-center text-xs text-gray-400">Drag measure here</div>
                }
              </div>
            </div>
            
            {/* Colors Drop Zone */}
            <div>
              <Label className="block text-xs font-medium text-gray-500 mb-1">Color (Optional)</Label>
              <div 
                className="border border-dashed border-gray-300 rounded-md p-2 min-h-[40px] bg-gray-50 flex items-center"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropField(e, 'colorBy')}
              >
                {localConfig.colorBy 
                  ? renderFieldChip(localConfig.colorBy, 'colorBy')
                  : <div className="w-full text-center text-xs text-gray-400">Drag dimension here</div>
                }
              </div>
            </div>
            
            {/* Filters Drop Zone */}
            <div>
              <Label className="block text-xs font-medium text-gray-500 mb-1">Filters (Optional)</Label>
              <div 
                className="border border-dashed border-gray-300 rounded-md p-2 min-h-[40px] bg-gray-50 flex flex-wrap gap-1"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDropField(e, 'filters')}
              >
                {localConfig.filters && localConfig.filters.length > 0 
                  ? localConfig.filters.map(field => (
                      <div key={field.name} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                        <span>{field.name}</span>
                        <button 
                          className="ml-1 text-blue-500 hover:text-blue-700"
                          onClick={() => handleRemoveFilter(field.name)}
                        >
                          <i className="fas fa-times-circle"></i>
                        </button>
                      </div>
                    ))
                  : <div className="w-full text-center text-xs text-gray-400">Drag fields here</div>
                }
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Settings */}
        <div className="border border-gray-200 rounded-md">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200 flex justify-between items-center">
            <span>Chart Settings</span>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Chart Title */}
            <div>
              <Label className="block text-xs font-medium text-gray-500 mb-1">Chart Title</Label>
              <Input
                type="text"
                value={localConfig.title}
                onChange={(e) => setLocalConfig({ ...localConfig, title: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            
            {/* Color Scheme */}
            <div>
              <Label className="block text-xs font-medium text-gray-500 mb-1">Color Scheme</Label>
              <Select 
                value={localConfig.colorScheme}
                onValueChange={(value) => setLocalConfig({ ...localConfig, colorScheme: value })}
              >
                <SelectTrigger className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                  <SelectItem value="categorical">Categorical</SelectItem>
                  <SelectItem value="diverging">Diverging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Show Legend */}
            <div className="flex items-center">
              <Checkbox 
                id="show-legend" 
                checked={localConfig.showLegend}
                onCheckedChange={(checked) => 
                  setLocalConfig({ ...localConfig, showLegend: checked as boolean })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="show-legend" className="ml-2 text-xs text-gray-700">Show legend</Label>
            </div>
            
            {/* Show Data Labels */}
            <div className="flex items-center">
              <Checkbox 
                id="show-data-labels" 
                checked={localConfig.showDataLabels}
                onCheckedChange={(checked) => 
                  setLocalConfig({ ...localConfig, showDataLabels: checked as boolean })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="show-data-labels" className="ml-2 text-xs text-gray-700">Show data labels</Label>
            </div>
            
            {/* Show Grid Lines */}
            <div className="flex items-center">
              <Checkbox 
                id="show-grid-lines" 
                checked={localConfig.showGridLines}
                onCheckedChange={(checked) => 
                  setLocalConfig({ ...localConfig, showGridLines: checked as boolean })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="show-grid-lines" className="ml-2 text-xs text-gray-700">Show grid lines</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
        <Button 
          variant="outline"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition duration-150"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button 
          variant="default"
          className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-md transition duration-150"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>
    </aside>
  );
}
