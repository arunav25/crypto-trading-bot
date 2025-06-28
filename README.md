# Crypto Trading Bot - RSI Curve Divergence Scanner - **TESTING ONLY**

⚠️ **IMPORTANT LEGAL DISCLAIMERS** ⚠️

**THIS TOOL IS FOR EDUCATIONAL AND TESTING PURPOSES ONLY**

- **NOT FINANCIAL ADVICE**: This bot is not financial advice and should not be used for actual trading decisions
- **TESTING ONLY**: This is a demonstration/testing bot for learning purposes
- **NO REAL TRADING**: The bot does not execute real trades or manage real money
- **USE AT YOUR OWN RISK**: Any use of this software is entirely at your own risk
- **NO WARRANTIES**: No guarantees of profitability or accuracy are provided
- **COMPLIANCE**: Users are responsible for complying with local laws and regulations

**By using this software, you acknowledge that:**
- You understand cryptocurrency trading involves substantial risk
- You will not hold the authors liable for any financial losses
- You will not use this bot for actual trading without proper testing and validation
- You are responsible for your own trading decisions and compliance with regulations

---

👋 Welcome! A Node.js-based cryptocurrency trading bot that scans for RSI curve divergence patterns on Binance perpetual futures markets. **FOR EDUCATIONAL PURPOSES ONLY.**

---

## How it works

1. **Scans all USDT perpetual futures on Binance**
2. **Fetches 15-minute candles for each symbol**
3. **Calculates RSI and MACD indicators**
4. **Looks for bullish or bearish RSI curve divergence (with MACD confirmation)**
5. **Prints signals for coins under $2 with high volume**
6. **Repeats every 60 seconds**

---

## Features

- Real-time market scanning
- RSI curve divergence detection
- MACD confirmation
- Volume and price filtering
- Friendly, readable code
- Easy to extend and hack on

## Technical Indicators

- **RSI (Relative Strength Index)**: Smoothed with exponential moving average for better curve detection
- **MACD (Moving Average Convergence Divergence)**: Used for trend confirmation
- **Linear Regression**: Calculates slopes for divergence detection

## Requirements

- Node.js 16.0.0 or higher
- npm or yarn
- (Optional) Binance API keys for higher rate limits

## Quick Start

1. **Clone this repo:**
   ```bash
   git clone <your-repo-url>
   cd crypto-trading-bot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **(Optional) Add your Binance API keys:**
   - Copy `.env.example` to `.env` and fill in your keys
4. **Run the bot:**
   ```bash
   npm start
   ```
5. **Test the bot:**
   ```bash
   npm test
   ```

## Output Example

```
[15m] DOGEUSDT | Price: $0.1234 | Volume: 200000 | Divergence: BULLISH_CURVE
```

## Configuration

Edit `config.js` to tweak timeframes, thresholds, and more.

## Project Structure

```
crypto-trading-bot/
├── main.js         # Main bot logic
├── test_bot.js     # Test script
├── config.js       # Config file
├── .env.example    # Example for API keys
├── package.json    # Dependencies & scripts
├── README.md       # This file
└── LICENSE         # MIT License
```

## Dependencies

- **ccxt**: Cryptocurrency exchange library
- **technicalindicators**: Technical analysis indicators
- **simple-statistics**: Statistical functions for slope calculation

## Contributing

Pull requests, issues, and ideas are welcome! See `CONTRIBUTING.md` for tips.

## License

MIT — see LICENSE file.

## Legal Disclaimers

⚠️ **CRITICAL LEGAL NOTICE** ⚠️

**EDUCATIONAL AND TESTING PURPOSES ONLY**

This software is provided for educational, research, and testing purposes only. It is NOT intended for actual trading or investment decisions.

**NO FINANCIAL ADVICE**: This bot does not constitute financial advice, investment recommendations, or trading signals. All trading decisions should be made independently after thorough research and consultation with qualified financial advisors.

**NO REAL TRADING**: This bot is designed for market analysis and signal generation only. It does not execute real trades, manage real money, or connect to live trading accounts.

**HIGH RISK**: Cryptocurrency trading involves substantial risk of loss. Past performance does not guarantee future results. You can lose some or all of your invested capital.

**NO WARRANTIES**: The software is provided "AS IS" without any warranties. The authors make no representations about the accuracy, reliability, or profitability of any signals generated.

**COMPLIANCE RESPONSIBILITY**: Users are solely responsible for complying with all applicable laws, regulations, and exchange rules in their jurisdiction.

**LIMITATION OF LIABILITY**: In no event shall the authors be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of this software.

**By using this software, you agree to these terms and acknowledge that you use it entirely at your own risk.**