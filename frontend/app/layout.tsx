import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kigali Car Rent",
  description: "Book your car rental in Kigali, Rwanda.",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
