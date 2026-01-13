import './shim';
import React, { useState } from 'react';
import Game from './src/features/gameplay/GameScreen';
import MainMenu from './src/features/home/MainMenuScreen';
import Shop from './src/features/shop/ShopScreen';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [inShop, setInShop] = useState(false);
  // Shared state for demo
  const [balance, setBalance] = useState("0");

  if (inGame) {
    return <Game />;
  }

  if (inShop) {
    return <Shop onBack={() => setInShop(false)} balance={balance} />;
  }

  return (
    <MainMenu
      onStartGame={() => setInGame(true)}
      onOpenShop={() => setInShop(true)}
      onBalanceUpdate={setBalance}
    />
  );
}
