/**
 * Converts an object to FormData, handling nested objects and file uploads
 * @param data The object to convert to FormData
 * @param formData Optional existing FormData instance to append to
 * @param parentKey Optional parent key for nested objects
 * @returns FormData object with all data properly formatted
 */
export const toFormData = (
    data: Record<string, any>,
    formData: FormData = new FormData(),
    parentKey: string = ''
  ): FormData => {
    // Loop through all properties in the data object
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // Create the proper key format for nested objects
        const formKey = parentKey ? `${parentKey}[${key}]` : key;
        
        // Get the current value
        const value = data[key];
        
        // Handle different value types
        if (value === null || value === undefined) {
          // Skip null or undefined values
          continue;
        } else if (value instanceof File) {
          // Handle File objects directly
          formData.append(formKey, value);
        } else if (value instanceof Date) {
          // Convert Date objects to ISO string
          formData.append(formKey, value.toISOString());
        } else if (typeof value === 'object' && !(value instanceof Blob) && !(value instanceof File)) {
          // Handle nested objects recursively
          toFormData(value, formData, formKey);
        } else {
          // Handle primitive values (string, number, boolean)
          formData.append(formKey, String(value));
        }
      }
    }
    
    return formData;
  };
