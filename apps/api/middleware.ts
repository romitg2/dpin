import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const public_key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxth0KfAoC/ZsJV6oBYbs
si5y0z4lse/33IBOneMmcJveVGvjHi2SggFqxYickEiO8iuwdLQV3CXsdZuaGgCB
EGsF0gQfN5inB8epo1sJ/s8BNvc3aXWUG8ayhAmI/RhJOw6nRl5zIrsFL2a+Dn+0
+BqbCAcycLQrQX2a09nWQVWvA+BzD5m0kiJlA2JAg3yJ0+7sX2oTL4kCqLIh0BHe
yjU8zMXYddvZUAbALoRO2APUrJ6Zg801YuzaZ4D+//lXDd3zW2yDO6Bq1/PpWSNV
hCIyywpt63i+CWRhnQuDKbvjAaTieLJ0PEMZ7tbEk9iWn+uExltH77YLiS/08M86
3wIDAQAB
-----END PUBLIC KEY-----
` 



interface JWTPayload {
  sub: string; // User ID in Clerk JWT
  exp: number; // Expiration time
  iat: number; // Issued at time
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Invalid authorization header");
    res.status(401).json({ error: "Invalid authorization header" });
  } else {
    const token = authHeader.split(" ")[1];
    console.log("token; " , token);

    try {
      // Verify the JWT token
      const decoded = jwt.verify(
        token,
        public_key,
        {
          algorithms: ["RS256"]
        }
      ) as JWTPayload;

      // Check if token is expired
      if (Date.now() >= decoded.exp * 1000) {
        console.log("here");
        res.status(401).json({ error: "Token expired" });
      }

      // Set the user ID from the token
     (req as unknown as any).userId = decoded.sub;

     console.log("passed from middleware");
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}
