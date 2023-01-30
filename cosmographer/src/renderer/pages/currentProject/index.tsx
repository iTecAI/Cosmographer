import { AppBar, Button, Paper, Toolbar, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "renderer/utils/globalState";
import { Resizable } from "react-resizable";
import "./style.scss";
import "react-resizable/css/styles.css";
import { MdDragIndicator } from "react-icons/md";
import { CosmMenu } from "renderer/components/menu/MenuItem";

export function CurrentProjectPage() {
    const [project, setProject] = useGlobal("project");
    const nav = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        if (!project) {
            nav("/");
        }
    }, [project]);

    const [sidebarWidth, setSidebarWidth] = useState<number>(256);

    return (
        <Box className="project-page-layout">
            <AppBar className="controls">
                <Box
                    className="menus"
                    sx={{
                        width: `${sidebarWidth}px`,
                        borderRight: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <CosmMenu
                        items={[
                            {
                                text: "test",
                            },
                        ]}
                        trigger={(params) => (
                            <Button {...params} className="control-menu">
                                File
                            </Button>
                        )}
                    />
                </Box>
            </AppBar>
            <Resizable
                axis="x"
                minConstraints={[256, 0]}
                maxConstraints={[720, 0]}
                width={sidebarWidth}
                className="sidebar-container"
                onResize={(e, data) => setSidebarWidth(data.size.width)}
                resizeHandles={["e"]}
                handle={
                    <div className="drag-handle">
                        <Paper elevation={4} className="drag-paper">
                            <MdDragIndicator size={24} />
                        </Paper>
                    </div>
                }
            >
                <Paper
                    className="sidebar"
                    sx={{ width: `${sidebarWidth}px` }}
                ></Paper>
            </Resizable>
            <Box
                className="content"
                sx={{ width: `calc(100vw - ${sidebarWidth}px)` }}
            ></Box>
        </Box>
    );
}
