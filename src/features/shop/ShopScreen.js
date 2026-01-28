import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { SHOP_ITEMS, SHOP_CATEGORIES, getItemsByCategory } from '../../shared/constants/ShopItems';

const Shop = ({ onBack, balance, walletAddress }) => {
    const [selectedCategory, setSelectedCategory] = useState(SHOP_CATEGORIES.LIVES);
    const [purchasing, setPurchasing] = useState(null);

    const handleBuyXKX = () => {
        Linking.openURL('https://heavensgatedex.vercel.app');
    };

    const handlePurchase = async (item) => {
        if (!walletAddress) {
            alert('Please connect your wallet first!');
            return;
        }

        const userBalance = parseFloat(balance) || 0;
        if (userBalance < item.price) {
            alert(`Insufficient XKX balance!\n\nYou have: ${userBalance.toFixed(4)} XKX\nRequired: ${item.price} XKX\n\nClick \"Buy XKX\" to get more tokens.`);
            return;
        }

        setPurchasing(item.id);

        // Simulate purchase (replace with actual smart contract call later)
        setTimeout(() => {
            alert(`✅ Purchase Successful!\n\n${item.name} acquired for ${item.price} XKX\n\n(Demo mode - blockchain integration coming soon)`);
            setPurchasing(null);
        }, 1500);
    };

    const renderItem = (item, index) => {
        const isPurchasing = purchasing === item.id;
        const userBalance = parseFloat(balance) || 0;
        const canAfford = userBalance >= item.price;

        return (
            <Animatable.View
                key={item.id}
                animation="fadeInUp"
                delay={index * 100}
                style={styles.itemCard}
            >
                <View style={styles.itemHeader}>
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                    {item.badge && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.itemFooter}>
                    <View>
                        <Text style={styles.itemPrice}>{item.price} XKX</Text>
                        <Text style={styles.itemPriceUSD}>~${item.priceUSD.toFixed(2)} USD</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => handlePurchase(item)}
                        disabled={!canAfford || isPurchasing}
                        style={[
                            styles.buyButton,
                            !canAfford && styles.buyButtonDisabled
                        ]}
                    >
                        <LinearGradient
                            colors={canAfford ? ['#00b09b', '#96c93d'] : ['#666', '#444']}
                            start={[0, 0]}
                            end={[1, 0]}
                            style={styles.buyGradient}
                        >
                            <Text style={styles.buyText}>
                                {isPurchasing ? 'BUYING...' : canAfford ? 'BUY' : 'NEED XKX'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        );
    };

    return (
        <LinearGradient colors={['#24243e', '#302b63', '#0f0c29']} style={styles.container}>
            <Animatable.Text animation="fadeInDown" style={styles.title}>
                GALACTIC SHOP
            </Animatable.Text>

            {/* Balance and Buy XKX */}
            <View style={styles.balanceContainer}>
                <Text style={styles.balance}>
                    Balance: <Text style={styles.balanceAmount}>{parseFloat(balance).toFixed(4)} XKX</Text>
                </Text>
                <TouchableOpacity onPress={handleBuyXKX} style={styles.buyXKXButton}>
                    <LinearGradient colors={['#FFD700', '#FFA500', '#FF8C00']} style={styles.buyXKXGradient}>
                        <Text style={styles.buyXKXText}>💰 Buy XKX</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Category Tabs */}
            <View style={styles.categoryTabs}>
                {Object.values(SHOP_CATEGORIES).map(category => (
                    <TouchableOpacity
                        key={category}
                        onPress={() => setSelectedCategory(category)}
                        style={[
                            styles.categoryTab,
                            selectedCategory === category && styles.categoryTabActive
                        ]}
                    >
                        <Text style={[
                            styles.categoryTabText,
                            selectedCategory === category && styles.categoryTabTextActive
                        ]}>
                            {category.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Items List */}
            <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                {getItemsByCategory(selectedCategory).map((item, index) => renderItem(item, index))}
            </ScrollView>

            {/* Back Button */}
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Text style={styles.backText}>← BACK TO MENU</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 40
    },
    title: {
        fontSize: 36,
        color: '#e0aaff',
        fontWeight: 'bold',
        marginBottom: 15,
        textShadowColor: 'purple',
        textShadowRadius: 10,
        fontFamily: 'monospace'
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10
    },
    balance: {
        fontSize: 16,
        color: '#aaa'
    },
    balanceAmount: {
        color: '#ffd700',
        fontSize: 20,
        fontWeight: 'bold'
    },
    buyXKXButton: {
        borderRadius: 20,
        overflow: 'hidden'
    },
    buyXKXGradient: {
        paddingVertical: 8,
        paddingHorizontal: 15
    },
    buyXKXText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14
    },
    categoryTabs: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 25,
        padding: 4
    },
    categoryTab: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center'
    },
    categoryTabActive: {
        backgroundColor: 'rgba(224, 170, 255, 0.3)'
    },
    categoryTabText: {
        color: '#888',
        fontSize: 11,
        fontWeight: '600'
    },
    categoryTabTextActive: {
        color: '#e0aaff',
        fontWeight: 'bold'
    },
    itemsList: {
        flex: 1,
        width: '100%'
    },
    itemCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        position: 'relative'
    },
    itemIcon: {
        fontSize: 40,
        marginRight: 12
    },
    itemInfo: {
        flex: 1
    },
    itemName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4
    },
    itemDescription: {
        color: '#aaa',
        fontSize: 13,
        lineHeight: 18
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: 0,
        backgroundColor: '#ff6b6b',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold'
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8
    },
    itemPrice: {
        color: '#00ff00',
        fontSize: 18,
        fontWeight: 'bold'
    },
    itemPriceUSD: {
        color: '#888',
        fontSize: 12,
        marginTop: 2
    },
    buyButton: {
        borderRadius: 20,
        overflow: 'hidden'
    },
    buyButtonDisabled: {
        opacity: 0.5
    },
    buyGradient: {
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    buyText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    },
    backButton: {
        marginTop: 15,
        marginBottom: 10
    },
    backText: {
        color: '#ccc',
        fontSize: 16
    }
});

export default Shop;
