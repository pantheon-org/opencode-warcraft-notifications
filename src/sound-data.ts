import { DEFAULT_DATA_DIR, DEFAULT_BASE_URL } from './plugin-config.js';

export interface SoundFile {
  filename: string;
  url: string;
  description: string;
}

export const soundEntries: Array<{ filename: string; path: string; description: string }> = [
  {
    filename: 'human_selected1.wav',
    path: 'basic-human-voices/selected1.wav',
    description: 'Your command?',
  },
  {
    filename: 'human_selected2.wav',
    path: 'basic-human-voices/selected2.wav',
    description: 'Your orders?',
  },
  {
    filename: 'human_selected3.wav',
    path: 'basic-human-voices/selected3.wav',
    description: 'Yes, sire?',
  },
  {
    filename: 'human_selected4.wav',
    path: 'basic-human-voices/selected4.wav',
    description: 'Yes?',
  },
  {
    filename: 'human_selected5.wav',
    path: 'basic-human-voices/selected5.wav',
    description: 'My lord',
  },
  {
    filename: 'human_selected6.wav',
    path: 'basic-human-voices/selected6.wav',
    description: 'At your service',
  },

  {
    filename: 'human_acknowledge1.wav',
    path: 'basic-human-voices/acknowledge1.wav',
    description: 'Yes',
  },
  {
    filename: 'human_acknowledge2.wav',
    path: 'basic-human-voices/acknowledge2.wav',
    description: 'Yes, My Lord',
  },
  {
    filename: 'human_acknowledge3.wav',
    path: 'basic-human-voices/acknowledge3.wav',
    description: 'As you wish',
  },
  {
    filename: 'human_acknowledge4.wav',
    path: 'basic-human-voices/acknowledge4.wav',
    description: 'At once, sire',
  },

  {
    filename: 'dwarf_selected1.wav',
    path: 'dwarven-demolition-squad/selected1.wav',
    description: 'What do you want?',
  },
  {
    filename: 'dwarf_selected2.wav',
    path: 'dwarven-demolition-squad/selected2.wav',
    description: 'Auch',
  },

  {
    filename: 'dwarf_acknowledge1.wav',
    path: 'dwarven-demolition-squad/acknowledge1.wav',
    description: 'Aye, laddie',
  },
  {
    filename: 'dwarf_acknowledge2.wav',
    path: 'dwarven-demolition-squad/acknowledge2.wav',
    description: 'Okay',
  },
  {
    filename: 'dwarf_acknowledge3.wav',
    path: 'dwarven-demolition-squad/acknowledge3.wav',
    description: 'Alright',
  },
  {
    filename: 'dwarf_acknowledge4.wav',
    path: 'dwarven-demolition-squad/acknowledge4.wav',
    description: 'Move out',
  },
  {
    filename: 'dwarf_acknowledge5.wav',
    path: 'dwarven-demolition-squad/acknowledge5.wav',
    description: 'Yes sir',
  },

  {
    filename: 'elf_selected1.wav',
    path: 'elven-archer/selected1.wav',
    description: 'Your eminence?',
  },
  {
    filename: 'elf_selected2.wav',
    path: 'elven-archer/selected2.wav',
    description: 'Exalted one?',
  },
  {
    filename: 'elf_selected3.wav',
    path: 'elven-archer/selected3.wav',
    description: 'My sovereign?',
  },
  { filename: 'elf_selected4.wav', path: 'elven-archer/selected4.wav', description: 'Your wish?' },

  { filename: 'elf_acknowledge1.wav', path: 'elven-archer/acknowledge1.wav', description: 'Yes' },
  {
    filename: 'elf_acknowledge2.wav',
    path: 'elven-archer/acknowledge2.wav',
    description: 'By your command',
  },
  {
    filename: 'elf_acknowledge3.wav',
    path: 'elven-archer/acknowledge3.wav',
    description: 'For the alliance',
  },
  {
    filename: 'elf_acknowledge4.wav',
    path: 'elven-archer/acknowledge4.wav',
    description: 'Move out',
  },

  { filename: 'knight_selected1.wav', path: 'knight/selected1.wav', description: 'Your majesty?' },
  {
    filename: 'knight_selected2.wav',
    path: 'knight/selected2.wav',
    description: 'At your service',
  },
  { filename: 'knight_selected3.wav', path: 'knight/selected3.wav', description: 'Sire?' },
  { filename: 'knight_selected4.wav', path: 'knight/selected4.wav', description: 'What ho?' },

  { filename: 'knight_acknowledge1.wav', path: 'knight/acknowledge1.wav', description: 'We move' },
  {
    filename: 'knight_acknowledge2.wav',
    path: 'knight/acknowledge2.wav',
    description: 'In your name',
  },
  {
    filename: 'knight_acknowledge3.wav',
    path: 'knight/acknowledge3.wav',
    description: 'For the king',
  },
  {
    filename: 'knight_acknowledge4.wav',
    path: 'knight/acknowledge4.wav',
    description: 'Defending your honor',
  },

  { filename: 'mage_selected1.wav', path: 'mage/selected1.wav', description: 'What is it?' },
  {
    filename: 'mage_selected2.wav',
    path: 'mage/selected2.wav',
    description: 'Do you need assistance?',
  },
  { filename: 'mage_selected3.wav', path: 'mage/selected3.wav', description: 'Your request?' },

  { filename: 'mage_acknowledge1.wav', path: 'mage/acknowledge1.wav', description: 'As you wish' },
  { filename: 'mage_acknowledge2.wav', path: 'mage/acknowledge2.wav', description: 'Very well' },
  { filename: 'mage_acknowledge3.wav', path: 'mage/acknowledge3.wav', description: 'Alright' },

  { filename: 'peasant_selected1.wav', path: 'peasant/selected1.wav', description: 'Yes?' },
  { filename: 'peasant_selected2.wav', path: 'peasant/selected2.wav', description: 'My lord?' },
  { filename: 'peasant_selected3.wav', path: 'peasant/selected3.wav', description: 'What is it?' },
  { filename: 'peasant_selected4.wav', path: 'peasant/selected4.wav', description: 'Hello' },

  { filename: 'peasant_acknowledge1.wav', path: 'peasant/acknowledge1.wav', description: 'Okay' },
  {
    filename: 'peasant_acknowledge2.wav',
    path: 'peasant/acknowledge2.wav',
    description: 'Right-o',
  },
  {
    filename: 'peasant_acknowledge3.wav',
    path: 'peasant/acknowledge3.wav',
    description: 'Alright',
  },
  {
    filename: 'peasant_acknowledge4.wav',
    path: 'peasant/acknowledge4.wav',
    description: 'Yes, my lord',
  },

  {
    filename: 'ship_selected1.wav',
    path: 'ships/human1.wav',
    description: 'Captain on the bridge',
  },
  { filename: 'ship_selected2.wav', path: 'ships/human2.wav', description: 'Aye captain?' },
  { filename: 'ship_selected3.wav', path: 'ships/human3.wav', description: 'Skipper?' },
  { filename: 'ship_selected4.wav', path: 'ships/human4.wav', description: 'Set sail?' },

  { filename: 'ship_acknowledge1.wav', path: 'ships/acknowledge1.wav', description: 'Aye aye sir' },
  { filename: 'ship_acknowledge2.wav', path: 'ships/acknowledge2.wav', description: 'Aye captain' },
  { filename: 'ship_acknowledge3.wav', path: 'ships/acknowledge3.wav', description: 'Under way' },

  {
    filename: 'work_completed.wav',
    path: 'basic-human-voices/work-completed.wav',
    description: 'Work completed',
  },
  { filename: 'jobs_done.wav', path: 'peasant/work-complete.wav', description: 'Jobs done' },

  // HORDE SOUNDS
  // Basic Orc Voices - Selected
  {
    filename: 'orc_selected1.wav',
    path: 'basic-orc-voices/selected1.wav',
    description: 'Selected 1',
  },
  {
    filename: 'orc_selected2.wav',
    path: 'basic-orc-voices/selected2.wav',
    description: 'Selected 2',
  },
  {
    filename: 'orc_selected3.wav',
    path: 'basic-orc-voices/selected3.wav',
    description: 'Selected 3',
  },
  {
    filename: 'orc_selected4.wav',
    path: 'basic-orc-voices/selected4.wav',
    description: 'Selected 4',
  },
  {
    filename: 'orc_selected5.wav',
    path: 'basic-orc-voices/selected5.wav',
    description: 'Selected 5',
  },
  {
    filename: 'orc_selected6.wav',
    path: 'basic-orc-voices/selected6.wav',
    description: 'Selected 6',
  },

  // Basic Orc Voices - Acknowledge
  {
    filename: 'orc_acknowledge1.wav',
    path: 'basic-orc-voices/acknowledge1.wav',
    description: 'Zug Zug',
  },
  {
    filename: 'orc_acknowledge2.wav',
    path: 'basic-orc-voices/acknowledge2.wav',
    description: 'Dah boo',
  },
  {
    filename: 'orc_acknowledge3.wav',
    path: 'basic-orc-voices/acknowledge3.wav',
    description: 'Lok tar',
  },
  {
    filename: 'orc_acknowledge4.wav',
    path: 'basic-orc-voices/acknowledge4.wav',
    description: 'Slo boo',
  },

  // Death Knight - Selected
  {
    filename: 'death_knight_selected1.wav',
    path: 'death-knight/selected1.wav',
    description: 'Yes?',
  },
  {
    filename: 'death_knight_selected2.wav',
    path: 'death-knight/selected2.wav',
    description: 'Make it quick',
  },

  // Death Knight - Acknowledge
  {
    filename: 'death_knight_acknowledge1.wav',
    path: 'death-knight/acknowledge1.wav',
    description: 'Of course, master',
  },
  {
    filename: 'death_knight_acknowledge2.wav',
    path: 'death-knight/acknowledge2.wav',
    description: 'Very well',
  },
  {
    filename: 'death_knight_acknowledge3.wav',
    path: 'death-knight/acknowledge3.wav',
    description: 'Acknowledge 3',
  },

  // Dragon - Selected
  {
    filename: 'dragon_selected1.wav',
    path: 'dragon/selected1.wav',
    description: 'Dragon selected',
  },

  // Dragon - Acknowledge
  {
    filename: 'dragon_acknowledge1.wav',
    path: 'dragon/acknowledge1.wav',
    description: 'Dragon acknowledge 1',
  },
  {
    filename: 'dragon_acknowledge2.wav',
    path: 'dragon/acknowledge2.wav',
    description: 'Dragon acknowledge 2',
  },

  // Goblin Sappers - Selected
  {
    filename: 'goblin_sapper_selected1.wav',
    path: 'goblin-sappers/selected1.wav',
    description: 'What?',
  },
  {
    filename: 'goblin_sapper_selected2.wav',
    path: 'goblin-sappers/selected2.wav',
    description: 'Yes?',
  },
  {
    filename: 'goblin_sapper_selected3.wav',
    path: 'goblin-sappers/selected3.wav',
    description: 'Who is it?',
  },
  {
    filename: 'goblin_sapper_selected4.wav',
    path: 'goblin-sappers/selected4.wav',
    description: 'Hello?',
  },

  // Goblin Sappers - Acknowledge
  {
    filename: 'goblin_sapper_acknowledge1.wav',
    path: 'goblin-sappers/acknowledge1.wav',
    description: 'Okay',
  },
  {
    filename: 'goblin_sapper_acknowledge2.wav',
    path: 'goblin-sappers/acknowledge2.wav',
    description: 'Certainly',
  },
  {
    filename: 'goblin_sapper_acknowledge3.wav',
    path: 'goblin-sappers/acknowledge3.wav',
    description: 'Yes boss',
  },
  {
    filename: 'goblin_sapper_acknowledge4.wav',
    path: 'goblin-sappers/acknowledge4.wav',
    description: 'Alright',
  },

  // Ogre - Selected
  {
    filename: 'ogre_selected1.wav',
    path: 'ogre/selected1.wav',
    description: 'Huh what?',
  },
  {
    filename: 'ogre_selected2.wav',
    path: 'ogre/selected2.wav',
    description: 'Wha? Huh?',
  },
  {
    filename: 'ogre_selected3.wav',
    path: 'ogre/selected3.wav',
    description: 'Yes?',
  },
  {
    filename: 'ogre_selected4.wav',
    path: 'ogre/selected4.wav',
    description: 'Master?',
  },

  // Ogre - Acknowledge
  {
    filename: 'ogre_acknowledge1.wav',
    path: 'ogre/acknowledge1.wav',
    description: 'Okay',
  },
  {
    filename: 'ogre_acknowledge2.wav',
    path: 'ogre/acknowledge2.wav',
    description: 'Yes master',
  },
  {
    filename: 'ogre_acknowledge3.wav',
    path: 'ogre/acknowledge3.wav',
    description: 'Alright',
  },

  // Ogre-Mage - Selected
  {
    filename: 'ogre_mage_selected1.wav',
    path: 'ogre-mage/selected1.wav',
    description: 'Yes master?',
  },
  {
    filename: 'ogre_mage_selected2.wav',
    path: 'ogre-mage/selected2.wav',
    description: 'What?',
  },
  {
    filename: 'ogre_mage_selected3.wav',
    path: 'ogre-mage/selected3.wav',
    description: 'Yes?',
  },
  {
    filename: 'ogre_mage_selected4.wav',
    path: 'ogre-mage/selected4.wav',
    description: 'What is it?',
  },

  // Ogre-Mage - Acknowledge
  {
    filename: 'ogre_mage_acknowledge1.wav',
    path: 'ogre-mage/acknowledge1.wav',
    description: 'Yes master',
  },
  {
    filename: 'ogre_mage_acknowledge2.wav',
    path: 'ogre-mage/acknowledge2.wav',
    description: 'Of course',
  },
  {
    filename: 'ogre_mage_acknowledge3.wav',
    path: 'ogre-mage/acknowledge3.wav',
    description: 'Right away',
  },

  // Troll Axethrower - Selected
  {
    filename: 'troll_selected1.wav',
    path: 'troll-axethrower/selected1.wav',
    description: "D'you call me?",
  },
  {
    filename: 'troll_selected2.wav',
    path: 'troll-axethrower/selected2.wav',
    description: 'Selected 2',
  },
  {
    filename: 'troll_selected3.wav',
    path: 'troll-axethrower/selected3.wav',
    description: "Who d'you want to kill?",
  },

  // Troll Axethrower - Acknowledge
  {
    filename: 'troll_acknowledge1.wav',
    path: 'troll-axethrower/acknowledge1.wav',
    description: 'Okay',
  },
  {
    filename: 'troll_acknowledge2.wav',
    path: 'troll-axethrower/acknowledge2.wav',
    description: 'Alright',
  },
  {
    filename: 'troll_acknowledge3.wav',
    path: 'troll-axethrower/acknowledge3.wav',
    description: 'You the boss',
  },

  // Horde Ships - Selected
  {
    filename: 'horde_ship_selected1.wav',
    path: 'ships/orc1.wav',
    description: 'Done building ship',
  },
  {
    filename: 'horde_ship_selected2.wav',
    path: 'ships/orc2.wav',
    description: 'Argh?',
  },
  {
    filename: 'horde_ship_selected3.wav',
    path: 'ships/orc3.wav',
    description: 'Aye matey?',
  },
  {
    filename: 'horde_ship_selected4.wav',
    path: 'ships/orc4.wav',
    description: 'Yes captain?',
  },

  // Horde Ships - Acknowledge
  {
    filename: 'horde_ship_acknowledge1.wav',
    path: 'ships/acknowledge1.wav',
    description: 'Ah hoy',
  },
  {
    filename: 'horde_ship_acknowledge2.wav',
    path: 'ships/acknowledge2.wav',
    description: 'I would love to',
  },
  {
    filename: 'horde_ship_acknowledge3.wav',
    path: 'ships/acknowledge3.wav',
    description: "You're the captain",
  },

  // Horde Special Sounds
  {
    filename: 'orc_work_completed.wav',
    path: 'basic-orc-voices/work-complete.wav',
    description: 'Work complete',
  },
];

/**
 * Build the list of `SoundFile` objects with absolute URLs based on the given base URL.
 * @param baseUrl - Base URL to prepend to each entry's path
 * @returns Array of `SoundFile` objects ready for download
 */
export const buildSoundsToDownload = (baseUrl: string): SoundFile[] => {
  return soundEntries.map((e) => {
    // Determine if this is a Horde sound based on filename
    const isHordeSound = e.filename.startsWith('orc_') || 
                         e.filename.startsWith('death_knight_') || 
                         e.filename.startsWith('dragon_') || 
                         e.filename.startsWith('goblin_sapper_') || 
                         e.filename.startsWith('ogre_') || 
                         e.filename.startsWith('troll_') || 
                         e.filename.startsWith('horde_ship_');

    // Use appropriate base URL for the faction
    const effectiveUrl = isHordeSound 
      ? `https://www.thanatosrealms.com/war2/sounds/orcs/${e.path}`
      : `${baseUrl}/${e.path}`;

    return {
      filename: e.filename,
      url: effectiveUrl,
      description: e.description,
    };
  });
};

/**
 * Return the list of expected sound filenames included in the package.
 * @returns Array of sound filenames
 */
export const getSoundFileList = (): string[] => {
  return soundEntries.map((e) => e.filename);
};
