'use client';
import { useAuth } from "@clerk/nextjs";
import { API_BACKEND_URL } from "@/config";
import { useEffect, useCallback } from "react";
import axios from "axios";
import { useState } from "react";

import type { GetWebsitesResponse } from "@repo/types";

type Websites = GetWebsitesResponse["websites"];

export function useWebsites(): {websites: Websites, refreshWebsites: () => Promise<void>, isLoading: boolean} {
    const { getToken } = useAuth();
    const [websites, setWebsites] = useState<Websites>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshWebsites = useCallback(async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`${API_BACKEND_URL}/api/websites`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setWebsites(response.data.websites);
        } catch (error) {
            console.error('Failed to fetch websites:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        refreshWebsites(); // Initial fetch
        const interval = setInterval(refreshWebsites, 60000); // Every minute
        return () => clearInterval(interval);
    }, [refreshWebsites]);

    return {
        websites,
        refreshWebsites,
        isLoading
    };
}