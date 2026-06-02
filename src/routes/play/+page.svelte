<script lang="ts">
	import { onMount } from "svelte";

	let x: number = 185;
	let y: number = 185;
	const speed: number = 40;

	let direction: string = "front";

	const sprites: { [key: string]: string } = {
		front: "/images/Sprites/png/npcs/protagonista/frente-0001.png",
		back: "/images/Sprites/png/npcs/protagonista/costas-1.png",
		left: "/images/Sprites/png/npcs/protagonista/ladoesquerdo-1.png",
		right: "/images/Sprites/png/npcs/protagonista/ladodireito-1.png",
	};

	function move(event: KeyboardEvent): void {
		switch (event.key.toLowerCase()) {
			case "arrowup":
			case "w":
				y -= speed;
				direction = "back";
				break;

			case "arrowdown":
			case "s":
				y += speed;
				direction = "front";
				break;

			case "arrowleft":
			case "a":
				x -= speed;
				direction = "left";
				break;

			case "arrowright":
			case "d":
				x += speed;
				direction = "right";
				break;
		}
	}

onMount(() => {
	const handleKeyDown = (event: KeyboardEvent) => move(event);

	window.addEventListener("keydown", handleKeyDown);

	return () => {
		window.removeEventListener("keydown", handleKeyDown);
	};
});
</script>

<div class="game-screen">
	<img
		src="/images/Sprites/png/map/house.png"
		alt="house"
		class="house"
	/>

	<img
		src={sprites[direction]}
		alt="player"
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
