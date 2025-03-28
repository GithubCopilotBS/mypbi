import { CSVField } from '@shared/schema';

/**
 * Determines the field type based on name and value patterns
 */
export function determineFieldType(name: string, value: any): CSVField['type'] {
  const nameLower = name.toLowerCase();
  
  // Check for date fields first by name
  if (
    nameLower.includes('date') || 
    nameLower.includes('time') || 
    nameLower.includes('year') ||
    nameLower.includes('month') ||
    nameLower.includes('day')
  ) {
    return 'date';
  }
  
  // Check for numeric/measure fields
  if (
    typeof value === 'number' ||
    nameLower.includes('amount') ||
    nameLower.includes('price') ||
    nameLower.includes('cost') ||
    nameLower.includes('revenue') ||
    nameLower.includes('profit') ||
    nameLower.includes('sales') ||
    nameLower.includes('qty') ||
    nameLower.includes('quantity') ||
    nameLower.includes('count') ||
    nameLower.includes('total') ||
    nameLower.includes('sum') ||
    nameLower.includes('avg') ||
    nameLower.includes('average') ||
    nameLower.includes('min') ||
    nameLower.includes('max')
  ) {
    return 'measure';
  }
  
  // Default to dimension for categorical data
  return 'dimension';
}

/**
 * Filters fields by their type
 */
export function filterFieldsByType(fields: CSVField[], type: CSVField['type']): CSVField[] {
  return fields.filter(field => field.type === type);
}

/**
 * Gets a field's icon class based on its type
 */
export function getFieldIconClass(type: CSVField['type']): string {
  switch (type) {
    case 'dimension':
      return 'fas fa-tag text-blue-500';
    case 'measure':
      return 'fas fa-hashtag text-green-500';
    case 'date':
      return 'fas fa-calendar text-purple-500';
    default:
      return 'fas fa-question-circle text-gray-500';
  }
}

/**
 * Groups values in data by a specific field
 */
export function groupDataByField(data: any[], field: CSVField): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  
  data.forEach(row => {
    const key = String(row[field.name]);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(row);
  });
  
  return result;
}

/**
 * Formats a value based on field type for display
 */
export function formatFieldValue(value: any, field: CSVField): string {
  if (value === null || value === undefined) {
    return '—';
  }
  
  if (field.type === 'measure' && typeof value === 'number') {
    return value.toLocaleString();
  }
  
  if (field.type === 'date') {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    } catch (e) {
      // If date parsing fails, return as string
    }
  }
  
  return String(value);
}
