/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        currentUser?: {
            id: number;
            name: string;
            email: string;
        };
    }
}
