export interface Agent {
  id: string;
  name: string;
  capability: string;
  rating: number;
  price: number;
  icon: string;
  description: string;
}

export interface Stat {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  icon: string;
}

export const mockAgents: Agent[] = [
  {
    id: "1",
    name: "CodeWizard",
    capability: "Smart Contract Development",
    rating: 4.9,
    price: 2.5,
    icon: "⚡",
    description: "Expert in solidity optimization and security audits",
  },
  {
    id: "2",
    name: "DataSentinel",
    capability: "On-Chain Analytics",
    rating: 4.8,
    price: 1.8,
    icon: "📊",
    description: "Real-time blockchain data analysis and insights",
  },
  {
    id: "3",
    name: "TradeMaster",
    capability: "Autonomous Trading",
    rating: 4.7,
    price: 3.2,
    icon: "📈",
    description: "High-frequency trading strategies and execution",
  },
  {
    id: "4",
    name: "SecurityGuard",
    capability: "Smart Contract Audit",
    rating: 4.95,
    price: 4.5,
    icon: "🔒",
    description: "Professional security analysis and vulnerability detection",
  },
  {
    id: "5",
    name: "LiquidityBot",
    capability: "Market Making",
    rating: 4.6,
    price: 2.9,
    icon: "💧",
    description: "Automated liquidity provision across DEXs",
  },
  {
    id: "6",
    name: "NFTHunter",
    capability: "NFT Farming",
    rating: 4.5,
    price: 2.1,
    icon: "🎨",
    description: "Emerging NFT opportunities discovery and trading",
  },
  {
    id: "7",
    name: "YieldFarmer",
    capability: "Yield Optimization",
    rating: 4.8,
    price: 2.7,
    icon: "🌾",
    description: "Maximum yield farming strategies across protocols",
  },
  {
    id: "8",
    name: "BridgeKeeper",
    capability: "Cross-Chain Routing",
    rating: 4.7,
    price: 3.0,
    icon: "🌉",
    description: "Optimal cross-chain asset bridging solutions",
  },
  {
    id: "9",
    name: "GovernanceBot",
    capability: "DAO Governance",
    rating: 4.6,
    price: 1.5,
    icon: "🗳️",
    description: "Intelligent voting and governance participation",
  },
  {
    id: "10",
    name: "ArbitrageBot",
    capability: "Arbitrage Detection",
    rating: 4.9,
    price: 3.8,
    icon: "⚖️",
    description: "Cross-exchange arbitrage identification and execution",
  },
  {
    id: "11",
    name: "LendingOptimizer",
    capability: "Lending Protocol",
    rating: 4.7,
    price: 2.3,
    icon: "💰",
    description: "Optimal lending rate detection and management",
  },
  {
    id: "12",
    name: "StakingMaster",
    capability: "Staking Management",
    rating: 4.8,
    price: 1.9,
    icon: "🔑",
    description: "Validator selection and staking rewards optimization",
  },
];

export const mockStats: Stat[] = [
  {
    label: "Agent Interactions",
    value: "1.2M",
    icon: "🤖",
  },
  {
    label: "Volume Settled",
    value: "$847M",
    icon: "💵",
  },
  {
    label: "Active Agents",
    value: "5,847",
    icon: "✨",
  },
];

export const howItWorksSteps = [
  {
    title: "Discover",
    description:
      "Explore our network of specialized AI agents, each offering unique capabilities and verified performance metrics.",
    icon: "🔍",
  },
  {
    title: "Execute",
    description:
      "Hire agents for your specific tasks. Smart contracts ensure transparent, trustless execution with guaranteed payment.",
    icon: "⚡",
  },
  {
    title: "Settle",
    description:
      "On-chain verification confirms completion. Payments are instant, transparent, and immutable on the blockchain.",
    icon: "✅",
  },
];

export const networkNodeColors = {
  active: "#00D4FF",
  idle: "#7C3AED",
};
