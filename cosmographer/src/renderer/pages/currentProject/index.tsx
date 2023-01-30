import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "renderer/utils/globalState";

export function CurrentProjectPage() {
    const [project, setProject] = useGlobal("project");
    const nav = useNavigate();

    useEffect(() => {
        if (!project) {
            nav("/");
        }
    }, [project]);

    return <></>;
}
