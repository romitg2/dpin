import { randomUUIDv7, type ServerWebSocket } from "bun";
import type {
  IncomingEvents,
  IncomingSignupData,
  OutgoingSignupData,
  IncomingValidationData,
  OutgoingValidationData,
} from "@repo/types";
import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import bs58 from "bs58";

const VALIDATORS: ServerWebSocket<unknown>[] = [];
const CALLBACKS: Record<
  string,
  (ws: ServerWebSocket<unknown>, data: IncomingValidationData) => void
> = {};

import { PublicKey } from "@solana/web3.js";

function isValidSolanaPublicKey(key: string) {
  try {
    new PublicKey(key); // If this fails, the key is invalid
    return true;
  } catch (error) {
    return false;
  }
}

function verifySignature(
  message: string,
  signature: string,
  publicKeyStr: string
) {
  try {
    const publicKey = new PublicKey(publicKeyStr);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );
  } catch (error) {
    return false;
  }
}

Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      const event: IncomingEvents = JSON.parse(message.toString());

      if (event.type == "signup") {
        signUp(ws, event.data);
      } else if (event.type === "validation") {
        if (!event.data.token) {
          const response: OutgoingValidationData = {
            websiteId: event.data.websiteId,
            url: event.data.url,
            requestId: event.data.requestId,
          };
          ws.send(JSON.stringify(response));
          return;
        }

        try {
          // Verify the JWT token
          const decoded = jwt.verify(event.data.token, "123123", {
            algorithms: ["RS256"],
          }) as { sub: string; exp: number; iat: number };

          if (Date.now() >= decoded.exp * 1000) {
            const response: OutgoingValidationData = {
              websiteId: event.data.websiteId,
              url: event.data.url,
              requestId: event.data.requestId,
            };
            ws.send(JSON.stringify(response));
            return;
          }

          if (CALLBACKS[event.data.requestId]) {
            CALLBACKS[event.data.requestId](ws, event.data);
          } else {
            console.log("Invalid request ID");
          }
        } catch (error) {
          const response: OutgoingValidationData = {
            websiteId: event.data.websiteId,
            url: event.data.url,
            requestId: event.data.requestId,
          };
          ws.send(JSON.stringify(response));
          return;
        }
      }
    }, // a message is received
    open(ws) {
      VALIDATORS.push(ws);
    }, // a socket is opened
    close(ws, code, message) {
      VALIDATORS.splice(VALIDATORS.indexOf(ws), 1);
    }, // a socket is closed
    drain(ws) {}, // the socket is ready to receive more data
  },
});

async function signUp(ws: ServerWebSocket<unknown>, data: IncomingSignupData) {
  if (!isValidSolanaPublicKey(data.publicKey)) {
    const response: OutgoingSignupData = {
      status: "FAILURE",
      validatorId: "",
      token: "",
      requestId: data.requestId,
    };
    ws.send(JSON.stringify(response));
    return;
  }

  if (!verifySignature("signup", data.signature, data.publicKey)) {
    const response: OutgoingSignupData = {
      status: "FAILURE",
      validatorId: "",
      token: "",
      requestId: data.requestId,
    };
    ws.send(JSON.stringify(response));
    return;
  }

  const validator = await prisma.validator.create({
    data: {
      publicKey: data.publicKey,
      solanaBalance: "0",
      location: data.location,
    },
  });

  const token = jwt.sign(
    {
      sub: validator.id,
      exp: Date.now() + 60 * 60 * 1000, // 1 hour
      iat: Date.now(),
    },
    "123123",
    { algorithm: "RS256" }
  );

  const response: OutgoingSignupData = {
    status: "SUCCESS",
    validatorId: validator.id,
    token: token,
    requestId: data.requestId,
  };

  ws.send(JSON.stringify(response));
}

setInterval(async () => {
  const websites = await prisma.websites.findMany({
    where: {
      Disabled: false,
    },
  });

  websites.forEach((website) => {
    VALIDATORS.forEach((ws) => {
      const requestId = randomUUIDv7();
      CALLBACKS[requestId] = (ws, data: IncomingValidationData) => {
        prisma.websiteTicks.create({
          data: {
            websiteId: website.id,
            status: data.websiteStatus,
            validatorId: data.validatorId,
          },
        });
      };

      const validationData: OutgoingValidationData = {
        websiteId: website.id,
        url: website.url,
        requestId
      };
      ws.send(
        JSON.stringify({
          type: "validation",
          data: validationData,
        })
      );
    });
  });
}, 60 * 1000);
