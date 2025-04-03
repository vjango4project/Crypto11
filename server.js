//main

require('dotenv').config();
const WebSocket = require('ws');
const axios = require('axios');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const BTC_WS_URL = 'wss://ws.blockchain.info/inv';
const ALCHEMY_WS_URL = `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

const btcSocket = new WebSocket(BTC_WS_URL);
const ethSocket = new WebSocket(ALCHEMY_WS_URL);

// Store connected frontend clients
const clients = new Set();
wss.on('connection', (ws) => {
    console.log('🔗 Frontend connected');
    clients.add(ws);
    
    ws.on('close', () => {
        console.log('❌ Frontend disconnected');
        clients.delete(ws);
    });
});

// Function to send whale alerts to all connected clients
const sendAlert = (message) => {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ alert: message }));
        }
    });
};

// ✅ Bitcoin WebSocket Connection
btcSocket.on('open', () => {
    console.log('✅ Connected to Bitcoin WebSocket');
    btcSocket.send(JSON.stringify({ op: 'unconfirmed_sub' }));
});

// 🛠 Process BTC Transactions
btcSocket.on('message', (data) => {
    const tx = JSON.parse(data).x;
    if (!tx) return;

    let totalBTC = 0;
    tx.out.forEach(output => {
        totalBTC += output.value / 1e8; // Convert satoshis to BTC
    });

    if (totalBTC >= 1) {
        const timestamp = new Date().toLocaleString();
        const message = `🚨 BTC Whale Alert: ${totalBTC} BTC at ${timestamp}`;
        console.log(message);
        sendAlert(message);
    }
});

// ✅ Ethereum WebSocket Connection
ethSocket.on('open', () => {
    console.log('✅ Connected to Ethereum WebSocket');
    ethSocket.send(JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['newPendingTransactions']
    }));
});

// 🔄 Fetch ETH Transaction Data (With Improved Delay)
async function fetchTransaction(txHash, retries = 10) {
    try {
        const response = await axios.post(
            `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
            {
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getTransactionByHash",
                params: [txHash]
            }
        );

        const txData = response.data.result;
        if (!txData) return;

        const { value } = txData;
        const ethValue = parseInt(value, 16) / 1e18;

        if (ethValue >= 1) {
            const timestamp = new Date().toLocaleString();
            const message = `🚨 ETH Whale Alert: ${ethValue} ETH at ${timestamp}`;
            console.log(message);
            sendAlert(message);
        }
    } catch (error) {
        console.error("❌ Error fetching ETH transaction:", error.response?.data || error.message);
    }
}

// 🛠 Process Incoming ETH Transactions
ethSocket.on('message', async (data) => {
    try {
        const txHash = JSON.parse(data).params?.result;
        if (txHash) {
            fetchTransaction(txHash);
        }
    } catch (error) {
        console.error("❌ Error processing ETH transaction:", error.message);
    }
});

// Start the Express Server
server.listen(3001, () => console.log('🚀 Server running on port 3001'));



//3
// require('dotenv').config();
// const WebSocket = require('ws');
// const axios = require('axios');
// const express = require('express');

// const app = express();
// const server = require('http').createServer(app);
// const wss = new WebSocket.Server({ server });

// const BTC_WS_URL = 'wss://ws.blockchain.info/inv';
// const ALCHEMY_WS_URL = `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

// let btcSocket = null;
// let ethSocket = null;
// let isMonitoring = false;

// // Store connected frontend clients
// const clients = new Set();

// wss.on('connection', (ws) => {
//     console.log('🔗 Frontend connected');
//     clients.add(ws);
    
//     // Send current monitoring status to new client
//     ws.send(JSON.stringify({ 
//         status: isMonitoring ? "connected" : "disconnected"
//     }));
    
//     ws.on('close', () => {
//         console.log('❌ Frontend disconnected');
//         clients.delete(ws);
//     });
// });

// // Function to send alerts/status to all connected clients
// const broadcast = (message) => {
//     clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify(message));
//         }
//     });
// };

// const startMonitoring = () => {
//     if (isMonitoring) return;
//     isMonitoring = true;
//     broadcast({ status: "connected" });

//     // Initialize Bitcoin WebSocket
//     btcSocket = new WebSocket(BTC_WS_URL);
    
