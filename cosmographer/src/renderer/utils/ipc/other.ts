import { call, get } from "./general";

export function devtools() {
    call("other", "devtools");
}

export function closeWindow() {
    call("other", "close");
}

export function maximizeWindow() {
    call("other", "maximize");
}

export function minimizeWindow() {
    call("other", "minimize");
}