
//1
// import { useEffect, useState } from "react";

// function App() {
//     const [alerts, setAlerts] = useState([]);

//     useEffect(() => {
//         const socket = new WebSocket("ws://localhost:3001");

//         socket.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data.alert) {
//                 setAlerts((prevAlerts) => [data.alert, ...prevAlerts]);
//             }
//         };

//         return () => socket.close();
//     }, []);

//     return (
//         <div style={{ padding: "20px", fontFamily: "Arial" }}>
//             <h1>🚀 Crypto Whale Alerts</h1>
//             <ul>
//                 {alerts.map((alert, index) => (
//                     <li key={index} style={{ margin: "10px 0", fontSize: "18px" }}>
//                         {alert}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default App;



//main
// import { useEffect, useState, useRef } from "react";
// import { Line } from "react-chartjs-2";
// import "chart.js/auto";

// function App() {
//     const [ethAlerts, setEthAlerts] = useState([]);
//     const [btcAlerts, setBtcAlerts] = useState([]);
//     const [ethValues, setEthValues] = useState([]);
//     const [btcValues, setBtcValues] = useState([]);
//     const [ethTimestamps, setEthTimestamps] = useState([]);
//     const [btcTimestamps, setBtcTimestamps] = useState([]);
//     const socketRef = useRef(null);

//     useEffect(() => {
//         socketRef.current = new WebSocket("ws://localhost:3001");

//         socketRef.current.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data.alert) {
//                 const timestamp = new Date().toLocaleTimeString();
                
//                 if (data.alert.includes("ETH Whale Alert")) {
//                     const value = parseFloat(data.alert.match(/(\d+\.\d+)/)[0]);
//                     setEthAlerts((prev) => [data.alert, ...prev]);
//                     setEthValues((prev) => [...prev, value]);
//                     setEthTimestamps((prev) => [...prev, timestamp]);
//                 } else if (data.alert.includes("BTC Whale Alert")) {
//                     const value = parseFloat(data.alert.match(/(\d+\.\d+)/)[0]);
//                     setBtcAlerts((prev) => [data.alert, ...prev]);
//                     setBtcValues((prev) => [...prev, value]);
//                     setBtcTimestamps((prev) => [...prev, timestamp]);
//                 }
//             }
//         };

//         socketRef.current.onopen = () => {
//             console.log("✅ Connected to WebSocket");
//         };

//         socketRef.current.onclose = () => {
//             console.log("❌ Disconnected from WebSocket");
//             socketRef.current = null;
//         };

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.close();
//             }
//         };
//     }, []);

//     const ethChartData = {
//         labels: ethTimestamps,
//         datasets: [
//             {
//                 label: "ETH Whale Transactions",
//                 data: ethValues,
//                 borderColor: "#00ff00",
//                 backgroundColor: "rgba(0, 255, 0, 0.2)",
//             },
//         ],
//     };

//     const btcChartData = {
//         labels: btcTimestamps,
//         datasets: [
//             {
//                 label: "BTC Whale Transactions",
//                 data: btcValues,
//                 borderColor: "#ff9900",
//                 backgroundColor: "rgba(255, 153, 0, 0.2)",
//             },
//         ],
//     };

//     return (
//         <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "start", padding: "20px", fontFamily: "Arial", background: "#121212", color: "#fff", width: "100vw", height: "100vh" }}>
//             <div style={{ width: "45%" }}>
//                 <h2>🐋 Ethereum Transactions</h2>
//                 <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e1e1e", color: "#fff" }}>
//                     <thead>
//                         <tr>
//                             <th style={{ padding: "10px", borderBottom: "1px solid #fff" }}>Timestamp</th>
//                             <th style={{ padding: "10px", borderBottom: "1px solid #fff" }}>Transaction</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {ethAlerts.map((alert, index) => (
//                             <tr key={index}>
//                                 <td style={{ padding: "10px", borderBottom: "1px solid #555" }}>{ethTimestamps[index]}</td>
//                                 <td style={{ padding: "10px", borderBottom: "1px solid #555" }}>{alert}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <div style={{ width: "100%", marginTop: "20px" }}>
//                     <Line data={ethChartData} />
//                 </div>
//             </div>
            
