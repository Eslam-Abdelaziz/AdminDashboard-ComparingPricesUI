// app/models/category.model.ts

// Define the Brand interface
export interface Brand {
  name_Local: string;
  name_Global: string;
  description_Local: string;
  description_Global: string;
  logo: string | null;
}

// Define the SubCategory interface
export interface SubCategory {
  name_Local: string;
  name_global: string;
}

// Define the Category interface
export interface Category {
  id: number;
  name_Local: string;
  name_Global: string;
  brands: Brand[];
  subCategories: SubCategory[];
}