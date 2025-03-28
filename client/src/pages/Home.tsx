import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Header } from "@/components/Header";
import { FieldsSidebar } from "@/components/FieldsSidebar";
import { MainContent } from "@/components/MainContent";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { DataPreviewModal } from "@/components/DataPreviewModal";
import { useCSVData } from "@/hooks/useCSVData";
import { ChartConfig } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  // State
  const { csvData, fields, fileName, isLoading, error, loadCSV } = useCSVData();
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [configPanelVisible, setConfigPanelVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("visualize");
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [activeChartId, setActiveChartId] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { toast } = useToast();
  
  // Event handlers
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        await loadCSV(e.target.files[0]);
        toast({
          title: "CSV file loaded successfully",
          description: `Loaded ${e.target.files[0].name}`,
        });
      } catch (err) {
        toast({
          title: "Error loading CSV file",
          description: error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleNewChartClick = () => {
    if (!csvData || csvData.length === 0) {
      toast({
        title: "No data available",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }
    
    const newChartId = uuidv4();
    const newChart: ChartConfig = {
      id: newChartId,
      title: "New Chart",
      type: "bar",
      showLegend: true,
      showDataLabels: false,
      showGridLines: true,
      colorScheme: "default",
    };
    
    setCharts(prev => [...prev, newChart]);
    setActiveChartId(newChartId);
    setConfigPanelVisible(true);
  };
  
  const handleExportClick = () => {
    if (charts.length === 0) {
      toast({
        title: "No charts to export",
        description: "Create a chart first before exporting",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Export feature",
      description: "This feature will be available in a future update",
    });
  };
  
  const handleEditChart = (id: string) => {
    setActiveChartId(id);
    setConfigPanelVisible(true);
  };
  
  const handleRemoveChart = (id: string) => {
    setCharts(prev => prev.filter(chart => chart.id !== id));
    if (activeChartId === id) {
      setActiveChartId(null);
      setConfigPanelVisible(false);
    }
  };
  
  const handleDownloadChart = (id: string) => {
    toast({
      title: "Download feature",
      description: "This feature will be available in a future update",
    });
  };
  
  const handleSwitchTab = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleUpdateConfig = (updatedConfig: ChartConfig) => {
    setCharts(prev => 
      prev.map(chart => 
        chart.id === updatedConfig.id ? updatedConfig : chart
      )
    );
    toast({
      title: "Chart updated",
      description: "Chart settings have been applied",
    });
  };
  
  const activeChart = charts.find(chart => chart.id === activeChartId) || {
    id: "",
    title: "New Chart",
    type: "bar",
    showLegend: true,
    showDataLabels: false,
    showGridLines: true,
    colorScheme: "default",
  };
  
  return (
    <div className="bg-gray-50 h-screen flex flex-col font-sans text-neutral-800 overflow-hidden">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".csv" 
        onChange={handleFileChange}
      />
      
      {/* Header */}
      <Header 
        onUploadClick={handleUploadClick}
        onNewChartClick={handleNewChartClick}
        onExportClick={handleExportClick}
      />
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fields sidebar */}
        <FieldsSidebar 
          fields={fields}
          fileName={fileName}
          onViewDataPreview={() => setShowDataPreview(true)}
        />
        
        {/* Main visualization area */}
        <MainContent 
          charts={charts}
          csvData={csvData}
          onUploadClick={handleUploadClick}
          onEditChart={handleEditChart}
          onRemoveChart={handleRemoveChart}
          onDownloadChart={handleDownloadChart}
          onSwitchTab={handleSwitchTab}
          activeTab={activeTab}
        />
        
        {/* Configuration panel */}
        <ConfigurationPanel 
          visible={configPanelVisible}
          onClose={() => setConfigPanelVisible(false)}
          config={activeChart}
          onConfigUpdate={handleUpdateConfig}
          allFields={fields}
        />
      </div>
      
      {/* Data preview modal */}
      <DataPreviewModal 
        isOpen={showDataPreview}
        onClose={() => setShowDataPreview(false)}
        csvData={csvData}
        fields={fields}
      />
    </div>
  );
}
