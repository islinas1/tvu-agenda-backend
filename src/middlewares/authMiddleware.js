import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = {
      id_user: decoded.id_user,
      ci: decoded.ci,
      name: decoded.name,
      last_name: decoded.last_name,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalido o expirado" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Acceso solo para administradores" });
};