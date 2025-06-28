#!/usr/bin/env node
/**
 * Test script for the Crypto Trading Bot
 * This script tests the bot functionality without running the continuous loop.
 * 
 * ⚠️ LEGAL DISCLAIMER ⚠️
 * THIS SOFTWARE IS FOR EDUCATIONAL AND TESTING PURPOSES ONLY
 * 
 * NOT FINANCIAL ADVICE: This bot is not financial advice and should not be used 
 * for actual trading decisions. It is designed for learning and testing only.
 *
 * NO REAL TRADING: This bot does not execute real trades or manage real money.
 * It only analyzes market data and generates signals for educational purposes.
 *
 * USE AT YOUR OWN RISK: Any use of this software is entirely at your own risk.
 * The authors are not liable for any financial losses or damages.
 */

const {
    fetchPerpetualSymbols,
    fetchOHLCV,
    calculateRSIMACD,
    detectRSICurveDivergence,
    getLastPrice
} = require('./main');

async function testBotFunctions() {
    console.log("Testing Crypto Trading Bot Functions");
    console.log("=".repeat(50));
    
    // Test 1: Fetch perpetual symbols
    console.log("1. Testing perpetual symbols fetch...");
    try {
        const symbols = await fetchPerpetualSymbols();
        console.log(`Successfully fetched ${symbols.length} perpetual symbols`);
        if (symbols.length > 0) {
            console.log(`Sample symbols: ${symbols.slice(0, 5).join(', ')}`);
        }
    } catch (error) {
        console.log(`Error fetching symbols: ${error.message}`);
        return false;
    }
    
    // Test 2: Fetch OHLCV data
    console.log("\n2. Testing OHLCV data fetch...");
    const testSymbol = "BTCUSDT";
    let data;
    try {
        data = await fetchOHLCV(testSymbol, '15m', 50);
        if (data && data.length > 0) {
            console.log(`Successfully fetched ${data.length} candles for ${testSymbol}`);
            console.log(`Latest close price: ${data[data.length - 1].close.toFixed(4)}`);
        } else {
            console.log(`Failed to fetch data for ${testSymbol}`);
            return false;
        }
    } catch (error) {
        console.log(`Error fetching OHLCV: ${error.message}`);
        return false;
    }
    
    // Test 3: Calculate RSI and MACD
    console.log("\n3. Testing RSI and MACD calculation...");
    let dataWithIndicators;
    try {
        dataWithIndicators = calculateRSIMACD(data);
        // Find the last candle with both RSI and MACD values
        const lastValid = [...dataWithIndicators].reverse().find(c => c.rsi !== null && c.macd_hist !== null);
        if (lastValid) {
            console.log(`Successfully calculated RSI and MACD`);
            console.log(`Latest RSI: ${lastValid.rsi.toFixed(2)}`);
            console.log(`Latest MACD Histogram: ${lastValid.macd_hist.toFixed(6)}`);
        } else {
            console.log(`Failed to calculate indicators`);
            return false;
        }
    } catch (error) {
        console.log(`Error calculating indicators: ${error.message}`);
        return false;
    }
    
    // Test 4: Detect divergence
    console.log("\n4. Testing divergence detection...");
    try {
        const divergence = detectRSICurveDivergence(dataWithIndicators);
        if (divergence) {
            console.log(`Divergence detected: ${divergence}`);
        } else {
            console.log(`No divergence detected (this is normal)`);
        }
    } catch (error) {
        console.log(`Error detecting divergence: ${error.message}`);
        return false;
    }
    
    // Test 5: Get last price
    console.log("\n5. Testing last price fetch...");
    try {
        const lastPrice = await getLastPrice(testSymbol);
        if (lastPrice !== null) {
            console.log(`Successfully fetched last price for ${testSymbol}: ${lastPrice.toFixed(4)}`);
        } else {
            console.log(`Failed to fetch last price for ${testSymbol}`);
            return false;
        }
    } catch (error) {
        console.log(`Error fetching last price: ${error.message}`);
        return false;
    }
    
    console.log("\n" + "=".repeat(50));
    console.log("All tests completed successfully!");
    console.log("The bot is ready to run.");
    return true;
}

// Run tests
if (require.main === module) {
    testBotFunctions().catch(error => {
        console.error('Test failed with error:', error.message);
        process.exit(1);
    });
}

module.exports = { testBotFunctions }; 