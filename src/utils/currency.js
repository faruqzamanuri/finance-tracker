const DEFAULT_CURRENCY_OPTIONS = {
  currency: 'MYR',
  locale: 'en-MY',
}

export const getCurrencyOptions = () => DEFAULT_CURRENCY_OPTIONS

export const formatCurrency = (value, options = {}) => {
  const { currency, locale } = { ...DEFAULT_CURRENCY_OPTIONS, ...options }
  const amount = Number(value) || 0
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  const parts = formatter.formatToParts(amount)
  const currencyPart = parts.find((part) => part.type === 'currency')?.value
  const numberPart = parts
    .filter((part) => part.type !== 'currency' && part.type !== 'literal')
    .map((part) => part.value)
    .join('')

  return currencyPart ? `${currencyPart} ${numberPart}` : formatter.format(amount)
}
