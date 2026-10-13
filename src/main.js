import { LibMedia } from "../libmedia/libmedia.js";
import { LibMidi, createUnlockingAudioContext } from "../libmidi/libmidi.js";
import { codeMap, KeyRepeatManager } from "./key.js";
import { EventQueue } from "./eventqueue.js";
import { initKbdListeners, setKbdHandler, kbdWidth, kbdHeight } from "./screenKbd.js";

// we need to import natives here, don't use System.loadLibrary
// since CheerpJ fails to load them in firefox and we can't set breakpoints
import canvasFontNatives from "../libjs/libcanvasfont.js";
import canvasGraphicsNatives from "../libjs/libcanvasgraphics.js";
import gles2Natives from "../libjs/libgles2.js";
import jsReferenceNatives from "../libjs/libjsreference.js";
import mediaBridgeNatives from "../libjs/libmediabridge.js";
import midiBridgeNatives from "../libjs/libmidibridge.js";

const evtQueue = new EventQueue();
const sp = new URLSearchParams(location.search);

const cheerpjWebRoot = '/app'+location.pathname.replace(/\/[^/]*$/,'');

let isMobile = sp.get('mobile');

let display = null;
let screenCtx = null;

let fractionScale = sp.get('fractionScale') || (localStorage && localStorage.getItem("pl.zb3.freej2me.fractionScale") === "true");
let scaleSet = false;

const keyRepeatManager = new KeyRepeatManager();

window.evtQueue = evtQueue;

function autoscale() {
    if (!scaleSet) return;

    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    const leftKeys = document.getElementById('left-keys');
    const rightKeys = document.getElementById('right-keys');
    if (leftKeys) leftKeys.style.display = 'none';
    if (rightKeys) rightKeys.style.display = 'none';

    let scale = Math.min(
        screenWidth / screenCtx.canvas.width,
        (screenHeight - 48) / screenCtx.canvas.height
    );

    if (!fractionScale) {
        scale = Math.max(1, scale | 0);
    }

    display.style.zoom = scale;
}

