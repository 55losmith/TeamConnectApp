// src/entities/Payment.js
/**
 * Payment model
 * @typedef {Object} Payment
 * @property {string|null} id
 * @property {number} amount
 * @property {string|null} currency
 * @property {string|null} payerId
 * @property {string|null} status - 'pending'|'completed'|'failed'
 * @property {string|null} createdAt - ISO
 */

export const PaymentDefaults = {
  id: null,
  amount: 0,
  currency: 'USD',
  payerId: null,
  status: 'pending',
  createdAt: null
};

export function createPayment(data = {}) {
  return { ...PaymentDefaults, ...data };
}
