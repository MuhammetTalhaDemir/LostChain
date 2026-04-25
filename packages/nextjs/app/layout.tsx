import "@rainbow-me/rainbowkit/styles.css";
import "@scaffold-ui/components/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "LostChain | Erciyes Portal",
  description: "Erciyes Üniversitesi Şeffaf Kayıp Eşya Portalı",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning data-theme="light"><body className="bg-white"><ThemeProvider forcedTheme="light" enableSystem={false}><ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders></ThemeProvider></body></html>
  );
};

export default ScaffoldEthApp;
