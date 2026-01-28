// Shop Items with Fractional XKX Pricing
// 1 XKX = ~$70-80 USD (price of 1g 21k gold)

export const SHOP_CATEGORIES = {
    LIVES: 'lives',
    WEAPONS: 'weapons',
    SHIELDS: 'shields',
    POWERUPS: 'powerups'
};

export const SHOP_ITEMS = {
    // LIVES (Consumable)
    'life-1': {
        id: 'life-1',
        name: '1 Extra Life',
        category: SHOP_CATEGORIES.LIVES,
        price: 0.001, // XKX
        priceUSD: 0.08, // ~$0.08
        description: 'Add 1 life to your current game session',
        icon: '\u2764\ufe0f',
        consumable: true,
        quantity: 1
    },
    'lives-5': {
        id: 'lives-5',
        name: '5 Lives Pack',
        category: SHOP_CATEGORIES.LIVES,
        price: 0.004, // XKX (20% discount)
        priceUSD: 0.32,
        description: 'Add 5 lives - Save 20%!',
        icon: '\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f',
        consumable: true,
        quantity: 5,
        badge: 'BEST VALUE'
    },
    'lives-10': {
        id: 'lives-10',
        name: '10 Lives Pack',
        category: SHOP_CATEGORIES.LIVES,
        price: 0.007, // XKX (30% discount)
        priceUSD: 0.56,
        description: 'Add 10 lives - Save 30%!',
        icon: '\ud83d\udc96',
        consumable: true,
        quantity: 10,
        badge: 'MEGA PACK'
    },

    // WEAPONS (Permanent NFTs)
    'dual-cannons': {
        id: 'dual-cannons',
        name: 'Dual Cannons',
        category: SHOP_CATEGORIES.WEAPONS,
        price: 0.01, // XKX
        priceUSD: 0.75,
        description: 'Fire 2 bullets simultaneously for double damage',
        icon: '\ud83d\udd2b\ud83d\udd2b',
        consumable: false
    },
    'rapid-fire': {
        id: 'rapid-fire',
        name: 'Rapid Fire',
        category: SHOP_CATEGORIES.WEAPONS,
        price: 0.015, // XKX
        priceUSD: 1.20,
        description: '2x fire rate - unleash a bullet storm',
        icon: '\u26a1',
        consumable: false
    },
    'laser-beam': {
        id: 'laser-beam',
        name: 'Laser Beam',
        category: SHOP_CATEGORIES.WEAPONS,
        price: 0.02, // XKX
        priceUSD: 1.60,
        description: 'Continuous damage beam that cuts through enemies',
        icon: '\ud83d\udd34',
        consumable: false,
        badge: 'POWERFUL'
    },
    'homing-missiles': {
        id: 'homing-missiles',
        name: 'Homing Missiles',
        category: SHOP_CATEGORIES.WEAPONS,
        price: 0.025, // XKX
        priceUSD: 2.00,
        description: 'Smart missiles that track and destroy enemies',
        icon: '\ud83d\ude80',
        consumable: false,
        badge: 'PREMIUM'
    },

    // SHIELDS (Permanent NFTs)
    'energy-shield': {
        id: 'energy-shield',
        name: 'Energy Shield',
        category: SHOP_CATEGORIES.SHIELDS,
        price: 0.01, // XKX
        priceUSD: 0.75,
        description: '+50 max health points',
        icon: '\ud83d\udee1\ufe0f',
        consumable: false
    },
    'regeneration': {
        id: 'regeneration',
        name: 'Auto Regeneration',
        category: SHOP_CATEGORIES.SHIELDS,
        price: 0.015, // XKX
        priceUSD: 1.20,
        description: 'Automatically heal 1 HP per second',
        icon: '\u2795',
        consumable: false,
        badge: 'SURVIVAL'
    },
    'damage-reduction': {
        id: 'damage-reduction',
        name: 'Armor Plating',
        category: SHOP_CATEGORIES.SHIELDS,
        price: 0.02, // XKX
        priceUSD: 1.60,
        description: 'Take 50% less damage from all sources',
        icon: '\ud83d\udee1\ufe0f\ud83d\udee1\ufe0f',
        consumable: false,
        badge: 'TANK'
    },
    'invincibility-pulse': {
        id: 'invincibility-pulse',
        name: 'Invincibility Pulse',
        category: SHOP_CATEGORIES.SHIELDS,
        price: 0.03, // XKX
        priceUSD: 2.40,
        description: '3 seconds of invincibility every 30 seconds',
        icon: '\u2728',
        consumable: false,
        badge: 'LEGENDARY'
    },

    // POWER-UPS (Permanent NFTs)
    'speed-boost': {
        id: 'speed-boost',
        name: 'Speed Boost',
        category: SHOP_CATEGORIES.POWERUPS,
        price: 0.008, // XKX
        priceUSD: 0.64,
        description: '+50% movement speed',
        icon: '\ud83d\udca8',
        consumable: false
    },
    'score-multiplier': {
        id: 'score-multiplier',
        name: 'Score Multiplier',
        category: SHOP_CATEGORIES.POWERUPS,
        price: 0.012, // XKX
        priceUSD: 0.96,
        description: '2x points for every enemy destroyed',
        icon: '\ud83c\udfc6',
        consumable: false
    },
    'magnet-field': {
        id: 'magnet-field',
        name: 'Magnet Field',
        category: SHOP_CATEGORIES.POWERUPS,
        price: 0.01, // XKX
        priceUSD: 0.80,
        description: 'Auto-collect power-ups and bonuses',
        icon: '\ud83e\uddf2',
        consumable: false
    },
    'time-slow': {
        id: 'time-slow',
        name: 'Time Distortion',
        category: SHOP_CATEGORIES.POWERUPS,
        price: 0.018, // XKX
        priceUSD: 1.44,
        description: 'Slow down enemies by 50%',
        icon: '\u23f1\ufe0f',
        consumable: false,
        badge: 'EPIC'
    }
};

// Helper functions
export const getItemsByCategory = (category) => {
    return Object.values(SHOP_ITEMS).filter(item => item.category === category);
};

export const getItemById = (id) => {
    return SHOP_ITEMS[id] || null;
};

export const getTotalPriceXKX = (itemIds) => {
    return itemIds.reduce((total, id) => {
        const item = SHOP_ITEMS[id];
        return total + (item ? item.price : 0);
    }, 0);
};
