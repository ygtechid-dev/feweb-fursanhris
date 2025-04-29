export const formatCurrency = (amount: string) => {
    if (!amount) return '-';
    try {
      const numAmount = parseFloat(amount);
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numAmount);
    } catch (e) {
      return amount;
    }
  };