function setListeners() {
    let mouseDown = false;
    let noMouse = false;

    window.tapGameKey = (key, duration = 120) => {
        if (!codeMap[key]) return;
        const symbol = key.startsWith('Digit') ? key.substring(5) : '\x00';
        keyRepeatManager.post(true, key, {symbol, ctrlKey: false, shiftKey: false});
        setTimeout(() => {
            keyRepeatManager.post(false, key, {symbol, ctrlKey: false, shiftKey: false});
        }, duration);
    };

    window.sendGameKey = (key, isDown = true) => {
        if (!codeMap[key]) return;
        const symbol = key.startsWith('Digit') ? key.substring(5) : '\x00';
        keyRepeatManager.post(isDown, key, {symbol, ctrlKey: false, shiftKey: false});
    };

    setKbdHandler((isDown, key) => {
        const symbol = key.startsWith('Digit') ? key.substring(5) : '\x00';
        keyRepeatManager.post(isDown, key, {symbol, ctrlKey: false, shiftKey: false});
    });

    function handleKeyEvent(e) {
        const isDown = e.type === 'keydown';

        if (codeMap[e.code]) {
            keyRepeatManager.post(isDown, e.code, {
                symbol: e.key.length == 1 ? e.key.charCodeAt(0) : '\x00',
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey
            })
        }
        e.preventDefault();
    }

    display.addEventListener('keydown', handleKeyEvent);
    display.addEventListener('keyup', handleKeyEvent);

    keyRepeatManager.register((kind, key, args) => {
        if (kind === 'click') {
            if (key === 'Maximize') {
                fractionScale = !fractionScale;
                localStorage && localStorage.setItem("pl.zb3.freej2me.fractionScale", fractionScale);
                autoscale();
            }
        } else if (codeMap[key]) {
            evtQueue.queueEvent({
                kind: kind === 'up' ? 'keyup' : 'keydown',
                args: [codeMap[key], args.symbol, args.ctrlKey, args.shiftKey]
            });
        }
    });

    function getCanvasCoords(clientX, clientY) {
        const rect = display.getBoundingClientRect();
        if (!rect.width || !rect.height) return { x: 160, y: 120 };
        const targetW = (screenCtx && screenCtx.canvas && screenCtx.canvas.width) ? screenCtx.canvas.width : 320;
        const targetH = (screenCtx && screenCtx.canvas && screenCtx.canvas.height) ? screenCtx.canvas.height : 240;
        const x = Math.round(((clientX - rect.left) / rect.width) * targetW);
        const y = Math.round(((clientY - rect.top) / rect.height) * targetH);
        return {
            x: Math.max(0, Math.min(targetW, x)),
            y: Math.max(0, Math.min(targetH, y))
        };
    }

    display.addEventListener('mousedown', async e => {
        display.focus();
        if (noMouse) return;

        const c = getCanvasCoords(e.clientX, e.clientY);
        evtQueue.queueEvent({
            kind: 'pointerpressed',
            x: c.x,
            y: c.y,
        });

        mouseDown = true;
        e.preventDefault();
    });

    display.addEventListener('mousemove', async e => {
        if (noMouse) return;
        if (!mouseDown) return;

        const c = getCanvasCoords(e.clientX, e.clientY);
        evtQueue.queueEvent({
            kind: 'pointerdragged',
            x: c.x,
            y: c.y,
        });

        e.preventDefault();
    });

    document.addEventListener('mouseup', async e => {
        if (noMouse) return;
        if (!mouseDown) return;

        mouseDown = false;

        const c = getCanvasCoords(e.clientX, e.clientY);
        evtQueue.queueEvent({
            kind: 'pointerreleased',
            x: c.x,
            y: c.y,
        });

        e.preventDefault();
    });

    display.addEventListener('touchstart', async e => {
        display.focus();
        noMouse = true;

        if (e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            const c = getCanvasCoords(touch.clientX, touch.clientY);
            evtQueue.queueEvent({
                kind: 'pointerpressed',
                x: c.x,
                y: c.y,
            });
        }

        e.preventDefault();
    }, {passive: false});

    display.addEventListener('touchmove', async e => {
        noMouse = true;

        if (e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            const c = getCanvasCoords(touch.clientX, touch.clientY);
            evtQueue.queueEvent({
                kind: 'pointerdragged',
                x: c.x,
                y: c.y,
            });
        }

        e.preventDefault();
    }, {passive: false});

    display.addEventListener('touchend', async e => {
        noMouse = true;

        if (e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            const c = getCanvasCoords(touch.clientX, touch.clientY);
            evtQueue.queueEvent({
                kind: 'pointerreleased',
                x: c.x,
                y: c.y,
            });
        }

        e.preventDefault();
    });

    document.addEventListener('mousedown', e => {
        console.log('refocus');
        setTimeout(() => display.focus(), 20);
        ;
    });

    display.addEventListener('blur', e => {
        console.log('refocus');
        // it doesn't work without any timeout
        setTimeout(() => display.focus(), 10);
        ;
    });

    window.addEventListener('resize', autoscale);

    initKbdListeners();
}

function setFaviconFromBuffer(arrayBuffer) {
    // Keep custom high-res Accra Life SVG/PNG favicon; do not overwrite
}

function updateLoadingStatus(msg) {
    const el = document.getElementById("loading-status");
    if (el) el.textContent = msg;
}