//     btcSocket.on('open', () => {
//         console.log('✅ Connected to Bitcoin WebSocket');
//         btcSocket.send(JSON.stringify({ op: 'unconfirmed_sub' }));
//     });

//     btcSocket.on('message', (data) => {
//         try {
//             const tx = JSON.parse(data).x;
//             if (!tx) return;

//             let totalBTC = 0;
//             tx.out.forEach(output => {
//                 totalBTC += output.value / 1e8; // Convert satoshis to BTC
//             });

//             if (totalBTC >= 1) {
//                 const timestamp = new Date().toLocaleString();
//                 const message = `🚨 BTC Whale Alert: ${totalBTC.toFixed(2)} BTC at ${timestamp}`;
//                 console.log(message);
//                 broadcast({ alert: message });
//             }
//         } catch (error) {
//             console.error("Error processing BTC transaction:", error.message);
//         }
//     });

//     btcSocket.on('close', () => {
//         console.log('❌ Disconnected from Bitcoin WebSocket');
//     });

//     btcSocket.on('error', (error) => {
//         console.error('Bitcoin WebSocket error:', error);
//     });

//     // Initialize Ethereum WebSocket
//     ethSocket = new WebSocket(ALCHEMY_WS_URL);
    
//     ethSocket.on('open', () => {
//         console.log('✅ Connected to Ethereum WebSocket');
//         ethSocket.send(JSON.stringify({
//             jsonrpc: '2.0',
//             id: 1,
//             method: 'eth_subscribe',
//             params: ['newPendingTransactions']
//         }));
//     });

//     ethSocket.on('message', async (data) => {
//         try {
//             const txHash = JSON.parse(data).params?.result;
//             if (txHash) {
//                 await fetchTransaction(txHash);
//             }
//         } catch (error) {
//             console.error("Error processing ETH transaction:", error.message);
//         }
//     });

//     ethSocket.on('close', () => {
//         console.log('❌ Disconnected from Ethereum WebSocket');
//     });

//     ethSocket.on('error', (error) => {
//         console.error('Ethereum WebSocket error:', error);
//     });
// };

// const stopMonitoring = () => {
//     if (!isMonitoring) return;
//     isMonitoring = false;
//     broadcast({ status: "disconnected" });

//     if (btcSocket) {
//         btcSocket.close();
//         btcSocket = null;
//     }

//     if (ethSocket) {
//         ethSocket.close();
//         ethSocket = null;
//     }

//     console.log('🛑 Stopped monitoring whale transactions');
// };

// async function fetchTransaction(txHash, retries = 3) {
//     try {
//         const response = await axios.post(
//             `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
//             {
//                 jsonrpc: "2.0",
//                 id: 1,
//                 method: "eth_getTransactionByHash",
//                 params: [txHash]
//             },
//             { timeout: 5000 }
//         );

//         const txData = response.data.result;
//         if (!txData) return;

//         const { value } = txData;
//         const ethValue = parseInt(value, 16) / 1e18;

//         if (ethValue >= 10) {
//             const timestamp = new Date().toLocaleString();
//             const message = `🚨 ETH Whale Alert: ${ethValue.toFixed(2)} ETH at ${timestamp}`;
//             console.log(message);
//             broadcast({ alert: message });
//         }
//     } catch (error) {
//         console.error("Error fetching ETH transaction:", error.message);
//         if (retries > 0) {
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             await fetchTransaction(txHash, retries - 1);
//         }
//     }
// }

// // API endpoints for manual control
// app.get('/start', (req, res) => {
//     startMonitoring();
//     res.send({ status: "Monitoring started" });
// });

// app.get('/stop', (req, res) => {
//     stopMonitoring();
//     res.send({ status: "Monitoring stopped" });
// });

// // Start the Express Server
// server.listen(3001, () => {
//     console.log('🚀 Server running on port 3001');
//     // Start monitoring automatically when server starts
//     // startMonitoring();
// });

// // Handle process termination
// process.on('SIGINT', () => {
//     stopMonitoring();
//     process.exit();
// });







//2
// require('dotenv').config();
// const WebSocket = require('ws');
// const axios = require('axios');
// const express = require('express');
// const http = require('http');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const BTC_WS_URL = 'wss://ws.blockchain.info/inv';
// const ALCHEMY_WS_URL = `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

