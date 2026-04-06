import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-ignition";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: "0.8.28",
  networks: {
    kiteTestnet: {
      type: "http",
      url: "https://rpc-testnet.gokite.ai/",
      accounts: process.env.KITE_PRIVATE_KEY ? [process.env.KITE_PRIVATE_KEY] : [],
    },
  },
});
