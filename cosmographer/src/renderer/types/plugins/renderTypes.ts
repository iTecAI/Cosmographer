import {RendererKitItemForm, RendererKitItemNoForm} from "react-jsonx/dist/types/kits";
import { GeneratorItems } from "react-jsonx/dist/types/generators";
import {ValueRoot} from "react-jsonx/dist/types"
import { IconName } from "renderer/components/Icon";

export interface CosmGroup extends RendererKitItemNoForm {
    subtype: "group";
    children: CosmRenderer;
}

export interface CosmText extends RendererKitItemNoForm {
    subtype: "text";
    text: ValueRoot;
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subtitle1" | "subtitle2" | "body1" | "body2" | "button" | "caption" | "overline";
    styles?: ("bold" | "italic" | "underlined" | "strike")[];
}

export interface CosmStack extends RendererKitItemNoForm {
    subtype: "stack";
    spacing?: number;
    children: CosmRenderer;
}

export interface CosmField extends RendererKitItemForm {
    subtype: "field";
    icon?: IconName;
    label?: ValueRoot;
    placeholder?: ValueRoot;
    numerical?: boolean;
}

type CosmRendererItems = CosmGroup | CosmText | CosmStack | CosmField;
export type CosmRenderer = (CosmRendererItems | GeneratorItems)[] | CosmRendererItems | GeneratorItems;
export type CosmRendererKit = {
    group: CosmGroup;
    text: CosmRenderer;
    stack: CosmStack;
    field: CosmField;
}