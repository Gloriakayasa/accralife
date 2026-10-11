export class Input {
  private keysDown: Set<string> = new Set();
  private keysPressed: Set<string> = new Set();
  private keysReleased: Set<string> = new Set();

  public mouseX: number = 0;
  public mouseY: number = 0;
  public mouseClicked: boolean = false;
  public mouseDown: boolean = false;

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initKeyboard();
    this.initTouchButtons();
    this.initMouseTouchCanvas();
  }

  private initKeyboard(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const code = e.code;
      if (!this.keysDown.has(code)) {
        this.keysPressed.add(code);
      }
      this.keysDown.add(code);

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      const code = e.code;
      this.keysDown.delete(code);
      this.keysReleased.add(code);
    });
  }

  private initTouchButtons(): void {
    const buttons = document.querySelectorAll<HTMLElement>('[data-key]');
    buttons.forEach((btn) => {
      const key = btn.getAttribute('data-key')!;
      
      const press = (e: Event) => {
        e.preventDefault();
        if (!this.keysDown.has(key)) {
          this.keysPressed.add(key);
        }
        this.keysDown.add(key);
      };

      const release = (e: Event) => {
        e.preventDefault();
        this.keysDown.delete(key);
        this.keysReleased.add(key);
      };

      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);

      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });
    });
  }

  private initMouseTouchCanvas(): void {
    const updateCoords = (clientX: number, clientY: number) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = 320 / rect.width;
      const scaleY = 240 / rect.height;
      this.mouseX = Math.floor((clientX - rect.left) * scaleX);
      this.mouseY = Math.floor((clientY - rect.top) * scaleY);
    };

    this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      updateCoords(e.clientX, e.clientY);
      this.mouseDown = true;
      this.mouseClicked = true;
    });

    window.addEventListener('mouseup', () => {
      this.mouseDown = false;
    });

    this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      updateCoords(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
        this.mouseDown = true;
        this.mouseClicked = true;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouseDown = false;
    });
  }

  public update(): void {
    this.keysPressed.clear();
    this.keysReleased.clear();
    this.mouseClicked = false;
  }

  public isDown(key: string): boolean {
    if (this.keysDown.has(key)) return true;
    if (key === 'ArrowUp' && (this.keysDown.has('KeyW') || this.keysDown.has('Numpad8'))) return true;
    if (key === 'ArrowDown' && (this.keysDown.has('KeyS') || this.keysDown.has('Numpad2'))) return true;
    if (key === 'ArrowLeft' && (this.keysDown.has('KeyA') || this.keysDown.has('Numpad4'))) return true;
    if (key === 'ArrowRight' && (this.keysDown.has('KeyD') || this.keysDown.has('Numpad6'))) return true;
    if (key === 'Enter' && (this.keysDown.has('Space') || this.keysDown.has('KeyZ') || this.keysDown.has('Numpad5'))) return true;
    if (key === 'Escape' && (this.keysDown.has('KeyX') || this.keysDown.has('Backspace'))) return true;
    if (key === 'SoftLeft' && (this.keysDown.has('KeyQ') || this.keysDown.has('F1'))) return true;
    if (key === 'SoftRight' && (this.keysDown.has('KeyE') || this.keysDown.has('F2') || this.keysDown.has('Escape'))) return true;
    if (key === 'Phone' && this.keysDown.has('KeyP')) return true;
    return false;
  }

  public isJustPressed(key: string): boolean {
    if (this.keysPressed.has(key)) return true;
    if (key === 'ArrowUp' && (this.keysPressed.has('KeyW') || this.keysPressed.has('Numpad8'))) return true;
    if (key === 'ArrowDown' && (this.keysPressed.has('KeyS') || this.keysPressed.has('Numpad2'))) return true;
    if (key === 'ArrowLeft' && (this.keysPressed.has('KeyA') || this.keysPressed.has('Numpad4'))) return true;
    if (key === 'ArrowRight' && (this.keysPressed.has('KeyD') || this.keysPressed.has('Numpad6'))) return true;
    if (key === 'Enter' && (this.keysPressed.has('Space') || this.keysPressed.has('KeyZ') || this.keysPressed.has('Numpad5'))) return true;
    if (key === 'Escape' && (this.keysPressed.has('KeyX') || this.keysPressed.has('Backspace'))) return true;
    if (key === 'SoftLeft' && (this.keysPressed.has('KeyQ') || this.keysPressed.has('F1'))) return true;
    if (key === 'SoftRight' && (this.keysPressed.has('KeyE') || this.keysPressed.has('F2') || this.keysPressed.has('Escape'))) return true;
    if (key === 'Phone' && this.keysPressed.has('KeyP')) return true;
    return false;
  }

  public setSoftkeyLabels(left: string, right: string): void {
    const lsk = document.getElementById('lbl-lsk');
    const rsk = document.getElementById('lbl-rsk');
    if (lsk) lsk.textContent = left;
    if (rsk) rsk.textContent = right;
  }
}
