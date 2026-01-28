import { ethers } from 'ethers';

export const isMetamaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

export const connectWallet = async () => {
    if (!isMetamaskInstalled()) {
        throw new Error('MetaMask is not installed');
    }

    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        return accounts[0];
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        throw error;
    }
};

export const getCurrentChainId = async () => {
    if (!isMetamaskInstalled()) {
        return null;
    }

    try {
        const chainId = await window.ethereum.request({
            method: 'eth_chainId'
        });
        return chainId;
    } catch (error) {
        console.error('Error getting chain ID:', error);
        return null;
    }
};

export const switchToPolygon = async () => {
    if (!isMetamaskInstalled()) {
        throw new Error('MetaMask is not installed');
    }

    const polygonChainId = '0x89'; // 137 in hex

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: polygonChainId }]
        });
        return true;
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: polygonChainId,
                            chainName: 'Polygon Mainnet',
                            nativeCurrency: {
                                name: 'MATIC',
                                symbol: 'MATIC',
                                decimals: 18
                            },
                            rpcUrls: ['https://polygon-rpc.com/'],
                            blockExplorerUrls: ['https://polygonscan.com/']
                        }
                    ]
                });
                return true;
            } catch (addError) {
                console.error('Error adding Polygon network:', addError);
                throw addError;
            }
        }
        console.error('Error switching to Polygon:', switchError);
        throw switchError;
    }
};

export const watchAccountChanges = (callback) => {
    if (!isMetamaskInstalled()) {
        return () => { };
    }

    const handler = (accounts) => {
        if (accounts.length > 0) {
            callback(accounts[0]);
        } else {
            callback(null);
        }
    };

    window.ethereum.on('accountsChanged', handler);

    return () => {
        window.ethereum.removeListener('accountsChanged', handler);
    };
};

export const watchChainChanges = (callback) => {
    if (!isMetamaskInstalled()) {
        return () => { };
    }

    const handler = (chainId) => {
        callback(chainId);
    };

    window.ethereum.on('chainChanged', handler);

    return () => {
        window.ethereum.removeListener('chainChanged', handler);
    };
};

export const getProvider = () => {
    if (!isMetamaskInstalled()) {
        // Fallback to RPC provider
        return new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    }

    return new ethers.providers.Web3Provider(window.ethereum);
};

export const getSigner = () => {
    if (!isMetamaskInstalled()) {
        throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
};
