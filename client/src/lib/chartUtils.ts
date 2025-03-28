import { ChartConfiguration } from 'chart.js';
import { CSVField, ChartConfig } from '@shared/schema';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

// Color palettes for different color schemes
const COLOR_PALETTES = {
  default: [
    'rgba(59, 130, 246, 0.7)', // blue
    'rgba(16, 185, 129, 0.7)', // green
    'rgba(249, 115, 22, 0.7)', // orange
    'rgba(139, 92, 246, 0.7)', // purple
    'rgba(236, 72, 153, 0.7)', // pink
  ],
  monochrome: [
    'rgba(59, 130, 246, 0.8)',
    'rgba(59, 130, 246, 0.7)',
    'rgba(59, 130, 246, 0.6)',
    'rgba(59, 130, 246, 0.5)',
    'rgba(59, 130, 246, 0.4)',
  ],
  categorical: [
    'rgba(239, 68, 68, 0.7)', // red
    'rgba(249, 115, 22, 0.7)', // orange
    'rgba(234, 179, 8, 0.7)',  // yellow
    'rgba(16, 185, 129, 0.7)', // green
    'rgba(59, 130, 246, 0.7)', // blue
  ],
  diverging: [
    'rgba(239, 68, 68, 0.7)', // red
    'rgba(249, 115, 22, 0.7)', // orange
    'rgba(234, 234, 234, 0.7)', // light gray
    'rgba(147, 197, 253, 0.7)', // light blue
    'rgba(59, 130, 246, 0.7)', // blue
  ],
  gradient: [
    'rgba(236, 72, 153, 0.7)', // pink
    'rgba(217, 70, 239, 0.7)', // fuchsia
    'rgba(168, 85, 247, 0.7)', // purple
    'rgba(139, 92, 246, 0.7)', // violet
    'rgba(99, 102, 241, 0.7)',  // indigo
  ],
  pastel: [
    'rgba(254, 226, 226, 0.7)', // red-100
    'rgba(254, 243, 199, 0.7)', // yellow-100
    'rgba(209, 250, 229, 0.7)', // green-100
    'rgba(219, 234, 254, 0.7)', // blue-100
    'rgba(237, 233, 254, 0.7)', // purple-100
  ],
  bold: [
    'rgba(220, 38, 38, 0.8)', // red-600
    'rgba(217, 119, 6, 0.8)',  // amber-600
    'rgba(5, 150, 105, 0.8)',  // emerald-600
    'rgba(37, 99, 235, 0.8)',  // blue-600
    'rgba(124, 58, 237, 0.8)', // violet-600
  ],
};

// Border colors for each palette
const BORDER_PALETTES = {
  default: [
    'rgba(59, 130, 246, 1)', // blue
    'rgba(16, 185, 129, 1)', // green
    'rgba(249, 115, 22, 1)', // orange
    'rgba(139, 92, 246, 1)', // purple
    'rgba(236, 72, 153, 1)', // pink
  ],
  monochrome: [
    'rgba(59, 130, 246, 1)',
    'rgba(59, 130, 246, 0.9)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(59, 130, 246, 0.7)',
    'rgba(59, 130, 246, 0.6)',
  ],
  categorical: [
    'rgba(239, 68, 68, 1)', // red
    'rgba(249, 115, 22, 1)', // orange
    'rgba(234, 179, 8, 1)',  // yellow
    'rgba(16, 185, 129, 1)', // green
    'rgba(59, 130, 246, 1)', // blue
  ],
  diverging: [
    'rgba(239, 68, 68, 1)', // red
    'rgba(249, 115, 22, 1)', // orange
    'rgba(234, 234, 234, 1)', // light gray
    'rgba(147, 197, 253, 1)', // light blue
    'rgba(59, 130, 246, 1)', // blue
  ],
  gradient: [
    'rgba(236, 72, 153, 1)', // pink
    'rgba(217, 70, 239, 1)', // fuchsia
    'rgba(168, 85, 247, 1)', // purple
    'rgba(139, 92, 246, 1)', // violet
    'rgba(99, 102, 241, 1)',  // indigo
  ],
  pastel: [
    'rgba(254, 202, 202, 1)', // red-200
    'rgba(254, 240, 138, 1)', // yellow-200
    'rgba(187, 247, 208, 1)', // green-200
    'rgba(191, 219, 254, 1)', // blue-200
    'rgba(221, 214, 254, 1)', // purple-200
  ],
  bold: [
    'rgba(185, 28, 28, 1)', // red-700
    'rgba(180, 83, 9, 1)',  // amber-700
    'rgba(4, 120, 87, 1)',  // emerald-700
    'rgba(29, 78, 216, 1)',  // blue-700
    'rgba(109, 40, 217, 1)', // violet-700
  ],
};

/**
 * Suggests a default chart type based on field types
 */
export function suggestChartType(
  xAxisField?: CSVField,
  yAxisField?: CSVField
): ChartConfig['type'] {
  if (!xAxisField || !yAxisField) {
    return 'bar';
  }
  
  // If x-axis is a dimension and y-axis is a measure, use bar chart
  if (xAxisField.type === 'dimension' && yAxisField.type === 'measure') {
    return 'bar';
  }
  
  // If x-axis is a date and y-axis is a measure, use line chart
  if (xAxisField.type === 'date' && yAxisField.type === 'measure') {
    return 'line';
  }
  
  // If both are dimensions, use pie chart
  if (xAxisField.type === 'dimension' && yAxisField.type === 'dimension') {
    // For categorical dimensions with few values, pie/doughnut are good
    // For those with many values, radar might be better
    return 'pie';
  }
  
  // If both are measures, use scatter chart or bubble chart
  if (xAxisField.type === 'measure' && yAxisField.type === 'measure') {
    return 'scatter';
  }
  
  // Default to bar chart
  return 'bar';
}

