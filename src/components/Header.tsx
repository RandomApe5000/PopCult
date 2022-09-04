import { GrCircleInformation } from "react-icons/gr";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import IconMenu from "./IconMenu";

import { FaTwitter, FaDiscord, FaInstagram } from "react-icons/fa";
import {
  DISCORD_URL,
  INSTAGRAM_URL,
  OPENSEA_URL,
  TWITTER_URL,
} from "../config";
import Opensea from "./Opensea";

const aTagProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};

const Header = () => {
  return (
    <nav className="nav">
      <div className="container">
        <div className="columns">
          <div className="column column-logo">
            <div className="content">
              <a href="https://popcult.io" target="_blank"><h2 className="logo">Pop Cult NFT</h2></a>
              <span className="logo-iwansmit">
                <span>by</span>
                <img
                  src="/images/iwan-smit.png"
                  alt="Iwan Smit"
                />
              </span>

            </div>

          </div>

          <div className="column column-nav">
            <div className="content">
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="btn-menu">
                    <span class="hamburger-holder"><span class="hamburger"></span></span>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="menu-overlay absolute right-0 mt-2 w-56 origin-top-right">
                    <div className="menu-container">
                      <ul className="list-nav">
                        <li><Menu.Item><a href="https://popcult.io/how-to-mint-pop-cult-nfts/" target="_blank">How to mint</a></Menu.Item></li>
                        <li><Menu.Item><a href="https://popcult.io/wp-content/uploads/2022/08/pop-cult-nft-whitepaper_2022-08-25.pdf" target="_blank">Whitepaper</a></Menu.Item></li>
                        <li><Menu.Item><a href="https://popcult.io/#roadmap" target="_blank">Roadmap</a></Menu.Item></li>
                      </ul>
                      <ul className="list-social">
                        <li>
                          <a href={TWITTER_URL} {...aTagProps}>
                            <FaTwitter />
                          </a>
                        </li>
                        <li>
                          <a href={DISCORD_URL} {...aTagProps}>
                            <FaDiscord />
                          </a>
                        </li>
                        <li>
                          <a href={INSTAGRAM_URL} {...aTagProps}>
                            <FaInstagram />
                          </a>
                        </li>
                        <li>
                          <a href={OPENSEA_URL} {...aTagProps}>
                            <Opensea />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Header;
