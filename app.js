/*
 * This small Node.js script listens for changes to the GNOME wallpaper file.
 *
 * It uses the Linux command `inotifywait`, which talks directly to the kernel
 * and reports file system events in real time.
 *
 * Here's what happens:
 * 1. We start `inotifywait` to watch the ~/.config directory for any file that
 *    finishes writing (the CLOSE_WRITE event).
 * 2. Whenever data comes in, we check if the event line ends with "background"
 *    and contains CLOSE_WRITE — meaning the wallpaper file was updated.
 * 3. When that happens, we immediately log "[info] Background changed".
 * 4. After that, we ignore any further events for one second to avoid multiple
 *    messages when the file is rewritten several times quickly.
 *
 * This gives one clean message each time the background image changes,
 * without flooding the console.
 */

import { spawn } from 'node:child_process'

const configDir = `${process.env.HOME}/.config`
const child = spawn('inotifywait', ['-m', '-e', 'close_write', configDir])
child.stdout.setEncoding('utf8')

let isThrottled = false

child.stdout.on('data', data => {
    for (const line of data.split('\n')) {
        if (!line.includes('CLOSE_WRITE') || !line.endsWith('background')) continue

        if (isThrottled) continue

        console.log('[info] Background changed')
        isThrottled = true

        setTimeout(() => isThrottled = false, 1000)
    }
})
