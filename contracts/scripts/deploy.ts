import { network } from "hardhat";

async function main() {
  console.log("🚀 Deploying ReputationRegistry to Kite testnet...\n");

  const { ethers, networkName } = await network.connect();
  console.log(`📍 Network: ${networkName}\n`);

  // Deploy contract
  const registry = await ethers.deployContract("ReputationRegistry");

  console.log("⏳ Waiting for the deployment tx to confirm");
  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log(`✅ ReputationRegistry deployed successfully!`);
  console.log(`\n📋 Deployment Details:`);
  console.log(`   Address: ${address}`);
  console.log(`   Network: ${networkName}`);

  console.log(`\n🔗 Verify on Block Explorer:`);
  console.log(`   https://testnet.kitescan.io/address/${address}`);

  console.log(`\n💾 Save this address in your .env:`);
  console.log(`   REPUTATION_REGISTRY_ADDRESS=${address}`);

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });