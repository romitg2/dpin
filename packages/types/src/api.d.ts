import type { WebsiteWithTicksData, WebsitesWithTicksData } from "./db";

export type GetWebsitesRequest = {
    userId: string;
};

export type GetWebsitesResponse = {
    websites: Omit<WebsitesWithTicksData, "Disabled">[];
};

export type GetWebsiteRequest = {
    userId: string;
    websiteId: string;
};

export type GetWebsiteResponse = {
    website: WebsiteWithTicksData | null; 
};

export type AddWebsiteRequest = {
    userId: string;
    url: string;
};

export type AddWebsiteResponse = {
    url: string;
    id: string;
    userId: string;
};

export type UpdateWebsiteRequest = {
    userId: string;
    websiteId: string;
    url: string;
};

export type UpdateWebsiteResponse = {
    website: WebsiteWithTicksData; 
};

export type DeleteWebsiteRequest = {
    userId: string;
    websiteId: string;
};

export type DeleteWebsiteResponse = {
    website: WebsiteWithTicksData; 
};

    

