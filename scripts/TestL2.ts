import {
  createPublicClient,
  http,
  createWalletClient,
  formatEther,
} from "viem";
import * as chains from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";
import { constants } from "../lib/constants";
dotenv.config();

async function main() {
  const chain = chains.polygonAmoy; // chains.polygonAmoy
  const CUSTOM_RPC_URL = chain === chains.polygonAmoy ? constants.integrations.alchemy.amoy : constants.integrations.alchemy.sepolia;
  const publicClient = createPublicClient({
    chain: chain,
    transport: http(CUSTOM_RPC_URL),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);
  const account = privateKeyToAccount(`0x${constants.account.deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: chain,
    transport: http(CUSTOM_RPC_URL),
  });
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
