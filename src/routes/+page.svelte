<script lang="ts">
  import { goto } from "$app/navigation";
  import { t, lang, toggleLang } from "$lib/translator/il8n";
  let selected = 0;
  $: currentLang = $lang;
  let inSettings = false;

  const items = ["menu.play", "menu.credits", "menu.settings"];

  function handleClick(index: number) {
    selected = index;

    if (!inSettings) {
      if (index === 0) goto("/play");
      if (index === 1) goto("/credits");

      if (index === 2) {
        inSettings = true;
        selected = 0;
      }
    } else {
      if (index === 0) toggleLang();
      if (index === 1) {
        inSettings = false;
        selected = 0;
      }
    }
  }

  function handleKey(e: KeyboardEvent) {
    const max = inSettings ? 2 : items.length;

    if (e.key === "ArrowDown") selected = (selected + 1) % max;
    if (e.key === "ArrowUp") selected = (selected + max - 1) % max;
    if (e.key === "Enter") handleClick(selected);

    if (e.key === "Escape") inSettings = false;
  }
</script>

<svelte:window on:keydown={handleKey} />

<div class="menu-background">
  <img src="/images/Menu/logo.png" class="logo" alt="logo"/>

  <div class="menu-box">

    {#if !inSettings}

      {#each items as item, i}
        <button
          class="menu-button"
          class:active={selected === i}
          on:click={() => handleClick(i)}
        >
          <span class="label">{$t(item)}</span>
        </button>
      {/each}

    {:else}

      <button
        class="menu-button"
        class:active={selected === 0}
        on:click={() => handleClick(0)}
      >
        <span class="label">
          {$t("settings.language")}: {$lang.toUpperCase()}
        </span>
      </button>

      <button
        class="menu-button"
        class:active={selected === 1}
        on:click={() => handleClick(1)}
      >
        <span class="label">{$t("menu.back")}</span>
      </button>

    {/if}

  </div>

  <div class="hint">
    <p>{$t("menu.press")}
        <span class="key">ENTER</span>
        {$t("menu.to_select")}    
        </p>
  </div>
</div>
