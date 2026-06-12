<script lang="ts">
  import { goto } from '$app/navigation';
    import { onMount } from "svelte";
	import { podeAndar } from "$lib/maps/mausoleum";
	import { playerConfig } from '$lib/entities/player';
    import { chest } from '$lib/entities/chest';
	import { npc } from '$lib/entities/npc';
	  import { t } from '$lib/translator/il8n';
    
    import { colidiuWithChest, colidiuWithNpc } from '$lib/systems/collision';
   
   	
	let x: number = playerConfig.x;
	let y: number = playerConfig.y;

	const speed: number = playerConfig.speed;
	const sprites: { front: string; back: string; left: string; right: string } = playerConfig.sprites;
	
	const ChestX: number = chest.x;
	const ChestY: number = chest.y;
	const ChestFechadoSprite: string = chest.spriteClosed;
	const ChestAbertoSprite: string = chest.spriteOpen;
	let ChestSprite: string = chest.spriteClosed;
	let ChestOpen: boolean = false;

	const npcX: number = npc.x;
	const npcY: number = npc.y;
	const npcSprite: string = npc.sprite;
    let mostrarDialogoNpc: boolean = false;

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
	let direction: Direction = "back";
    // Supondo que você tenha os sprites nessas pastas
    
  function move(event: KeyboardEvent): void {
        let newX: number = x;
        let newY: number = y;

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
    

onMount((): (() => void) => {
  window.addEventListener("keydown", move);
  return (): void => {
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
		<p>{$t("npc.dialog")}</p>

		<button
			on:click={() => mostrarDialogoNpc = false}
		>
			{$t("npc.close")}
		</button>
	</div>
{/if}
