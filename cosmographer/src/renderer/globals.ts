import { platform } from "./utils/ipc/os";

// Project spec version
export const PROJECT_VERSION: number = 0;

// Maximum recent projects to remember in user_config
export const MAX_RECENT: number = 8;

// Current platform, for convenience
export const PLATFORM = platform();