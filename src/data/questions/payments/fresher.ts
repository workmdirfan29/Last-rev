import { defineQuestions } from "../author"
import { q } from "../compact"

const RZ = "https://razorpay.com/docs"
const CHK = `${RZ}/payments/payment-gateway/web-integration/standard/build-integration/`
const WH = `${RZ}/webhooks/validate-test/`
const RF = `${RZ}/payments/refunds/`
const PAY = `${RZ}/payments/payments/`
const NODE = "https://nodejs.org/api/crypto.html"

export default defineQuestions("payments", "fresher", [
  q({
    slug: "online-payment-flow-overview",
    topic: "Payment flow & orders",
    d: "easy",
    title:
      "How does an online payment flow work between customer, merchant server and gateway?",
    kw: [
      "payment gateway",
      "payment flow",
      "order",
      "checkout",
      "server confirmation",
    ],
    intent:
      "A foundation question: checks you can describe who does what in a payment.",
    short:
      "The customer starts checkout in your app. Your server creates an order with the payment gateway for a specific amount, and the front end opens the gateway's hosted checkout with that order. The customer enters payment details directly into the gateway's form, so card data never touches your servers. The gateway talks to the bank, then reports the result to the browser and, more reliably, to your server through a webhook. Your server verifies the result and only then marks the order as paid and fulfils it.",
    detail: [
      "The server decides the amount and does all verification; the browser is not trusted.",
      "The gateway handles sensitive details and the bank communication.",
      "Never ship goods based only on the front end saying the payment succeeded.",
    ],
    ex: "In a shop, the server creates an order for the cart total, checkout opens, the customer pays by UPI, and a verified webhook marks the order as paid.",
    mistakes: [
      "Trusting the browser's success callback alone.",
      "Letting the client send the amount.",
    ],
    follow: ["Why must the server create the order?"],
    points: [
      "Server creates the order",
      "Gateway checkout collects payment details",
      "Server verifies the result",
      "Fulfil only after verification",
    ],
    notes: ["Create order, pay, verify, fulfil."],
    src: [
      ["Razorpay: Build integration", CHK],
      ["Razorpay: Payments", PAY],
    ],
  }),
  q({
    slug: "create-order-server-side",
    topic: "Payment flow & orders",
    d: "easy",
    title: "Why do you create an order on the server before taking a payment?",
    kw: ["orders api", "order_id", "server-side", "amount", "tamper"],
    intent:
      "Checks you understand the order as the trusted record of what is being paid for.",
    short:
      "An order is created with a server-side API call to the gateway, stating the amount, currency and your own receipt reference. The gateway returns an order id, which you pass to the checkout. That ties the payment to a specific order and amount and protects the request from tampering, because the customer cannot change the price in the browser. Razorpay's documentation says an order should be created for every payment, and that payments made without an `order_id` cannot be captured and are automatically refunded.",
    detail: [
      "The amount is expressed in the smallest currency unit, such as paise for INR.",
      "Compute the amount on the server from your own product data.",
      "Store the order id with your own order record so you can match them later.",
    ],
    ex: "The server reads the cart from the database, totals it, creates a gateway order for that amount and returns the order id to the page.",
    code: [
      [
        "Create an order (Node SDK)",
        "js",
        `import Razorpay from "razorpay"\n\nconst razorpay = new Razorpay({\n  key_id: process.env.RAZORPAY_KEY_ID,\n  key_secret: process.env.RAZORPAY_KEY_SECRET,\n})\n\nconst order = await razorpay.orders.create({\n  amount: 50000, // paise, so 500.00 INR\n  currency: "INR",\n  receipt: "order_rcpt_1001",\n})`,
        [
          "The server calls the Orders API with the secret key.",
          "The amount is in the smallest unit.",
          "`order.id` is passed to checkout.",
        ],
      ],
    ],
    mistakes: [
      "Taking the amount from the request body.",
      "Skipping the order and calling checkout directly.",
    ],
    follow: ["What happens to a payment with no order id?"],
    points: [
      "Server-side Orders API call",
      "Returns an order id for checkout",
      "Amount in smallest unit",
      "Ties payment to the order",
    ],
    notes: ["No order, no capture."],
    src: [
      ["Razorpay: Build integration (create an order)", CHK],
      ["Razorpay: Orders API", `${RZ}/api/orders/`],
    ],
  }),
  q({
    slug: "amounts-in-smallest-unit",
    topic: "Payment flow & orders",
    d: "easy",
    title:
      "Why are payment amounts sent in the smallest currency unit as integers?",
    kw: [
      "smallest currency unit",
      "paise",
      "integer money",
      "floating point",
      "currency",
    ],
    intent: "Checks you handle money without floating-point errors.",
    short:
      "Payment APIs expect amounts as integers in the currency's smallest unit, so ₹500.00 is sent as 50000 paise. Floating-point numbers cannot represent many decimal fractions exactly, so calculations like `0.1 + 0.2` produce rounding errors that are unacceptable for money. Store and calculate prices as integers (or a decimal type), convert only for display, and mind currencies with different decimal places: Razorpay's documentation notes zero-decimal currencies such as JPY and three-decimal currencies where the last digit must be 0.",
    detail: [
      "A common bug is multiplying a decimal price by 100 in floating point; round carefully.",
      "Keep the currency code alongside every amount.",
      "Apply discounts and taxes with defined rounding rules.",
    ],
    ex: "A cart total of ₹499.99 is stored as 49999 and sent to the gateway unchanged.",
    code: [
      [
        "Floating-point trap",
        "js",
        `0.1 + 0.2 // 0.30000000000000004\n\nconst rupees = 499.99\nconst paise = Math.round(rupees * 100) // 49999`,
        [
          "Binary floating point cannot store 0.1 exactly.",
          "Rounding after multiplying avoids off-by-one paise.",
        ],
      ],
    ],
    mistakes: [
      "Sending decimals such as 499.99 as the amount.",
      "Storing money in floats.",
    ],
    follow: ["What is a zero-decimal currency?"],
    points: [
      "Integers in the smallest unit",
      "Floats cause rounding errors",
      "Convert for display only",
      "Currency decimals vary",
    ],
    notes: ["Money is an integer."],
    src: [
      ["Razorpay: Build integration (amount parameter)", CHK],
      [
        "MDN: Number (floating point precision)",
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
      ],
    ],
  }),
  q({
    slug: "order-and-payment-states",
    topic: "Payment flow & orders",
    d: "medium",
    title: "What are the order and payment states in Razorpay?",
    kw: ["order status", "payment status", "created", "authorized", "captured"],
    intent:
      "Checks you know the lifecycle and which state means money is secured.",
    short:
      "An order starts as `created`, moves to `attempted` when a payment is first attempted, and becomes `paid` after a payment on it is captured. A payment is `created` when details are submitted, `authorized` when the bank has authenticated it and the money is deducted, `captured` when it is verified complete and will be settled, `failed` for an unsuccessful attempt, and `refunded` after a refund. Fulfil the order only when the payment is captured and the order is paid.",
    detail: [
      "Once an order is paid, no more payments are accepted on it, even if it is later refunded.",
      "An authorized payment that is not captured within three days is automatically refunded.",
      "A failed attempt can be retried on the same order.",
    ],
    ex: "A customer's first card attempt fails, the order stays attempted, the second attempt is captured, and the order becomes paid.",
    mistakes: [
      "Fulfilling on authorized without checking capture settings.",
      "Treating failed as final for the order.",
    ],
    follow: ["When does an order become paid?"],
    points: [
      "Order: created, attempted, paid",
      "Payment: created, authorized, captured, failed, refunded",
      "Fulfil on captured",
      "Unreleased authorizations are refunded",
    ],
    notes: ["Captured means secured."],
    src: [
      ["Razorpay: Build integration (order and payment states)", CHK],
      ["Razorpay: Payments (life cycle)", PAY],
    ],
  }),
  q({
    slug: "authorize-vs-capture",
    topic: "Payment flow & orders",
    d: "medium",
    title:
      "What is the difference between authorizing and capturing a payment?",
    kw: [
      "authorization",
      "capture",
      "auto-capture",
      "manual capture",
      "late authorization",
    ],
    intent: "Checks you know the two-step nature of card payments.",
    short:
      "Authorization means the bank has approved the payment and the amount is held or deducted from the customer. Capture confirms the payment as complete so it is settled to the merchant. By default Razorpay captures payments automatically once the customer completes them. A business can instead keep payments authorized and capture them manually later, but authorized payments that are not captured within three days are refunded automatically. Late authorization can also leave a payment authorized when the bank's response was delayed.",
    detail: [
      "Capture settings are configured on the Dashboard and apply to payments created through the Orders API.",
      "Auto-capture timeouts can be set, with a minimum of 12 minutes and a maximum of 3 days.",
      "Manual capture suits businesses that confirm stock or service before charging.",
    ],
    ex: "A shop auto-captures at once, while a made-to-order seller may authorize first and capture when the item ships.",
    mistakes: [
      "Forgetting that uncaptured payments are refunded.",
      "Assuming authorized always means settled.",
    ],
    follow: ["What is late authorization?"],
    points: [
      "Authorize: bank approves",
      "Capture: payment completed and settled",
      "Auto-capture by default",
      "Uncaptured payments refund after 3 days",
    ],
    notes: ["Approve, then capture."],
    src: [
      [
        "Razorpay: Capture settings",
        `${RZ}/payments/payments/capture-settings/`,
      ],
      ["Razorpay: Payments (life cycle)", PAY],
    ],
  }),
  q({
    slug: "idempotent-order-fulfilment",
    topic: "Payment flow & orders",
    d: "hard",
    title:
      "How do you make order fulfilment idempotent when you may be told about a payment twice?",
    kw: [
      "idempotency",
      "duplicate events",
      "fulfilment",
      "state machine",
      "unique constraint",
    ],
    intent: "Checks you prevent double shipping or double crediting.",
    short:
      "A payment can be reported more than once: by the browser callback, by a webhook, and by a webhook that the gateway delivers more than once. Fulfilment must therefore be safe to repeat. Store the payment id on your order with a unique constraint and move the order through explicit states, for example pending to paid, using a conditional update such as `UPDATE orders SET status = 'paid' WHERE id = ? AND status = 'pending'`. If no row changes, the work was already done and you skip it. Wrap related changes in a transaction.",
    detail: [
      "Record processed event ids to ignore duplicates.",
      "Make side effects such as emails and stock changes part of the same guarded step.",
      "Test by replaying the same event several times.",
    ],
    ex: "Two webhook deliveries arrive at the same moment; only one update changes the row from pending to paid, and stock is reduced once.",
    code: [
      [
        "Guarded state change",
        "sql",
        `UPDATE orders\nSET status = 'paid', payment_id = $2\nWHERE id = $1 AND status = 'pending';\n-- affected rows = 0 means it was already processed`,
        [
          "The condition on status makes the update run once.",
          "The row count tells you whether you did the work.",
        ],
      ],
    ],
    mistakes: [
      "Shipping on every notification.",
      "Check-then-update without a transaction or condition.",
    ],
    follow: ["How would you test this?"],
    points: [
      "Same payment may be reported several times",
      "Unique payment id",
      "Conditional state transition",
      "Transactional side effects",
    ],
    notes: ["Process once, ignore repeats."],
    src: [
      ["Razorpay: Validate and test webhooks (idempotency)", WH],
      [
        "PostgreSQL: UPDATE",
        "https://www.postgresql.org/docs/current/sql-update.html",
      ],
    ],
  }),
  q({
    slug: "settlement-after-capture",
    topic: "Payment flow & orders",
    d: "easy",
    title:
      "What is settlement, and why is a captured payment not yet money in your bank account?",
    kw: [
      "settlement",
      "settlement schedule",
      "captured payment",
      "reconciliation report",
      "payout",
    ],
    intent:
      "Checks you distinguish a successful payment from funds arriving in the account.",
    short:
      "When a payment is captured, the gateway has confirmed it as complete, but the money reaches the merchant's bank account later, according to the settlement schedule. Settlement is the transfer of captured funds, after fees, from the gateway to the merchant. So an order can be marked paid in your system while the funds are still in transit, and a refund reverses part of what will be or has been settled. Dashboard reports help match settlements to your orders for accounting.",
    detail: [
      "Your order status reflects the payment state, not the bank balance.",
      "Settlement reports list which payments and refunds are included.",
      "Finance teams reconcile settlements against orders using payment ids.",
    ],
    ex: "An order paid on Monday shows as paid immediately, but its funds appear in the bank account on the next settlement date.",
    mistakes: [
      "Assuming captured means the money is already in the bank.",
      "Ignoring refunds when matching settlements.",
    ],
    follow: ["Where would you see which payments a settlement covers?"],
    points: [
      "Capture confirms the payment",
      "Settlement transfers funds later",
      "Follows a schedule",
      "Reports match settlements to orders",
    ],
    notes: ["Captured is not yet in the bank."],
    src: [
      ["Razorpay: Payments (payment life cycle)", PAY],
      ["Razorpay: Refunds (reports)", RF],
    ],
  }),
  q({
    slug: "payment-methods-and-checkout",
    topic: "Razorpay integration",
    d: "easy",
    title: "Which payment methods can Checkout offer, and why offer several?",
    kw: ["payment methods", "upi", "netbanking", "cards", "wallet"],
    intent:
      "Checks you know why offering multiple methods helps conversion and resilience.",
    short:
      "Razorpay Checkout can offer several payment methods, including debit and credit cards, netbanking, UPI, wallets and EMI, with others such as cash on delivery, bank transfer or pay later available after approval. Offering several lets customers pay the way they prefer, and if one method has downtime, such as netbanking, they can complete the payment with another. The methods enabled for your account can be seen and requested on the Dashboard.",
    detail: [
      "Some methods are enabled by default, others need approval and sometimes extra integration.",
      "Different methods have different confirmation times and failure modes.",
      "Your code should treat all methods through the same order and verification flow.",
    ],
    ex: "A customer whose bank's netbanking is down switches to UPI and completes the same order.",
    mistakes: [
      "Assuming all methods confirm instantly.",
      "Special-casing each method in the verification logic.",
    ],
    follow: ["Where do you enable more methods?"],
    points: [
      "Cards, netbanking, UPI, wallets, EMI",
      "Some need approval",
      "Alternatives during downtime",
      "One order and verification flow",
    ],
    notes: ["More methods, more successful payments."],
    src: [
      ["Razorpay: Payment methods", `${RZ}/payments/payments/payment-methods/`],
    ],
  }),
  q({
    slug: "protecting-payment-endpoints",
    topic: "Payment flow & orders",
    d: "medium",
    title:
      "How do you protect your own order and payment endpoints from abuse?",
    kw: [
      "endpoint protection",
      "authentication",
      "rate limiting",
      "ownership check",
      "coupon abuse",
    ],
    intent: "Checks you apply general API security to the payment flow.",
    short:
      "Your endpoints that create orders and verify payments are valuable targets. Require authentication, and check that the cart and order belong to the signed-in user so one user cannot pay for or view another's order. Calculate the amount and validate discounts and coupons on the server. Rate limit order creation and verification to stop spam and probing, validate all inputs, never trust a client-supplied status or amount, and use HTTPS. Log payment events with ids for auditing, without logging secrets.",
    detail: [
      "A user who changes an order id in the request must not reach someone else's order.",
      "Limit how many unpaid orders one account can create.",
      "Keep the webhook route separate and protected by its signature, not by login.",
    ],
    ex: "The verify endpoint loads the order by id and user id, so another user's order id returns not found.",
    mistakes: [
      "Skipping ownership checks on order ids.",
      "Applying a coupon client-side only.",
    ],
    follow: ["Why is the webhook route not behind login?"],
    points: [
      "Authenticate and check ownership",
      "Server-side amounts and coupons",
      "Rate limit order creation",
      "Webhook protected by signature",
    ],
    notes: ["Same API security rules apply to payments."],
    src: [
      [
        "OWASP: REST Security Cheat Sheet",
        "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html",
      ],
      ["Razorpay: Build integration", CHK],
    ],
  }),
  q({
    slug: "razorpay-api-keys-test-live",
    topic: "Razorpay integration",
    d: "easy",
    title:
      "What are the Razorpay Key ID and Key Secret, and how do test and live modes differ?",
    kw: ["key id", "key secret", "test mode", "live mode", "secrets"],
    intent: "Checks you know which key goes where and keep the secret safe.",
    short:
      "An API key is a pair: the Key ID, which identifies your account and is passed to the front-end checkout, and the Key Secret, which acts like a password and must stay on the server only. The secret is shown only once when generated, so store it securely and never commit it to a repository or put it in front-end code. Test mode keys process simulated transactions and no real money moves; live mode keys accept real payments, so you swap to live keys when you go live.",
    detail: [
      "Keep both pairs in environment variables or a secrets manager, separate per environment.",
      "If a secret is exposed, regenerate the keys.",
      "Test card numbers and UPI details are provided for test mode.",
    ],
    ex: "The front end gets `RAZORPAY_KEY_ID` through config, while `RAZORPAY_KEY_SECRET` is read only by the Node server.",
    mistakes: [
      "Shipping the secret in front-end code.",
      "Forgetting to switch to live keys on launch.",
    ],
    follow: ["What do you do if the secret leaks?"],
    points: [
      "Key ID is public, Key Secret is private",
      "Secret only on the server",
      "Test mode is simulated",
      "Swap to live keys on go-live",
    ],
    notes: ["Secret never leaves the server."],
    src: [
      [
        "Razorpay: API keys",
        `${RZ}/payments/dashboard/account-settings/api-keys/`,
      ],
      [
        "Razorpay: Test card details",
        `${RZ}/payments/payments/test-card-details/`,
      ],
    ],
  }),
  q({
    slug: "razorpay-checkout-js-integration",
    topic: "Razorpay integration",
    d: "medium",
    title: "How do you open Razorpay Checkout from a web page?",
    kw: [
      "checkout.js",
      "Razorpay options",
      "handler function",
      "order_id",
      "payment.failed",
    ],
    intent: "Checks you can wire the front end to a server-created order.",
    short:
      "Load `https://checkout.razorpay.com/v1/checkout.js`, create the options object, and call `new Razorpay(options).open()` from a button click. The mandatory options include `key` (the Key ID), `amount`, `currency`, `name` and the `order_id` returned by your server. A `handler` function receives `razorpay_payment_id`, `razorpay_order_id` and `razorpay_signature` when the payment succeeds, and you listen for the `payment.failed` event to show errors. Send the three success values to your server for verification.",
    detail: [
      "`prefill` can fill the customer's name, email and phone to reduce friction.",
      "`callback_url` is for redirect flows; for standard web checkout the handler function is used.",
      "The `modal.ondismiss` callback tells you when the customer closes checkout.",
    ],
    ex: "A React page fetches the order from the server, then opens checkout and posts the response to `/api/payments/verify`.",
    code: [
      [
        "Open checkout",
        "js",
        `const options = {\n  key: RAZORPAY_KEY_ID,\n  amount: order.amount,\n  currency: order.currency,\n  name: "My Shop",\n  order_id: order.id,\n  handler: (response) => {\n    // response.razorpay_payment_id, razorpay_order_id, razorpay_signature\n    verifyOnServer(response)\n  },\n}\nconst rzp = new window.Razorpay(options)\nrzp.on("payment.failed", (res) => showError(res.error.description))\nrzp.open()`,
        [
          "`order_id` links checkout to the server's order.",
          "The handler runs on success.",
          "`payment.failed` handles failures.",
        ],
      ],
    ],
    mistakes: [
      "Using callback_url and handler together without understanding the difference.",
      "Treating the handler call as final proof of payment.",
    ],
    follow: ["What does the handler receive?"],
    points: [
      "Load checkout.js, create options, open",
      "order_id from the server",
      "handler gets payment id, order id, signature",
      "payment.failed for errors",
    ],
    notes: ["Options, open, handler, verify."],
    src: [["Razorpay: Build integration (checkout)", CHK]],
  }),
  q({
    slug: "verify-payment-signature",
    topic: "Razorpay integration",
    d: "medium",
    title: "How do you verify the payment signature returned by Checkout?",
    kw: [
      "razorpay_signature",
      "hmac sha256",
      "verify payment",
      "key secret",
      "tamper",
    ],
    intent:
      "Checks you can validate that the success data really came from the gateway.",
    short:
      'After a successful payment the front end gets `razorpay_payment_id`, `razorpay_order_id` and `razorpay_signature`. Razorpay\'s documentation says verifying the signature is a mandatory step. On your server, create an HMAC with SHA-256 using your Key Secret as the key and the string `order_id + "|" + razorpay_payment_id` as the message, as a hex digest, and compare it with `razorpay_signature`. Use the `order_id` stored on your server, not the one sent by the browser. If they match, the data is authentic; otherwise reject it.',
    detail: [
      "The SDKs include a helper that does this check.",
      "Compare signatures with a constant-time function.",
      "A valid signature proves authenticity; also confirm the amount and order belong to this user.",
    ],
    ex: "The verify endpoint rebuilds the signature from the stored order id and the payment id, and marks the order paid only on a match.",
    code: [
      [
        "Verify with Node crypto",
        "js",
        `import crypto from "node:crypto"\n\nfunction isValidPayment(orderId, paymentId, signature) {\n  const expected = crypto\n    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)\n    .update(\`\${orderId}|\${paymentId}\`)\n    .digest("hex")\n  const a = Buffer.from(expected)\n  const b = Buffer.from(signature)\n  return a.length === b.length && crypto.timingSafeEqual(a, b)\n}`,
        [
          "The message is `order_id|payment_id`.",
          "HMAC-SHA256 with the secret key.",
          "Constant-time comparison.",
        ],
      ],
    ],
    mistakes: [
      "Using the order id sent by the client.",
      "Skipping verification because the handler said success.",
    ],
    follow: ["Why use a constant-time comparison?"],
    points: [
      "HMAC-SHA256 of order_id|payment_id",
      "Key Secret is the key",
      "Use your stored order id",
      "Mandatory step",
    ],
    notes: ["Rebuild the signature on the server."],
    src: [
      ["Razorpay: Build integration (verify payment signature)", CHK],
      [
        "Node.js: crypto.createHmac",
        `${NODE}#cryptocreatehmacalgorithm-key-options`,
      ],
      ["Node.js: crypto.timingSafeEqual", `${NODE}#cryptotimingsafeequala-b`],
    ],
  }),
  q({
    slug: "callback-handler-vs-webhook",
    topic: "Razorpay integration",
    d: "medium",
    title:
      "Why shouldn't you rely only on the front-end handler to confirm a payment?",
    kw: [
      "handler",
      "webhook",
      "server confirmation",
      "closed tab",
      "source of truth",
    ],
    intent: "Checks you know why webhooks are the dependable confirmation.",
    short:
      "The handler runs in the customer's browser, so it can be missed: the user may close the tab, lose connectivity or the page may crash right after paying, and a malicious user can also fake calls to your server. The gateway's webhook is a server-to-server notification, so it reaches you whether or not the browser completed, and it can be authenticated by its signature. Use the handler for a fast user experience and the verified webhook, plus the gateway's API for reconciliation, as the source of truth for marking orders paid.",
    detail: [
      "Razorpay's documentation says to use the handler for client-side completion and webhooks for server-side confirmation.",
      "Both paths should lead to the same idempotent update.",
      "A periodic reconciliation job can fetch payments for orders still pending.",
    ],
    ex: "A customer pays and their phone loses signal; the webhook still marks the order paid, and the page shows it on the next load.",
    mistakes: [
      "Marking paid only in the handler path.",
      "Not handling a webhook that arrives before the handler.",
    ],
    follow: ["What is a reconciliation job?"],
    points: [
      "Browser can fail or be faked",
      "Webhook is server-to-server",
      "Both lead to one idempotent update",
      "Reconcile pending orders",
    ],
    notes: ["The webhook is the safety net."],
    src: [
      ["Razorpay: Build integration (handler vs callback)", CHK],
      ["Razorpay: Webhooks", `${RZ}/webhooks/`],
    ],
  }),
  q({
    slug: "payment-ui-states-in-react",
    topic: "Razorpay integration",
    d: "medium",
    title: "How do you design the payment UI states in a React checkout page?",
    kw: [
      "checkout ux",
      "pending state",
      "double click",
      "error handling",
      "payment status polling",
    ],
    intent: "Checks you design the full journey, not only the happy path.",
    short:
      "Model the checkout as explicit states: idle, creating the order, checkout open, verifying, paid, failed and cancelled. Disable the Pay button while an order is being created so it cannot be clicked twice, handle the `payment.failed` event and the modal dismissal with a retry option, and after success show a 'verifying your payment' state until the server confirms. If the final status is not yet known, poll your own backend for the order status rather than assuming success, and give the user a reference number.",
    detail: [
      "A reusable `useCheckout` hook can hold the state machine.",
      "Never display success only because the handler fired.",
      "Show clear messages for failed, cancelled and pending outcomes.",
    ],
    ex: "After paying, the page shows 'Confirming your payment...' and polls `/api/orders/1001/status` until it returns paid or failed.",
    mistakes: [
      "No pending state after the handler.",
      "Allowing duplicate order creation by double clicks.",
    ],
    follow: ["What do you show if confirmation takes a long time?"],
    points: [
      "Explicit state machine",
      "Disable the button while busy",
      "Handle failed and dismissed",
      "Confirm with the backend",
    ],
    notes: ["Design for failed, cancelled and pending."],
    src: [
      ["Razorpay: Build integration", CHK],
      [
        "React: Choosing the state structure",
        "https://react.dev/learn/choosing-the-state-structure",
      ],
    ],
  }),
  q({
    slug: "payment-security-and-pci",
    topic: "Razorpay integration",
    d: "medium",
    title: "How does using a hosted checkout reduce your security burden?",
    kw: [
      "pci dss",
      "hosted checkout",
      "card data",
      "tokenization",
      "compliance",
    ],
    intent: "Checks you know why card details should never reach your server.",
    short:
      "With a hosted or embedded checkout, the customer types card, UPI or bank details into the gateway's form, so your servers and logs never see sensitive card data. This greatly reduces the security and compliance scope you carry, compared with handling card numbers yourself. You still must protect your own part: keep the secret key and webhook secret on the server, compute amounts server-side, verify signatures, use HTTPS, and avoid logging payment secrets or personal details.",
    detail: [
      "Do not store card numbers, CVV or other sensitive authentication data.",
      "Store only gateway identifiers such as payment and order ids.",
      "Limit access to the dashboard and rotate keys when staff leave.",
    ],
    ex: "The shop's database contains order ids and payment ids, never card numbers.",
    mistakes: [
      "Building your own card form.",
      "Logging full request payloads that include customer details.",
    ],
    follow: ["What data is safe to store?"],
    points: [
      "Card data goes to the gateway",
      "Smaller compliance scope",
      "Server keeps keys and verifies",
      "Store ids only",
    ],
    notes: ["Never touch raw card data."],
    src: [
      ["Razorpay: Payments overview", PAY],
      [
        "Razorpay: API keys",
        `${RZ}/payments/dashboard/account-settings/api-keys/`,
      ],
    ],
  }),
  q({
    slug: "what-are-payment-webhooks",
    topic: "Webhooks & signature verification",
    d: "easy",
    title: "What is a webhook and why do payment systems use them?",
    kw: [
      "webhook",
      "event notification",
      "push",
      "polling",
      "payment.captured",
    ],
    intent:
      "A core concept: checks you know push notifications from the gateway.",
    short:
      "A webhook is an HTTP callback: when an event occurs, such as `payment.captured` or `refund.processed`, the gateway sends an HTTP POST with the event data to a URL you registered. Compared with polling the API, it is push-based, near real-time and efficient. Payment systems use it because the final result of a payment may arrive after the customer has left your site. Your endpoint must be publicly reachable over HTTPS, verify the sender, process the event, and respond quickly.",
    detail: [
      "Razorpay distinguishes webhooks from the checkout `callback_url`; they are different mechanisms.",
      "You subscribe to the specific events you need.",
      "Test mode has its own webhook configuration.",
    ],
    ex: "A `payment.captured` event arrives at `/webhooks/razorpay`, and the handler marks the matching order as paid.",
    mistakes: [
      "Confusing webhooks with callback_url.",
      "Subscribing to every event without handling them.",
    ],
    follow: ["How is a webhook different from polling?"],
    points: [
      "Server-to-server HTTP POST",
      "Event-driven, push-based",
      "Registered URL and event list",
      "Verify before trusting",
    ],
    notes: ["The gateway calls you."],
    src: [
      ["Razorpay: Webhooks", `${RZ}/webhooks/`],
      ["Razorpay: Payment webhooks", `${RZ}/webhooks/payments/`],
    ],
  }),
  q({
    slug: "webhook-signature-verification",
    topic: "Webhooks & signature verification",
    d: "medium",
    title: "How do you verify a Razorpay webhook signature?",
    kw: [
      "x-razorpay-signature",
      "webhook secret",
      "hmac sha256",
      "raw body",
      "verify webhook",
    ],
    intent: "Checks you can authenticate incoming webhooks.",
    short:
      "When a webhook secret is set, Razorpay creates a hash signature for each payload and sends it in the `X-Razorpay-Signature` header. The signature is an HMAC with SHA-256, using your webhook secret as the key and the raw request body as the message. Compute the same HMAC on your server and compare it with the header; if they do not match, reject the request. The documentation stresses that you must use the raw body and must not parse or cast it before generating the signature.",
    detail: [
      "The webhook secret is set when you configure the webhook and is separate from the API key secret.",
      "If you change the webhook secret, retries of older events still carry signatures made with the old one.",
      "SDKs provide helper functions for the check.",
    ],
    ex: "The endpoint reads the raw bytes, verifies the signature, then parses JSON and handles the event.",
    code: [
      [
        "Verify a webhook",
        "js",
        `import crypto from "node:crypto"\n\napp.post("/webhooks/razorpay", express.raw({ type: "application/json" }), (req, res) => {\n  const expected = crypto\n    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)\n    .update(req.body) // raw Buffer\n    .digest("hex")\n  const received = req.get("x-razorpay-signature") ?? ""\n  const a = Buffer.from(expected)\n  const b = Buffer.from(received)\n  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {\n    return res.sendStatus(400)\n  }\n  const event = JSON.parse(req.body.toString("utf8"))\n  // handle the event\n  res.sendStatus(200)\n})`,
        [
          "`express.raw` keeps the body as bytes.",
          "The HMAC is computed over the raw body.",
          "Only then is the JSON parsed.",
        ],
      ],
    ],
    mistakes: [
      "Verifying a re-serialised JSON body.",
      "Putting express.json() before the webhook route and losing the raw body.",
    ],
    follow: ["Why must the raw body be used?"],
    points: [
      "X-Razorpay-Signature header",
      "HMAC-SHA256 with the webhook secret",
      "Raw body, not parsed",
      "Reject mismatches",
    ],
    notes: ["Raw body in, signature out."],
    src: [
      ["Razorpay: Validate and test webhooks", WH],
      ["Express: express.raw", "https://expressjs.com/en/api.html"],
    ],
  }),
  q({
    slug: "webhook-idempotency-duplicates",
    topic: "Webhooks & signature verification",
    d: "medium",
    title: "How do you handle duplicate webhook deliveries?",
    kw: [
      "x-razorpay-event-id",
      "duplicate webhook",
      "idempotency",
      "processed events",
      "at-least-once",
    ],
    intent: "Checks you know webhooks can be delivered more than once.",
    short:
      "Webhook systems typically deliver at least once, so the same event can arrive multiple times. Razorpay's documentation says the `x-razorpay-event-id` header is unique per event, so you can store the ids of events you have processed and ignore any you have seen. Combine that with an idempotent business update, so even if two copies are processed concurrently the order is only marked paid once. Respond successfully for duplicates so the sender stops retrying.",
    detail: [
      "A unique index on the event id in a table gives atomic de-duplication.",
      "Keep the stored ids for long enough to cover the retry window.",
      "Log duplicates to understand delivery behaviour.",
    ],
    ex: "The handler inserts the event id into `processed_events`; a unique violation means it was already handled.",
    code: [
      [
        "De-duplicate by event id",
        "js",
        `const eventId = req.get("x-razorpay-event-id")\ntry {\n  await db.query("INSERT INTO processed_events (id) VALUES ($1)", [eventId])\n} catch (e) {\n  if (e.code === "23505") return res.sendStatus(200) // already processed\n  throw e\n}`,
        [
          "The insert fails on a duplicate id.",
          "A duplicate is acknowledged without reprocessing.",
        ],
      ],
    ],
    mistakes: [
      "Doing the work before recording the event.",
      "No unique constraint, so races slip through.",
    ],
    follow: ["Which header identifies the event?"],
    points: [
      "Events may repeat",
      "x-razorpay-event-id is unique",
      "Store processed ids",
      "Idempotent business logic too",
    ],
    notes: ["See an event id once."],
    src: [["Razorpay: Validate and test webhooks (idempotency)", WH]],
  }),
  q({
    slug: "webhook-ordering-and-state",
    topic: "Webhooks & signature verification",
    d: "hard",
    title: "What if payment webhooks arrive out of order?",
    kw: [
      "webhook order",
      "payment.authorized",
      "payment.captured",
      "state machine",
      "out-of-order events",
    ],
    intent: "Checks you do not assume events arrive in a strict sequence.",
    short:
      "Razorpay's documentation says you should ideally receive webhooks in the order the events occurred, for example `payment.authorized` then `payment.captured`, but that order is not guaranteed, and your endpoint should not expect it. Design the handler around states instead of sequence: move an order forward only if the new state is later than the current one, never move backwards, and treat the highest state as final. If something looks inconsistent, fetch the current payment from the API rather than trusting arrival order.",
    detail: [
      "A late `authorized` event after `captured` should be ignored for state purposes.",
      "Store a monotonic status ranking in code.",
      "The API is the authority when events conflict.",
    ],
    ex: "A `payment.captured` event arrives before `payment.authorized`; the order is marked paid and the late authorized event is ignored.",
    mistakes: [
      "Assuming authorized always arrives first.",
      "Letting an older event overwrite a newer state.",
    ],
    follow: ["What do you do when events conflict?"],
    points: [
      "Order is not guaranteed",
      "Think in states, not sequence",
      "Never regress a state",
      "Fetch from the API when unsure",
    ],
    notes: ["States only move forward."],
    src: [["Razorpay: Validate and test webhooks (order of webhooks)", WH]],
  }),
  q({
    slug: "webhook-endpoint-design",
    topic: "Webhooks & signature verification",
    d: "medium",
    title: "How should a webhook endpoint be designed and tested locally?",
    kw: [
      "webhook endpoint",
      "public url",
      "tunnel",
      "test mode",
      "fast response",
    ],
    intent:
      "Checks you can build a reliable endpoint and test it during development.",
    short:
      "Design the endpoint to verify the signature first, record the event, enqueue any slow work such as emails or fulfilment for a background worker, and respond quickly with a 2xx status so the gateway knows it was received. The URL must be publicly reachable over HTTPS, so for local development you cannot use localhost directly; Razorpay's documentation suggests using a tunnel to your local app or a staging environment, and test events are triggered by transactions in test mode. Log the event ids and results for debugging.",
    detail: [
      "Some well-known tunnelling and request-capture domains are blocked by Razorpay for security, so check the current list.",
      "Keep handlers small and push heavy work to a queue.",
      "Use test mode and a staging deployment for end-to-end checks.",
    ],
    ex: "The endpoint returns 200 within milliseconds after saving the event, and a worker processes the order update.",
    mistakes: [
      "Doing slow work before responding.",
      "Testing only with hand-crafted payloads.",
    ],
    follow: ["Why can't you use localhost directly?"],
    points: [
      "Verify, record, enqueue, respond",
      "Public HTTPS URL",
      "Tunnel or staging for tests",
      "Test mode events",
    ],
    notes: ["Acknowledge fast, process later."],
    src: [
      ["Razorpay: Validate and test webhooks", WH],
      [
        "Razorpay: Set up payment webhooks",
        `${RZ}/webhooks/setup-edit-payments/`,
      ],
    ],
  }),
  q({
    slug: "payment-failure-handling",
    topic: "Failure & refund handling",
    d: "medium",
    title: "How do you handle failed or abandoned payments?",
    kw: [
      "payment failed",
      "retry",
      "abandoned checkout",
      "error codes",
      "order expiry",
    ],
    intent: "Checks you plan for payments that do not succeed.",
    short:
      "A failed payment attempt is marked `failed`, and the customer can retry; the order remains open until a payment on it is captured. The client receives a `payment.failed` event with an error code, description, source, step and reason that you can map to a friendly message. Do not mark the order as paid on failure, keep the cart and order so the customer can retry with another method, and clean up or expire orders that stay unpaid. Any amount debited for a failed payment is refunded to the customer by the gateway.",
    detail: [
      "Show actionable messages, such as trying another method, not raw error text.",
      "Handle the customer closing checkout with the dismiss callback.",
      "Reconcile stuck pending orders by fetching their status from the API.",
    ],
    ex: "A UPI timeout shows 'Your payment didn't go through. Try again or use another method', and the same order id is reused.",
    mistakes: [
      "Creating a new order for each retry without need.",
      "Leaving unpaid orders reserved forever.",
    ],
    follow: ["What happens to money debited on a failed payment?"],
    points: [
      "Failed attempts can be retried",
      "Map error details to friendly messages",
      "Order stays open until captured",
      "Expire and reconcile unpaid orders",
    ],
    notes: ["Failure is a normal path."],
    src: [
      ["Razorpay: Build integration (payment.failed)", CHK],
      ["Razorpay: Payments (failed state)", PAY],
    ],
  }),
  q({
    slug: "reconciliation-and-pending-payments",
    topic: "Failure & refund handling",
    d: "hard",
    title: "What is payment reconciliation and why is it needed?",
    kw: [
      "reconciliation",
      "pending orders",
      "late authorization",
      "fetch payment",
      "source of truth",
    ],
    intent:
      "Checks you know how to repair mismatches between your records and the gateway.",
    short:
      "Reconciliation compares your order records with the gateway's payment records and fixes differences. Mismatches arise from missed webhooks, a server outage during a callback, or late authorization, where the bank's response arrives after a delay and the gateway polls for it for up to three days. A scheduled job takes orders that are still pending after some minutes, fetches the order's payments from the gateway API, and updates your records using the same idempotent logic as webhooks. Dashboard reports help with accounting checks.",
    detail: [
      "The gateway's records are the authority on money movement.",
      "Alert when many orders stay pending.",
      "Keep gateway ids on your orders to make matching simple.",
    ],
    ex: "A job runs every 10 minutes for orders pending for over 15 minutes and asks the API whether they were paid.",
    mistakes: [
      "Relying only on webhooks with no repair path.",
      "Reconciliation that bypasses the idempotent update.",
    ],
    follow: ["What is late authorization?"],
    points: [
      "Compare your records with the gateway",
      "Fix missed events",
      "Poll the API for stuck orders",
      "Reuse idempotent update logic",
    ],
    notes: ["Trust, but reconcile."],
    src: [
      ["Razorpay: Payments (late authorization)", PAY],
      [
        "Razorpay: Capture settings",
        `${RZ}/payments/payments/capture-settings/`,
      ],
    ],
  }),
  q({
    slug: "refund-types-and-states",
    topic: "Failure & refund handling",
    d: "easy",
    title:
      "What types of refund exist and what states does a refund go through?",
    kw: [
      "refund",
      "normal refund",
      "instant refund",
      "refund states",
      "partial refund",
    ],
    intent: "Checks you know the refund options and timing.",
    short:
      "Refunds can be full or partial and only apply to captured payments. In Razorpay a normal refund reaches the customer in about 5 to 7 working days, an instant refund is processed almost immediately, and batch refunds handle many at once. A refund ends in the `processed` state, or `failed`, which can happen for example when a normal refund is attempted on a payment older than six months, or for bank-related reasons on instant refunds. Refunds go back to the original payment method.",
    detail: [
      "The order stays in the paid state even after a payment is refunded.",
      "Refund via the API with `POST /v1/payments/:id/refund` or from the Dashboard.",
      "Your own records should store refund id, amount and reason.",
    ],
    ex: "A customer cancels within a day, and the shop issues a full refund from the admin panel.",
    mistakes: [
      "Trying to refund an uncaptured payment.",
      "Telling the customer a refund is instant when it is a normal refund.",
    ],
    follow: ["Which payments can be refunded?"],
    points: [
      "Full or partial, on captured payments",
      "Normal 5-7 working days, instant is fast",
      "States: processed or failed",
      "Refunded to the original method",
    ],
    notes: ["Captured payments only."],
    src: [
      ["Razorpay: Refunds", RF],
      ["Razorpay: Refunds API", `${RZ}/api/refunds/`],
    ],
  }),
  q({
    slug: "issuing-refunds-via-api",
    topic: "Failure & refund handling",
    d: "medium",
    title: "How do you issue a refund safely from your backend?",
    kw: [
      "refund api",
      "partial refund",
      "idempotent refund",
      "authorization",
      "audit trail",
    ],
    intent:
      "Checks you apply authorization, validation and idempotency to refunds.",
    short:
      "Only authorised staff or the verified order owner under your rules should trigger a refund, so protect the endpoint with authentication and role checks. Validate that the payment is captured, that the amount does not exceed what remains refundable, and record who requested it and why. Call the refund API with the payment id and amount in the smallest unit. Razorpay offers an idempotent refund request so that retrying the same call does not create a duplicate, and you should also guard against double clicks in your own system. Update your order from the refund webhook.",
    detail: [
      "Keep an audit log of refund requests.",
      "Handle failures, for example insufficient balance, and tell the operator.",
      "Partial refunds need a running total of refunded amounts.",
    ],
    ex: "An admin refunds ₹200 of a ₹500 order; the system records a refund row and updates the order to partially refunded when the webhook arrives.",
    code: [
      [
        "Refund with the Node SDK",
        "js",
        `const refund = await razorpay.payments.refund(paymentId, {\n  amount: 20000, // paise\n  notes: { reason: "damaged item" },\n})`,
        [
          "The payment id identifies what to refund.",
          "The amount is in paise.",
          "Notes store the reason.",
        ],
      ],
    ],
    mistakes: [
      "No authorization on the refund endpoint.",
      "Refunding more than the captured amount.",
    ],
    follow: ["How do you avoid refunding twice?"],
    points: [
      "Protect with auth and roles",
      "Validate refundable amount",
      "Use the idempotent request",
      "Audit and update from webhook",
    ],
    notes: ["Authorise, validate, make idempotent."],
    src: [
      ["Razorpay: Refunds API", `${RZ}/api/refunds/`],
      ["Razorpay: Refunds", RF],
    ],
  }),
  q({
    slug: "customer-communication-and-records",
    topic: "Failure & refund handling",
    d: "easy",
    title: "What payment information should you store and show to users?",
    kw: [
      "payment records",
      "receipt",
      "audit trail",
      "payment id",
      "customer support",
    ],
    intent: "Checks you keep the right records for support and accounting.",
    short:
      "Store gateway identifiers (order id, payment id, refund id), the amount and currency, status with timestamps, the receipt reference, and which user and order they belong to. These make support, refunds, reconciliation and accounting possible. Show users a clear order status, their receipt or invoice, and a reference to quote to support, while not storing card details or secrets. Keep an append-only log of status changes, so you can explain what happened and when.",
    detail: [
      "Use your own receipt numbers to match records in both systems.",
      "Retain records for the period your accounting rules require.",
      "Mask any personal data in logs.",
    ],
    ex: "A support agent finds the order by payment id and sees every status change with its time.",
    mistakes: [
      "Storing too little to investigate a dispute.",
      "Logging sensitive data.",
    ],
    follow: ["Which ids link your order to the gateway?"],
    points: [
      "Store order, payment and refund ids",
      "Amounts, status and timestamps",
      "Append-only status history",
      "No card data",
    ],
    notes: ["Keep ids and history."],
    src: [
      ["Razorpay: Payments", PAY],
      ["Razorpay: Build integration", CHK],
    ],
  }),
  q({
    slug: "testing-payments-in-test-mode",
    topic: "Failure & refund handling",
    d: "easy",
    title: "How do you test a payment integration safely?",
    kw: [
      "test mode",
      "test cards",
      "failure scenarios",
      "webhook testing",
      "go-live checklist",
    ],
    intent: "Checks you test failure paths, not only successful payments.",
    short:
      "Use the gateway's test mode with test API keys, which process simulated transactions so no real money moves, and use the test card, UPI and netbanking details from the documentation. Test the full set of outcomes: success, failure, user cancellation, a closed tab after paying, duplicate and out-of-order webhooks, and refunds. Verify the signature checks reject tampered data. Before launch, switch to live keys and work through the go-live checklist.",
    detail: [
      "Test events for webhooks are triggered by transactions in test mode.",
      "Automated tests can mock the gateway client and replay recorded webhook payloads.",
      "Do a small real transaction in live mode after launch, then refund it.",
    ],
    ex: "The QA checklist includes paying with a failing test card, closing checkout midway and replaying the same webhook twice.",
    mistakes: [
      "Testing only the happy path.",
      "Going live without swapping the keys and webhook secret.",
    ],
    follow: ["Which scenarios beyond success should you test?"],
    points: [
      "Test keys and test instruments",
      "Cover failure, cancel and duplicate paths",
      "Verify signature rejection",
      "Go-live checklist",
    ],
    notes: ["Test the unhappy paths."],
    src: [
      [
        "Razorpay: Test card details",
        `${RZ}/payments/payments/test-card-details/`,
      ],
      ["Razorpay: Build integration (test and go-live)", CHK],
    ],
  }),
])
