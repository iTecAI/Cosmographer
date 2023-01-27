import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { MdDriveFileRenameOutline, MdFolder } from "react-icons/md";
import { showOpenDialog } from "renderer/utils/ipc/dialog";
import { exists } from "renderer/utils/ipc/fs";
import { useTranslation } from "renderer/utils/LocalizationProvider";

export default function ProjectCreateDialog(props: {
    open: boolean;
    setOpen: (open: boolean) => void;
    create: (name: string, parent: string, plugins: string[]) => void;
}) {
    const t = useTranslation();

    const [name, setName] = useState<string>("");
    const [parent, setParent] = useState<string>("");
    const [parentStatus, setParentStatus] = useState<"error" | null>(null);
    const [tt, setTt] = useState<boolean>(false);

    function close() {
        props.setOpen(false);
        setName("");
        setParent("");
    }

    useEffect(() => {
        if (parent.length === 0) {
            setParentStatus(null);
            return;
        }
        if (exists(parent)) {
            setParentStatus(null);
        } else {
            setParentStatus("error");
        }
    }, [parent]);

    return (
        <Dialog
            open={props.open}
            onClose={close}
            maxWidth="sm"
            fullWidth
            className="project-create"
        >
            <DialogTitle>{t("project.create.title")}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ marginTop: "8px" }}>
                    <TextField
                        label={t("project.create.name")}
                        placeholder={
                            t("project.create.name-placeholder") ?? undefined
                        }
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdDriveFileRenameOutline size={24} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tooltip
                        open={parentStatus === null ? false : tt}
                        title={
                            parentStatus !== null &&
                            t(`project.create.folder-error`)
                        }
                        onMouseEnter={() => setTt(true)}
                        onMouseLeave={() => setTt(false)}
                    >
                        <TextField
                            color={parentStatus ?? undefined}
                            className="parent-input"
                            label={t("project.create.folder")}
                            placeholder={
                                t("project.create.folder-placeholder") ??
                                undefined
                            }
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton
                                            onClick={() =>
                                                showOpenDialog({
                                                    title:
                                                        t(
                                                            "project.create.folder-dialog"
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
                                                        setParent(value[0]);
                                                    }
                                                })
                                            }
                                        >
                                            <MdFolder size={24} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            value={parent}
                            onChange={(e) => setParent(e.target.value)}
                        />
                    </Tooltip>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={close}>
                    {t("general.cancel")}
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        props.create(name, parent, []);
                        close();
                    }}
                    disabled={
                        name.length === 0 ||
                        parent.length === 0 ||
                        parentStatus === "error"
                    }
                >
                    {t("general.create")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
