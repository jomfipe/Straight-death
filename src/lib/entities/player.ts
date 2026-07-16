type PlayerConfig = {
	x: number;
	y: number;
	speed: number;
	direction: "front" | "back" | "left" | "right";
	sprites: {
		front: string;
		back: string;
		left: string;
		right: string;
	};
};

export const playerConfig: PlayerConfig = {
	x: 596,
	y: 805,
	speed: 12,
	direction: "back",
	sprites: {
		front: "/images/Sprites/png/npcs/protagonista/frente-0001.png",
		back: "/images/Sprites/png/npcs/protagonista/costas-1.png",
		left: "/images/Sprites/png/npcs/protagonista/ladoesquerdo-1.png",
		right: "/images/Sprites/png/npcs/protagonista/ladodireito-1.png"
	}
};