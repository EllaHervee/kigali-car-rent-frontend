# Kigali Car Rent

Open the folder in VS Code, install the "Live Server" extension, then right-click index.html and choose "Open with Live Server".

- index.html : page structure and text (Home, Payment, Chat, Contact and My account are separate views, switched from the top menu). The footer has the location and the Facebook, Instagram and X links - replace them with your own profile addresses.
- css/style.css : colours (see :root at the top), layout, fonts and the moving hero background (.bgslides)
- js/app.js : the car list (var C), prices, booking, payment, login, notifications, chat, admin dashboard, search, categories, language (English, French, Kinyarwanda) and the hero slideshow
- images/ : car photos, logo, MTN, Airtel and WhatsApp logos

Login: customers use phone number + password and land on their account page. The owner types the admin password in the same window (created the first time by leaving the phone empty) and lands on the admin dashboard.
Chat: shown in the menu only after a customer logs in. It answers common questions automatically. The owner can reply from the dashboard (Chats tab).
Car prices, specs, logins, chat and the payment code step are demos. Data is saved in the browser only. No real payment is made.

See HOSTING.md to put the site online.

## What is in this folder
- index.html, css/, js/, images/ : the website, split into normal files (use this for VS Code and hosting).
- single-file/kigali-car-rent.html : the same website in ONE file (everything inside it). Double-click it to open in a browser.
- HOSTING.md : how to put the site online.
