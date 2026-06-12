<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/translator/il8n';

  function handleKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') goto('/');
  }
</script>

<svelte:window on:keydown={handleKey} />

<div class="credits-background">
  <div class="content">

    <h1 class="credits-title">{$t("credits.title")}</h1>

    <img
      src="/images/Credits/logo-ifpe.svg"
      class="logo-ifpe"
      alt="Logo do Instituto Federal de Pernambuco"
      loading="lazy"
    />

    <p class="instituto">{$t("credits.institute")}</p>
    <p class="estado">{$t("credits.state")}</p>

    <div class="box">
      <p class="dev">{$t("credits.dev")}</p>

      <div class="team-grid">

        <div class="member">
          <img
            src="/images/Credits/fabricio.svg"
            class="fabricio-pic"
            alt="Fabrício"
            loading="lazy"
          />
          <p class="fabricio">FABRÍCIO MOURA DE FRAGA</p>
          <p class="role">{$t("roles.pixel_artist")}</p>
        </div>

        <div class="member">
          <img
            src="/images/Credits/jp.svg"
            class="joao-pic"
            alt="João Pedro"
            loading="lazy"
          />
          <p class="joao">JOÃO PEDRO SANTANA DE ARAÚJO</p>
          <p class="role">{$t("roles.programmer")}</p>
        </div>

        <div class="member">
          <img
            src="/images/Credits/matias.svg"
            class="matias-pic"
            alt="Matias"
            loading="lazy"
          />
          <p class="matias">MATIAS LOPES DE SOUZA SILVA</p>
          <p class="role">{$t("roles.story")}</p>
        </div>

      </div>

      <div class="team-row-bottom">

        <div class="member">
          <img
            src="/images/Credits/fagner.svg"
            class="fagner-pic"
            alt="Fagner"
            loading="lazy"
          />
          <p class="fagner">FÁGNER MOURA DE FRAGA</p>
          <p class="role">{$t("roles.game_designer")}</p>
        </div>

        <div class="member">
          <img
            src="/images/Credits/gabriel.svg"
            class="gabriel-pic"
            alt="Gabriel"
            loading="lazy"
          />
          <p class="gabriel">GABRIEL GALDINO ALVES DE ARAÚJO</p>
          <p class="role">{$t("roles.programmer")}</p>
        </div>

      </div>
    </div>

    <div class="box-thanks">
      <h1 class="thanks">{$t("credits.thanks")}</h1>
      <p class="thanks-description">
        {$t("credits.thanks_desc")}
      </p>
    </div>
     <div class="esc">
       <img src="/images/Credits/esc.svg" alt="ESC" />
        <p>
        {$t("credits.press")}
        <span class="key">ESC</span>        
        {$t("credits.to_back")}
  </p>
</div>
  </div>
</div>
