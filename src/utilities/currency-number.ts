export const currencyNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    if (typeof Intl == "object" &&
        Intl &&
        typeof Intl.NumberFormat == "function") {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            ...options,
        }).format(value);
    }
    return value.toString();
};