//             <div style={{ width: "45%" }}>
//                 <h2>🐋 Bitcoin Transactions</h2>
//                 <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e1e1e", color: "#fff" }}>
//                     <thead>
//                         <tr>
//                             <th style={{ padding: "10px", borderBottom: "1px solid #fff" }}>Timestamp</th>
//                             <th style={{ padding: "10px", borderBottom: "1px solid #fff" }}>Transaction</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {btcAlerts.map((alert, index) => (
//                             <tr key={index}>
//                                 <td style={{ padding: "10px", borderBottom: "1px solid #555" }}>{btcTimestamps[index]}</td>
//                                 <td style={{ padding: "10px", borderBottom: "1px solid #555" }}>{alert}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 <div style={{ width: "100%", marginTop: "20px" }}>
//                     <Line data={btcChartData} />
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default App;











import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function App() {
    const [ethAlerts, setEthAlerts] = useState([]);
    const [btcAlerts, setBtcAlerts] = useState([]);
    const [ethValues, setEthValues] = useState([]);
    const [btcValues, setBtcValues] = useState([]);
    const [ethTimestamps, setEthTimestamps] = useState([]);
    const [btcTimestamps, setBtcTimestamps] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState("Connecting...");
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket("ws://localhost:3001");

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.alert) {
                const timestamp = new Date().toLocaleTimeString();
                
                if (data.alert.includes("ETH Whale Alert")) {
                    const value = parseFloat(data.alert.match(/(\d+\.\d+)/)[0]);
                    setEthAlerts((prev) => [data.alert, ...prev].slice(0, 20));
                    setEthValues((prev) => [...prev, value].slice(-30));
                    setEthTimestamps((prev) => [...prev, timestamp].slice(-30));
                } else if (data.alert.includes("BTC Whale Alert")) {
                    const value = parseFloat(data.alert.match(/(\d+\.\d+)/)[0]);
                    setBtcAlerts((prev) => [data.alert, ...prev].slice(0, 20));
                    setBtcValues((prev) => [...prev, value].slice(-30));
                    setBtcTimestamps((prev) => [...prev, timestamp].slice(-30));
                }
            }
        };

        socketRef.current.onopen = () => {
            console.log("✅ Connected to WebSocket");
            setConnectionStatus("Connected");
        };

        socketRef.current.onclose = () => {
            console.log("❌ Disconnected from WebSocket");
            setConnectionStatus("Disconnected");
            socketRef.current = null;
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    const ethChartData = {
        labels: ethTimestamps,
        datasets: [
            {
                label: "ETH Transaction Value (USD)",
                data: ethValues,
                borderColor: "#00ff9d",
                backgroundColor: "rgba(0, 255, 157, 0.1)",
                borderWidth: 2,
                tension: 0.1,
                pointBackgroundColor: "#00ff9d",
                pointRadius: 3,
                fill: true
            },
        ],
    };

    const btcChartData = {
        labels: btcTimestamps,
        datasets: [
            {
                label: "BTC Transaction Value (USD)",
                data: btcValues,
                borderColor: "#ff9900",
                backgroundColor: "rgba(255, 153, 0, 0.1)",
                borderWidth: 2,
                tension: 0.1,
                pointBackgroundColor: "#ff9900",
                pointRadius: 3,
                fill: true
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#fff',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#333',
                borderWidth: 1,
                padding: 10
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255,255,255,0.1)'
                },
                ticks: {
                    color: '#aaa',
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                grid: {
                    color: 'rgba(255,255,255,0.1)'
                },
                ticks: {
                    color: '#aaa'
                }
            }
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="whale">🐋 Whale Alert Dashboard</h1>
                <div className={`connection-status ${connectionStatus.toLowerCase()}`}>
                    {connectionStatus}
                </div>
            </header>

            <div className="dashboard-container">
                <div className="dashboard-column">
                    <div className="card">
                        <div className="card-header eth-header">
                            <h2>Ethereum Whale Transactions</h2>
                            <div className="stats">
                                <span>Latest: {ethValues[0] ? `$${ethValues[0].toLocaleString()}` : '-'}</span>
                                <span>Count: {ethAlerts.length}</span>
                            </div>
                        </div>
                        <div className="chart-container">
                            <Line data={ethChartData} options={chartOptions} />
                        </div>
                        <div className="transactions-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Transaction Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ethAlerts.map((alert, index) => (
                                        <tr key={`eth-${index}`}>
                                            <td>{ethTimestamps[index] || new Date().toLocaleTimeString()}</td>
                                            <td className="transaction-details">{alert}</td>
                                        </tr>
                                    ))}
                                    {ethAlerts.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="no-data">No Ethereum transactions yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="dashboard-column">
                    <div className="card">
                        <div className="card-header btc-header">
                            <h2>Bitcoin Whale Transactions</h2>
                            <div className="stats">
                                <span>Latest: {btcValues[0] ? `$${btcValues[0].toLocaleString()}` : '-'}</span>
                                <span>Count: {btcAlerts.length}</span>
                            </div>
                        </div>
                        <div className="chart-container">
                            <Line data={btcChartData} options={chartOptions} />
                        </div>
                        <div className="transactions-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Transaction Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {btcAlerts.map((alert, index) => (
                                        <tr key={`btc-${index}`}>
                                            <td>{btcTimestamps[index] || new Date().toLocaleTimeString()}</td>
                                            <td className="transaction-details">{alert}</td>
                                        </tr>
                                    ))}
                                    {btcAlerts.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="no-data">No Bitcoin transactions yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .app-container {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: #0a0b0d;
                    color: #fff;
                    min-height: 100vh;
                    min-width: 100vw;

                    border:1px solid red;
                }
                
                .app-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #1e1f25;
                }
              
                .app-header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }
                
                .connection-status {
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                .connection-status.connected {
                    background: rgba(0, 255, 157, 0.1);
                    color: #00ff9d;
                }
                
                .connection-status.disconnected {
                    background: rgba(255, 71, 87, 0.1);
                    color: #ff4757;
                }
                
                .connection-status.connecting {
                    background: rgba(255, 165, 0, 0.1);
                    color: #ffa500;
                }
                
                .dashboard-container {
                    display: flex;
                    gap: 20px;
                }
                
                .dashboard-column {
                    flex: 1;
                    min-width: 0;
                }
                
                .card {
                    background: #121318;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .card-header {
                    padding: 16px 20px;
                    border-bottom: 1px solid #1e1f25;
                }
                
                .eth-header {
                    background: linear-gradient(90deg, rgba(0, 255, 157, 0.05) 0%, rgba(0, 255, 157, 0) 100%);
                }
                
                .btc-header {
                    background: linear-gradient(90deg, rgba(255, 153, 0, 0.05) 0%, rgba(255, 153, 0, 0) 100%);
                }
                
                .card-header h2 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .stats {
                    display: flex;
                    gap: 16px;
                    font-size: 14px;
                    color: #a1a1a1;
                }
                
                .chart-container {
                    height: 250px;
                    padding: 16px;
                }
                
                .transactions-table {
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                th {
                    position: sticky;
                    top: 0;
                    background: #1a1b21;
                    padding: 12px 16px;
                    text-align: left;
                    font-size: 13px;
                    font-weight: 500;
                    color: #a1a1a1;
                    z-index: 1;
                }
                
                td {
                    padding: 12px 16px;
                    border-bottom: 1px solid #1e1f25;
                    font-size: 14px;
                }
                
                .transaction-details {
                    color: #d1d1d1;
                }
                
                .no-data {
                    text-align: center;
                    color: #666;
                    padding: 20px;
                }
                
                @media (max-width: 1200px) {
                    .dashboard-container {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
}

export default App;



// import { useEffect, useState, useRef } from "react";
// import { Line } from "react-chartjs-2";
// import "chart.js/auto";

// function App() {
//     const [ethAlerts, setEthAlerts] = useState([]);
//     const [btcAlerts, setBtcAlerts] = useState([]);
//     const [ethValues, setEthValues] = useState([]);
//     const [btcValues, setBtcValues] = useState([]);
//     const [ethTimestamps, setEthTimestamps] = useState([]);
//     const [btcTimestamps, setBtcTimestamps] = useState([]);
//     const [connectionStatus, setConnectionStatus] = useState("disconnected");
//     const [isMonitoring, setIsMonitoring] = useState(false);
//     const socketRef = useRef(null);

//     const connectWebSocket = () => {
//         if (socketRef.current) return;

//         setConnectionStatus("connecting");
//         socketRef.current = new WebSocket("ws://localhost:3001");

//         socketRef.current.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data.alert) {
//                 const timestamp = new Date().toLocaleTimeString();
                
//                 if (data.alert.includes("ETH Whale Alert")) {
//                     const value = parseFloat(data.alert.match(/(\d+\.\d+)/)[0]);
//                     setEthAlerts((prev) => [data.alert, ...prev].slice(0, 100));
//                     setEthValues((prev) => [...prev, value].slice(-20));
//                     setEthTimestamps((prev) => [...prev, timestamp].slice(-20));
//                 } else if (data.alert.includes("BTC Whale Alert")) {
//                     const value = parseFloat(data.alert.match(/(\d+\.\d+)/)[0]);
//                     setBtcAlerts((prev) => [data.alert, ...prev].slice(0, 100));
//                     setBtcValues((prev) => [...prev, value].slice(-20));
//                     setBtcTimestamps((prev) => [...prev, timestamp].slice(-20));
//                 }
//             } else if (data.status) {
//                 setConnectionStatus(data.status);
//                 setIsMonitoring(data.status === "connected");
//             }
//         };

//         socketRef.current.onopen = () => {
//             console.log("✅ Connected to WebSocket");
//             setConnectionStatus("connected");
//             setIsMonitoring(true);
//         };

//         socketRef.current.onclose = () => {
//             console.log("❌ Disconnected from WebSocket");
//             setConnectionStatus("disconnected");
//             setIsMonitoring(false);
//             socketRef.current = null;
//         };

//         socketRef.current.onerror = (error) => {
//             console.error("WebSocket error:", error);
//             setConnectionStatus("error");
//             setIsMonitoring(false);
//         };
//     };

//     const disconnectWebSocket = () => {
//         if (socketRef.current) {
//             socketRef.current.close();
//         }
//     };

//     const toggleMonitoring = () => {
//         if (isMonitoring) {
//             disconnectWebSocket();
//         } else {
//             connectWebSocket();
//         }
//     };

//     const clearData = () => {
//         setEthAlerts([]);
//         setBtcAlerts([]);
//         setEthValues([]);
//         setBtcValues([]);
//         setEthTimestamps([]);
//         setBtcTimestamps([]);
//     };

//     const ethChartData = {
//         labels: ethTimestamps,
//         datasets: [
//             {
//                 label: "ETH Whale Transactions (ETH)",
//                 data: ethValues,
//                 borderColor: "#00ff00",
//                 backgroundColor: "rgba(0, 255, 0, 0.2)",
//                 tension: 0.1,
//                 borderWidth: 2,
//                 pointRadius: 3,
//                 pointBackgroundColor: "#00ff00"
//             },
//         ],
//     };

//     const btcChartData = {
//         labels: btcTimestamps,
//         datasets: [
//             {
//                 label: "BTC Whale Transactions (BTC)",
//                 data: btcValues,
//                 borderColor: "#ff9900",
//                 backgroundColor: "rgba(255, 153, 0, 0.2)",
//                 tension: 0.1,
//                 borderWidth: 2,
//                 pointRadius: 3,
//                 pointBackgroundColor: "#ff9900"
//             },
//         ],
//     };

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 labels: {
//                     color: "#fff",
//                     font: {
//                         size: 14
//                     }
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 ticks: {
//                     color: "#aaa",
//                     maxRotation: 45,
//                     minRotation: 45
//                 },
//                 grid: {
//                     color: "rgba(255, 255, 255, 0.1)"
//                 }
//             },
//             y: {
//                 ticks: {
//                     color: "#aaa"
//                 },
//                 grid: {
//                     color: "rgba(255, 255, 255, 0.1)"
//                 }
//             }
//         }
//     };

//     const getStatusColor = () => {
//         switch(connectionStatus) {
//             case "connected": return { backgroundColor: "#10B981" };
//             case "connecting": return { backgroundColor: "#F59E0B" };
//             case "disconnected": return { backgroundColor: "#6B7280" };
//             case "error": return { backgroundColor: "#EF4444" };
//             default: return { backgroundColor: "#6B7280" };
//         }
//     };

//     return (
//         <div style={styles.appContainer}>
//             <div style={styles.mainContainer}>
//                 <header style={styles.header}>
//                     <h1 style={styles.title}>🐋 Crypto Whale Tracker</h1>
//                     <div style={styles.controls}>
//                         <div style={{ ...styles.statusIndicator, ...getStatusColor() }}>
//                             <span style={styles.statusDot}></span>
//                             <span style={styles.statusText}>{connectionStatus}</span>
//                         </div>
//                         <button
//                             onClick={toggleMonitoring}
//                             style={{
//                                 ...styles.button,
//                                 backgroundColor: isMonitoring ? "#EF4444" : "#10B981"
//                             }}
//                         >
//                             {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
//                         </button>
//                         <button
//                             onClick={clearData}
//                             style={{
//                                 ...styles.button,
//                                 backgroundColor: "#4B5563"
//                             }}
//                         >
//                             Clear Data
//                         </button>
//                     </div>
//                 </header>

//                 <div style={styles.gridContainer}>
//                     {/* Ethereum Section */}
//                     <div style={styles.sectionContainer}>
//                         <div style={styles.sectionHeader}>
//                             <h2 style={styles.sectionTitle}>
//                                 <span style={styles.ethIcon}>🦄</span> Ethereum Transactions
//                             </h2>
//                             <div style={styles.alertCount}>{ethAlerts.length} alerts</div>
//                         </div>
                        
//                         <div style={styles.chartContainer}>
//                             <Line data={ethChartData} options={chartOptions} />
//                         </div>
                        
//                         <div style={styles.tableContainer}>
//                             <table style={styles.table}>
//                                 <thead style={styles.tableHeader}>
//                                     <tr>
//                                         <th style={styles.tableHeaderCell}>Time</th>
//                                         <th style={styles.tableHeaderCell}>Transaction</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {ethAlerts.map((alert, index) => (
//                                         <tr key={index} style={styles.tableRow}>
//                                             <td style={styles.tableCell}>{ethTimestamps[index] || "N/A"}</td>
//                                             <td style={{ ...styles.tableCell, color: "#00ff00" }}>{alert}</td>
//                                         </tr>
//                                     ))}
//                                     {ethAlerts.length === 0 && (
//                                         <tr>
//                                             <td colSpan="2" style={styles.emptyMessage}>
//                                                 No Ethereum whale transactions detected yet
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>

//                     {/* Bitcoin Section */}
//                     <div style={styles.sectionContainer}>
//                         <div style={styles.sectionHeader}>
//                             <h2 style={styles.sectionTitle}>
//                                 <span style={styles.btcIcon}>₿</span> Bitcoin Transactions
//                             </h2>
//                             <div style={styles.alertCount}>{btcAlerts.length} alerts</div>
//                         </div>
                        
//                         <div style={styles.chartContainer}>
//                             <Line data={btcChartData} options={chartOptions} />
//                         </div>
                        
//                         <div style={styles.tableContainer}>
//                             <table style={styles.table}>
//                                 <thead style={styles.tableHeader}>
//                                     <tr>
//                                         <th style={styles.tableHeaderCell}>Time</th>
//                                         <th style={styles.tableHeaderCell}>Transaction</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {btcAlerts.map((alert, index) => (
//                                         <tr key={index} style={styles.tableRow}>
//                                             <td style={styles.tableCell}>{btcTimestamps[index] || "N/A"}</td>
//                                             <td style={{ ...styles.tableCell, color: "#ff9900" }}>{alert}</td>
//                                         </tr>
//                                     ))}
//                                     {btcAlerts.length === 0 && (
//                                         <tr>
//                                             <td colSpan="2" style={styles.emptyMessage}>
//                                                 No Bitcoin whale transactions detected yet
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// const styles = {
//     appContainer: {
//         minHeight: "100vh",
//         backgroundColor: "#111827",
//         color: "#fff",
//         padding: "1rem",
//         fontFamily: "Arial, sans-serif"
//     },
//     mainContainer: {
//         maxWidth: "1400px",
//         margin: "0 auto"
//     },
//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "1.5rem",
//         flexWrap: "wrap",
//         gap: "1rem"
//     },
//     title: {
//         fontSize: "2rem",
//         fontWeight: "bold",
//         background: "linear-gradient(to right, #10B981, #3B82F6)",
//         WebkitBackgroundClip: "text",
//         WebkitTextFillColor: "transparent",
//         margin: 0
//     },
//     controls: {
//         display: "flex",
//         alignItems: "center",
//         gap: "1rem",
//         flexWrap: "wrap"
//     },
//     statusIndicator: {
//         display: "flex",
//         alignItems: "center",
//         padding: "0.5rem 1rem",
//         borderRadius: "9999px",
//         color: "white",
//         fontWeight: "500"
//     },
//     statusDot: {
//         width: "0.75rem",
//         height: "0.75rem",
//         borderRadius: "50%",
//         marginRight: "0.5rem"
//     },
//     statusText: {
//         fontSize: "0.875rem",
//         textTransform: "capitalize"
//     },
//     button: {
//         padding: "0.5rem 1rem",
//         borderRadius: "0.375rem",
//         color: "white",
//         fontWeight: "500",
//         border: "none",
//         cursor: "pointer",
//         transition: "background-color 0.2s"
//     },
//     gridContainer: {
//         display: "grid",
//         gridTemplateColumns: "1fr",
//         gap: "1.5rem"
//     },
//     sectionContainer: {
//         backgroundColor: "#1F2937",
//         borderRadius: "0.5rem",
//         padding: "1rem",
//         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
//     },
//     sectionHeader: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "1rem"
//     },
//     sectionTitle: {
//         fontSize: "1.25rem",
//         fontWeight: "600",
//         margin: 0,
//         display: "flex",
//         alignItems: "center",
//         gap: "0.5rem"
//     },
//     ethIcon: {
//         color: "#10B981"
//     },
//     btcIcon: {
//         color: "#F59E0B"
//     },
//     alertCount: {
//         fontSize: "0.875rem",
//         color: "#9CA3AF"
//     },
//     chartContainer: {
//         height: "16rem",
//         marginBottom: "1rem"
//     },
//     tableContainer: {
//         overflowY: "auto",
//         height: "24rem",
//         backgroundColor: "#111827",
//         borderRadius: "0.375rem"
//     },
//     table: {
//         width: "100%",
//         borderCollapse: "collapse"
//     },
//     tableHeader: {
//         position: "sticky",
//         top: 0,
//         backgroundColor: "#374151"
//     },
//     tableHeaderCell: {
//         padding: "0.75rem",
//         textAlign: "left",
//         borderBottom: "1px solid #fff"
//     },
//     tableRow: {
//         borderBottom: "1px solid #374151",
//         transition: "background-color 0.2s"
//     },
//     tableCell: {
//         padding: "0.75rem",
//         color: "#9CA3AF",
//         fontSize: "0.875rem"
//     },
//     emptyMessage: {
//         padding: "1rem",
//         textAlign: "center",
//         color: "#6B7280"
//     }
// };

// export default App;








//2
// // import { useEffect, useState, useRef } from "react";

// // function App() {
// //     const [alerts, setAlerts] = useState([]);
// //     const [isMonitoring, setIsMonitoring] = useState(false);
// //     const socketRef = useRef(null);

// //     const startMonitoring = () => {
// //         if (socketRef.current) return; // Avoid multiple connections

// //         socketRef.current = new WebSocket("ws://localhost:3001");

// //         socketRef.current.onmessage = (event) => {
// //             const data = JSON.parse(event.data);
// //             if (data.alert) {
// //                 setAlerts((prevAlerts) => [data.alert, ...prevAlerts]);
// //             }
// //         };

// //         socketRef.current.onopen = () => {
// //             console.log("✅ Connected to WebSocket");
// //             setIsMonitoring(true);
// //         };

// //         socketRef.current.onclose = () => {
// //             console.log("❌ Disconnected from WebSocket");
// //             setIsMonitoring(false);
// //             socketRef.current = null;
// //         };
// //     };

// //     const stopMonitoring = () => {
// //         if (socketRef.current) {
// //             socketRef.current.close();
// //             socketRef.current = null;
// //         }
// //     };

// //     return (
// //         <div style={{ padding: "20px", fontFamily: "Arial", textAlign: "center" }}>
// //             <h1>🚀 Crypto Whale Alerts</h1>
// //             <div style={{ marginBottom: "20px" }}>
// //                 <button 
// //                     onClick={startMonitoring} 
// //                     disabled={isMonitoring}
// //                     style={{ padding: "10px", marginRight: "10px", cursor: isMonitoring ? "not-allowed" : "pointer" }}>
// //                     🟢 Start Monitoring
// //                 </button>
// //                 <button 
// //                     onClick={stopMonitoring} 
// //                     disabled={!isMonitoring}
// //                     style={{ padding: "10px", cursor: !isMonitoring ? "not-allowed" : "pointer" }}>
// //                     🔴 Stop Monitoring
// //                 </button>
// //             </div>
// //             <ul style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
// //                 {alerts.map((alert, index) => (
// //                     <li key={index} style={{ margin: "10px 0", fontSize: "18px" }}>
// //                         {alert}
// //                     </li>
// //                 ))}
// //             </ul>
// //         </div>
// //     );
// // }

// // export default App;
