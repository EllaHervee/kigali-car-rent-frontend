# Putting Kigali Car Rent online

This site is plain HTML, CSS and JavaScript, so any static hosting service can serve it. No build step is needed.
Check each service's current free-plan terms before you choose.

## Option 1 - Netlify (drag and drop)
1. Unzip kigali-car-rent.zip so you have the kigali-car-rent folder.
2. Create or log in to an account at netlify.com.
3. Add a new site and choose the manual deploy / drag-and-drop option.
4. Drag the whole kigali-car-rent folder (the one that contains index.html) onto the page.
5. Netlify gives you a web address. Open it to check the site.

## Option 2 - GitHub Pages
1. Create a repository on github.com and upload everything inside the kigali-car-rent folder (index.html must be at the top level).
2. Open the repository Settings, then Pages.
3. Choose to deploy from the main branch, root folder, and save.
4. After a minute or two the site is available at the address GitHub shows.

## Option 3 - Cloudflare Pages
1. Create an account at cloudflare.com and open Pages.
2. Choose direct upload and upload the kigali-car-rent folder.

## Your own web address
Buy a domain name from a domain registrar, then open your hosting service's domain settings and follow its steps to connect the domain. The registrar and the host both show the records you need to enter.

## Before you take real customers
The site keeps bookings, payments, accounts, chat and notifications in each visitor's own browser only. To make it real you need:
- a backend and database, so the owner can see every customer's bookings, payments and chats;
- real MTN Mobile Money and Airtel Money payments through their business APIs or a payment service;
- server-side login instead of the browser-only demo login;
- your real car prices, specs, address and social media links.
