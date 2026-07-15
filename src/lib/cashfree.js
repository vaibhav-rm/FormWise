/**
 * Cashfree Payments Web SDK Integration Helper
 */

// Dynamically inject the Cashfree script tag
export const loadCashfreeSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve(window.Cashfree);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      if (window.Cashfree) {
        resolve(window.Cashfree);
      } else {
        reject(new Error("Cashfree SDK loaded but object is not available on window."));
      }
    };
    script.onerror = (err) => {
      reject(new Error("Failed to load Cashfree SDK script: " + err.message));
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates the standard Cashfree Checkout flow using the SDK.
 * Expects a valid paymentSessionId generated from backend order creation.
 */
export const initiateCashfreeCheckout = async ({ paymentSessionId, isSandbox = true }) => {
  try {
    const Cashfree = await loadCashfreeSDK();
    const mode = isSandbox ? "sandbox" : "production";
    const cashfreeInstance = Cashfree({ mode });
    
    return cashfreeInstance.checkout({
      paymentSessionId,
      redirectTarget: "_self"
    });
  } catch (error) {
    console.error("Error in Cashfree checkout initialization:", error);
    throw error;
  }
};

/**
 * Mock payment order creator to simulate backend order initiation.
 */
export const createMockPaymentSession = async (planId, amount) => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1200));
  
  // Return a mock session details structure
  return {
    order_id: `order_fw_${Math.random().toString(36).substr(2, 9)}`,
    payment_session_id: `session_cf_${Math.random().toString(36).substr(2, 16)}`,
    order_amount: amount,
    order_currency: "INR",
    plan_id: planId
  };
};
