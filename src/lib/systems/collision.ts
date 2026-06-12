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
	objeto: { x: number; y: number },
	distancia: number = 48
): boolean {
	return (
		Math.abs(newX - objeto.x) < distancia &&
		Math.abs(newY - objeto.y) < distancia
	);
}