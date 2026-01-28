import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { getXKXBalance } from '../../shared/services/Web3Service';

const MainMenu = ({ onStartGame, onOpenShop, onBalanceUpdate, onWalletConnect }) => {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("0");
    const [loading, setLoading] = useState(false);
    const [walletConnected, setWalletConnected] = useState(false);

    const checkBalance = async () => {
        if (!address) return;
        setLoading(true);
        const bal = await getXKXBalance(address);
        setBalance(bal);
        if (onBalanceUpdate) onBalanceUpdate(bal);
        if (onWalletConnect) onWalletConnect(address);
        setLoading(false);
        setWalletConnected(true); // Mark wallet as connected after successful balance check
    };

    const handleStartGame = () => {
        if (!walletConnected) {
            alert('Please connect your wallet and check your XKX balance before playing!');
            return;
        }
        onStartGame();
    };

    const handleOpenShop = () => {
        if (!walletConnected) {
            alert('Please connect your wallet and check your XKX balance before accessing the shop!');
            return;
        }
        onOpenShop();
    };

    return (
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
            <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.title}>
                STAR SHOOTER
            </Animatable.Text>

            <Animatable.View animation="fadeInUp" style={styles.walletSection}>
                <Text style={styles.label}>Connect Polygon Wallet to Play:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Polygon wallet address (0x...)"
                    placeholderTextColor="#aaa"
                    value={address}
                    onChangeText={setAddress}
                />
                <TouchableOpacity
                    style={[styles.button, !address && styles.buttonDisabled]}
                    onPress={checkBalance}
                    disabled={!address}
                >
                    <Text style={styles.buttonText}>
                        {walletConnected ? '✓ Wallet Connected' : 'Connect Wallet'}
                    </Text>
                </TouchableOpacity>

                {walletConnected && (
                    <Text style={styles.balance}>XKX Balance: {loading ? "Loading..." : balance}</Text>
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
        color: '#ccc',
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 5
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '600'
    },
    balance: {
        color: '#ffd700',
        fontSize: 20,
        marginTop: 15,
        fontWeight: 'bold'
    },
    startButton: {
        width: 200,
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
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2
    },
    shopButton: {
        backgroundColor: 'rgba(128, 0, 128, 0.6)',
        paddingVertical: 12,
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
