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

    chest: {
      sword_title: "You found:",
      sword_name: "Cursed Sword",
      sword_flavor: "A blade thirsty for blood, forged in the darkness of this mausoleum. It whispers promises of power... and battles to come.",
      sword_hint: "Press E to continue.",
      fist_title: "You found:",
      fist_name: "Magic Fist",
      fist_description: "An ancient artifact wrapped in arcane energy. When equipped, your strikes channel pure magic, significantly increasing your combat power.",
      fist_hint: "Press E to continue."
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
      paladin_line1: "You have come far, but this is the end of your journey.",
      protagonist_line3: "I will not retreat!",
      attack: "Attack",
      item: "Item",
      stats: "Stats",
      flee: "Flee",
      sword_strike: "Sword Strike",
      magic_fist: "Magic Fist",
      potion: "Potion",
      protagonist_name: "Protagonist"
    },
    tutorial: {
      wasd:
        "Use WASD for movement.",
      interact:
        "Interact.",
    },

    log: {
      enemy_appeared: "A wild {enemy} appeared!",
      enemy_defeated: "{enemy} has been defeated!",
      victory_taunt: "Congratulations on your victory... but don't celebrate yet. The challenges ahead will be far crueler. Your death is certain.",
      player_defeated: "You have been defeated...",
      enemy_attack_hit: "{enemy} attacked and dealt {damage} damage{critical}.",
      enemy_attack_miss: "{enemy} missed the attack.",
      critical_suffix: " (critical)",
      sword_strike_message: "You struck with your sword!",
      magic_fist_message: "MAGIC FIST! An explosion of energy hits the enemy!",
      damage_result: " Damage: {damage}{critical}",
      critical_label: " (CRITICAL!)",
      attack_missed: "Your attack failed miserably.",
      no_potions: "You have no potions left!",
      used_potion: "You used a potion and recovered health.",
      stats: "[STATUS] You: {playerHp} HP | Enemy: {enemyHp} HP",
      fled_success: "You fled like a coward!",
      fled_fail: "The escape failed!",
      recoil_damage: " You took {damage} recoil damage.",
      recoil_neutralized: " The recoil was neutralized by the magic fist."
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

    chest: {
      sword_title: "Você encontrou:",
      sword_name: "Espada Amaldiçoada",
      sword_flavor: "Uma lâmina sedenta por sangue, forjada nas trevas deste mausoléu.\nEla sussurra promessas de poder... e de batalhas que virão.",
      sword_hint: "Pressione E para continuar.",
      fist_title: "Você encontrou:",
      fist_name: "Punho Mágico",
      fist_description: "Um antigo artefato envolto em energia arcana. Ao equipá-lo, seus golpes passam a canalizar magia pura, aumentando significativamente seu poder em combate.",
      fist_hint: "Pressione E para continuar."
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
      paladin_line1: "Você chegou longe, mas este é o fim do seu caminho.",
      protagonist_line3: "Eu não vou recuar!",
      attack: "Ataque",
      item: "Item",
      stats: "Estatísticas",
      flee: "Fugir",
      sword_strike: "Golpe de Espada",
      magic_fist: "Punho Mágico",
      potion: "Poção",
      protagonist_name: "Protagonista"
    },
    tutorial: {
      wasd:
        "Mover-se com as teclas WASD.",
      interact:
        "Interação",
    },

    log: {
      enemy_appeared: "Um {enemy} selvagem apareceu!",
      enemy_defeated: "{enemy} foi derrotado!",
      victory_taunt: "Parabéns por ter vencido... mas não comemore cedo. Os desafios adiante serão muito mais cruéis. Sua morte é certa.",
      player_defeated: "Você foi derrotado...",
      enemy_attack_hit: "{enemy} atacou e causou {damage} de dano{critical}.",
      enemy_attack_miss: "{enemy} errou o ataque.",
      critical_suffix: " crítico",
      sword_strike_message: "Você desferiu um golpe de espada!",
      magic_fist_message: "PUNHO MÁGICO! Uma explosão de energia atinge o inimigo!",
      damage_result: " Dano: {damage}{critical}",
      critical_label: " (CRÍTICO!)",
      attack_missed: "Seu ataque falhou miseravelmente.",
      no_potions: "Você não tem poções restantes!",
      used_potion: "Você usou uma poção e recuperou vida.",
      stats: "[STATUS] Você: {playerHp} HP | Inimigo: {enemyHp} HP",
      fled_success: "Você fugiu covardemente!",
      fled_fail: "A fuga falhou!",
      recoil_damage: " Você recebeu {damage} de dano de recuo.",
      recoil_neutralized: " O recuo foi neutralizado pelo soco mágico."
}
  }
};

function createT(langValue: Lang) {
  return (path: string) =>
    path
      .split(".")
      .reduce((a: any, k) => a?.[k], dict[langValue]) ?? path;
}

export function interpolar(texto: string, valores: Record<string, string | number>): string {
	let resultado: string = texto;
	const chaves: string[] = Object.keys(valores);
	for (let i = 0; i < chaves.length; i++) {
		const chave: string = chaves[i];
		const marcador: string = '{' + chave + '}';
		resultado = resultado.split(marcador).join(String(valores[chave]));
	}
	return resultado;
}

export const t = derived(lang, ($lang) => createT($lang));

export function toggleLang() {
  lang.update(v => (v === "english" ? "ptbr" : "english"));
}

