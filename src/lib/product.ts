export type StockStatus = 'inStock' | 'lowStock' | 'outOfStock' | 'preOrder';

export function stockStatus(p: {
  preOrder: boolean;
  stockOnHand: number;
  stockReserved: number;
  lowStockThreshold: number;
}): StockStatus {
  if (p.preOrder) return 'preOrder';
  const available = p.stockOnHand - p.stockReserved;
  if (available <= 0) return 'outOfStock';
  if (available <= p.lowStockThreshold) return 'lowStock';
  return 'inStock';
}

export const STOCK_BADGE_CLASS: Record<StockStatus, string> = {
  inStock: 'bg-success/15 text-success',
  lowStock: 'bg-warning/15 text-warning',
  outOfStock: 'bg-muted text-muted-foreground',
  preOrder: 'bg-accent/15 text-accent',
};
