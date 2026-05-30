<script lang="ts">
    let gameTitle : string = "Straight"
    let gameSubtitle : string = "Death"

    function showAlert(): void {
        alert("Still on development!")
    }


</script>

<div class="container">
<h1 class="title">
    {gameTitle}
</h1>
<h2 class="subtitle">
   {gameSubtitle}
</h2>

<button class="about" on:click={showAlert}> 
    <p>Read More</p>
</button>

<a class="try" href="/jogar">
    <p>Play</p>
</a>
</div>

