<script lang="ts">
  import { goto } from '$app/navigation';

  let selected = 0;
  const items = ['PLAY', 'CREDITS', 'EXIT'];

  function handleClick(index: number) {
    selected = index;
    if (index === 0) goto('/play');
    if (index === 1) goto('/credits');
    if (index === 2) alert('Still in development!');
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') selected = (selected + 1) % 3;
    if (e.key === 'ArrowUp') selected = (selected + 2) % 3;
    if (e.key === 'Enter') handleClick(selected);
  }
</script>

<svelte:window on:keydown={handleKey} />

<div class="menu-background">
  <img src="/images/Menu/logo.png" alt="Game Logo" class="logo" />
  <div class="menu-box">
    {#each items as item, i}
      <button class="menu-button" class:active={selected === i} on:click={() => handleClick(i)}>
        <span class="arrow">◀</span>
        <span class="label">{item}</span>
        <span class="arrow">▶</span>
      </button>
    {/each}
  </div>
  <div class="hint">
    <p>press</p>
    <span class="key">ENTER</span>
    <p>to select</p>
  </div>
</div>