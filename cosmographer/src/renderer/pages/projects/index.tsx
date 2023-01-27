import Icon from "../../resources/assets/icon.png";
import "./index.scss";
import { useTranslation } from "../../utils/LocalizationProvider";
import {
    Box,
    Button,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { MdAdd, MdFolder } from "react-icons/md";

export function ProjectsPage() {
    const t = useTranslation();
    const theme = useTheme();
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
                        <TextField
                            size="small"
                            className="folder-input"
                            label={t("project.browser.folder-select")}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            sx={{
                                                backgroundColor:
                                                    theme.palette.background
                                                        .default,
                                            }}
                                            size="small"
                                            variant="contained"
                                        >
                                            <MdFolder size={24} />
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            startIcon={<MdAdd size={24} />}
                            variant="contained"
                            className="new-btn"
                        >
                            {t("project.browser.new")}
                        </Button>
                    </Box>
                </Paper>
            </Stack>
        </Box>
    );
}
