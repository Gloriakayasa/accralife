export interface ModuleRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FModule {
  mod: number;
  x: number;
  y: number;
  flags: number;
}

export interface FrameDef {
  count: number;
  start: number;
}

export interface AnimDef {
  t: number;
  u: number;
  v: number;
  w: number;
  x: number;
}

export interface AFrameDef {
  frame: number;
  delay: number;
}

export interface SpriteMeta {
  type: 'asprite' | 'png';
  file?: string;
  sheet?: string;
  sheet_w?: number;
  sheet_h?: number;
  modules?: (ModuleRect | null)[];
  frames?: FrameDef[];
  fmodules?: FModule[];
  anims?: AnimDef[];
  aframes?: AFrameDef[];
  palettes?: number;
}

export class SpriteManager {
  private catalog: Record<string, SpriteMeta> = {};
  private imageCache: Map<string, HTMLImageElement> = new Map();
  public loaded: boolean = false;

  public async load(): Promise<void> {
    try {
      const res = await fetch('/data/sprites.json');
      if (res.ok) {
        this.catalog = await res.json();
        this.loaded = true;

        // Preload core Gameloft sprite sheets
        const coreSheets = [
          // Room environments (Pack 9)
          'sheet_9_2.png',
          'sheet_9_4.png',
          'sheet_9_7.png',
          'sheet_9_8.png',
          'sheet_9_9.png',
          'sheet_9_11.png',
          'sheet_9_23.png',
          // Furniture & props (Pack 10)
          'sheet_10_1.png',
          'sheet_10_2.png',
          'sheet_10_7.png',
          'sheet_10_8.png',
          'sheet_10_13.png',
          'sheet_10_17.png',
          'sheet_10_20.png',
          'sheet_10_29.png',
          'sheet_10_32.png',
          // City scenery & landmarks (Pack 11)
          'sheet_11_1.png',
          'sheet_11_17.png',
          'sheet_11_20.png',
          'sheet_11_25.png',
          'sheet_11_48.png',
          'sheet_11_52.png',
          'sheet_11_54.png',
          'sheet_11_63.png',
          'sheet_11_64.png',
          'sheet_11_72.png',
          'sheet_11_74.png',
          'sheet_11_104.png',
          // Male character layers (Pack 13)
          'sheet_13_0.png',
          'sheet_13_2.png',
          'sheet_13_3.png',
          'sheet_13_4.png',
          'sheet_13_5.png',
          'sheet_13_6.png',
          'sheet_13_7.png',
          'sheet_13_8.png',
          'sheet_13_11.png',
          'sheet_13_12.png',
          'sheet_13_13.png',
          // Female character layers (Pack 16)
          'sheet_16_0.png',
          'sheet_16_1.png',
          'sheet_16_2.png',
          'sheet_16_3.png',
          'sheet_16_4.png',
          'sheet_16_5.png',
          'sheet_16_6.png',
          'sheet_16_7.png',
          'sheet_16_8.png',
          'sheet_16_10.png',
          'sheet_16_11.png',
          'sheet_16_12.png',
          // UI & emotion badges
          'sheet_15_23.png',
          'sheet_2_0.png'
        ];

        await Promise.all(coreSheets.map((s) => this.preloadImage(s)));
      }
    } catch (e) {
      console.warn('Failed to load sprites.json:', e);
    }
  }

