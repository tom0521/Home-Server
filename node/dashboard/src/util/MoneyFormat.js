const MoneyFormat = (maximumFractionDigits) => {
    return Intl.NumberFormat('en-US', {
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: maximumFractionDigits
    }).format;
};

export default MoneyFormat;
