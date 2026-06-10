<script lang="ts">
  import { goto } from '$app/navigation';
    import { onMount } from "svelte";
	import { podeAndar } from "$lib/maps/mausoleum";
	import { playerConfig } from '$lib/entities/player';
    import { chest } from '$lib/entities/chest';
	import { npc } from '$lib/entities/npc';
    
    import { colidiuWithChest, colidiuWithNpc } from '$lib/systems/collision';
   
   	
	let x = playerConfig.x;
	let y = playerConfig.y;

	const speed = playerConfig.speed;
	const sprites = playerConfig.sprites;
	
	const ChestX = chest.x;
	const ChestY = chest.y;
	const ChestFechadoSprite = chest.spriteClosed;
	const ChestAbertoSprite = chest.spriteOpen;
	let ChestSprite = chest.spriteClosed;
	let ChestOpen = false;

	const npcX = npc.x;
	const npcY = npc.y;
	const npcSprite = npc.sprite;
    let mostrarDialogoNpc = false;

	function nearthechest(): boolean {
	return (
		Math.abs(x - ChestX) < 80 &&
		Math.abs(y - ChestY) < 80
	);
}
function nearNpc(): boolean {
	return (
		Math.abs(x - npc.x) < 80 &&
		Math.abs(y - npc.y) < 80
	);
}
function handleKey(event: KeyboardEvent): void {
	if (event.key === 'Escape') {
		goto('/');
	}

	if (
		event.key.toLowerCase() === 'x' &&
		nearthechest() &&
		!ChestOpen
	) {
		ChestOpen = true;
		ChestSprite = ChestAbertoSprite;
	}
    
    if (
	event.key.toLowerCase() === 'x' &&
	nearNpc()
) {
	mostrarDialogoNpc = true;
}
  }

  

	type Direction = "front" | "back" | "left" | "right";
	let direction: Direction = "front";
    // Supondo que você tenha os sprites nessas pastas
    
  function move(event: KeyboardEvent): void {
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
        }if (colidiuWithNpc(newX, newY)) {
	    return;
}

if (
	podeAndar(newX, newY) &&
	!colidiuWithChest(newX, newY)
) {
	x = newX;
	y = newY;
}
	// Se saiu de perto do baú, ele fecha
	if (!nearthechest() && ChestOpen) {
		ChestOpen = false;
		ChestSprite = ChestFechadoSprite;
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
    /><img
    src={ChestSprite}
    alt="Chest"
    class="chest"
    style="left: {ChestX}px; top: {ChestY}px;"
/>
<img
	src={npcSprite}
	alt="NPC"
	class="npc"
	style="left: {npcX}px; top: {npcY}px;"
/>

	<div class="debug">
	X: {x}<br>
	Y: {y}<br>
	
</div>

</div>
{#if mostrarDialogoNpc}
	<div class="dialogo">
		<p>
			Olá viajante! O portal está selado.Para Prosseguir, pegue o amuleto que está
            dentro do baú. Você precisará dele para enfrentar os desafios que estão por vir. Boa sorte!
		</p>

		<button
			on:click={() => mostrarDialogoNpc = false}
		>
			Fechar
		</button>
	</div>
{/if}