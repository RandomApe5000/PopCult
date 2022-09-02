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
                        <h6>Sale is Closed</h6>
                      )}
                      {isPublicSaleOpen && (
                        <h6>Public sale is open</h6>
                      )}
                      <h1>{totalSupply}/{maxSupply} <span>Pop Cults Minted</span></h1>
                    </div>
                    <div className="content content-quantity">
                      <h4>
                        Select quantity
                      </h4>
                      <div className="input-row">
                        <span className="input-holder">
                          <button
                            className="btn-quantity minus"
                            onClick={() => {
                              if (quantity - 1 >= 1) {
                                setQuantity((quantity) => quantity - 1);
                              }
                            }}
                          >
                           <IconMinus />
                          </button>
                        </span>
                        <span className="input-holder">
                          <p>{quantity}</p>
                        </span>
                        <span className="input-holder">
                          <button
                            className="btn-quantity plus"
                            onClick={() => {
                              if (quantity + 1 <= 10) {
                                setQuantity((quantity) => quantity + 1);
                              }
                            }}
                          >
                            <IconPlus />
                          </button>
                        </span>
                      </div>
                    </div>
                    <div className="content content-payment">
                      <h4>How would you like to pay?</h4>
                      <div className="input-row">
                        <span className="input-holder">
                          <input
                            type="radio"
                            id="eth"
                            value="ETH"
                            checked={paymentMethod === "eth"}
                            onChange={() => {
                              setPaymentMethod("eth");
                            }}
                          />
                          <label className="label-eth" htmlFor="eth">{fetchedEthPrice} <span>ETH</span></label>
                        </span>
                        <span className="input-holder">
                          <input
                            type="radio"
                            id="usdc"
                            value="USDC"
                            checked={paymentMethod === "usdc"}
                            onChange={() => {
                              setPaymentMethod("usdc");
                            }}
                          />
                          <label className="label-usdc" htmlFor="usdc">{fetchedUsdcPrice} <span>USDC</span></label>
                        </span>
                      </div>
                    </div>
                    {/* /*<div className="content content-price">
                      <h6>Mint Price</h6>
                      <p>{fetchedMintPrice} {paymentMethod.toUpperCase()}</p>
                    </div> */}
                    {isLoggedIn ? (
                      <>
                        <div className="content content-action">
                          <button
                          className="btn"
                          onClick={async () => {
                          await mint();
                          }}
                          disabled={isDisabled}
                          >
                          {buttonText}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <ConnectButton />
                      </>
                    )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minter;
