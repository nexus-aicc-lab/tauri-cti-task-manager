import {
    getCurrentWindow,
    availableMonitors,
} from '@tauri-apps/api/window';

interface PopupPositionOptions {
    width: number;
    height: number;
    offsetY?: number;
}

export async function getPopupPosition({
    width,
    height,
    offsetY = 10,
}: PopupPositionOptions): Promise<{ x: number; y: number }> {
    const win = getCurrentWindow();
    const [pos, size, scale] = await Promise.all([
        win.outerPosition(),
        win.outerSize(),
        win.scaleFactor(),
    ]);

    const x = pos.x / scale;
    const y = pos.y / scale;
    const w = size.width / scale;
    const h = size.height / scale;

    let newX = Math.round(x + (w - width) / 2);
    let newY = Math.round(y + h + offsetY);

    const monitors = await availableMonitors();
    const monitor = monitors.find((m) => {
        const mx = m.position.x / m.scaleFactor;
        const my = m.position.y / m.scaleFactor;
        const mw = m.size.width / m.scaleFactor;
        const mh = m.size.height / m.scaleFactor;

        return newX >= mx && newX < mx + mw && newY >= my && newY < my + mh;
    }) ?? monitors[0];

    const monitorY = monitor.position.y / monitor.scaleFactor;
    const monitorH = monitor.size.height / monitor.scaleFactor;

    if (newY + height > monitorY + monitorH) {
        newY = y - height - offsetY;
    }

    return { x: newX, y: newY };
}
