# Quick Start Guide

Get up and running in 5 minutes!

## 1. Install Dependencies

```bash
cd app
npm install
```

## 2. Setup Environment

Create `.env.local` from the template:

```bash
cp ENV_TEMPLATE.txt .env.local
```

Edit `.env.local` and add your API keys:
- Anthropic: https://console.anthropic.com/
- Pinecone: https://www.pinecone.io/

## 3. Process Food Data

```bash
npm run process-foods
```

## 4. Setup Pinecone

```bash
npm run setup-pinecone
```

This takes 5-10 minutes.

## 5. Run the App

```bash
npm run dev
```

Visit: http://localhost:3000

## That's It!

You should see:
1. Trainer selection page
2. User profile form
3. Chat interface with your trainer

Click the buttons to generate workout and nutrition plans!

## Need Help?

See [SETUP.md](../SETUP.md) for detailed documentation.


