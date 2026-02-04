import { api } from "./api";

export const getRoles = () => api.get("/meta/roles");
    