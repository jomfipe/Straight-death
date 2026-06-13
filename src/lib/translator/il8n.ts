import { writable, derived } from "svelte/store";

export type Lang = "english" | "ptbr";

export const lang = writable<Lang>("english");

const dict = {
  english: {
    menu: {
      play: "PLAY",
      credits: "CREDITS",
      settings: "SETTINGS",
      press: "press",
      to_select: "to select",      
      back: "BACK"
    },

    credits: {
      title: "CREDITS",
      institute: "INSTITUTO FEDERAL",
      state: "Pernambuco",
      dev: "DEVELOPMENT",
      thanks: "ACKNOWLEDGEMENTS",
      thanks_desc:
        "We would like to thank everyone who supported and believed in this project.",
      back: "press ESC to return",
      press: "press",
      to_back: "to return"      
    },

    roles: {
      pixel_artist: "Pixel artist",
      programmer: "Programmer",
      story: "Story Writer",
      game_designer: "Game Designer"
    },

    settings: {
      language: "LANGUAGE",
      back: "BACK"
    },

    npc: {
      dialog:
        "Hello, traveler! The portal is sealed. To proceed, take the amulet from inside the chest. You will need it to face the challenges that lie ahead. Good luck!", 
        close: "Close"
    }
  },

  ptbr: {
    menu: {
      play: "JOGAR",
      credits: "CRÉDITOS",
      settings: "CONFIGURAÇÕES",
      press: "aperte",
      to_select: "para selecionar",
      back: "VOLTAR"
    },

    credits: {
      title: "CRÉDITOS",
      institute: "INSTITUTO FEDERAL",
      state: "Pernambuco",
      dev: "DESENVOLVIMENTO",
      thanks: "AGRADECIMENTOS",
      thanks_desc:
        "Agradecemos a todos que apoiaram e acreditaram no projeto.",
      press: "aperte",
      to_back: "para voltar"      
    },

    roles: {
      pixel_artist: "Artista Pixel Art",
      programmer: "Programador",
      story: "Roteirista",
      game_designer: "Game Designer"
    },

    settings: {
      language: "IDIOMA",
      back: "VOLTAR"
    },

    npc: {
      dialog:
        "Olá viajante! O portal está selado. Para prosseguir, pegue o amuleto que está dentro do baú. Você precisará dele para enfrentar os desafios que estão por vir. Boa sorte!",
      close: "Fechar"  
    }
  }
};

function createT(langValue: Lang) {
  return (path: string) =>
    path
      .split(".")
      .reduce((a: any, k) => a?.[k], dict[langValue]) ?? path;
}

export const t = derived(lang, ($lang) => createT($lang));

export function toggleLang() {
  lang.update(v => (v === "english" ? "ptbr" : "english"));
}

