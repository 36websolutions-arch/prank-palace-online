// Google Analytics 4 Event Tracking

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Track sign-up attempt
export function trackSignUpAttempt() {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'sign_up_attempt', {});
  }
}

// Track successful sign-up
export function trackSignUpSuccess() {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'sign_up_success', { method: 'email' });
  }
}

// Track failed sign-up
export function trackSignUpFailure(errorMessage: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'sign_up_failure', { error_message: errorMessage });
  }
}

// Track add to cart / buy button click
export function trackAddToCart(productName: string, productPrice: number) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: productPrice,
      items: [{
        item_name: productName,
        price: productPrice
      }]
    });
  }
}

// Track purchase completion
export function trackPurchase(
  transactionId: string,
  totalValue: number,
  items: Array<{ item_name: string; price: number }>
) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: totalValue,
      currency: 'USD',
      items: items
    });
  }
}
