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
        "Hello, traveler! The portal is sealed. To proceed, take the cursed sword from inside the chest. You will need it to face the challenges that lie ahead. Good luck!", 
        close: "Close"
    },
    battle: {
      archestry_line1: "Another lost soul...",
      protagonist_line1: "Where am I?",
      archestry_line2: "In a place where only death answers.",
      attack: "Attack",
      item: "Item",
      stats: "Stats",
      flee: "Flee",
      sword_strike: "Sword Strike",
      potion: "Potion",
      protagonist_name: "Protagonist"
    },
    tutorial: {
      wasd:
        "Use WASD for movement.",
      interact:
        "Interact.",
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
        "Olá viajante! O portal está selado. Para prosseguir, pegue a espada amaldiçoada que está dentro do baú. Você precisará dela para enfrentar os desafios que estão por vir. Boa sorte!",
      close: "Fechar"  
    },
    battle: {
      archestry_line1: "Mais um perdido...",
      protagonist_line1: "Onde estou?",
      archestry_line2: "Em um lugar onde apenas a morte responde.",
      attack: "Ataque",
      item: "Item",
      stats: "Estatísticas",
      flee: "Fugir",
      sword_strike: "Golpe de Espada",
      potion: "Poção",
      protagonist_name: "Protagonista"
    },
    tutorial: {
      wasd:
        "Mover-se com as teclas WASD.",
      interact:
        "Interação",
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

