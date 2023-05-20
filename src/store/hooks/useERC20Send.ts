// hooks/useERC20Transfer.ts
import { useState, useCallback } from "react";
import { ethers } from "ethers";
// import { useNotification } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";
import { useAccount, useSigner } from "wagmi";

function toWei(amount: string | number): ethers.BigNumber {
  const input = typeof amount === "number" ? amount.toString() : amount;
  const wei = ethers.BigNumber.from("1000000000000000000");
  const etherRegex = /^(\d+)?(\.\d+)?$/;

  // If the input amount is in ether format, multiply by the conversion factor
  if (etherRegex.test(input)) {
    return ethers.utils.parseEther(input);
  }

  // If the input amount is already in wei, return it as a BigNumber
  return ethers.BigNumber.from(input);
}

// chainID too
export function useERC20Transfer(
  //   signer: ethers.Signer,
  contractAddress,
  to,
  amount
  // title
) {
  const [isTransferring, setIsTransferring] = useState(false);
  //   const signer = useSigner();
  const { data: signer, error, isLoading, refetch } = useSigner();

  const { address: from } = useAccount();

  console.log(from, signer, "sginer account");
  //   const { notifications } = useNotification();

  const transferERC20 = useCallback(async () => {
    try {
      setIsTransferring(true);

      const provider = new ethers.providers.StaticJsonRpcProvider(
        "https://rpc.ankr.com/eth_goerli"
      );

      // Instantiate the contract
      const contractRead = new ethers.Contract(
        contractAddress,
        ERC20_ABI,
        provider
      );
      const contractCall = new ethers.Contract(
        contractAddress,
        ERC20_ABI,
        signer
      );

      console.log(contractCall, "contractss", signer);

      const amountInWei = toWei(amount);
      // Check balance
      const balance = await contractRead.balanceOf(from);

      if (balance.lt(amountInWei)) {
        notifications.show({
          title: "Insufficient balance",
          message: "You do not have enough tokens to complete this transfer.",
          color: "red",
        });
        return;
      }

      // // Check allowance
      // const allowance = await contract.allowance(from, to);
      // if (allowance.lt(amountInWei)) {
      //   notifications.show({
      //     title: "Insufficient allowance",
      //     message: "You need to approve a higher allowance for this transfer.",
      //     color: "red",
      //   });
      //   return;
      // }

      // Estimate gas
      const gasEstimate = await contractCall.estimateGas.transfer(
        from,
        to,
        amountInWei
      );

      console.log(gasEstimate, "gasEstimate");

      // Transfer the tokens
      const tx = await contractCall.transfer(to, amountInWei, {
        gasLimit: gasEstimate,
      });
      await tx.wait();

      // Show success notification
      notifications.show({
        title: "Transfer successful",
        message: "The tokens have been transferred successfully.",
        color: "green",
      });

      // ADD to analytics or DB
    } catch (error) {
      console.error(error, "eerror");
      notifications.show({
        title: "Transfer failed",
        message: "An error occurred while transferring the tokens.",
        color: "red",
      });
    } finally {
      setIsTransferring(false);
    }
  }, [signer, notifications]);

  return {
    loading: isTransferring,
    transferERC20,
  };
}

const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
] as any;
