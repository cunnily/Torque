import * as dotenv from "dotenv";
import axios from "axios";
import { ethers } from "ethers";

dotenv.config();

export async function fetchGasPriceFromBlockNative(provider: ethers.JsonRpcProvider): Promise<{
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}> {
  // Get network info to determine chain ID
  const network = await provider.getNetwork();
  const chainId = network.chainId;

  const response = await axios.get(`https://api.blocknative.com/gasprices/blockprices?chainid=${chainId}`, {
    headers: {
      Authorization: process.env.BLOCKNATIVE_API,
    },
  });

  const blockPrices = response.data.blockPrices[0].estimatedPrices[0];

  if (!blockPrices) {
    throw new Error("Could not retrieve 99% confidence gas prices from BlockNative.");
  }

  return {
    maxFeePerGas: ethers.parseUnits(blockPrices.maxFeePerGas.toString(), "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits(blockPrices.maxPriorityFeePerGas.toString(), "gwei"),
  };
}
