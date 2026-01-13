import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const ITEMS = [
    { id: "ship_speed", name: "Speed Upgrade", price: "100 XKX" },
    { id: "ship_shield", name: "Shield Generator", price: "500 XKX" },
    { id: "ship_rapid", name: "Rapid Fire", price: "1000 XKX" }
];

const Shop = ({ onBack, balance }) => {
    const handleBuy = (item) => {
        Alert.alert("Purchase", `Buy ${item.name} for ${item.price}? \n(Mock for demo)`);
    };

    return (
        <LinearGradient colors={['#24243e', '#302b63', '#0f0c29']} style={styles.container}>
            <Animatable.Text animation="fadeInDown" style={styles.title}>GALACTIC SHOP</Animatable.Text>
            <Text style={styles.balance}>Your Balance: <Text style={{ color: 'yellow' }}>{balance} XKX</Text></Text>

            <Animatable.View animation="fadeInUp" delay={300} style={styles.list}>
                {ITEMS.map((item, index) => (
                    <Animatable.View key={item.id} animation="fadeInLeft" delay={index * 200} style={styles.itemRow}>
                        <View>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{item.price}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleBuy(item)}>
                            <LinearGradient colors={['#00b09b', '#96c93d']} start={[0, 0]} end={[1, 0]} style={styles.buyButton}>
                                <Text style={styles.buyText}>BUY</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animatable.View>
                ))}
            </Animatable.View>

            <TouchableOpacity onPress={onBack} style={{ marginTop: 40 }}>
                <Text style={styles.backText}>← BACK TO BASE</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 40
    },
    title: {
        fontSize: 36,
        color: '#e0aaff',
        fontWeight: 'bold',
        marginBottom: 10,
        textShadowColor: 'purple',
        textShadowRadius: 10,
        fontFamily: 'monospace'
    },
    balance: {
        fontSize: 18,
        color: 'cyan',
        marginBottom: 40
    },
    list: {
        width: '100%'
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        marginBottom: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    itemName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    itemPrice: {
        color: '#aaa',
        marginTop: 5
    },
    buyButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20
    },
    buyText: {
        color: 'white',
        fontWeight: 'bold'
    },
    backText: {
        color: '#ccc',
        fontSize: 16
    }
});

export default Shop;
