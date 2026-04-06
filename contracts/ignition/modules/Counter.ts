import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ReputationRegistryModule", (m) => {
  const reputationRegistry = m.contract("ReputationRegistry");

  return { reputationRegistry };
});
