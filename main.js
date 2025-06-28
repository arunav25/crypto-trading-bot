// =============================================
//  Crypto Trading Bot - RSI Curve Divergence
//  (c) 2025 Arunav Malhotra & contributors
// =============================================
//
// ⚠️ LEGAL DISCLAIMER ⚠️
// THIS SOFTWARE IS FOR EDUCATIONAL AND TESTING PURPOSES ONLY
// 
// NOT FINANCIAL ADVICE: This bot is not financial advice and should not be used 
// for actual trading decisions. It is designed for learning and testing only.
//
// NO REAL TRADING: This bot does not execute real trades or manage real money.
// It only analyzes market data and generates signals for educational purposes.
//
// USE AT YOUR OWN RISK: Any use of this software is entirely at your own risk.
// The authors are not liable for any financial losses or damages.
//
// COMPLIANCE: Users are responsible for complying with local laws and regulations.
// This bot is not suitable for production trading environments.
//
// Want to use your own Binance API keys? Add them to a .env file (see .env.example).
//
// For fun, learning, and maybe profit. Not financial advice!
//
// =============================================

const ccxt = require('ccxt');
const { RSI, MACD } = require('technicalindicators');
const { linearRegression } = require('simple-statistics');
require('dotenv').config();

// Optionally use API keys from .env
const binance = new ccxt.binance({
    options: { defaultType: 'future' },
    apiKey: process.env.BINANCE_API_KEY || undefined,
    secret: process.env.BINANCE_API_SECRET || undefined
});

/**
 * Fetch all perpetual symbols from Binance
 * @returns {Promise<string[]>} Array of perpetual symbol names
 */
async function fetchPerpetualSymbols() {
    try {
        const markets = await binance.loadMarkets();
        return Object.keys(markets).filter(symbol => 
            symbol.includes('USDT') && 
            markets[symbol].contract && 
            markets[symbol].active
        );
    } catch (error) {
        console.error('Could not fetch markets:', error.message);
        return [];
    }
}

/**
 * Fetch OHLCV data for a symbol
 * @param {string} symbol - Trading symbol
 * @param {string} timeframe - Timeframe (default: '15m')
 * @param {number} limit - Number of candles (default: 100)
 * @returns {Promise<Array|null>} OHLCV data or null if error
 */
async function fetchOHLCV(symbol, timeframe = '15m', limit = 100) {
    try {
        const data = await binance.fetchOHLCV(symbol, timeframe, undefined, limit);
        return data.map(candle => ({
            timestamp: candle[0],
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
            volume: candle[5]
        }));
    } catch (error) {
        console.error(`Could not fetch OHLCV for ${symbol}:`, error.message);
        return null;
    }
}

/**
 * Calculate RSI and MACD indicators
 * @param {Array} data - OHLCV data
 * @param {number} rsiPeriod - RSI period (default: 14)
 * @param {number} macdFast - MACD fast period (default: 12)
 * @param {number} macdSlow - MACD slow period (default: 26)
 * @param {number} macdSignal - MACD signal period (default: 9)
 * @returns {Object} Data with calculated indicators
 */
function calculateRSIMACD(data, rsiPeriod = 14, macdFast = 12, macdSlow = 26, macdSignal = 9) {
    const closes = data.map(d => d.close);
    
    // Calculate RSI
    const rsiRaw = RSI.calculate({
        values: closes,
        period: rsiPeriod
    });
    
    // Smooth RSI with exponential moving average
    const rsiSmoothed = smoothEMA(rsiRaw, 5);
    
    // Calculate MACD
    const macdResult = MACD.calculate({
        values: closes,
        fastPeriod: macdFast,
        slowPeriod: macdSlow,
        signalPeriod: macdSignal,
        SimpleMAOscillator: false,
        SimpleMASignal: false
    });
    
    // Merge indicators into candles
    const result = data.map((candle, index) => ({
        ...candle,
        rsi: rsiSmoothed[index] || null,
        macd_hist: macdResult[index] ? macdResult[index].histogram : null
    }));
    
    return result;
}

/**
 * Smooth data using Exponential Moving Average
 * @param {Array} data - Input data array
 * @param {number} span - EMA span
 * @returns {Array} Smoothed data
 */
