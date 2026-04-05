import axios from "axios";
import dotenv from "dotenv";
import express from "express";

dotenv.config();
const router = express.Router();

/**
 * ✅ Endpoint general para mercados financieros:
 * /api/finance/markets?type=usa
 * /api/finance/markets?type=crypto
 * /api/finance/markets?type=colombia
 */
router.get("/markets", async (req, res) => {
  try {
    const type = (req.query.type as string) || "usa";

    // Selección de símbolos según el tipo de mercado
    let symbols: string[] = [];

    if (type === "usa") {
      symbols = ["AAPL", "MSFT", "GOOG", "AMZN", "TSLA", "NVDA"];
    } else if (type === "crypto") {
      // Criptomonedas (Yahoo usa sufijo "-USD")
      symbols = ["BTC-USD", "ETH-USD", "SOL-USD", "XRP-USD", "BNB-USD"];
    } else if (type === "colombia") {
      // Acciones colombianas en Yahoo Finance (sufijo .CO)
      symbols = [
        "ECOPETROL.CO",
        "PFBCOLOM.CO",
        "GRUPOSURA.CO",
        "ISA.CO",
        "GRUPOARGOS.CO",
      ];
    } else {
      return res.status(400).json({ message: "Tipo de mercado no válido" });
    }

    // Endpoint oficial de Yahoo Finance para múltiples símbolos
    const url = `https://${process.env.RAPIDAPI_HOST}/market/v2/get-quotes`;

    const response = await axios.get(url, {
      params: {
        region: "US",
        symbols: symbols.join(","),
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST!,
      },
    });

    const results = response.data?.quoteResponse?.result || [];

    const data = results.map((item: any) => ({
      symbol: item.symbol,
      name: item.shortName || item.longName || item.symbol,
      price: item.regularMarketPrice ?? null,
      change: item.regularMarketChangePercent ?? null,
    }));

    res.json(data);
  } catch (error: any) {
    console.error("❌ Error al obtener datos del mercado:", error.message);
    res.status(500).json({
      message: "Error al obtener datos del mercado",
      error: error.message,
    });
  }
});

export default router;

// ✅ Endpoint: /api/finance/colombia
router.get("/colombia", async (req, res) => {
  try {
    const symbols = [
      "EC",
      "CIB",
      "GRUPOSURA.CL",
      "GRUPOARGOS.CL",
      "NUTRESA.CL",
    ];

    const url = `https://${process.env.RAPIDAPI_HOST}/market/v2/get-quotes`;
    const response = await axios.get(url, {
      params: { region: "CL", symbols: symbols.join(",") },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST!,
      },
    });

    const results = response.data?.quoteResponse?.result || [];

    const data = results.map((item: any) => ({
      symbol: item.symbol,
      name: item.shortName || item.longName || item.symbol,
      price: item.regularMarketPrice ?? null,
      change: item.regularMarketChangePercent ?? null,
    }));

    res.json(data);
  } catch (error: any) {
    console.error("❌ Error al obtener datos de Colombia:", error.message);
    res.status(500).json({
      message: "Error al obtener datos del mercado colombiano",
      error: error.message,
    });
  }
});

router.get("/cryptos", async (req, res) => {
  try {
    const symbols = [
      "BTC-USD",
      "ETH-USD",
      "SOL-USD",
      "BNB-USD",
      "XRP-USD",
      "USDT-USD",
    ];

    const url = `https://${process.env.RAPIDAPI_HOST}/market/v2/get-quotes`;
    const response = await axios.get(url, {
      params: { region: "US", symbols: symbols.join(",") },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST!,
      },
    });

    const results = response.data?.quoteResponse?.result || [];

    const data = results.map((item: any) => ({
      symbol: item.symbol,
      name: item.shortName || item.longName || item.symbol,
      price: item.regularMarketPrice ?? null,
      change: item.regularMarketChangePercent ?? null,
      marketCap: item.marketCap ?? null,
      volume24h: item.regularMarketVolume ?? null,
    }));

    res.json(data);
  } catch (error: any) {
    console.error("❌ Error al obtener criptomonedas:", error.message);
    res.status(500).json({
      message: "Error al obtener datos de criptomonedas",
      error: error.message,
    });
  }
});