  public async preloadImage(filename: string): Promise<HTMLImageElement | null> {
    if (this.imageCache.has(filename)) {
      return this.imageCache.get(filename)!;
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.src = `/sprites/${filename}`;
      img.onload = () => {
        this.imageCache.set(filename, img);
        resolve(img);
      };
      img.onerror = () => {
        resolve(null);
      };
    });
  }

  public getImage(filename: string): HTMLImageElement | null {
    if (this.imageCache.has(filename)) {
      return this.imageCache.get(filename)!;
    }
    this.preloadImage(filename);
    return null;
  }

  public getMeta(pack: number, rec: number): SpriteMeta | null {
    const key = `${pack}_${rec}`;
    return this.catalog[key] || null;
  }

  public drawModule(
    ctx: CanvasRenderingContext2D,
    pack: number,
    rec: number,
    modIdx: number,
    dx: number,
    dy: number,
    flipH: boolean = false,
    flipV: boolean = false
  ): boolean {
    const meta = this.getMeta(pack, rec);
    if (!meta || !meta.sheet || !meta.modules) return false;

    const img = this.getImage(meta.sheet);
    if (!img) return false;

    const mod = meta.modules[modIdx];
    if (!mod || mod.w <= 0 || mod.h <= 0) return false;

    ctx.save();
    if (flipH || flipV) {
      ctx.translate(dx + (flipH ? mod.w : 0), dy + (flipV ? mod.h : 0));
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, mod.x, mod.y, mod.w, mod.h, 0, 0, mod.w, mod.h);
    } else {
      ctx.drawImage(img, mod.x, mod.y, mod.w, mod.h, dx, dy, mod.w, mod.h);
    }
    ctx.restore();
    return true;
  }

  public drawFrame(
    ctx: CanvasRenderingContext2D,
    pack: number,
    rec: number,
    frameIdx: number,
    dx: number,
    dy: number,
    flipH: boolean = false,
    flipV: boolean = false
  ): boolean {
    const meta = this.getMeta(pack, rec);
    if (!meta || !meta.frames || meta.frames.length === 0 || !meta.fmodules) {
      return this.drawModule(ctx, pack, rec, frameIdx, dx, dy, flipH, flipV);
    }

    if (frameIdx < 0 || frameIdx >= meta.frames.length) return false;
    const fDef = meta.frames[frameIdx];

    let rendered = false;
    for (let i = 0; i < fDef.count; i++) {
      const fmod = meta.fmodules[fDef.start + i];
      if (!fmod) continue;

      const flags = fmod.flags || 0;
      const fmodFlipH = Boolean(flags & 1) !== flipH;
      const fmodFlipV = Boolean(flags & 2) !== flipV;

      // Handle sub-frame recursion
      if ((flags & 0x10) !== 0) {
        const posX = flipH ? dx - fmod.x : dx + fmod.x;
        const posY = flipV ? dy - fmod.y : dy + fmod.y;
        if (this.drawFrame(ctx, pack, rec, fmod.mod, posX, posY, fmodFlipH, fmodFlipV)) {
          rendered = true;
        }
        continue;
      }

      const mod = meta.modules ? meta.modules[fmod.mod] : null;
      const mw = mod ? mod.w : 0;
      const mh = mod ? mod.h : 0;
      const posX = flipH ? dx - fmod.x - mw : dx + fmod.x;
      const posY = flipV ? dy - fmod.y - mh : dy + fmod.y;

      if (this.drawModule(ctx, pack, rec, fmod.mod, posX, posY, fmodFlipH, fmodFlipV)) {
        rendered = true;
      }
    }
    return rendered;
  }

  public drawAnim(
    ctx: CanvasRenderingContext2D,
    pack: number,
    rec: number,
    animIdx: number,
    stepTimer: number,
    dx: number,
    dy: number,
    flipH: boolean = false
  ): boolean {
    const meta = this.getMeta(pack, rec);
    if (!meta || !meta.aframes || !meta.anims) return false;
    if (animIdx < 0 || animIdx >= meta.aframes.length) return false;

    const animDef = meta.aframes[animIdx];
    const totalSteps = animDef.frame;
    if (totalSteps <= 0) return false;

    const stepIdx = Math.floor(stepTimer) % totalSteps;
    const step = meta.anims[animDef.delay + stepIdx];
    if (!step) return false;

    const fidx = step.t | ((step.x & 0xc0) << 2);
    const ox = step.v < 128 ? step.v : step.v - 256;
    const oy = step.w < 128 ? step.w : step.w - 256;
    const aflags = step.x & 0x0f;
    const aflipH = (aflags & 1) !== 0;
    const aflipV = (aflags & 2) !== 0;

    const finalFlipH = aflipH !== flipH;
    const finalX = flipH ? dx - ox : dx + ox;
    const finalY = dy + oy;

    return this.drawFrame(ctx, pack, rec, fidx, finalX, finalY, finalFlipH, aflipV);
  }

  // --- AUTHENTIC GAMELOFT ROOM BACKGROUND RENDERER ---
  public drawEnvironment(ctx: CanvasRenderingContext2D, locationId: string, animTimer: number): void {
    if (locationId === 'osu_apartment' || locationId === 'apartment') {
      // Authentic isometric apartment bedroom & living room: 9_2 Frame 0
      this.drawFrame(ctx, 9, 2, 0, 0, 30);
      this.drawFrame(ctx, 9, 2, 0, 240, 30);
      // Floor decorative rug from Pack 11 (11_52)
      this.drawFrame(ctx, 11, 52, 0, 60, 160);
    } else if (locationId === 'oxford_street') {
      // Authentic bustling Oxford Street / Osu night avenue: 9_8 Frame 4
      this.drawFrame(ctx, 9, 8, 4, 0, 20);
      this.drawFrame(ctx, 9, 8, 4, 240, 20);
      // Newsstand kiosk and Hairdresser salon from Pack 11
      this.drawFrame(ctx, 11, 1, 0, 15, 80);
      this.drawFrame(ctx, 11, 54, 0, 260, 80);
    } else if (locationId === 'jamestown') {
      // Historic Jamestown Harbor & promenade: 9_23 Frame 0
      this.drawFrame(ctx, 9, 23, 0, 0, 20);
      this.drawFrame(ctx, 9, 23, 0, 240, 20);
      this.drawFrame(ctx, 10, 13, 0, 20, 60);
      this.drawFrame(ctx, 10, 13, 0, 380, 60);
    } else if (locationId === 'labadi_beach') {
      // Labadi Beach seaside & turquoise ocean: 9_7 Frame 0
      this.drawFrame(ctx, 9, 7, 0, 0, 20);
      this.drawFrame(ctx, 9, 7, 0, 240, 20);
      this.drawFrame(ctx, 10, 13, 0, 40, 50);
      this.drawFrame(ctx, 10, 13, 0, 320, 50);
    } else if (locationId === 'east_legon_club') {
      // East Legon VIP Club lounge & dance floor: 9_11 Frame 0
      this.drawFrame(ctx, 9, 11, 0, 0, 20);
      this.drawFrame(ctx, 9, 11, 0, 240, 20);
      this.drawFrame(ctx, 11, 63, 0, 180, 70); // DJ Booth
    } else if (locationId === 'makola_market') {
      // Makola Market arcade: 9_4 Frame 0
      this.drawFrame(ctx, 9, 4, 0, 0, 20);
      this.drawFrame(ctx, 9, 4, 0, 240, 20);
      this.drawFrame(ctx, 11, 72, 0, 200, 70);
    } else if (locationId === 'airport_city') {
      this.drawFrame(ctx, 9, 8, 4, 0, 20);
      this.drawFrame(ctx, 9, 8, 4, 240, 20);
      this.drawFrame(ctx, 11, 104, 0, 160, 100);
    } else {
      // Default chop bar & highlife spot
      this.drawFrame(ctx, 9, 2, 0, 0, 30);
      this.drawFrame(ctx, 9, 2, 0, 240, 30);
    }
  }

  // --- AUTHENTIC GAMELOFT FURNITURE & INTERACTIVE PROPS ---
  public drawProp(ctx: CanvasRenderingContext2D, propId: string, x: number, y: number, animTimer: number): void {
    switch (propId) {
      case 'bed':
        this.drawFrame(ctx, 10, 1, 0, x, y);
        break;
      case 'fridge':
      case 'wardrobe':
        this.drawFrame(ctx, 10, 7, 0, x, y);
        break;
      case 'sofa':
      case 'couch':
        this.drawFrame(ctx, 10, 20, 0, x, y);
        break;
      case 'table':
      case 'desk':
        this.drawFrame(ctx, 10, 8, 0, x, y);
        break;
      case 'tv':
        this.drawFrame(ctx, 11, 48, 0, x, y);
        break;
      case 'laptop':
      case 'sound_system':
        this.drawFrame(ctx, 10, 8, 1, x, y);
        break;
      case 'car':
      case 'trotro':
        this.drawFrame(ctx, 10, 29, 0, x, y);
        break;
      case 'bar_counter':
        this.drawFrame(ctx, 10, 17, 0, x, y);
        break;
      case 'dj_booth':
        this.drawFrame(ctx, 11, 63, 0, x, y);
        break;
      case 'palm_tree':
        this.drawFrame(ctx, 10, 13, 0, x, y);
        break;
      case 'chair':
        this.drawFrame(ctx, 10, 2, 0, x, y);
        break;
      case 'newsstand':
        this.drawFrame(ctx, 11, 1, 0, x, y);
        break;
      case 'hairdresser':
        this.drawFrame(ctx, 11, 54, 0, x, y);
        break;
      case 'artshop':
        this.drawFrame(ctx, 11, 72, 0, x, y);
        break;
      case 'subway':
        this.drawFrame(ctx, 11, 104, 0, x, y);
        break;
      default:
        this.drawFrame(ctx, 10, 2, 0, x, y);
        break;
    }
  }

  // --- AUTHENTIC MODULAR GAMELOFT CHARACTER ANIMATOR ---
  public drawCharacter(
    ctx: CanvasRenderingContext2D,
    gender: 'male' | 'female',
    styleOutfit: number, // 0: casual, 1: streetwear / drip, 2: executive / club
    action: 'idle' | 'walk' | 'talk' | 'dance',
    dir: 'down' | 'up' | 'left' | 'right',
    stepTime: number,
    x: number,
    y: number
  ): void {
    const isMale = gender === 'male';
    const isWalking = action === 'walk';
    const isTalking = action === 'talk';
    const isDancing = action === 'dance';

    // Facing direction
    const flipH = dir === 'right';
    const facingBack = dir === 'up';
    const faceMod = facingBack ? 1 : (dir === 'right' ? 2 : 0);

    // Ground contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(x + 9, y + 26, 11, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    if (flipH) {
      ctx.translate(x * 2 + 16, 0);
      ctx.scale(-1, 1);
    }

    if (isMale) {
      // Pack 13
      // Outfits:
      // 0 casual: hoodie (13_5), jeans (13_12), spiky hair (13_2)
      // 1 drip: collared shirt (13_6), shorts (13_11), curly hair (13_3)
      // 2 executive: leather jacket (13_7), trousers (13_13), fade hair (13_4)
      let shirtRec = 5;
      let legRec = 12;
      let hairRec = 2;
      if (styleOutfit === 1) { shirtRec = 6; legRec = 11; hairRec = 3; }
      else if (styleOutfit === 2) { shirtRec = 7; legRec = 13; hairRec = 4; }

      // Leg step frame
      let legFrame = 0;
      if (isWalking) {
        legFrame = (Math.floor(stepTime * 8) % 6);
      } else if (isDancing) {
        legFrame = (Math.floor(stepTime * 6) % 2 === 0) ? 6 : 1;
      }

      // Arm animation
      let leftArm = 0;
      let rightArm = 1;
      if (isWalking) {
        const armCycle = Math.floor(stepTime * 8) % 4;
        leftArm = [0, 4, 0, 6][armCycle] || 0;
        rightArm = [1, 5, 1, 7][armCycle] || 1;
      } else if (isTalking) {
        const talkCycle = Math.floor(stepTime * 4) % 4;
        leftArm = [0, 8, 12, 0][talkCycle] || 0;
      } else if (isDancing) {
        const danceCycle = Math.floor(stepTime * 8) % 4;
        leftArm = [14, 16, 18, 14][danceCycle] || 14;
        rightArm = [15, 17, 19, 15][danceCycle] || 15;
      }

      // Layer 1: Legs / Pants
      this.drawModule(ctx, 13, legRec, legFrame, x, y + 14);
      // Layer 2: Torso
      this.drawModule(ctx, 13, shirtRec, faceMod, x, y);
      // Layer 3: Head
      this.drawModule(ctx, 13, 0, faceMod, x + 3, y - 12);
      // Layer 4: Hair
      this.drawModule(ctx, 13, hairRec, faceMod, x + 3, y - 14);
      // Layer 5: Arms
      this.drawModule(ctx, 13, 8, leftArm, x - 3, y + 2);
      this.drawModule(ctx, 13, 8, rightArm, x + 13, y + 2);

    } else {
      // Female: Pack 16
      // Outfits:
      // 0 casual: cardigan (16_5), skinny jeans (16_11), bob hair (16_2)
      // 1 chic: crop top (16_6), shorts (16_12), long hair (16_3)
      // 2 party dress: evening dress (16_7), slacks (16_11), curly hair (16_4)
      let topRec = 5;
      let legRec = 11;
      let hairRec = 2;
      if (styleOutfit === 1) { topRec = 6; legRec = 12; hairRec = 3; }
      else if (styleOutfit === 2) { topRec = 7; legRec = 11; hairRec = 4; }

      let legFrame = 0;
      if (isWalking) {
        legFrame = (Math.floor(stepTime * 8) % 6);
      } else if (isDancing) {
        legFrame = (Math.floor(stepTime * 6) % 2 === 0) ? 7 : 2;
      }

      let leftArm = 0;
      let rightArm = 1;
      if (isWalking) {
        const armCycle = Math.floor(stepTime * 8) % 4;
        leftArm = [0, 4, 0, 6][armCycle] || 0;
        rightArm = [1, 5, 1, 7][armCycle] || 1;
      } else if (isTalking) {
        const talkCycle = Math.floor(stepTime * 4) % 4;
        leftArm = [0, 8, 10, 0][talkCycle] || 0;
      } else if (isDancing) {
        const danceCycle = Math.floor(stepTime * 8) % 4;
        leftArm = [12, 14, 16, 12][danceCycle] || 12;
        rightArm = [13, 15, 17, 13][danceCycle] || 13;
      }

      // Layer 1: Legs / Skirt
      this.drawModule(ctx, 16, legRec, legFrame, x, y + 14);
      // Layer 2: Torso / Top
      this.drawModule(ctx, 16, topRec, faceMod, x, y);
      // Layer 3: Head
      this.drawModule(ctx, 16, 0, faceMod, x + 3, y - 10);
      // Layer 4: Hair
      this.drawModule(ctx, 16, hairRec, faceMod, x + 3, y - 12);
      // Layer 5: Arms
      this.drawModule(ctx, 16, 8, leftArm, x - 3, y + 2);
      this.drawModule(ctx, 16, 8, rightArm, x + 13, y + 2);
    }

    ctx.restore();
  }

  // --- AUTHENTIC CHARACTER PORTRAIT IN DIALOGS ---
  public drawPortrait(ctx: CanvasRenderingContext2D, charIndex: number, x: number, y: number): void {
    const isMale = charIndex % 2 === 0;
    const pack = isMale ? 13 : 16;
    const outfit = isMale ? 5 + (charIndex % 3) : 5 + (charIndex % 3);
    const hair = isMale ? 2 + (charIndex % 3) : 2 + (charIndex % 3);

    ctx.save();
    // Scaled framed portrait for dialog box
    ctx.translate(x, y);
    ctx.scale(1.4, 1.4);

    // Torso
    this.drawModule(ctx, pack, outfit, 0, 6, 14);
    // Head
    this.drawModule(ctx, pack, 0, 0, 9, 3);
    // Hair
    this.drawModule(ctx, pack, hair, 0, 9, 1);
    ctx.restore();
  }

  // --- EMOTION BUBBLE SPRITE ---
  public drawEmotionBubble(ctx: CanvasRenderingContext2D, emotion: 'heart' | 'cash' | 'music' | 'happy' | 'star', x: number, y: number): void {
    let mod = 44;
    if (emotion === 'heart') mod = 44;
    else if (emotion === 'music') mod = 72;
    else if (emotion === 'happy') mod = 77;
    else if (emotion === 'star') mod = 88;
    else if (emotion === 'cash') mod = 94;

    this.drawModule(ctx, 15, 23, mod, x, y);
  }
}
