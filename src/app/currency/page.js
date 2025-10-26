"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function Currency() {
  const [amount, setAmount] = useState(0);
  const [currencyFrom, setCurrencyFrom] = useState('THB');
  const [currencyTo, setCurrencyTo] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = ['THB', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'AUD'];

  // ✅ ใช้ useCallback เพื่อป้องกัน useEffect เตือนเรื่อง dependency
  const fetchExchangeRate = useCallback(async () => {
    if (currencyFrom === currencyTo) {
      setExchangeRate(1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock exchange rates
      const mockRates = {
        'THB': { 'USD': 0.027, 'EUR': 0.025, 'GBP': 0.021, 'JPY': 4.1, 'CNY': 0.19, 'SGD': 0.036, 'AUD': 0.041 },
        'USD': { 'THB': 37.0, 'EUR': 0.92, 'GBP': 0.78, 'JPY': 151.5, 'CNY': 7.2, 'SGD': 1.35, 'AUD': 1.52 },
        'EUR': { 'THB': 40.2, 'USD': 1.09, 'GBP': 0.85, 'JPY': 165.0, 'CNY': 7.8, 'SGD': 1.47, 'AUD': 1.65 },
        'GBP': { 'THB': 47.3, 'USD': 1.28, 'EUR': 1.18, 'JPY': 194.0, 'CNY': 9.2, 'SGD': 1.73, 'AUD': 1.94 },
        'JPY': { 'THB': 0.24, 'USD': 0.0066, 'EUR': 0.0061, 'GBP': 0.0052, 'CNY': 0.048, 'SGD': 0.0089, 'AUD': 0.01 },
        'CNY': { 'THB': 5.1, 'USD': 0.14, 'EUR': 0.13, 'GBP': 0.11, 'JPY': 20.8, 'SGD': 0.19, 'AUD': 0.21 },
        'SGD': { 'THB': 27.8, 'USD': 0.74, 'EUR': 0.68, 'GBP': 0.58, 'JPY': 112.0, 'CNY': 5.3, 'AUD': 1.12 },
        'AUD': { 'THB': 24.8, 'USD': 0.66, 'EUR': 0.61, 'GBP': 0.52, 'JPY': 100.0, 'CNY': 4.7, 'SGD': 0.89 }
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay

      const rate = mockRates[currencyFrom]?.[currencyTo];
      if (rate) {
        setExchangeRate(rate);
      } else {
        throw new Error('ไม่พบอัตราแลกเปลี่ยนสำหรับสกุลเงินนี้');
      }
    } catch (error) {
      setError(error.message);
      setExchangeRate(null);
    } finally {
      setLoading(false);
    }
  }, [currencyFrom, currencyTo]);

  // ✅ ดึงอัตราแลกเปลี่ยนเมื่อ currencyFrom หรือ currencyTo เปลี่ยน
  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  // ✅ คำนวณผลลัพธ์เมื่อ amount หรือ exchangeRate เปลี่ยน
  useEffect(() => {
    if (exchangeRate) {
      setConvertedAmount(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  const handleRefresh = () => {
    setAmount(0);
    setCurrencyFrom('THB');
    setCurrencyTo('USD');
    setExchangeRate(null);
    setConvertedAmount(0);
    setError('');
    fetchExchangeRate();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50 flex-1 w-full" style={{ fontFamily: 'Noto Sans Thai, sans-serif' }}>
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#299D91]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-200"></div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#299D91] to-[#238A80] text-white p-6 text-center">
            <h1 className="text-xl font-bold">อัตราแลกเปลี่ยนเงิน</h1>
            <p className="text-sm text-white/80">แปลงสกุลเงินแบบเรียลไทม์</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r-lg flex items-start space-x-2 shadow-lg backdrop-blur-xl">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <p className="text-xs font-medium text-red-300">{error}</p>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">จำนวนเงิน</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#299D91] text-gray-700 font-medium"
                placeholder="เช่น 100"
              />
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">จาก</label>
                <select
                  value={currencyFrom}
                  onChange={(e) => setCurrencyFrom(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#299D91] text-gray-700"
                >
                  {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">เป็น</label>
                <select
                  value={currencyTo}
                  onChange={(e) => setCurrencyTo(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#299D91] text-gray-700"
                >
                  {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Exchange Rate */}
            {exchangeRate && (
              <div className="bg-gradient-to-r from-[#299D91]/10 to-[#238A80]/10 rounded-lg p-3 border border-[#299D91]/20">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">อัตราแลกเปลี่ยน</span>
                  <span className="font-bold text-[#299D91]">
                    1 {currencyFrom} = {exchangeRate.toFixed(4)} {currencyTo}
                  </span>
                </div>
              </div>
            )}

            {/* Result */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">ผลลัพธ์</label>
              <input
                type="text"
                value={loading ? 'กำลังโหลด...' : convertedAmount.toFixed(2)}
                readOnly
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 font-bold text-gray-700"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#299D91] to-[#238A80] text-white rounded-lg font-semibold text-sm shadow-lg hover:scale-105 transition-all disabled:bg-gray-400 disabled:shadow-none"
              >
                {loading ? 'กำลังโหลด...' : 'รีเฟรช'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-center font-semibold text-sm border-2 border-gray-200 hover:bg-gray-200"
              >
                กลับ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
