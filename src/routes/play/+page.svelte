<script lang="ts">
	import { onMount } from "svelte";

	let x = 185;
	let y = 185;
	const speed = 40;
    let mapaAtual = 'casa';

	function move(event: KeyboardEvent) {
		switch (event.key) {
			case "ArrowUp":
				y -= speed;
				break;
			case "ArrowDown":
				y += speed;
				break;
			case "ArrowLeft":
				x -= speed;
				break;
			case "ArrowRight":
				x += speed;
				break;
		}
	
	}

	onMount(() => {
		window.addEventListener("keydown", move);

		return () => {
			window.removeEventListener("keydown", move);
		};
	});
	

</script>


<div class="game-screen">
	<img
	src="images/Sprites/png/map/house.png"
		alt="house"
		class="house"
	
	/>

	<img
		src="/images/Sprites/png/npcs/protagonista/frente-0001.png"
		alt="Protagonista"
		class="player"
		style="left: {x}px; top: {y}px;"
	/>
</div>

<style>
.game-screen {
		width: 1400px;
		height: 900px;
		background: black;
		border: 2px solid white;
		position: relative;
		margin: 50px auto;
	}

.house {
	width: 1400px;
	height: 900px;
	position: absolute;
	left: 0;
	top: 0;
	image-rendering: pixelated;
}
.player {
		width: 128px;
		height: 256px;
		position: absolute;
		image-rendering: pixelated;
		
	}


</style>