// let btcSocket = null;
// let ethSocket = null;
// let isMonitoring = false;
// const clients = new Set();

// // ✅ Handle WebSocket Connection from Frontend
// wss.on('connection', (ws) => {
//     clients.add(ws);
//     console.log("✅ New frontend connected");

//     ws.on('message', (message) => {
//         console.log("📩 Received from frontend:", message);
//         if (message === "start") {
//             console.log("🟢 Starting monitoring...");
//             startMonitoring();
//         } else if (message === "stop") {
//             console.log("🛑 Stopping monitoring...");
//             stopMonitoring();
//         }
//     });

//     ws.on('close', () => {
//         clients.delete(ws);
//         console.log("❌ Frontend disconnected");
//     });
// });

// // 🚀 Start Monitoring Transactions
// function startMonitoring() {
//     if (isMonitoring) return;
//     isMonitoring = true;

//     // Connect to BTC WebSocket
//     btcSocket = new WebSocket(BTC_WS_URL);
//     btcSocket.on('open', () => {
//         console.log('✅ Connected to Bitcoin WebSocket');
//         btcSocket.send(JSON.stringify({ op: 'unconfirmed_sub' }));
//     });

//     btcSocket.on('message', (data) => {
//         console.log("📥 BTC Transaction received");
//         const tx = JSON.parse(data).x;
//         if (!tx) return;

//         let totalBTC = 0;
//         tx.out.forEach(output => {
//             totalBTC += output.value / 1e8;
//         });

//         if (totalBTC >= 10) {
//             const timestamp = new Date().toLocaleString();
//             const alert = `🚨 BTC Whale Alert: ${totalBTC} BTC at ${timestamp}`;
//             console.log(alert);
//             broadcast(alert);
//         }
//     });

//     btcSocket.on('error', (err) => console.error('❌ BTC WebSocket Error:', err));

//     // Connect to ETH WebSocket
//     ethSocket = new WebSocket(ALCHEMY_WS_URL);
//     ethSocket.on('open', () => {
//         console.log('✅ Connected to Ethereum WebSocket');
//         ethSocket.send(JSON.stringify({
//             jsonrpc: '2.0',
//             id: 1,
//             method: 'eth_subscribe',
//             params: ['newPendingTransactions']
//         }));
//     });

//     ethSocket.on('message', async (data) => {
//         console.log("📥 ETH Transaction received");
//         try {
//             const txHash = JSON.parse(data).params?.result;
//             if (txHash) fetchTransaction(txHash);
//         } catch (error) {
//             console.error("❌ Error processing ETH transaction:", error.message);
//         }
//     });

//     ethSocket.on('error', (err) => console.error('❌ ETH WebSocket Error:', err));
// }

// // 🔄 Fetch ETH Transaction Data
// async function fetchTransaction(txHash) {
//     try {
//         const response = await axios.post(
//             `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
//             {
//                 jsonrpc: "2.0",
//                 id: 1,
//                 method: "eth_getTransactionByHash",
//                 params: [txHash]
//             }
//         );

//         const txData = response.data.result;
//         if (!txData) return;

//         const { value } = txData;
//         const ethValue = parseInt(value, 16) / 1e18;

//         if (ethValue >= 50) {
//             const timestamp = new Date().toLocaleString();
//             const alert = `🚨 ETH Whale Alert: ${ethValue} ETH at ${timestamp}`;
//             console.log(alert);
//             broadcast(alert);
//         }
//     } catch (error) {
//         console.error("❌ Error fetching ETH transaction:", error.message);
//     }
// }

// // 🛑 Stop Monitoring Transactions
// function stopMonitoring() {
//     if (!isMonitoring) return;
//     isMonitoring = false;

//     if (btcSocket) {
//         btcSocket.close();
//         btcSocket = null;
//     }
//     if (ethSocket) {
//         ethSocket.close();
//         ethSocket = null;
//     }

//     console.log("🛑 Monitoring stopped.");
// }

// // 📡 Broadcast Data to All Clients
// function broadcast(message) {
//     clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             client.send(message);
//         }
//     });
// }

// // Start Server
// server.listen(3001, () => console.log("🚀 Server running on port 3001"));
