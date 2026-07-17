<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let lines: { speaker: string; text: string; portrait?: string }[] = [];
  export let portraitSize = 96;

  const dispatch = createEventDispatcher();

  let index = 0;
  let visibleText = '';
  let typing = false;

  function advance() {
    if (typing) {
      // finish instantly
      visibleText = lines[index].text;
      typing = false;
      return;
    }

    if (index < lines.length - 1) {
      index += 1;
      startTyping();
      return;
    }

    // diálogo finalizado
    dispatch('done');
  }

  let typeInterval: number;

  function startTyping() {
    visibleText = '';
    typing = true;
    const text = lines[index].text;
    let i = 0;
    clearInterval(typeInterval);
    typeInterval = setInterval(() => {
      i += 1;
      visibleText = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(typeInterval);
        typing = false;
      }
    }, 18) as unknown as number;
  }

  onMount(() => {
    if (lines.length) startTyping();
  });
</script>

<div
  class="dialog-wrap"
  on:click|stopPropagation={advance}
  on:keydown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      advance();
    }
  }}
  role="button"
  tabindex="0"
>
  <div class="frame">
      <div class="portrait" style="width:{portraitSize}px; height:{portraitSize}px;">
        {#if lines[index] && lines[index].portrait}
          <img src="{lines[index].portrait}" alt="portrait" />
        {:else if lines[0] && lines[0].portrait}
          <img src="{lines[0].portrait}" alt="portrait" />
        {/if}
      </div>
    <div class="dialog-area">
      <div class="name">{lines[index]?.speaker}</div>
      <div class="text">{visibleText}</div>
    </div>
  </div>
  <div class="glow" aria-hidden="true"></div>
</div>
