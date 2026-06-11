interface Hitbox {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

interface NpcObject {
  x: number;
  y: number;
  sprite: string;
  hitbox: Hitbox;
}

export const npc: NpcObject = {
  x: 596,
  y: 205,
  sprite: "/images/Sprites/png/npcs/npc1/npc.png",
  hitbox: {
    offsetX: 10,
    offsetY: 20,
    width: 44,
    height: 44
  }
};