import Icon from "../../resources/assets/icon.png";
import "./index.scss";
import { useTranslation } from "../../utils/LocalizationProvider";
import {
    Box,
    Button,
    InputAdornment,
    Paper,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { MdAdd, MdCheck, MdFolder } from "react-icons/md";
import { useEffect, useState } from "react";
import { showOpenDialog } from "../../utils/ipc/dialog";
import { exists, mkdir, writeFile } from "../../utils/ipc/fs";
import { join } from "path";
import { useConfig } from "../../utils/userConfig";
import ProjectCreateDialog from "./ProjectCreateDialog";
import { PROJECT_VERSION } from "renderer/globals";

export function ProjectsPage() {
    const t = useTranslation();
    const theme = useTheme();

    const [loadDir, setLoadDir] = useState<string>("");
    const [loadStatus, setLoadStatus] = useState<
        "error" | "warning" | "success" | null
    >(null);
    const [tt, setTt] = useState<boolean>(false);

    const [conf, setConf] = useConfig();
    const [creating, setCreating] = useState<boolean>(false);

    useEffect(() => {
        if (loadDir.length === 0) {
            setLoadStatus(null);
            return;
        }
        if (exists(loadDir)) {
            if (exists(join(loadDir, "meta.cosm.json"))) {
                setLoadStatus("success");
            } else {
                setLoadStatus("warning");
            }
        } else {
            setLoadStatus("error");
        }
    }, [loadDir]);

    return (
        <Box className="projects-page-root">
            <Stack spacing={4}>
                <img src={Icon} className="logo" />
                <Paper className="project-box" elevation={1}>
                    <Paper className="recent-title" elevation={2}>
                        <Typography variant="overline">
                            {t("project.browser.recent")}
                        </Typography>
                    </Paper>
                    <Paper className="recent-list" variant="outlined"></Paper>
                    <Box className="inputs">
                        <Tooltip
                            open={loadStatus === null ? false : tt}
                            title={
                                loadStatus !== null &&
                                t(
                                    `project.browser.folder-select.status.${loadStatus}`
                                )
                            }
                            onMouseEnter={() => setTt(true)}
                            onMouseLeave={() => setTt(false)}
                        >
                            <TextField
                                color={loadStatus ?? undefined}
                                size="small"
                                className="folder-input"
                                label={t("project.browser.folder-select.label")}
                                placeholder={
                                    t(
                                        "project.browser.folder-select.placeholder"
                                    ) ?? undefined
                                }
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {loadStatus === "success" ? (
                                                <Button
                                                    color="success"
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() => {}}
                                                >
                                                    <MdCheck size={24} />
                                                </Button>
                                            ) : (
                                                <Button
                                                    sx={{
                                                        backgroundColor:
                                                            theme.palette
                                                                .background
                                                                .default,
                                                    }}
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() =>
                                                        showOpenDialog({
                                                            title:
                                                                t(
                                                                    "project.browser.folder-select.dialog"
                                                                ) ?? undefined,
                                                            properties: [
                                                                "createDirectory",
                                                                "showHiddenFiles",
                                                                "openDirectory",
                                                                "promptToCreate",
                                                            ],
                                                        }).then((value) => {
                                                            if (
                                                                value &&
                                                                value.length > 0
                                                            ) {
                                                                setLoadDir(
                                                                    value[0]
                                                                );
                                                            }
                                                        })
                                                    }
                                                >
                                                    <MdFolder size={24} />
                                                </Button>
                                            )}
                                        </InputAdornment>
                                    ),
                                }}
                                value={loadDir}
                                onChange={(e) => setLoadDir(e.target.value)}
                            />
                        </Tooltip>
                        <Button
                            startIcon={<MdAdd size={24} />}
                            variant="contained"
                            className="new-btn"
                            onClick={() => setCreating(true)}
                        >
                            {t("project.browser.new")}
                        </Button>
                    </Box>
                </Paper>
            </Stack>
            <ProjectCreateDialog
                open={creating}
                setOpen={setCreating}
                create={(name, parent, plugins) => {
                    if (!exists(join(parent, name))) {
                        mkdir(join(parent, name));
                    }
                    writeFile(
                        join(parent, name, "meta.cosm.json"),
                        JSON.stringify({
                            version: PROJECT_VERSION,
                            name: name,
                            plugins: plugins,
                        })
                    );
                    if (!(conf.recent ?? []).includes(join(parent, name))) {
                        setConf({
                            recent: [
                                ...(conf.recent ?? []),
                                join(parent, name),
                            ],
                        });
                    }
                }}
            />
        </Box>
    );
}
