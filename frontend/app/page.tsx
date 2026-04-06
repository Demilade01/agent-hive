import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AgentMarketplace } from "@/components/landing/AgentMarketplace";
import { LiveNetworkSection } from "@/components/landing/LiveNetworkSection";
import { BlockchainTrust } from "@/components/landing/BlockchainTrust";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-950 text-foreground">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <Hero />

        {/* Stats Strip */}
        <StatsStrip />

        {/* How It Works */}
        <HowItWorks />

        {/* Agent Marketplace */}
        <AgentMarketplace />

        {/* Live Network Section */}
        <LiveNetworkSection />

        {/* Blockchain Trust */}
        <BlockchainTrust />

        {/* Final CTA */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
