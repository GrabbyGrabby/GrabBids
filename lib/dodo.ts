import DodoPayments from 'dodopayments'

const apiKey = process.env.DODO_PAYMENTS_API_KEY
const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode'

export const dodo = new DodoPayments({
  bearerToken: apiKey || '',
  environment: environment,
})
