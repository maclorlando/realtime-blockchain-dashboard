# 🚀 Real-Time Blockchain Dashboard

A Web3 dashboard that tracks USDC Token and visualizes **Ethereum block activity** with three live-updating charts:

- 📦 **Token Volume per Block**
- ⛽ **Base Fee per Block**
- ⚙️ **Gas Used / Gas Limit Ratio**

---

# 🛠 How to Set Up Locally

1. **Clone the project**

2. **Install dependencies**

   npm install

3. **Create a `.env.local` file**

   Add the following to your `.env.local` at the project root:

   NEXT_PUBLIC_ETHEREUM_WS_URL=wss://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

   > **Note:** Replace `YOUR_ALCHEMY_API_KEY` with your real API key from [Alchemy](https://www.alchemy.com/) or another provider.

4. **Start the development server**

   npm run dev

   Then open [http://localhost:3000](http://localhost:3000) to view your dashboard.

---

# 🧠 Observation: Base Fee vs Gas Used Ratio

One of the key relationships observed in the dashboard:

- **Base Fee per Block** (second graph) is **directly influenced** by the **Gas Used / Gas Limit Ratio** (third graph).
- If the **gas usage ratio** stays consistently **above 0.5**, the **base fee automatically increases** block by block (per EIP-1559 rules).
- If blocks are **only lightly used** (gas ratio below 0.5), the **base fee decreases** to make transactions cheaper.

Thus, the **third graph predicts trends** in the **second graph**!

> **Example:**  
> If the gas usage ratio spikes close to `1.0` (full block), you’ll usually see an **increase in the base fee** shortly after.

---

# 📚 Technologies Used

- Next.js 14
- Ethers.js 6
- Mantine UI
- WebSocket Providers (Alchemy, Infura, etc.)
- TypeScript