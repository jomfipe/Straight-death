<script lang="ts">
  import { goto } from '$app/navigation';
  function handleKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') goto('/');
  }
</script>

<svelte:window on:keydown={handleKey} />

<div class="credits-background">
  <div class="content">
    <h1 class="credits-title">CREDITS</h1>
    <img src="/images/Credits/logo-ifpe.svg" class="logo-ifpe" />
    <p class="instituto">INSTITUTO FEDERAL</p>
    <p class="estado">Pernambuco</p>

    <!-- Box Desenvolvimento -->
    <div class="box">
      <p class="dev">DEVELOPMENT</p>

      <div class="team-row">
    <div class="member">
        <img src="/images/Credits/fabricio.svg" class="fabricio-pic" />
        <p class="fabricio">FABRÍCIO MOURA</p>
        <p class="role">Pixel artist</p>
    </div>
    <div class="member">
        <img src="/images/Credits/jp.svg" class="joao-pic" />
        <p class="joao">JOÃO PEDRO</p>
        <p class="role">Programmer</p>
    </div>
    <div class="member">
        <img src="/images/Credits/matias.svg" class="matias-pic" />
        <p class="matias">MATIAS LOPES</p>
        <p class="role">Programmer</p>
    </div>
</div>

<div class="team-row">
    <div class="member">
        <img src="/images/Credits/fagner.svg" class="fagner-pic" />
        <p class="fagner">FÁGNER MOURA</p>
        <p class="role">Game Designer</p>
    </div>
    <div class="member">
        <img src="/images/Credits/gabriel.svg" class="gabriel-pic" />
        <p class="gabriel">GABRIEL GALDINO</p>
        <p class="role">Programmer</p>
    </div>
</div>
    </div>

    <!-- Box Agradecimentos -->
    <div class="box-thanks">
      <h1 class="thanks">ACKNOWLEDGEMENTS</h1>
      <p class="thanks2">
        We would like to thank everyone who rooted for us, supported us, and believed in this project.
      </p>
    </div>
    <div class="esc">
      <img src="/images/Credits/esc.svg" />
      <p>PRESS <span class="key">ESC</span> TO RETURN</p>
    </div>
  </div>
</div>