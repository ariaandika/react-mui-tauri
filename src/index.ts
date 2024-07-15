import { createContext } from "react";
import type { App, Users } from "../server/index.ts"
import { treaty } from "@elysiajs/eden";

export const client = treaty<App>("http://localhost:3000",{
    async fetcher(a,b) {
        console.log({a,b})
        return new Response();
    }
})

export function toImgUrl(file: File, onFile: (img: string) => void) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        onFile(reader.result?.toString()!)
    }
}

export const AuthContext = createContext<{ auth: Users, logout(): void, login(user: Users): void }>(void 0 as never);


