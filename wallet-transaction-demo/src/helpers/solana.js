import * as web3 from '@solana/web3.js';

const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
const LAMPORTS_PER_SOL = web3.LAMPORTS_PER_SOL;
const generateWalletAddress = () => {
  const keyPair = web3.Keypair.generate();
  return {
    keyPair,
    publicKey: keyPair.publicKey,
    secretKey: keyPair.secretKey,
  };
};
export {
  connection,
  LAMPORTS_PER_SOL,
  generateWalletAddress
};