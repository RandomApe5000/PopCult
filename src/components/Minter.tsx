import { useEffect, useState } from "react";
import useMint from "../hooks/useMint";
import CompletedMinting from "./CompletedMinting";
import ConnectButton from "./ConnectButton";
import IconMinus from "./IconMinus";
import IconPlus from "./IconPlus";

const Minter = () => {
  const [fetchedMintPrice, setFetchedMintPrice] = useState("");
  const [fetchedEthPrice, setFetchedEthPrice] = useState("");
  const [fetchedUsdcPrice, setFetchedUsdcPrice] = useState("");

  const {
    isLoggedIn,
    maxSupply,
    totalSupply,
    saleStatus: { isPublicSaleOpen, isWhitelistSaleOpen },
    mintPrice,
    ethPrice,
    usdcPrice,
    setPaymentMethod,
    paymentMethod,
    quantity,
    setQuantity,
    buttonText,
    mint,
    txId,
    setTxId,
    isDisabled,
  } = useMint();

  useEffect(() => {
    (async () => {
      const fetchedMintPrice = await mintPrice();
      setFetchedMintPrice(fetchedMintPrice!);
    })();
  }, [mintPrice, paymentMethod, quantity]);

  useEffect(() => {
    (async () => {
      const fetchedEthPrice = await ethPrice();
      setFetchedEthPrice(fetchedEthPrice!);
    })();
  }, [ethPrice, quantity]);

  useEffect(() => {
    (async () => {
      const fetchedUsdcPrice = await usdcPrice();
      setFetchedUsdcPrice(fetchedUsdcPrice!);
    })();
  }, [usdcPrice, quantity]);

  return (
    <div className="main">
      <CompletedMinting
          txId={txId}
          onClose={() => {
            setTxId("");
          }}
        />
      <div className="container">
        <div className="columns">
          <div className="column">
            <img
              className="img-booster"
              src="/images/PopCult---Booster-Pack_loop_alpha_1280.gif"
              alt="Popcult Packet"
              onClick={() => {
                if (quantity + 1 <= 10) {
                  setQuantity((quantity) => quantity + 1);
                }
              }}
            />
          </div>
          <div className="column">
            <div className="content content-mint">
                    <div className="content content-intro">
                      {isWhitelistSaleOpen && (
                        <h6>Seed Sale is open</h6>
                      )}
                      {!isWhitelistSaleOpen && !isPublicSaleOpen && (
                        <h1>Sale is Paused</h1>
                      )}
                      {isPublicSaleOpen && (
                        <h6>Public sale is open</h6>
                      )}
                      <h1>{totalSupply}<span>Pop Cults Minted</span></h1>
                    </div>
                    
                    
                    
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minter;
