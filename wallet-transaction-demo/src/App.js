import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import { useState } from 'react';
import { sendTransactions } from './helpers/connection';
import { connection, generateWalletAddress, LAMPORTS_PER_SOL } from './helpers/solana';
function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const { connected, publicKey, disconnect } = useWallet();
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const handleGenerateWallet = async (e) => {
    /* Generate random wallet */
    const { keyPair, publicKey } = generateWalletAddress();
    setWalletAddress(publicKey.toString());
    setWalletBalance(0);
    /* Airdrop sol to wallet */
    let airdropSignature = await connection.requestAirdrop(
      keyPair.publicKey,
      2 * LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);
    console.log("airdropSignature",airdropSignature);
  };
  /* Get wallet balance */
  const handleGetBalance = async () => {
    const walletBalance = await connection.getBalance(new PublicKey(walletAddress));
    console.log("walletBalance", walletBalance / LAMPORTS_PER_SOL);
    setWalletBalance(walletBalance / LAMPORTS_PER_SOL);
  };
  /* Handle transfer */
  const handleTransfer = async (e) => {
    let amount = 1; // Amount in sol
    var transferInstruction = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey:  new PublicKey(walletAddress),
      lamports: LAMPORTS_PER_SOL * amount,
    });
    /* Gloabal function to send Transaction */
    await sendTransactions(connection, wallet, [[transferInstruction]], [[]])
  };
  /* Handle to set wallet modal visible */
  const onRequestConnectWallet = () => {
    setVisible(true);
  };
  return (
    <div className="App">
      <div>
        {
          !connected &&
          <button onClick={onRequestConnectWallet}>Connect Wallet</button>
        }
        {
          connected &&
          <>
            <p>Wallet successfully connected!</p>
            <p>{publicKey?.toString()}</p>
          </>
        }
        <button onClick={handleGenerateWallet}>Generate Wallet</button><br/>
        {walletAddress !== "" && (<>{"Your wallet address is : " + walletAddress}<br/></>)}
        {
          walletAddress !== "" && <><button onClick={handleGetBalance}>Get Balance</button><br/></>
        }
        {(walletAddress !== "" && walletBalance) && (<>{"Your wallet balance is : " + walletBalance} SOL<br/></>)}

        {
          walletAddress !== "" && walletBalance &&
          <>
            <div><strong>From:</strong> {publicKey.toString()} <br/></div>
            <div><strong>To: {walletAddress}</strong> </div><br/>
            <button onClick={handleTransfer}>Transfer</button>
          </>
        }
      </div>
    </div>
  );
}

export default App;
