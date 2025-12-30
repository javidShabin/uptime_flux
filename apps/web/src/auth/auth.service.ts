let logoutHandler: (() => void) | null = null;

export function registerLogout(fn: () => void) {
  logoutHandler = fn;
}

export function forceLogout() {
  if (logoutHandler) {
    logoutHandler();
  }
}
