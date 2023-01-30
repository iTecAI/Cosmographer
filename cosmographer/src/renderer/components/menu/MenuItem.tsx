import {
    Divider,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

type MenuItem =
    | {
          text: string;
          helpText?: string;
          event?: (item: MenuItem) => void;
          icon?: JSX.Element;
          keybind?: ("$super" | "$alt" | "$shift" | string)[];
      }
    | "divider";

function CosmMenuItem(props: { item: MenuItem; close: () => void }) {
    if (props.item === "divider") {
        return <Divider className="menu-item divider" />;
    } else {
        return (
            <MenuItem
                onClick={() => {
                    props.close();
                    if (props.item !== "divider" && props.item.event) {
                        props.item.event(props.item);
                    }
                }}
            >
                <Tooltip title={props.item.helpText}>
                    <>
                        {props.item.icon ?? <></>}
                        <ListItemText>{props.item.text}</ListItemText>
                        {props.item.keybind ?? (
                            <Typography variant="body2" color="text.secondary">
                                {props.item.keybind}
                            </Typography>
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
            >
                <Box sx={{ width: "192px" }}>
                    <MenuList>
                        {props.items.map((m) => (
                            <CosmMenuItem
                                key={Math.random()}
                                item={m}
                                close={() => setAnchor(null)}
                            />
                        ))}
                    </MenuList>
                </Box>
            </Menu>
        </Box>
    );
}