function smoothEMA(data, span) {
    const alpha = 2 / (span + 1);
    const smoothed = [];
    let ema = data[0];
    
    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            smoothed.push(data[i]);
        } else {
            ema = alpha * data[i] + (1 - alpha) * ema;
            smoothed.push(ema);
        }
    }
    
    return smoothed;
}

/**
 * Detect RSI curve divergence
 * @param {Array} data - Data with indicators
 * @param {number} window - Analysis window (default: 15)
 * @param {number} slopeThreshold - Minimum slope threshold (default: 0.0001)
 * @returns {string|null} Divergence type or null
 */
function detectRSICurveDivergence(data, window = 15, slopeThreshold = 0.0001) {
    const recent = data.filter(d => d.rsi !== null && d.macd_hist !== null).slice(-window);
    
    if (recent.length < window) {
        return null;
    }
    
    const closes = recent.map(d => d.close);
    const rsis = recent.map(d => d.rsi);
    const macdHist = recent.map(d => d.macd_hist);
    
    // Calculate slopes using linear regression
    const priceSlope = calculateSlope(closes);
    const rsiSlope = calculateSlope(rsis);
    const macdSlope = calculateSlope(macdHist);
    
    // Check for divergence patterns
    const bullishCurve = priceSlope < -slopeThreshold && rsiSlope > slopeThreshold && macdSlope > 0;
    const bearishCurve = priceSlope > slopeThreshold && rsiSlope < -slopeThreshold && macdSlope < 0;
    
    if (bullishCurve) {
        return 'BULLISH_CURVE';
    }
    if (bearishCurve) {
        return 'BEARISH_CURVE';
    }
    
    return null;
}

/**
 * Calculate slope using linear regression
 * @param {Array} values - Array of values
 * @returns {number} Slope value
 */
function calculateSlope(values) {
    const n = values.length;
    const x = Array.from({length: n}, (_, i) => i);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
}

/**
 * Get last price for a symbol
 * @param {string} symbol - Trading symbol
 * @returns {Promise<number|null>} Last price or null if error
 */
async function getLastPrice(symbol) {
    try {
        const ticker = await binance.fetchTicker(symbol);
        return ticker.last;
    } catch (error) {
        console.error(`Could not fetch last price for ${symbol}:`, error.message);
        return null;
    }
}

/**
 * Main scanning function
 */
async function run() {
    console.log(`\n[${new Date().toLocaleTimeString()}] Scanning for signals...`);
    try {
        const perpetualSymbols = await fetchPerpetualSymbols();
        
        for (const symbol of perpetualSymbols) {
            const lastPrice = await getLastPrice(symbol);
            if (lastPrice === null || lastPrice > 2) {
                continue;
            }
            
            const data = await fetchOHLCV(symbol, '15m');
            if (!data || data.length === 0) {
                continue;
            }
            
            const dataWithIndicators = calculateRSIMACD(data);
            const divergence = detectRSICurveDivergence(dataWithIndicators);
            
            const currentVolume = data[data.length - 1].volume;
            if (divergence && currentVolume > 150000) {
                console.log(`[15m] ${symbol} | Price: $${lastPrice.toFixed(4)} | Volume: ${currentVolume.toFixed(0)} | Divergence: ${divergence}`);
            }
        }
    } catch (error) {
        console.error('Oops! Something went wrong in the scan:', error.message);
    }
}

/**
 * Main execution
 */
async function main() {
    console.log("Crypto Trading Bot - RSI Curve Divergence Scanner");
    console.log("=".repeat(60));
    console.log("For testing purposes only.");
    console.log("Cryptocurrency trading involves significant risk.");
    console.log("=".repeat(60));
    
    // Initial test run
    await run();
    
    // Set up continuous scanning
    setInterval(async () => {
        try {
            await run();
        } catch (error) {
            console.error("Error occurred:", error.message);
            console.log("Retrying in 60 seconds...");
        }
    }, 60000); // Run every 60 seconds
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nBot stopped by user.');
    process.exit(0);
});

// Start the bot
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = {
    fetchPerpetualSymbols,
    fetchOHLCV,
    calculateRSIMACD,
    detectRSICurveDivergence,
    getLastPrice,
    run
}; 