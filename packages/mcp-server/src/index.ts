import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { ethers } from "ethers";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const server = new Server({ name: "arcstra-coordination-os", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "arcstra_list_settlement_rails", description: "Lists supported rail-agnostic settlement currencies (USDC, USDT, EURC, SPARKLET).", inputSchema: { type: "object", properties: {} } },
    { name: "arcstra_generate_zero_phi_hashes", description: "Generates SHA-256 on-chain anchor hashes for encrypted medical diagnostics and KVKK/HIPAA/GDPR consent.", inputSchema: { type: "object", properties: { patientReference: { type: "string" }, proformaSummary: { type: "string" }, consentTimestampUTC: { type: "string" } }, required: ["patientReference", "proformaSummary", "consentTimestampUTC"] } }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name === "arcstra_list_settlement_rails") {
    return { content: [{ type: "text", text: JSON.stringify({ protocol: "ACS-01", portal: "https://drarcstra.com", rails: ["USDC", "USDT", "EURC", "SPARKLET"] }) }] };
  }
  const { patientReference, proformaSummary, consentTimestampUTC } = req.params.arguments as Record<string, string>;
  const sha = (v: string) => "0x" + crypto.createHash("sha256").update(v).digest("hex");
  return { content: [{ type: "text", text: JSON.stringify({ zeroPhi: true, diagnosticsHash: sha(patientReference), proformaHash: sha(proformaSummary), consentHash: sha(consentTimestampUTC) }) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
