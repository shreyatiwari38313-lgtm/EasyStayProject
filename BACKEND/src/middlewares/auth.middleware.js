import jwt from "jsonwebtoken"

const protect = (req, res, next) => {
  const auth = req.headers.authorization

  if (!auth || !auth.startsWith("Bearer")) {
    console.warn("⚠️ [AUTH] Missing or invalid Authorization header:", auth);
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const token = auth.split(" ")[1]
    console.log("🔐 [AUTH] Verifying token:", token.substring(0, 20) + "...");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log("✅ [AUTH] Token verified - User ID:", decoded._id, "Role:", decoded.role);
    // Ensure req.user.id is set from decoded token (handle both '_id' and 'id' fields)
    req.user = {
      //...decoded,
      id: decoded._id || decoded.id,
      role: decoded.role,   // ✅ explicitly add
      email: decoded.email
    }
    next()
  } catch (err) {
    console.error("❌ [AUTH] Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid token", error: err.message })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" })
  }
  next()
}
//named export
export { protect, isAdmin }
