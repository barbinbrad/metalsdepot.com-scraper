export type Categories = Record<string, { name: string; url: string }[]>;

export type Product = {
  part: string;
  description: string;
  material: string;
  weight: string;
};

export type ProductWithCategory = Product & {
  category: string;
  subCategory: string;
};
