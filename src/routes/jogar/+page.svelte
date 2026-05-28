<script lang="ts">
    import { onMount } from "svelte";

    let playerX = 0;
    let playerY = 0;

    const treasureX = 3;
    const treasureY = 4;

    const size = 5;

    function move(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowUp":
                if (playerY > 0) playerY--;
                break;

            case "ArrowDown":
                if (playerY < size - 1) playerY++;
                break;

            case "ArrowLeft":
                if (playerX > 0) playerX--;
                break;

            case "ArrowRight":
                if (playerX < size - 1) playerX++;
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

<h1>Movimente o personagem (P) até o tesouro (T)</h1>

<table>
    {#each Array(size) as _, y}
        <tr>
            {#each Array(size) as _, x}
                <td
                    class="cell"
                    class:character={x === playerX && y === playerY}
                    class:treasure={x === treasureX && y === treasureY}
                >
                    {#if x === playerX && y === playerY}
                        P
                    {:else if x === treasureX && y === treasureY}
                        T
                    {/if}
                </td>
            {/each}
        </tr>
    {/each}
</table>

{#if playerX === treasureX && playerY === treasureY}
    <h2>Você encontrou o tesouro 🎉</h2>
{/if}

<br />

<a class="menu" href="/">Voltar ao Menu</a>

<style>
    table {
        border-collapse: collapse;
    }

    .cell {
        width: 60px;
        height: 60px;
        border: 2px solid black;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
    }

    .character {
        background-color: lightblue;
    }

    .treasure {
        background-color: gold;
    }

    h1,
    h2 {
        font-family: sans-serif;
    }

    .menu {
        font-family: sans-serif;
    }
</style>