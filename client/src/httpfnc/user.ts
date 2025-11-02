import { baseUrl } from "@/constast";
import type { httpRequstType } from "@/types/types";

const getProfileData = async (username: string) => {
    const response = await fetch(baseUrl + `user/profile?username=${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const resData: httpRequstType = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch profile data");
    };
    return resData.data;
}

const getTopEditors = async () => {
    const response = await fetch(baseUrl + `user/top-editors`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const resData: httpRequstType = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch top editors data");
    };
    return resData.data;
}

const getTopYoutubers = async () => {
    const response = await fetch(baseUrl + `user/top-youtubers`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const resData: httpRequstType = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch top youtubers data");
    };
    return resData.data;
}

const fetchEvents = async (url: string) => {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    const resData = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch users");
    };
    return resData.events;
}
export const fetchEventsSpecific = async (url: string) => {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    const resData = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch users");
    };
    return resData;
}



export const fetchUserEvents = async (url: string) => {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    const resData = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch users");
    };
    return resData;
}


const searchEditros = async (query: string) => {

    const response = await fetch(baseUrl + `user/search-editors?query=${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch editors");
    const resData: httpRequstType = await response.json();

    if (!response.ok || response.status >= 300) {
        throw new Error(resData.message || "Failed to fetch editors");
    };
    return resData.data;
}

export {
    getProfileData,
    getTopEditors,
    getTopYoutubers,
    fetchEvents,
    searchEditros
}
