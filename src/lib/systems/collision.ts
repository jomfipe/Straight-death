export function podeAndar(
	newX: number,
	newY: number,
	areasPermitidas: any[]
): boolean {
	return areasPermitidas.some(area =>
		newX >= area.xMin &&
		newX <= area.xMax &&
		newY >= area.yMin &&
		newY <= area.yMax
	);
}

export function colidiuComObjeto(
	newX: number,
	newY: number,
	objeto: any
): boolean {
	const playerHitbox = {
		offsetX: 16,
		offsetY: 32,
		width: 32,
		height: 24
	};

	const playerLeft = newX + playerHitbox.offsetX;
	const playerTop = newY + playerHitbox.offsetY;
	const playerRight = playerLeft + playerHitbox.width;
	const playerBottom = playerTop + playerHitbox.height;

	const objLeft = objeto.x + objeto.hitbox.offsetX;
	const objTop = objeto.y + objeto.hitbox.offsetY;
	const objRight = objLeft + objeto.hitbox.width;
	const objBottom = objTop + objeto.hitbox.height;

	return (
		playerLeft < objRight &&
		playerRight > objLeft &&
		playerTop < objBottom &&
		playerBottom > objTop
	);
}