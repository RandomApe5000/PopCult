import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { CHAIN, CONTRACT_ADDRESS, USDC_ADDRESS } from "../config";
import usdcInterface from "../data/usdcAbi";
import popcultInterface from "../data/popcultAbi";
import { useMemo, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import getETHError from "../utils/getETHError";

const usdcConfig = {
  addressOrName: USDC_ADDRESS,
  contractInterface: usdcInterface,
};

const popcultConfig = {
  addressOrName: CONTRACT_ADDRESS,
  contractInterface: popcultInterface,
};

const useMint = () => {
  const account = useAccount();
  const { chain } = useNetwork();

  const [buttonText, setButtonText] = useState("Mint now");
  const [isDisabled, setIsDisabled] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"eth" | "usdc">("eth");

  const [txId, setTxId] = useState<string>("");

  // USDC Calls
  const { refetch: fetchAllowance } = useContractRead({
    ...usdcConfig,
    functionName: "allowance",
    enabled: false,
    args: [account.address, CONTRACT_ADDRESS],
  });
  const { writeAsync: approveUSDC } = useContractWrite({
    ...usdcConfig,
    functionName: "approve",
    mode: "recklesslyUnprepared",
    args: [CONTRACT_ADDRESS, "0xffffffffffffffffffffffffffffffffffffffff"],
  });

  // Contract Calls
  const { data: maxSupply } = useContractRead({
    ...popcultConfig,
    functionName: "maxSupply",
  });
  const { data: totalSupply } = useContractRead({
    ...popcultConfig,
    functionName: "totalSupply",
  });

  const { data: isPublicSaleOpen } = useContractRead({
    ...popcultConfig,
    functionName: "isPublicSaleOpen",
  });
  const { data: isWhitelistSaleOpen } = useContractRead({
    ...popcultConfig,
    functionName: "isWhitelistSaleOpen",
  });

  const { refetch: fetchPublicEtherCost, data: publicEtherCost } =
    useContractRead({
      ...popcultConfig,
      functionName: "publicEtherCost",
      enabled: false,
    });
  const { refetch: fetchPublicUSDCCost, data: publicUSDCCost } =
    useContractRead({
      ...popcultConfig,
      functionName: "publicUSDCCost",
      enabled: false,
    });

  const { refetch: fetchWhitelistEtherCost, data: whitelistEtherCost } =
    useContractRead({
      ...popcultConfig,
      functionName: "whitelistEtherCost",
      enabled: false,
    });
  const { refetch: fetchWhitelistUSDCCost, data: whitelistUSDCCost } =
    useContractRead({
      ...popcultConfig,
      functionName: "whitelistUSDCCost",
      enabled: false,
    });

  const { writeAsync: publicMint } = useContractWrite({
    ...popcultConfig,
    functionName: "publicMint",
    mode: "recklesslyUnprepared",
  });

  const { writeAsync: whitelistMint } = useContractWrite({
    ...popcultConfig,
    functionName: "whitelistMint",
    mode: "recklesslyUnprepared",
  });

  const isLoaded = useMemo(
    () => maxSupply && totalSupply && isPublicSaleOpen && isWhitelistSaleOpen,
    [maxSupply, totalSupply, isPublicSaleOpen, isWhitelistSaleOpen]
  );

  const mint = async () => {
    try {
      setButtonText("Minting...");
      setIsDisabled(true);
      if (isPublicSaleOpen || isWhitelistSaleOpen) {
        if (paymentMethod === "usdc") {
          if (
            (await fetchAllowance()).data?.lt(
              isPublicSaleOpen
                ? (await fetchPublicUSDCCost()).data?.mul(quantity)
                : (await fetchWhitelistUSDCCost()).data?.mul(quantity)
            )
          ) {
            setButtonText("Approving USDC...");
            await (await approveUSDC()).wait();
            setButtonText("Minting...");
          }
        }
      }

      if (isPublicSaleOpen) {
        const txId = (
          await (
            await publicMint({
              recklesslySetUnpreparedArgs: [quantity, paymentMethod === "usdc"],
              recklesslySetUnpreparedOverrides: {
                value:
                  paymentMethod == "eth"
                    ? (await fetchPublicEtherCost()).data?.mul(quantity)
                    : null,
              },
            })
          ).wait()
        ).transactionHash;
        setTxId(txId);
        return;
      }

      if (isWhitelistSaleOpen) {
        const {
          data: { proof },
        } = await axios.get(`/api/merkletree/${account.address}`);

        if (proof.length === 0) {
          toast.error("You must be whitelisted in-order to mint");
          return;
        }

        const txId = await (
          await (
            await whitelistMint({
              recklesslySetUnpreparedArgs: [
                quantity,
                paymentMethod === "usdc",
                proof,
              ],
              recklesslySetUnpreparedOverrides: {
                value:
                  paymentMethod == "eth"
                    ? (await fetchWhitelistEtherCost()).data?.mul(quantity)
                    : null,
              },
            })
          ).wait()
        ).transactionHash;
        setTxId(txId);
        return;
      }

      if (!isWhitelistSaleOpen && !isPublicSaleOpen) {
        const {
          data: { proof },
        } = await axios.get(`/api/merkletree/${account.address}`);

        if (proof.length > 0) {
          toast.success("You are whitelisted to mint");
          return; 
        }
        if (proof.length === 0) {
          toast.error("You must be whitelisted in-order to mint");
          return; 
        }
      }

    } catch (error: any) {
      const ethError = getETHError(error);
      toast.error(ethError ?? "Error Occurred");

      console.error(error);
    } finally {
      setButtonText("Mint now");
      setIsDisabled(false);
    }
  };

  return {
    isLoading: !isLoaded,
    mint,
    maxSupply: '10.000', /*maxSupply?.toString()*/
    totalSupply: totalSupply?.toString(),
    buttonText,
    isDisabled,
    quantity,
    setQuantity,
    txId,
    setTxId,
    paymentMethod,
    setPaymentMethod,
    isLoggedIn: account.isConnected && chain?.id == CHAIN.id,
    saleStatus: {
      isPublicSaleOpen,
      isWhitelistSaleOpen,
    },
    mintPrice: async () => {
      if (paymentMethod === "usdc") {
        return isWhitelistSaleOpen
          ? (whitelistUSDCCost ?? (await fetchWhitelistUSDCCost()).data)
              ?.mul(quantity)
              .toString()
          : (publicUSDCCost ?? (await fetchPublicUSDCCost()).data)
              ?.mul(quantity)
              .toString();
      }

      return isWhitelistSaleOpen
        ? ethers.utils.formatEther(
            (whitelistEtherCost ?? (await fetchWhitelistEtherCost()).data)?.mul(
              quantity!
            )
          )
        : ethers.utils.formatEther(
            (publicEtherCost ?? (await fetchPublicEtherCost()).data)?.mul(
              quantity!
            )
          );
    },
    ethPrice: async () => {
      return isWhitelistSaleOpen
        ? ethers.utils.formatEther(
            (whitelistEtherCost ?? (await fetchWhitelistEtherCost()).data)?.mul(
              quantity!
            )
          )
        : ethers.utils.formatEther(
            (publicEtherCost ?? (await fetchPublicEtherCost()).data)?.mul(
              quantity!
            )
          );
    },
    usdcPrice: async () => {
      return isWhitelistSaleOpen
        ? (whitelistUSDCCost ?? (await fetchWhitelistUSDCCost()).data)
            ?.mul(quantity)
            .toString()
        : (publicUSDCCost ?? (await fetchPublicUSDCCost()).data)
            ?.mul(quantity)
            .toString();
    },
  };
};

export default useMint;
