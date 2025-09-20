'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencies, convertCurrency, formatCurrency } from '@/lib/currency';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = () => {
    setIsLoading(true);
    setTimeout(() => {
      const numAmount = parseFloat(amount) || 0;
      const result = convertCurrency(numAmount, fromCurrency, toCurrency);
      setConvertedAmount(result);
      setIsLoading(false);
    }, 500);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    if (amount) {
      handleConvert();
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <div className="flex gap-2">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{currency.symbol}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground">- {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="hover:bg-blue-50"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Converted Amount</div>
            <div className="text-2xl font-bold text-blue-600">
              {isLoading ? (
                'Converting...'
              ) : (
                formatCurrency(convertedAmount, toCurrency)
              )}
            </div>
            {!isLoading && amount && (
              <div className="text-sm text-muted-foreground mt-2">
                {formatCurrency(parseFloat(amount) || 0, fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          * Exchange rates are simulated for demo purposes
        </div>
      </CardContent>
    </Card>
  );
}