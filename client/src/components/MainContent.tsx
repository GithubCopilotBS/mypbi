import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartConfig } from "@shared/schema";
import { ChartContainer } from "./ChartContainer";
import { FileSpreadsheet, Download, Table, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MainContentProps {
  charts: ChartConfig[];
  csvData: any[] | null;
  onUploadClick: () => void;
  onEditChart: (id: string) => void;
  onRemoveChart: (id: string) => void;
  onDownloadChart: (id: string) => void;
  onSwitchTab: (tab: string) => void;
  activeTab: string;
}

export function MainContent({
  charts,
  csvData,
  onUploadClick,
  onEditChart,
  onRemoveChart,
  onDownloadChart,
  onSwitchTab,
  activeTab
}: MainContentProps) {
  const { toast } = useToast();
  const [previewLimit, setPreviewLimit] = useState(10); // Number of rows to show in preview
  
  const handleSwitchTab = (value: string) => {
    onSwitchTab(value);
  };
  
  const hasData = csvData && csvData.length > 0;
  const hasCharts = charts && charts.length > 0;
  
  // Handle export to CSV
  const handleExportCSV = () => {
    if (!csvData || csvData.length === 0) {
      toast({
        title: "Export failed",
        description: "No data available to export.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Get headers
      const headers = Object.keys(csvData[0]);
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n';
      
      // Add data rows
      csvData.forEach(row => {
        const rowValues = headers.map(header => {
          const value = row[header];
          // Handle strings with commas by wrapping in quotes
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        });
        csvContent += rowValues.join(',') + '\n';
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'exported_data.csv');
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Data has been exported as CSV.",
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Export failed",
        description: "Could not export data to CSV.",
        variant: "destructive"
      });
    }
  };
  
  // Handle export to JSON
  const handleExportJSON = () => {
    if (!csvData || csvData.length === 0) {
      toast({
        title: "Export failed",
        description: "No data available to export.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Convert data to JSON string
      const jsonContent = JSON.stringify(csvData, null, 2);
      
      // Create download link
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'exported_data.json');
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Data has been exported as JSON.",
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        title: "Export failed",
        description: "Could not export data to JSON.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Tab navigation */}
      <Tabs defaultValue={activeTab} onValueChange={handleSwitchTab} className="w-full">
        <div className="bg-white border-b border-gray-200">
          <TabsList className="flex">
            <TabsTrigger 
              value="visualize"
              className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700"
            >
              Visualize
            </TabsTrigger>
            <TabsTrigger 
              value="data"
              className="px-4 py-2 text-sm font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700"
            >
              Data
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="visualize" className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {/* Placeholder when no data */}
          {!hasData && (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-lg">
                <FileSpreadsheet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Create your first visualization</h2>
                <p className="text-gray-500 mb-6">Upload a CSV file and drag fields onto the canvas to start visualizing your data.</p>
                <Button 
                  variant="default"
                  className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium transition duration-150"
                  onClick={onUploadClick}
                >
                  Upload CSV File
                </Button>
              </div>
            </div>
          )}
          
          {/* Charts grid when data is available */}
          {hasData && (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${hasCharts ? '' : 'hidden'}`}>
              {charts.map(chart => (
                <ChartContainer
                  key={chart.id}
                  data={csvData}
                  config={chart}
                  onRemove={onRemoveChart}
                  onEdit={onEditChart}
                  onDownload={onDownloadChart}
                />
              ))}
            </div>
          )}
          
          {/* Empty state when data is loaded but no charts */}
          {hasData && !hasCharts && (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-lg">
                <i className="fas fa-chart-bar text-5xl text-gray-300 mb-4"></i>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Create your first chart</h2>
                <p className="text-gray-500 mb-6">Click "New Chart" and drag fields to configure a visualization.</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="data" className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {!hasData ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-lg">
                <FileSpreadsheet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No data available</h2>
                <p className="text-gray-500 mb-6">Upload a CSV file to analyze and explore your data.</p>
                <Button 
                  variant="default"
                  className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium transition duration-150"
                  onClick={onUploadClick}
                >
                  Upload CSV File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Data Export Options */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">Data Export</h2>
                  <div className="text-sm text-gray-500">{csvData.length} rows</div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleExportCSV}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Export as CSV</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleExportJSON}
                  >
                    <FileJson className="h-4 w-4" />
                    <span>Export as JSON</span>
                  </Button>
                </div>
              </div>
              
              {/* Data Preview Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Data Preview</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Showing {Math.min(previewLimit, csvData.length)} of {csvData.length} rows
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {csvData.length > 0 && Object.keys(csvData[0]).map((header, index) => (
                          <th 
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {csvData.slice(0, previewLimit).map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <td 
                              key={cellIndex}
                              className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 overflow-hidden text-ellipsis max-w-xs"
                            >
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {csvData.length > previewLimit && (
                  <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-center">
                    <Button 
                      variant="ghost" 
                      className="text-primary text-sm"
                      onClick={() => setPreviewLimit(prev => prev + 10)}
                    >
                      Load more rows
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
