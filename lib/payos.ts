import { PayOS } from "@payos/node";

if (
  !process.env.PAYOS_CLIENT_ID ||
  !process.env.PAYOS_API_KEY ||
  !process.env.PAYOS_CHECKSUM_KEY
) {
  throw new Error(
    "PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY are not set"
  );
}

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export default payos;
