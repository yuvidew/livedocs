import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkClientProvider } from "@/components/provider/ClerkProvider";
import { RoomProviderComp } from "@/components/provider/RoomProvider";
import { Toaster } from "sonner";


const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LiveDocs",
  description: "All your documents in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className}  min-h-screen  antialiased`}
      >
        <ClerkClientProvider>
          <RoomProviderComp>

            {children}
            <Toaster />
          </RoomProviderComp>
        </ClerkClientProvider>
      </body>
    </html>
  );
}