/**
 * Prepare chart data from CSV data and config
 */
export function prepareChartData(
  csvData: any[],
  config: ChartConfig
): ChartData {
  // Default empty data
  if (!csvData || !csvData.length || !config.xAxis || !config.yAxis) {
    return {
      labels: [],
      datasets: [{
        label: 'No data',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }]
    };
  }
  
  // Get unique x-axis values as labels
  const labels = Array.from(new Set(csvData.map(row => String(row[config.xAxis!.name]))));
  
  // Prepare data for each label
  let data: number[] = [];
  
  if (config.type === 'pie') {
    // For pie charts, we sum values for each category
    data = labels.map(label => {
      return csvData
        .filter(row => String(row[config.xAxis!.name]) === label)
        .reduce((sum, row) => sum + (Number(row[config.yAxis!.name]) || 0), 0);
    });
  } else {
    // For other charts, collect data points
    data = labels.map(label => {
      const matchingRows = csvData.filter(row => String(row[config.xAxis!.name]) === label);
      if (matchingRows.length === 0) return 0;
      
      // Average the values for this label
      const total = matchingRows.reduce((sum, row) => sum + (Number(row[config.yAxis!.name]) || 0), 0);
      return total / matchingRows.length;
    });
  }
  
  // Select color palette based on config
  const colorScheme = config.colorScheme || 'default';
  const backgroundColors = labels.map((_, i) => 
    COLOR_PALETTES[colorScheme as keyof typeof COLOR_PALETTES][i % COLOR_PALETTES[colorScheme as keyof typeof COLOR_PALETTES].length]
  );
  
  const borderColors = labels.map((_, i) => 
    BORDER_PALETTES[colorScheme as keyof typeof BORDER_PALETTES][i % BORDER_PALETTES[colorScheme as keyof typeof BORDER_PALETTES].length]
  );
  
  return {
    labels,
    datasets: [{
      label: config.yAxis.name,
      data,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1
    }]
  };
}

/**
 * Generate chart configuration based on chart type and data
 */
export function generateChartConfig(
  chartType: ChartConfig['type'],
  chartData: ChartData,
  config: ChartConfig
): ChartConfiguration {
  const baseConfig = {
    type: chartType,
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: config.aspectRatio ? true : false,
      aspectRatio: config.aspectRatio || 2,
      plugins: {
        legend: {
          display: config.showLegend,
          position: config.legendPosition || 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              
              if (typeof context.parsed === 'object' && context.parsed.y !== undefined) {
                label += context.parsed.y.toLocaleString();
              } else if (typeof context.parsed === 'number') {
                label += context.parsed.toLocaleString();
              }
              
              return label;
            }
          }
        },
        datalabels: {
          display: config.showDataLabels,
          color: '#333',
          font: {
            weight: 'bold',
            size: config.fontSize || 12
          },
          formatter: (value: number) => value.toLocaleString()
        }
      }
    }
  };
  
  // Add specific options based on chart type
  if (chartType === 'bar' || chartType === 'line') {
    return {
      ...baseConfig,
      options: {
        ...baseConfig.options,
        scales: {
          y: {
            beginAtZero: config.beginAtZero !== undefined ? config.beginAtZero : true,
            stacked: config.stacked || false,
            title: {
              display: !!config.axisTitle,
              text: config.axisTitle || ''
            },
            grid: {
              display: config.showGridLines
            },
            ticks: {
              callback: function(value: any) {
                return value.toLocaleString();
              }
            }
          },
          x: {
            stacked: config.stacked || false,
            grid: {
              display: config.showGridLines
            }
          }
        }
      }
    };
  }
  
  // Pie/Doughnut chart specific options
  if (chartType === 'pie' || chartType === 'doughnut') {
    const chartConfig = { ...baseConfig };
    // Set cutout percentage for doughnut charts
    if (chartType === 'doughnut') {
      (chartConfig as any).options.cutout = '50%';
    }
    return chartConfig;
  }
  
  // Scatter/Bubble chart specific options
  if (chartType === 'scatter' || chartType === 'bubble') {
    return {
      ...baseConfig,
      options: {
        ...baseConfig.options,
        scales: {
          y: {
            beginAtZero: config.beginAtZero !== undefined ? config.beginAtZero : true,
            title: {
              display: !!config.axisTitle,
              text: config.axisTitle || ''
            },
            grid: {
              display: config.showGridLines
            },
            ticks: {
              callback: function(value: any) {
                return value.toLocaleString();
              }
            }
          },
          x: {
            grid: {
              display: config.showGridLines
            },
            ticks: {
              callback: function(value: any) {
                return value.toLocaleString();
              }
            }
          }
        }
      }
    };
  }
  
  // Radar and PolarArea chart options
  if (chartType === 'radar' || chartType === 'polarArea') {
    return {
      ...baseConfig,
      options: {
        ...baseConfig.options,
        scales: {
          r: {
            beginAtZero: config.beginAtZero !== undefined ? config.beginAtZero : true,
            ticks: {
              callback: function(value: any) {
                return value.toLocaleString();
              }
            }
          }
        }
      }
    };
  }
  
  return baseConfig;
}
