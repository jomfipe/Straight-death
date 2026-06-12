interface Hitbox {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

interface ChestObject {
  x: number;
  y: number;
  spriteClosed: string;
  spriteOpen: string;
  hitbox: Hitbox;
}

export const chest: ChestObject = {
  x: 86,
  y: 381,
  spriteClosed: "/images/Sprites/png/objects/Chest.png",
  spriteOpen: "/images/Sprites/png/objects/Chest-open.png",
  hitbox: {
    offsetX: 1,
    offsetY: 5,
    width: 16,
    height: 16
  }
};
