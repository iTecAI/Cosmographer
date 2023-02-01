import { IconName } from "renderer/components/Icon";

export type ProjectMeta = {
    version: number;
    name: string;
    plugins: string[];
}

interface ContentItem {
    type: string;
    id: string;
    name: string;
    icon?: IconName;
    color?: string;
}

export interface Category extends ContentItem {
    type: "category";
    children: string[];
}