import {
    Divider,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { PLATFORM } from "renderer/globals";
import { bind, unbind } from "mousetrap";

type MenuItem =
    | {
          text: string;
          helpText?: string;
          event?: (item: MenuItem) => void;
          icon?: JSX.Element;
          keybind?: ("meta" | "alt" | "shift" | string)[];
      }
    | "divider";

export function CosmMenuItem(props: { item: MenuItem; close: () => void }) {
    function trigger(_props: { item: MenuItem; close: () => void }) {
        console.log(_props.item);
        _props.close();
        if (_props.item !== "divider" && _props.item.event) {
            _props.item.event(_props.item);
        }
    }
    if (props.item === "divider") {
        return <Divider className="menu-item divider" />;
    } else {
        if (props.item.keybind) {
            unbind(
                props.item.keybind
                    .join("+")
                    .toLowerCase()
                    .replaceAll(
                        "meta",
                        PLATFORM === "darwin" ? "command" : "ctrl"
                    )
            );
            bind(
                props.item.keybind
                    .join("+")
                    .toLowerCase()
                    .replaceAll(
                        "meta",
                        PLATFORM === "darwin" ? "command" : "ctrl"
                    ),
                () => trigger(props)
            );
        }
        return (
            <MenuItem onClick={() => trigger(props)}>
                <Tooltip title={props.item.helpText}>
                    <>
                        {(
                            <span
                                style={{
                                    marginRight: "8px",
                                    transform: "translate(0, 3px)",
                                }}
                            >
                                {props.item.icon}
                            </span>
                        ) ?? <></>}
                        <ListItemText>{props.item.text}</ListItemText>
                        {props.item.keybind ? (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    marginLeft: "24px",
                                    float: "right",
                                    transform: "translate(0, 1px)",
                                    opacity: 0.75,
                                }}
                            >
                                {props.item.keybind
                                    ? (props.item.keybind as string[])
                                          .map((kb: string) => {
                                              switch (kb) {
                                                  case "meta":
                                                      if (
                                                          PLATFORM === "darwin"
                                                      ) {
                                                          return "⌘";
                                                      } else {
                                                          return "Ctrl";
                                                      }
                                                  case "alt":
                                                      if (
                                                          PLATFORM === "darwin"
                                                      ) {
                                                          return "⌥";
                                                      } else {
                                                          return "Alt";
                                                      }
                                                  case "shift":
                                                      if (
                                                          PLATFORM === "darwin"
                                                      ) {
                                                          return "⇧";
                                                      } else {
                                                          return "Shift";
                                                      }
                                                  default:
                                                      return kb.toLocaleUpperCase();
                                              }
                                          })
                                          .join(" + ")
                                    : ""}
                            </Typography>
                        ) : (
                            <></>
                        )}
                    </>
                </Tooltip>
            </MenuItem>
        );
    }
}

export function CosmMenu(props: {
    items: MenuItem[];
    trigger: (params: { onClick: (event: any) => void }) => JSX.Element;
}) {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    return (
        <Box className="cosm-menu">
            {props.trigger({
                onClick: (event) => setAnchor(event.currentTarget),
            })}
            <Menu
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                anchorEl={anchor}
                className="test"
                sx={{
                    "& .MuiList-root": {
                        padding: "0px",
                        "& .MuiButtonBase-root": {
                            paddingTop: "8px",
                            paddingBottom: "8px",
                        },
                    },
                }}
            >
                <Box sx={{ minWidth: "192px", width: "fit-content" }}>
                    {props.items.map((m) => (
                        <CosmMenuItem
                            key={Math.random()}
                            item={m}
                            close={() => setAnchor(null)}
                        />
                    ))}
                </Box>
            </Menu>
        </Box>
    );
}
