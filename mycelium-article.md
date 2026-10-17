# Under the Forest Floor: How AI Agents Read Solana Liquidity & Earn $MYC via MCP and x402

*Published by HLP Data Research (@hunglp97) · October 17, 2026*

In biological ecosystems, mycelium forms an intricate, subterranean web beneath the forest floor. Rather than competing in isolation, trees and plants use mycelial threads to trade nutrients, hedge against environmental stress, and build shared resilience. In decentralized finance, liquidity has traditionally been fragmented into isolated silos where each token battles alone for attention and pool depth.

**[Mycelium Finance](https://www.myceliumfinance.com)** translates this biological architecture onto Solana. Instead of maintaining single-pair pools, the protocol's core token—**$MYC**—is paired directly across a curated basket of projects spanning DeFi, Real World Assets (RWA), Artificial Intelligence, GameFi, and Memes. Every swap through connected Raydium and Orca pools routes value through this root network.

Crucially for engineers building autonomous AI systems, Mycelium Finance is among the first Solana protocols designed from day one to be machine-readable, equipping AI agents with a native Model Context Protocol (MCP) server and HTTP 402 micro-payment settlement.

![Myceli carving x402](https://explore.hlpdata.com/nexus/myceli_x402.png)

---

## 1. What the Machine Reads: Live Network Allocation

To understand the root network, an agent does not need to scrape dynamic HTML or parse complex frontends. Calling the live endpoint `GET /api/mycelium-allocation` returns real-time pooled liquidity updated every 60 seconds.

As verified on-chain at block recording on October 17, 2026, the Mycelium Strategy actively manages **$33,555.03 USD** in verified paired liquidity distributed across 10 strategic Solana assets:

| Asset / Project | Symbol | Sector | Pooled USD | Share (%) |
| :--- | :--- | :--- | :--- | :--- |
| **Knots** | `$KNOTS` | DeFi Infrastructure | $6,911.58 | 20.60% |
| **Parcl** | `$PRCL` | Real World Assets (RWA) | $4,974.22 | 14.82% |
| **Kintara** | `$KINS` | DeFi | $3,987.75 | 11.88% |
| **Gable** | `$GABLE` | Ecosystem | $3,627.56 | 10.81% |
| **Solana** | `$SOL` | Layer 1 Core | $3,428.02 | 10.22% |
| **Streamflow** | `$STREAM` | Token Vesting / Infra | $3,072.93 | 9.16% |
| **Guacamole** | `$GUAC` | Community / DeFi | $2,729.51 | 8.13% |
| **Daydreams** | `$DREAMS` | AI Agents | $2,596.67 | 7.74% |
| **JubJub** | `$JUBJUB` | GameFi | $2,111.94 | 6.29% |
| **USD Coin** | `$USDC` | Stablecoin | $114.85 | 0.34% |

### Verifiable On-Chain Distribution
From the total minted supply of 1,000,000,000 $MYC:
- **551,045,000 $MYC (55.10%)** is programmatically time-locked in a public Streamflow contract (`FFodc8fN1Vbp8sTvpk2esRa3qGb7iVyYxDP5fGbJEeSN`).
- Of the tradable circulating supply (447.55M $MYC), **379,011,634 $MYC (84.68%)** sits directly inside liquidity pools, actively routing swaps and generating LP trading fees rather than sitting idle in private wallets.
- **1,395,747.96 $MYC (0.14%)** has been permanently burned.

---

## 2. Built for AI Agents: Streamable HTTP MCP & x402 Micropayments

Modern agent frameworks (such as Claude Code, Cursor, and LangGraph) require structured, standardized tool discovery. Rather than relying on proprietary wrappers, Mycelium Finance exposes a native Streamable HTTP MCP server at `https://www.myceliumfinance.com/api/mcp`.

The MCP server provides 7 dedicated tools:
1. `get_mycelium_allocation` (Free): Live USD liquidity allocation across Solana ecosystem partners.
2. `get_solana_top_performers` (Free): Leading Solana tokens by 7-day price momentum, showing where $ESF and partner tokens rank.
3. `get_myc_token_info` (Free): Mint addresses, metadata, and brand assets for $MYC and staking token $ESF.
4. `get_mycelium_distribution` (Free): Exact token accounting across trading, locked LP, and Streamflow contracts.
5. `get_faucet_info` (Free): Live pricing and remaining allocation for the x402 token faucet.
6. `get_mycelium_snapshot` (Paid - $0.05 USDC via x402): Bundled market snapshot. When an agent's Solana wallet makes its first payment, it automatically receives **1,337 $MYC** sent directly to its wallet address.
7. `get_mycelium_history` (Paid - $0.01 USDC via x402): Comprehensive UTC daily historical records of Strategy liquidity and supply distributions.

---

## 3. How an Agent Pays & Collects: Zero-SOL Micropayments

The defining breakthrough of the x402 standard (HTTP 402 Payment Required) on Solana is that autonomous agents do not need native $SOL gas to execute payments. When an agent requests a paid resource (such as `/api/x402/mycelium-snapshot`), the facilitator handles transaction execution while the agent's wallet only provides the signed $0.05 USDC payment payload.

Connecting an autonomous agent to the Mycelium MCP server in Python or Node.js requires only standard JSON-RPC over HTTP:

```javascript
// Querying Mycelium MCP server with Node.js fetch
const response = await fetch("https://www.myceliumfinance.com/api/mcp", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream"
  },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "get_mycelium_allocation",
      arguments: {}
    }
  })
});

const data = await response.json();
console.log("Mycelium Liquidity Data:", data.result.content[0].text);
```

---

## 4. Why It Matters for Developers and Traders

For autonomous agents executing portfolio rebalancing, market intelligence, or cross-DEX routing, Mycelium Finance serves two simultaneous roles:

1. **A Resilient Index Primitive:** By holding $MYC or its staking companion $ESF, an agent gains diversified liquidity exposure across 10 distinct Solana ecosystems in a single asset.
2. **A Machine-Native Oracle:** The protocol provides reliable, low-latency financial state through standardized MCP tools, rewarding participating autonomous agents with token allocations through its x402 faucet.

Just as fungal mycelium quietly routes water and minerals to where trees need it most, Mycelium Finance routes capital through the Solana understory—laying down the economic rails for both human traders and autonomous software agents.

---

*Official Website: [https://www.myceliumfinance.com](https://www.myceliumfinance.com) · Developers: [https://www.myceliumfinance.com/developers](https://www.myceliumfinance.com/developers)*

Created by an AI agent for a Taskmarket bounty.
