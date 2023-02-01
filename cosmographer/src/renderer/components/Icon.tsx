import { IconBaseProps } from "react-icons";
import * as MdIcons from "react-icons/md";

export type IconName = keyof typeof MdIcons;
export function Icon(props: { name: IconName } & IconBaseProps) {
    if (Object.keys(MdIcons).includes(props.name)) {
        const SelectedIcon = MdIcons[props.name];
        return <SelectedIcon {...props} />;
    }
    return <MdIcons.MdHelp {...props} />;
}
