export type IncomingSignupData = {
    signature: string;
    publicKey: string;
    location: string;
    requestId: string;
}

export type IncomingValidationData = {
    validatorId: string;
    websiteId: string;
    url: string;
    requestId: string;
    websiteStatus: 'GOOD' | 'BAD'
    token: string
    delay: number
}

export type OutgoingValidationData = {
    websiteId: string;
    url: string;
    requestId: string;
}

export type OutgoingSignupData = {
    status: 'SUCCESS' | 'FAILURE';
    validatorId: string;
    requestId: string;
    token: string
}   

export type IncomingEvents = {
    type: "signup";
    data: IncomingSignupData;
} | {
    type: "validation";
    data: IncomingValidationData;
}
    
export type OutgoingEvents = {
    type: "validation";
    data: OutgoingValidationData;
} | {
    type: "signup";
    data: OutgoingSignupData;
}
    