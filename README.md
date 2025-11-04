# GNOME Wallpaper Watcher

A tiny Node utility that detects when your GNOME wallpaper changes.

It uses the Linux `inotifywait` command to listen directly to kernel file events.
When a background is changed in GNOME, it copies it to `~/.config/background`,
which this script watches for changes. Whenever GNOME updates your wallpaper, it rewrites this file:

```
~/.config/background
```

This script watches that directory for **`CLOSE_WRITE`** events and prints  
a single message every time the wallpaper changes.

Example output:

```
[info] Background changed
````

It also throttles notifications so that multiple rapid file writes (which GNOME often does)
only produce one clean message.

---

## Requirements

- `inotify-tools` installed:

```bash
  $ sudo apt install inotify-tools
```

## Usage

Clone or copy the script and run it directly:

```bash
node app.js
```

Leave it running in the background — you’ll see `[info] Background changed`
each time you switch wallpapers.

---

## How It Works

* Spawns `inotifywait -m -e close_write ~/.config`
* Filters lines that mention `background`
* Prints a message right away (rising edge)
* Ignores further events for one second to prevent duplicates
