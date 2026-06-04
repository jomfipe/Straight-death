<script lang="ts">
  import { goto } from '$app/navigation';
    import { onMount } from "svelte";

    // Posição inicial: Centralizado no primeiro degrau da escada de entrada
   	let x = 560;
	let y = 745;
    const speed = 12;

	function handleKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') goto('/');
  }

  

	type Direction = "front" | "back" | "left" | "right";
	let direction: Direction = "front";
    // Supondo que você tenha os sprites nessas pastas
    const sprites = {
        front: "/images/Sprites/png/npcs/protagonista/frente-0001.png",
        back: "/images/Sprites/png/npcs/protagonista/costas-1.png",
        left: "/images/Sprites/png/npcs/protagonista/ladoesquerdo-1.png",
        right: "/images/Sprites/png/npcs/protagonista/ladodireito-1.png",
    };
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
}    function move(event: KeyboardEvent): void {
        let newX = x;
        let newY = y;

        switch (event.key.toLowerCase()) {
            case "arrowup":
            case "w":
                newY -= speed;
                direction = "back";
                break;
            case "arrowdown":
            case "s":
                newY += speed;
                direction = "front";
                break;
            case "arrowleft":
            case "a":
                newX -= speed;
                direction = "left";
                break;
            case "arrowright":
            case "d":
                newX += speed;
                direction = "right";
                break;
            default:
                return;
        }

        
 if (podeAndar(newX, newY)) {
	x = newX;
	y = newY;
}       
    }

    onMount(() => {
        window.addEventListener("keydown", move);
        return () => {
            window.removeEventListener("keydown", move);
        };
    });
</script>

<svelte:window on:keydown={handleKey} />


<div class="game-screen">
    <img
        src="/images/Sprites/png/map/mausoleum.png"
        alt="mausoleum"
        class="mausoleum"
    />

    <img
        src={sprites[direction]}
        alt="player"
        class="player"
        style="left: {x}px; top: {y}px;"
    />
	<div class="debug">
	X: {x}<br>
	Y: {y}<br>
	
</div>

</div>
