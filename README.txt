CARENEST WEBSITE REDESIGN
=========================

Files:
- index.html       Main website structure
- styles.css      Responsive visual design
- script.js       Cart + WhatsApp order flow
- assets/         The four supplied reference images and cropped logo

RUN LOCALLY
1. Extract the ZIP.
2. Open index.html in a modern browser.

BEFORE PUBLISHING
1. Open script.js.
2. Set STORE_CONFIG.whatsappNumber to the admin WhatsApp number in digits only,
   including the country code (for Indonesia, start with 62).
3. Set the confirmed product prices for pink and red.
4. Add the real Instagram, TikTok and YouTube URLs in STORE_CONFIG.social.
5. Confirm product names, contents, stock, materials and any water-resistance claims.
   The website intentionally avoids claiming features that are not confirmed.

SHOP FLOW
- Add to cart and change quantities.
- Checkout collects customer details.
- The order request opens WhatsApp with the order summary.
- This is not a payment gateway and does not save orders to a database.
  Admin confirms stock, shipping and final amount manually.

ASSETS
The supplied bag design, interior layout, CareNest logo source, and problem/customer
presentation images are included in assets/. The red product image currently uses a
color adjustment from the shared bag design reference; replace it with a final red
product photo/render if available.
