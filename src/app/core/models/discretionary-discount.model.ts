export interface DiscretionaryDiscount {
  discountId: number;
  validityTo: string;
  discountType: string;
  name: string;
  detail: string;
  limitPrice: number;
  discounts: Discount[];
  erpDiscountId: string;
  updatedTime: string;
}
export interface Discount {
  percentage: string;
  escaleQtyMin: number;
  escaleQtyMax: number;
}


