import crypto from "crypto";

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const hash = crypto.createHash("sha256").update(otp).digest("hex");

  return {
    otp,
    hash,
    expire: Date.now() + 10 * 60 * 1000, // 10 minutes
  };
};
