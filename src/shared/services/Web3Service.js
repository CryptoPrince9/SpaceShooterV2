import { ethers } from "ethers";

const XKX_ADDRESS = "0xC57f3BC5B14CC735eC8727b990f6751d2ad37165";
const RPC_URL = "https://polygon-rpc.com";

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint amount) returns (bool)"
];

export const getProvider = () => {
    return new ethers.providers.JsonRpcProvider(RPC_URL);
};

export const getXKXBalance = async (address) => {
    try {
        const provider = getProvider();
        const contract = new ethers.Contract(XKX_ADDRESS, ERC20_ABI, provider);
        const balance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
        console.error("Error fetching balance:", error);
        return "0";
    }
};

// Shop Contract Address (Replace with actual deployed address after deployment)
const SHOP_ADDRESS = "0x0000000000000000000000000000000000000000"; 

const SHOP_ABI = [
    "function buyItem(string itemId) external",
    "function items(string itemId) view returns (string name, uint256 price, bool exists)",
    "function hasItem(address player, string itemId) view returns (bool)"
];

export const buyItem = async (signer, itemId) => {
    try {
        const contract = new ethers.Contract(SHOP_ADDRESS, SHOP_ABI, signer);
        const tx = await contract.buyItem(itemId);
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Error buying item:", error);
        return false;
    }
};

export const checkOwnership = async (address, itemId) => {
     try {
        const provider = getProvider();
        const contract = new ethers.Contract(SHOP_ADDRESS, SHOP_ABI, provider);
        return await contract.hasItem(address, itemId);
    } catch (error) {
        console.error("Error checking ownership:", error);
        return false;
    }
};

// Simple wallet generation for demo if no wallet connect yet
export const createBurnerWallet = async () => {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
};
