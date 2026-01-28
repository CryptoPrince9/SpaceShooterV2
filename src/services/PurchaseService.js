import { ethers } from 'ethers';
import { getSigner, getProvider } from './MetamaskService';

const XKX_ADDRESS = "0xC57f3BC5B14CC735eC8727b990f6751d2ad37165";
const TREASURY_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1"; // Replace with your treasury wallet

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
];

export const purchaseItemWithXKX = async (itemId, priceInXKX, walletAddress) => {
    try {
        const signer = getSigner();
        const xkxContract = new ethers.Contract(XKX_ADDRESS, ERC20_ABI, signer);

        // Get decimals
        const decimals = await xkxContract.decimals();

        // Convert price to wei (token units)
        const amountInWei = ethers.utils.parseUnits(priceInXKX.toString(), decimals);

        // Execute transfer to treasury
        console.log(`Transferring ${priceInXKX} XKX to treasury...`);
        const tx = await xkxContract.transfer(TREASURY_ADDRESS, amountInWei);

        console.log('Transaction submitted:', tx.hash);

        // Wait for confirmation
        const receipt = await tx.wait();

        console.log('Transaction confirmed:', receipt.transactionHash);

        // Store purchase locally (can be replaced with on-chain storage later)
        storePurchase(walletAddress, itemId, receipt.transactionHash);

        return {
            success: true,
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber
        };
    } catch (error) {
        console.error('Purchase failed:', error);

        if (error.code === 4001) {
            throw new Error('Transaction rejected by user');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            throw new Error('Insufficient MATIC for gas fees');
        } else if (error.message.includes('insufficient funds')) {
            throw new Error('Insufficient XKX balance');
        } else {
            throw new Error(error.message || 'Transaction failed');
        }
    }
};

export const checkXKXBalance = async (walletAddress) => {
    try {
        const provider = getProvider();
        const xkxContract = new ethers.Contract(XKX_ADDRESS, ERC20_ABI, provider);

        const balance = await xkxContract.balanceOf(walletAddress);
        const decimals = await xkxContract.decimals();

        return parseFloat(ethers.utils.formatUnits(balance, decimals));
    } catch (error) {
        console.error('Error checking balance:', error);
        return 0;
    }
};

// Local storage for purchases (temporary until we deploy a shop contract)
const STORAGE_KEY = 'star_shooter_purchases';

export const storePurchase = (walletAddress, itemId, txHash) => {
    try {
        const purchases = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

        if (!purchases[walletAddress]) {
            purchases[walletAddress] = {};
        }

        purchases[walletAddress][itemId] = {
            purchasedAt: new Date().toISOString(),
            txHash: txHash,
            quantity: purchases[walletAddress][itemId]?.quantity
                ? purchases[walletAddress][itemId].quantity + 1
                : 1
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
    } catch (error) {
        console.error('Error storing purchase:', error);
    }
};

export const getPurchasedItems = (walletAddress) => {
    try {
        const purchases = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return purchases[walletAddress] || {};
    } catch (error) {
        console.error('Error getting purchases:', error);
        return {};
    }
};

export const hasPurchasedItem = (walletAddress, itemId) => {
    const purchases = getPurchasedItems(walletAddress);
    return !!purchases[itemId];
};

export const getItemQuantity = (walletAddress, itemId) => {
    const purchases = getPurchasedItems(walletAddress);
    return purchases[itemId]?.quantity || 0;
};

export const addLivesToSession = (walletAddress, quantity) => {
    try {
        const livesKey = `star_shooter_lives_${walletAddress}`;
        const currentLives = parseInt(localStorage.getItem(livesKey) || '5');
        const newLives = currentLives + quantity;
        localStorage.setItem(livesKey, newLives.toString());
        return newLives;
    } catch (error) {
        console.error('Error adding lives:', error);
        return 5;
    }
};

export const getSessionLives = (walletAddress) => {
    try {
        const livesKey = `star_shooter_lives_${walletAddress}`;
        return parseInt(localStorage.getItem(livesKey) || '5');
    } catch (error) {
        return 5;
    }
};

export const setSessionLives = (walletAddress, lives) => {
    try {
        const livesKey = `star_shooter_lives_${walletAddress}`;
        localStorage.setItem(livesKey, lives.toString());
    } catch (error) {
        console.error('Error setting lives:', error);
    }
};
