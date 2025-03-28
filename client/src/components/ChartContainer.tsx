import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Sliders, Download, X } from 'lucide-react';
import { ChartConfig } from '@shared/schema';
import { prepareChartData, generateChartConfig } from '@/lib/chartUtils';

interface ChartContainerProps {
  data: any[];
  config: ChartConfig;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  onDownload: (id: string) => void;
}

export function ChartContainer({ data, config, onRemove, onEdit, onDownload }: ChartContainerProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Prepare chart data
    const chartData = prepareChartData(data, config);
    
    // Generate chart configuration
    const chartConfig = generateChartConfig(config.type, chartData, config);
    
    // Create new chart
    chartInstance.current = new Chart(chartRef.current, chartConfig);
    
    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, config]);
  
  const fieldsText = [
    config.xAxis?.name, 
    config.yAxis?.name,
    config.colorBy?.name
  ].filter(Boolean).join(', ');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">{config.title}</h3>
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-400 hover:text-gray-600 p-1" 
            title="Chart Settings"
            onClick={() => onEdit(config.id)}
          >
            <Sliders className="h-4 w-4" />
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1" 
            title="Download Chart"
            onClick={() => onDownload(config.id)}
          >
            <Download className="h-4 w-4" />
          </button>
          <button 
            className="text-gray-400 hover:text-gray-600 p-1" 
            title="Remove Chart"
            onClick={() => onRemove(config.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4 flex-grow">
        <canvas ref={chartRef} height="200"></canvas>
      </div>
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Fields:</span> {fieldsText || 'None'}
          </div>
          <div>
            <button 
              className="text-primary hover:text-blue-700 text-xs"
              onClick={() => onEdit(config.id)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
