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

<style>
  .dialog-wrap {
    width: min(820px, 92%);
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: transparent;
    -webkit-user-select: none;
    user-select: none;
    outline: none;
    z-index: 60;
    pointer-events: auto;
  }

  .frame {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 12px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #0b0b0c 0%, #1a1a1b 100%);
    border: 4px solid #6f6f74; /* metallic trim */
    box-shadow: 0 0 0 3px rgba(80,0,120,0.08), 0 8px 24px rgba(0,0,0,0.6);
    position: relative;
    image-rendering: pixelated;
    filter: contrast(1.02) saturate(1.05);
  }

  /* portrait */
  .portrait {
    background: linear-gradient(180deg,#111,#222);
    border: 3px solid #444;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 -6px 12px rgba(0,0,0,0.6);
  }

  .portrait img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
    transform: translateY(2px);
  }

  .dialog-area {
    flex: 1 1 auto;
    min-height: 96px;
    padding: 8px 12px;
    background-image: linear-gradient(135deg, rgba(60,0,80,0.04) 0%, rgba(0,0,0,0.12) 100%);
    border-left: 2px solid rgba(255,255,255,0.02);
    position: relative;
    overflow: hidden;
  }

  .dialog-area:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: radial-gradient(circle at 10% 10%, rgba(128,64,192,0.06), transparent 20%), repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 2px, transparent 2px 6px);
    mix-blend-mode: overlay;
  }

  .name {
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    color: #c9b7ff;
    text-shadow: 0 1px 0 rgba(0,0,0,0.7);
    margin-bottom: 6px;
  }

  .text {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Courier New', monospace;
    font-size: 14px;
    color: #e9e6ff;
    line-height: 1.3;
    white-space: pre-wrap;
    text-shadow: 0 1px 0 rgba(0,0,0,0.6);
  }

  .glow {
    position: absolute;
    left: 0; right: 0; top: -6px; bottom: -6px;
    background: radial-gradient(ellipse at center, rgba(120,64,200,0.08), transparent 30%);
    pointer-events: none;
    mix-blend-mode: screen;
  }

  /* pixel-art runes / cracks decorations */
  .frame::after {
    content: '';
    position: absolute;
    inset: 6px;
    border: 2px dashed rgba(120,60,180,0.12);
    pointer-events: none;
    background-image: linear-gradient(90deg, transparent 0 4px, rgba(120,60,180,0.03) 4px 6px);
    mask-image: linear-gradient(#000, #000);
  }

  @media (max-width: 520px) {
    .frame { padding: 8px; }
    .portrait { width: 72px; height: 72px }
    .dialog-area { min-height: 76px }
  }
</style>
