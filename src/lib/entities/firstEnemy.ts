interface Hitbox {
	offsetX: number;
	offsetY: number;
	width: number;
	height: number;
}

interface FirstEnemyObject {
	x: number;
	y: number;
	sprite: string;
	hitbox: Hitbox;
}

export const firstEnemy: FirstEnemyObject = {
	x: 764,
	y: 481,
	sprite: "/images/Sprites/png/npcs/firstEnemy/firstEnemy.png",
	hitbox: {
		offsetX: 8,
		offsetY: 12,
		width: 48,
		height: 52
	}
};
