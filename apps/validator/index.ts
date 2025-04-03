import type { IncomingEvents, IncomingValidationData, OutgoingEvents, OutgoingValidationData } from "@repo/types";
import axios from 'axios';
import nacl from 'tweetnacl';
import jwt from 'jsonwebtoken';




let validatorId: string = "";
let token: string = "";

const socket = new WebSocket("ws://localhost:3000");

const privateKey = nacl.randomBytes(32);
const publicKey = nacl




async function validate(data: OutgoingValidationData) { 
    const currentTime = Date.now();
    const res = await axios.get(data.url);  
    const delay = Date.now() - currentTime;

    if (res.status === 200 || res.status === 401) {
        const responseData: IncomingValidationData = {
            websiteId: data.websiteId,
            url: data.url,
            requestId: data.requestId,
            validatorId: validatorId,
            websiteStatus: res.status === 200 ? 'GOOD' : 'BAD',
            token: token,
            delay: delay
        };
        const response: IncomingEvents = {
            type: "validation",
            data: responseData
        }
        socket.send(JSON.stringify(response));
    }
}

import type { OutgoingSignupData } from "@repo/types";
async function signUp(data: OutgoingSignupData) {
    if(data.status === "SUCCESS") {
        validatorId = data.validatorId;
        token = data.token;
    } else {
        console.log("Signup failed");
    }
}

socket.onmessage = (event: MessageEvent<OutgoingEvents>) => {
  const data: OutgoingEvents = JSON.parse(event.data.toString());

  if (data.type == "validation" ) {
    validate(data.data);
  }

  if (data.type == "signup") {
    signUp(data.data);
  }
};

// socket opened
socket.onopen = (event) => {};

// socket closed
socket.onclose = (event) => {};

// error handler
socket.onerror = (event) => {};