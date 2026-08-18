const cleanDiscount = (input: string) => {
  if (input == null) return 0;
  const sanitized = String(input).replace(/[^0-9.]/g, '');
  const result = parseFloat(sanitized);
  return Number.isNaN(result) ? 0 : result;
};

export const lineDiscount = (
  quantity: number,
  unit_price_cent: number,
  itemDiscount: string
) => {
  const subtotal = quantity * unit_price_cent;
  const discount = itemDiscount.trim();

  let discountAmount: number;

  if (discount.includes('%')) {
    const percentageDiscount = cleanDiscount(discount);
    discountAmount = (subtotal * percentageDiscount) / 100;
  } else {
    discountAmount = parseFloat(discount) * quantity;
  }

  return ((discountAmount / 100) * 100) / 100;
};
