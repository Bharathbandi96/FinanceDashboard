'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/finance';
import { Download, FileText, Calendar, DollarSign, Tag } from 'lucide-react';

interface BillViewerDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillViewerDialog({ transaction, open, onOpenChange }: BillViewerDialogProps) {
  if (!transaction) return null;

  const downloadBill = () => {
    if (transaction.billImage && transaction.billFileName) {
      const link = document.createElement('a');
      link.href = transaction.billImage;
      link.download = transaction.billFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bill/Receipt Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Transaction Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Description:</span>
                <span>{transaction.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Amount:</span>
                <span className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)} {transaction.currency}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Date:</span>
                <span>{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Category:</span>
                <Badge variant="outline">{transaction.category}</Badge>
                <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                  {transaction.type}
                </Badge>
              </div>
            </div>
          </div>

          {/* Bill Image */}
          {transaction.billImage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Attached Bill/Receipt</h3>
                <Button
                  onClick={downloadBill}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 bg-white">
                <div className="mb-3">
                  <span className="text-sm text-gray-600">File: {transaction.billFileName}</span>
                </div>
                <div className="flex justify-center">
                  <img
                    src={transaction.billImage}
                    alt="Bill/Receipt"
                    className="max-w-full max-h-96 rounded-lg shadow-lg object-contain border"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}