/**
 * Configuration file for Crypto Trading Bot
 */

module.exports = {
    // Trading Parameters
    TIMEFRAME: '15m',
    PRICE_THRESHOLD: 2.0, // Maximum price to consider
    VOLUME_THRESHOLD: 150000, // Minimum volume requirement

    // Technical Analysis Parameters
    RSI_PERIOD: 14,
    MACD_FAST: 12,
    MACD_SLOW: 26,
    MACD_SIGNAL: 9,
    RSI_SMOOTHING_SPAN: 5, // EWM span for RSI smoothing

    // Divergence Detection Parameters
    DIVERGENCE_WINDOW: 15, // Number of candles to analyze
    SLOPE_THRESHOLD: 0.0001, // Minimum slope for divergence detection

    // API Configuration
    EXCHANGE: 'binance',
    MARKET_TYPE: 'future', // 'spot' or 'future'

    // Scanning Parameters
    SCAN_INTERVAL: 60000, // milliseconds between scans
    OHLCV_LIMIT: 100, // number of candles to fetch

    // Logging
    ENABLE_LOGGING: true,
    LOG_LEVEL: 'INFO'
}; 