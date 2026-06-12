function podeAndar(newX: number, newY: number): boolean {

	// Caminho 1 - Entrada

	if (

		newX >= 368 && newX <= 884 &&

		newY >= 757 && newY <= 805

	) return true;



	// Caminho 2 - Corredor central

	if (

		newX >= 548 && newX <= 644 &&

		newY >= 577 && newY <= 745

	) return true;



	// Caminho 3

	if (

		newX >= 476 && newX <= 716 &&

		newY >= 517 && newY <= 577

	) return true;



	// Caminho 4 - Bifurcação

	if (

		newX >= 344 && newX <= 740 &&

		newY >= 481 && newY <= 517

	) return true;



	// Caminho 5

	if (

		newX >= 476 && newX <= 740 &&

		newY >= 445 && newY <= 481

	) return true;



	// Caminho 6 - Corredor das pilastras

	if (

		newX >= 572 && newX <= 620 &&

		newY >= 301 && newY <= 445

	) return true;



	// Caminho 7 - Portal

	if (

		newX >= 536 && newX <= 656 &&

		newY >= 193 && newY <= 289

	) return true;



	// Entrada da sala dos baús

	if (

		newX >= 308 && newX <= 332 &&

		newY >= 372 && newY <= 565

	) return true;



	// Sala dos baús

	if (

		newX >= 56 && newX <= 296 &&

		newY >= 361 && newY <= 586

	) return true;



	// Final da sala dos baús

	if (

		newX >= 20 && newX <= 56 &&

		newY >= 372 && newY <= 565

	) return true;
	return false;

}

export { podeAndar };
