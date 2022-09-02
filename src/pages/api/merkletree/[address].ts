import { NextApiHandler } from "next";

import { ethers } from "ethers";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

import addressList from "../../../data/whitelist.json";

const handler: NextApiHandler = (req, res) => {
  if (!req.query.address || typeof req.query.address != "string") {
    return res.status(400).json({
      error: "Missing address query parameter",
    });
  }

  if (!ethers.utils.isAddress(req.query.address)) {
    return res.status(400).json({
      error: "Invalid address query parameter",
    });
  }

  const leaves = addressList.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  const hashedAddress = keccak256(req.query.address as string);
  const proof = merkleTree.getHexProof(hashedAddress);

  res.status(200).json({
    proof,
  });
};

export default handler;
