import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { getXKXBalance } from '../../shared/services/Web3Service';
import {
    isMetamaskInstalled,
    connectWallet,
    getCurrentChainId,
    switchToPolygon,
    watchAccountChanges,
    watchChainChanges
} from '../../services/MetamaskService';

const POLYGON_CHAIN_ID = '0x89';

const MainMenu = ({ onStartGame, onOpenShop, onBalanceUpdate, onWalletConnect }) => {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("0");
    const [loading, setLoading] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);
    const [chainId, setChainId] = useState(null);
    const [isWeb, setIsWeb] = useState(false);

    useEffect(() => {
        setIsWeb(Platform.OS === 'web');

        // Only set up MetaMask listeners on web
        if (Platform.OS === 'web' && isMetamaskInstalled()) {
            // Check if already connected
            checkExistingConnection();

            // Set up listeners
            const removeAccountListener = watchAccountChanges(handleAccountChange);
            const removeChainListener = watchChainChanges(handleChainChange);

            return () => {
                removeAccountListener();
                removeChainListener();
            };
        }
    }, []);

    const checkExistingConnection = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const currentChainId = await getCurrentChainId();
                setAddress(accounts[0]);
                setChainId(currentChainId);
                await fetchBalance(accounts[0]);
            }
        } catch (error) {
            console.error('Error checking existing connection:', error);
        }
    };

    const handleAccountChange = (newAddress) => {
        if (newAddress) {
            setAddress(newAddress);
            fetchBalance(newAddress);
        } else {
            setAddress("");
            setBalance("0");
            setWalletConnected(false);
        }
    };

    const handleChainChange = (newChainId) => {
        setChainId(newChainId);
    };

    const handleConnectMetaMask = async () => {
        try {
            setLoading(true);
            const walletAddress = await connectWallet();
            const currentChainId = await getCurrentChainId();

            setAddress(walletAddress);
            setChainId(currentChainId);

            if (currentChainId !== POLYGON_CHAIN_ID) {
                // Don't fetch balance yet, wait for network switch
                setLoading(false);
                return;
            }

            await fetchBalance(walletAddress);
        } catch (error) {
            console.error('Error connecting MetaMask:', error);
            alert('Failed to connect MetaMask. Please try again.');
            setLoading(false);
        }
    };

    const handleSwitchToPolygon = async () => {
        try {
            setLoading(true);
            await switchToPolygon();
            const newChainId = await getCurrentChainId();
            setChainId(newChainId);
            if (address) {
                await fetchBalance(address);
            }
        } catch (error) {
            console.error('Error switching to Polygon:', error);
            alert('Failed to switch to Polygon network. Please try again.');
            setLoading(false);
        }
    };

    const fetchBalance = async (walletAddress) => {
        try {
            setLoading(true);
            const bal = await getXKXBalance(walletAddress);
            setBalance(bal);
            if (onBalanceUpdate) onBalanceUpdate(bal);
            if (onWalletConnect) onWalletConnect(walletAddress);
            setWalletConnected(true);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setLoading(false);
        }
    };

    const handleStartGame = () => {
        if (!walletConnected) {
            alert('Please connect your wallet and verify you are on Polygon network before playing!');
            return;
        }
        onStartGame();
    };

    const handleOpenShop = () => {
        if (!walletConnected) {
            alert('Please connect your wallet and verify you are on Polygon network before accessing the shop!');
            return;
        }
        onOpenShop();
    };

    const handleBuyXKX = () => {
        Linking.openURL('https://heavensgatedex.vercel.app');
    };

    const truncateAddress = (addr) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const isOnPolygon = chainId === POLYGON_CHAIN_ID;

    return (
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
            <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.title}>
                STAR SHOOTER
            </Animatable.Text>

            <Animatable.View animation="fadeInUp" style={styles.walletSection}>
                {!isWeb ? (
                    // Mobile: Manual address input (MetaMask mobile not supported in React Native WebView)
                    <>
                        <Text style={styles.label}>Connect Polygon Wallet to Play:</Text>
                        <Text style={styles.subLabel}>Enter your Polygon wallet address</Text>
                        <input
                            style={styles.input}
                            placeholder="0x..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <TouchableOpacity
                            style={[styles.button, !address && styles.buttonDisabled]}
                            onPress={() => address && fetchBalance(address)}
                            disabled={!address}
                        >
                            <Text style={styles.buttonText}>
                                {walletConnected ? '✓ Wallet Connected' : 'Connect Wallet'}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : !isMetamaskInstalled() ? (
                    // Web: MetaMask not installed
                    <>
                        <Text style={styles.label}>MetaMask Required</Text>
                        <Text style={styles.subLabel}>Install MetaMask to play Star Shooter</Text>
                        <TouchableOpacity
                            style={styles.metamaskButton}
                            onPress={() => Linking.openURL('https://metamask.io/download/')}
                        >
                            <Text style={styles.buttonText}>🦊 Install MetaMask</Text>
                        </TouchableOpacity>
                    </>
                ) : !address ? (
                    // Web: MetaMask installed but not connected
                    <>
                        <Text style={styles.label}>Connect Your Wallet</Text>
                        <Text style={styles.subLabel}>One-click connection with MetaMask</Text>
                        <TouchableOpacity
                            style={styles.metamaskButton}
                            onPress={handleConnectMetaMask}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Connecting...' : '🦊 Connect MetaMask'}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : !isOnPolygon ? (
                    // Web: Connected but wrong network
                    <>
                        <Text style={styles.label}>Wrong Network</Text>
                        <Text style={styles.subLabel}>Please switch to Polygon network</Text>
                        <Text style={styles.addressText}>Connected: {truncateAddress(address)}</Text>
                        <TouchableOpacity
                            style={styles.switchNetworkButton}
                            onPress={handleSwitchToPolygon}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Switching...' : '🔄 Switch to Polygon'}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // Web: Connected and on Polygon
                    <>
                        <Text style={styles.label}>✓ Wallet Connected</Text>
                        <Text style={styles.addressText}>{truncateAddress(address)}</Text>
                        <Text style={styles.balance}>
                            XKX Balance: {loading ? 'Loading...' : parseFloat(balance).toFixed(4)}
                        </Text>
                        <TouchableOpacity
                            style={styles.buyXKXButton}
                            onPress={handleBuyXKX}
                        >
                            <LinearGradient colors={['#FFD700', '#FFA500', '#FF8C00']} style={styles.buyXKXGradient}>
                                <Text style={styles.buyXKXText}>💰 Buy XKX Tokens</Text>
                                <Text style={styles.buyXKXSubtext}>Heaven's Gate DEX</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                )}
            </Animatable.View>

            <Animatable.View animation="bounceIn" delay={500}>
                <TouchableOpacity
                    style={[
                        styles.startButton,
                        { marginBottom: 20 },
                        !walletConnected && styles.buttonDisabled
                    ]}
                    onPress={handleStartGame}
                    disabled={!walletConnected}
                >
                    <LinearGradient
                        colors={walletConnected ? ['#4c669f', '#3b5998', '#192f6a'] : ['#555', '#444', '#333']}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.startButtonText}>
                            {walletConnected ? 'START GAME' : '🔒 CONNECT WALLET TO PLAY'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.shopButton,
                        !walletConnected && styles.shopButtonDisabled
                    ]}
                    onPress={handleOpenShop}
                    disabled={!walletConnected}
                >
                    <Text style={[
                        styles.shopButtonText,
                        !walletConnected && styles.shopButtonTextDisabled
                    ]}>
                        {walletConnected ? 'OPEN SHOP' : '🔒 SHOP (WALLET REQUIRED)'}
                    </Text>
                </TouchableOpacity>
            </Animatable.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#00d2ff',
        marginBottom: 60,
        textShadowColor: 'rgba(0, 210, 255, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        fontFamily: 'monospace'
    },
    walletSection: {
        width: '100%',
        marginBottom: 50,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 20,
        borderRadius: 15,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
    },
    label: {
        color: '#00d2ff',
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    subLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center'
    },
    addressText: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 8,
        fontFamily: 'monospace'
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
    },
    button: {
        backgroundColor: '#444',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center'
    },
    metamaskButton: {
        backgroundColor: '#f6851b',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center'
    },
    switchNetworkButton: {
        backgroundColor: '#8247e5',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    balance: {
        color: '#ffd700',
        fontSize: 20,
        marginTop: 15,
        fontWeight: 'bold'
    },
    buyXKXButton: {
        width: '100%',
        marginTop: 15,
        borderRadius: 10,
        overflow: 'hidden'
    },
    buyXKXGradient: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    buyXKXText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    },
    buyXKXSubtext: {
        color: '#333',
        fontSize: 12,
        marginTop: 2
    },
    startButton: {
        width: 240,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden'
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2
    },
    shopButton: {
        backgroundColor: 'rgba(128, 0, 128, 0.6)',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'purple',
        alignItems: 'center'
    },
    shopButtonText: {
        color: '#e0aaff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonDisabled: {
        opacity: 0.5
    },
    shopButtonDisabled: {
        backgroundColor: 'rgba(80, 0, 80, 0.3)',
        borderColor: '#666'
    },
    shopButtonTextDisabled: {
        color: '#888'
    }
});

export default MainMenu;
