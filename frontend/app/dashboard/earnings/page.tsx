'use client';

import React, { useEffect, useState } from 'react';
import { paymentApi } from '@/lib/api';
import { useWallet } from '@/lib/wallet-context';
import { toast } from '@/lib/toast-service';
import { Loader, TrendingUp, DollarSign } from 'lucide-react';
import { PaymentRowSkeleton } from '@/components/ui/skeletons';

interface Payment {
  id: string;
  agentId: string;
  taskId: string;
  amount: string;
  status: string;
  kiteTransactionHash?: string;
  createdAt?: string;
}

export default function EarningsPage() {
  const { address, userId } = useWallet();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await paymentApi.getPaymentHistory(userId);
        setPayments(response as Payment[]);
      } catch (err: any) {
        toast.error('Failed to fetch payment history', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userId]);

  // Calculate stats
  const totalEarnings = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (parseFloat(p.amount) / 1e18), 0); // Convert from wei

  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + (parseFloat(p.amount) / 1e18), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-300 border-green-500/30';
      case 'pending':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/10 text-red-300 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  const formatAmount = (wei: string) => {
    const usdcAmount = parseFloat(wei) / 1e18;
    return usdcAmount.toFixed(4);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Earnings</h1>
        <p className="mt-2 text-slate-400">
          Track your payments and transaction history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/20 backdrop-blur p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Earned</p>
              <p className="text-3xl font-bold text-cyan-300 mt-2">
                {totalEarnings.toFixed(4)} USDC
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-cyan-400 opacity-50" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/20 backdrop-blur p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Pending</p>
              <p className="text-3xl font-bold text-yellow-300 mt-2">
                {pendingAmount.toFixed(4)} USDC
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-400 opacity-50" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-800/20 backdrop-blur p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Transactions</p>
              <p className="text-3xl font-bold text-violet-300 mt-2">
                {payments.length}
              </p>
            </div>
            <Loader className="h-8 w-8 text-violet-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Error Alert Removed - Using toast notifications instead */}

      {/* Loading State */}
      {loading && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                <PaymentRowSkeleton />
                <PaymentRowSkeleton />
                <PaymentRowSkeleton />
                <PaymentRowSkeleton />
                <PaymentRowSkeleton />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && payments.length === 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur p-12 text-center">
          <DollarSign className="h-12 w-12 text-slate-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-300">No payments yet</h3>
          <p className="mt-2 text-slate-400 text-sm">
            Complete tasks to earn payments. Check back soon!
          </p>
        </div>
      )}

      {/* Transactions Table */}
      {!loading && payments.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 backdrop-blur overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Task ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Agent ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    TX Hash
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                      {payment.taskId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                      {payment.agentId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-cyan-300">
                      {formatAmount(payment.amount)} USDC
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {payment.kiteTransactionHash ? (
                        <a
                          href={`https://explorer.testnet.gokite.io/tx/${payment.kiteTransactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 font-mono text-xs underline"
                        >
                          {payment.kiteTransactionHash.slice(0, 8)}...
                        </a>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
