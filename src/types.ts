export interface FieldItem {
  displayOrder: number;
  fieldName: string;
  fieldType: string;
  label: string;
  
  fields?: FieldItem[]; 
  
  isRequired?: boolean;
  value?: any;
  fieldOptions?: string[];
  validationRule?: any;
  
  [key: string]: any; 
}