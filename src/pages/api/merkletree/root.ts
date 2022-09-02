import { NextApiHandler } from "next";

import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

import addressList from "../../../data/whitelist.json";

const handler: NextApiHandler = (req, res) => {
  const leaves = addressList.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = merkleTree.getHexRoot();

  res.status(200).send(root);
};

export default handler;
