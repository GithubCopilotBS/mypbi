import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartConfig } from "@shared/schema";
import { ChartContainer } from "./ChartContainer";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const handleSwitchTab = (value: string) => {
    onSwitchTab(value);
  };
  
  const hasData = csvData && csvData.length > 0;
  const hasCharts = charts && charts.length > 0;
  
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Data Analysis View</h2>
            <p className="text-gray-500">
              This tab will contain data analysis features in the future.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
