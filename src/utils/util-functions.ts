import { v4 as uuidv4 } from "uuid";

export type TUUIDText = "PAYOUT" | "PAY" | "BENE" | "ORD";

export const generateUUID = (text: TUUIDText) => {
  const cleanUUID = uuidv4().replace(/-/g, "");
  return `${text}_${cleanUUID}`;
};
