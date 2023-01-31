import { call } from "./general";

export function devtools() {
    call("other", "devtools");
}

export function closeWindow() {
    call("other", "close");
}