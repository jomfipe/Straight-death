<script lang="ts">
	import { goto } from '$app/navigation';

	const gameTitle: string = "STRAIGHT";
	const gameSubtitle: string = "DEATH";

	function showAlert(): void {
		alert("Still on development!");
	}

     function play(): void {
	     goto('/play');
	}

    function credits(): void {
	     goto('/credits');
	}
</script>

<div class="menu-background">
	<div class="container">
		<h1 class="title">{gameTitle}</h1>
		<h2 class="subtitle">{gameSubtitle}</h2>

		<button class="play" on:click={play}>
			<img src="/images/Menu/play.svg" class="play-icon" alt="Play">
			<p>PLAY</p>
		</button>

		<button class="credits" on:click={credits}>
			<img src="/images/Menu/credits.svg" class="credits-icon" alt="Credits">
			<p>CREDITS</p>
		</button>

		<button class="leave" on:click={showAlert}>
			<img src="/images/Menu/leave.svg" class="leave-icon" alt="Leave">
			<p>LEAVE GAME</p>
		</button>
	</div>
</div>
