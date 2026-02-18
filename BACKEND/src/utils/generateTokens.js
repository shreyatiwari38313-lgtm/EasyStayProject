import jwt from "jsonwebtoken";

const generateAccessToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
    }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { _id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d"
    }
  );
};

export { generateAccessToken, generateRefreshToken };
