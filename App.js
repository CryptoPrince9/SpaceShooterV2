import './shim';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import MainMenu from './src/features/home/MainMenuScreen';
import Shop from './src/features/shop/ShopScreen';

// Platform-specific Game component
const Game = Platform.select({
  web: require('./src/features/gameplay/web/WebGameScreen').default,
  default: require('./src/features/gameplay/GameScreen').default
});

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [inShop, setInShop] = useState(false);
  const [balance, setBalance] = useState("0");
  const [walletAddress, setWalletAddress] = useState("");

  if (inGame) {
    return <Game walletAddress={walletAddress} balance={balance} />;
  }

  if (inShop) {
    return <Shop onBack={() => setInShop(false)} balance={balance} walletAddress={walletAddress} onBalanceUpdate={setBalance} />;
  }

  return (
    <MainMenu
      onStartGame={() => setInGame(true)}
      onOpenShop={() => setInShop(true)}
      onBalanceUpdate={setBalance}
      onWalletConnect={setWalletAddress}
    />
  );
}