async function init() {
    updateLoadingStatus("Starting Accra Life...");

    display = document.getElementById('display');
    screenCtx = display.getContext('2d');
    window.screenCtx = screenCtx;

    setListeners();

    try {
        window.libmidi = new LibMidi(createUnlockingAudioContext());
        await window.libmidi.init();
        window.libmidi.midiPlayer.addEventListener('end-of-media', e => {
            window.evtQueue.queueEvent({kind: 'player-eom', player: e.target});
        });
    } catch(err) {
        console.warn("MIDI audio initialization deferred or unsupported:", err);
    }
    window.libmedia = new LibMedia();

    updateLoadingStatus("Preparing game engine...");

    await cheerpjInit({
        enableDebug: false,
        natives: {
            ...canvasFontNatives,
            ...canvasGraphicsNatives,
            ...gles2Natives,
            ...jsReferenceNatives,
            ...mediaBridgeNatives,
            ...midiBridgeNatives,
            async Java_pl_zb3_freej2me_bridge_shell_Shell_setTitle(lib, title) {
                document.title = "Accra Life - Alvyd Retro Mobile Simulator";
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_setIcon(lib, iconBytes) {
                // Keep custom high-res Accra Life SVG/PNG favicon; do not overwrite with 16x16 icon
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_getScreenCtx(lib) {
                return screenCtx;
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_setCanvasSize(lib, width, height) {
                if (!scaleSet) {
                    const loadEl = document.getElementById('loading');
                    if (loadEl) {
                        loadEl.hidden = true;
                        loadEl.style.display = 'none';
                    }
                    display.style.display = '';
                    scaleSet = true;
                    display.focus();
                }
                screenCtx.canvas.width = width;
                screenCtx.canvas.height = height;
                autoscale();
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_waitForAndDispatchEvents(lib, listener) {
                const KeyEvent = await lib.pl.zb3.freej2me.bridge.shell.KeyEvent;
                const PointerEvent = await lib.pl.zb3.freej2me.bridge.shell.PointerEvent;

                const evt = await evtQueue.waitForEvent();
                if (evt.kind == 'keydown') {
                    await listener.keyPressed(await new KeyEvent(...evt.args));
                } else if (evt.kind == 'keyup') {
                    await listener.keyReleased(await new KeyEvent(...evt.args));
                } else if (evt.kind == 'pointerpressed') {
                    await listener.pointerPressed(await new PointerEvent(evt.x, evt.y));
                } else if (evt.kind == 'pointerdragged') {
                    await listener.pointerDragged(await new PointerEvent(evt.x, evt.y));
                } else if (evt.kind == 'pointerreleased') {
                    await listener.pointerReleased(await new PointerEvent(evt.x, evt.y));
                } else if (evt.kind == 'player-eom') {
                    await listener.playerEOM(evt.player);
                } else if (evt.kind == 'player-video-frame') {
                    await listener.playerVideoFrame(evt.player);
                }
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_restart(lib) {
                location.reload();
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_exit(lib) {
                location.href = './';
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_sthop(lib) {
                debugger;
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_say(lib, sth) {
                console.log('[say]', sth);
            },
            async Java_pl_zb3_freej2me_bridge_shell_Shell_sayObject(lib, label, obj) {
                debugger;
                console.log('[sayobject]', label, obj);
            }
        }
    });

    if (typeof cheerpjAddCustomConsole === 'function') {
        cheerpjAddCustomConsole((buf) => {
            try {
                const text = new TextDecoder('utf-8').decode(buf);
                console.log('[JAVA STDOUT]', text.trimEnd());
            } catch (e) {
                console.log('[JAVA STDOUT]', buf);
            }
        });
    }

    updateLoadingStatus("Loading game engine...");

    const lib = await cheerpjRunLibrary(cheerpjWebRoot+"/freej2me-web.jar");
    window.lib = lib;

    const FreeJ2ME = await lib.org.recompile.freej2me.FreeJ2ME;

    let args;

    const jarToRun = sp.get('jar');
    if (jarToRun) {
        args = ['jar', cheerpjWebRoot + "/jar/" + jarToRun];
    } else {
        const appToRun = sp.get('app') || 'accralife';
        updateLoadingStatus("Loading Accra Life...");

        try {
            const hasApp = await cjFileBlob(appToRun + "/app.jar") || await cjFileBlob("/files/" + appToRun + "/app.jar");
            if (!hasApp) {
                const launcherUtil = await lib.pl.zb3.freej2me.launcher.LauncherUtil;
                try {
                    await launcherUtil.installFromBundle(cheerpjWebRoot + "/apps/", appToRun);
                } catch(e) {
                    console.warn("installFromBundle failed, trying init.zip:", e);
                    const zipPath = (location.pathname.replace(/\/[^/]*$/, '') || '') + "/init.zip";
                    const res = await fetch(zipPath);
                    if (res.ok) {
                        const ab = await res.arrayBuffer();
                        await launcherUtil.importData(new Int8Array(ab));
                    }
                }
            }
        } catch(e) {
            console.warn("App verification failed, fallback to direct jar:", e);
        }

        const verifyApp = await cjFileBlob(appToRun + "/app.jar") || await cjFileBlob("/files/" + appToRun + "/app.jar");
        if (verifyApp) {
            args = ['app', appToRun];
        } else {
            args = ['jar', cheerpjWebRoot + "/jar/game.jar"];
        }
    }

    updateLoadingStatus("Starting Accra Life...");

    FreeJ2ME.main(args).catch(e => {
        e.printStackTrace();
        updateLoadingStatus("Error starting game. Tap to reload.");
    });
}

init();