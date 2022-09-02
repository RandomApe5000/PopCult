import { ConnectButton as Connect } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import { CHAIN } from "../config";

const ConnectButton = () => {
  const { switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();
  const { chain } = useNetwork();

  return (
    <>
      <Connect.Custom>
        {({ openConnectModal }) => {
          if (address && chain?.id == CHAIN.id) {
            return null;
          }

          return (
            <div className="content-action">
              <button
                onClick={() => {
                  if (!address) {
                    openConnectModal();
                  } else {
                    switchNetwork!(CHAIN.id);
                  }
                }}
                className="btn"
              >
                {!address
                  ? "Connect Wallet"
                  : chain?.id != CHAIN.id &&
                    address &&
                    `Switch Network To ${CHAIN.name}`}
              </button>
            </div>
          );
        }}
      </Connect.Custom>
    </>
  );
};

export default ConnectButton;
