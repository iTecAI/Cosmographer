import {
    FormControlLabel,
    IconButton,
    Modal,
    Paper,
    Popover,
    Switch,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { MdSettings } from "react-icons/md";
import { useTranslation } from "renderer/utils/LocalizationProvider";
import { useConfig } from "renderer/utils/userConfig";
import "./style.scss";

export function UserSettingsMenu(props: { className?: string }) {
    const [conf, setConf] = useConfig();
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
    const t = useTranslation();

    return (
        <>
            <IconButton
                className={`${props.className ?? "settings-btn"}${
                    anchor ? " open" : ""
                }`}
                size="large"
                onClick={(e) => setAnchor(e.currentTarget)}
            >
                <MdSettings />
            </IconButton>
            <Modal open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                <Popover
                    className="settings-menu"
                    open={Boolean(anchor)}
                    onClose={() => setAnchor(null)}
                    anchorEl={anchor}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                >
                    <Paper elevation={2} className="settings-title">
                        {t("settings.title")}
                    </Paper>
                    <Stack spacing={2} className="settings-options">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={conf.theme === "dark"}
                                    onClick={() =>
                                        setConf({
                                            theme:
                                                conf.theme === "dark"
                                                    ? "light"
                                                    : "dark",
                                        })
                                    }
                                />
                            }
                            label={t("settings.setting-theme")}
                        />
                    </Stack>
                </Popover>
            </Modal>
        </>
    );
}
