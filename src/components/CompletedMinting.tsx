import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";

interface CompletedMintingProps {
  onClose: () => void;
  txId: string;
}

const CompletedMinting: FC<CompletedMintingProps> = ({ onClose, txId }) => {
  return (
    <Transition appear show={!!txId} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="content-inner w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                <h1>Congrats! 🥳</h1>
                <p>Thanks for minting and welcome to Pop Cult. Your NFT will be visible in your wallet and on <a href="https://opensea.io/" target="_blank">OpenSea</a> shortly.</p>
                <div className="content-action">
                  <a className="btn" onClick={onClose}>Close</a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CompletedMinting;
