/**
 * Sound descriptions for notification display
 * Maps sound filenames to their in-game voice lines
 */

/**
 * Alliance sound descriptions
 */
export const allianceSoundDescriptions: Record<string, string> = {
  // Human
  'human_selected1.wav': 'Yes, milord?',
  'human_selected2.wav': 'Yes?',
  'human_selected3.wav': 'My lord?',
  'human_selected4.wav': 'Hmmm?',
  'human_selected5.wav': 'More work?',
  'human_selected6.wav': 'What is it?',
  'human_acknowledge1.wav': 'Yes, milord.',
  'human_acknowledge2.wav': 'Right away.',
  'human_acknowledge3.wav': 'As you wish.',
  'human_acknowledge4.wav': 'Yes.',

  // Dwarf
  'dwarf_selected1.wav': 'Hmm?',
  'dwarf_selected2.wav': 'Yeah?',
  'dwarf_acknowledge1.wav': 'Alright.',
  'dwarf_acknowledge2.wav': 'Okey dokey.',
  'dwarf_acknowledge3.wav': 'Righto.',
  'dwarf_acknowledge4.wav': 'You got it.',
  'dwarf_acknowledge5.wav': 'Yessir.',

  // Elf
  'elf_selected1.wav': 'Yes?',
  'elf_selected2.wav': 'Hmm?',
  'elf_selected3.wav': 'Your orders?',
  'elf_selected4.wav': 'What do you need?',
  'elf_acknowledge1.wav': 'I hear and obey.',
  'elf_acknowledge2.wav': 'Excellent.',
  'elf_acknowledge3.wav': 'Of course.',
  'elf_acknowledge4.wav': 'As you wish.',

  // Knight
  'knight_selected1.wav': 'Yes, my lord?',
  'knight_selected2.wav': 'What do you need?',
  'knight_selected3.wav': 'Yes?',
  'knight_selected4.wav': 'At your service.',
  'knight_acknowledge1.wav': 'Yes, my lord.',
  'knight_acknowledge2.wav': 'For honor.',
  'knight_acknowledge3.wav': 'For the king.',
  'knight_acknowledge4.wav': 'Right away.',

  // Mage
  'mage_selected1.wav': 'I am ready.',
  'mage_selected2.wav': 'Yes?',
  'mage_selected3.wav': 'What is it?',
  'mage_acknowledge1.wav': 'Very well.',
  'mage_acknowledge2.wav': 'Yes.',
  'mage_acknowledge3.wav': 'Of course.',

  // Peasant
  'peasant_selected1.wav': 'Yes, milord?',
  'peasant_selected2.wav': 'Yes?',
  'peasant_selected3.wav': 'More work?',
  'peasant_selected4.wav': 'Ready to work.',
  'peasant_acknowledge1.wav': 'Yes, milord.',
  'peasant_acknowledge2.wav': 'Right away.',
  'peasant_acknowledge3.wav': 'Off I go.',
  'peasant_acknowledge4.wav': 'Okey dokey.',

  // Ship
  'ship_selected1.wav': 'Aye?',
  'ship_selected2.wav': 'Aye, captain?',
  'ship_selected3.wav': 'Yes, captain?',
  'ship_selected4.wav': 'What?',
  'ship_acknowledge1.wav': 'Aye, aye.',
  'ship_acknowledge2.wav': 'Full steam ahead.',
  'ship_acknowledge3.wav': 'Yes, captain.',

  // Special
  'work_completed.wav': 'Work complete.',
  'jobs_done.wav': "Job's done!",
} as const;

/**
 * Horde sound descriptions
 */
export const hordeSoundDescriptions: Record<string, string> = {
  // Orc
  'orc_selected1.wav': 'Yes?',
  'orc_selected2.wav': 'What do you want?',
  'orc_selected3.wav': 'Huh?',
  'orc_selected4.wav': 'More work?',
  'orc_selected5.wav': 'Ready to work.',
  'orc_selected6.wav': 'Yes?',
  'orc_acknowledge1.wav': 'Okay.',
  'orc_acknowledge2.wav': 'Alright.',
  'orc_acknowledge3.wav': 'Work, work.',
  'orc_acknowledge4.wav': 'Okie dokie.',

  // Death Knight
  'death_knight_selected1.wav': 'The pact is sealed.',
  'death_knight_selected2.wav': 'My patience has ended.',
  'death_knight_acknowledge1.wav': 'As you order.',
  'death_knight_acknowledge2.wav': 'Agreed.',
  'death_knight_acknowledge3.wav': 'For the Horde.',

  // Dragon
  'dragon_selected1.wav': 'Yesss?',
  'dragon_acknowledge1.wav': 'Yesss.',
  'dragon_acknowledge2.wav': 'Certainly.',

  // Goblin Sapper
  'goblin_sapper_selected1.wav': 'I got the big one!',
  'goblin_sapper_selected2.wav': 'Hehehehehe.',
  'goblin_sapper_selected3.wav': 'Yeah?',
  'goblin_sapper_selected4.wav': 'What?',
  'goblin_sapper_acknowledge1.wav': 'Alright.',
  'goblin_sapper_acknowledge2.wav': 'Hehehehe, okay!',
  'goblin_sapper_acknowledge3.wav': 'Right-o.',
  'goblin_sapper_acknowledge4.wav': 'Fire in the hole!',

  // Ogre
  'ogre_selected1.wav': 'What?',
  'ogre_selected2.wav': 'Huh?',
  'ogre_selected3.wav': 'Yeah?',
  'ogre_selected4.wav': 'Ugh?',
  'ogre_acknowledge1.wav': 'Okay.',
  'ogre_acknowledge2.wav': 'Ugh, alright.',
  'ogre_acknowledge3.wav': 'Ugh.',

  // Ogre Mage
  'ogre_mage_selected1.wav': 'We are ready.',
  'ogre_mage_selected2.wav': 'Yes?',
  'ogre_mage_selected3.wav': 'What do you need?',
  'ogre_mage_selected4.wav': 'Orders?',
  'ogre_mage_acknowledge1.wav': 'Very well.',
  'ogre_mage_acknowledge2.wav': 'Of course.',
  'ogre_mage_acknowledge3.wav': 'Agreed.',

  // Troll
  'troll_selected1.wav': 'Yes, mon?',
  'troll_selected2.wav': 'What is it?',
  'troll_selected3.wav': 'What you want?',
  'troll_acknowledge1.wav': 'Alright, mon.',
  'troll_acknowledge2.wav': 'Okay.',
  'troll_acknowledge3.wav': 'Yes, mon.',

  // Horde Ship
  'horde_ship_selected1.wav': 'Yes?',
  'horde_ship_selected2.wav': 'What?',
  'horde_ship_selected3.wav': 'Orders?',
  'horde_ship_selected4.wav': 'Yes, captain?',
  'horde_ship_acknowledge1.wav': 'Aye.',
  'horde_ship_acknowledge2.wav': 'Yes, captain.',
  'horde_ship_acknowledge3.wav': 'Right away.',

  // Special
  'orc_work_completed.wav': 'Work complete.',
} as const;

/**
 * Combined sound descriptions (Horde overwrites Alliance for conflicting keys)
 */
export const soundDescriptions: Record<string, string> = {
  ...allianceSoundDescriptions,
  ...hordeSoundDescriptions,
} as const;

/**
 * Get description for a sound filename
 * @param filename - Sound filename (e.g., 'human_selected1.wav')
 * @returns The description text, or undefined if not found
 *
 * @example
 * ```typescript
 * const desc = getSoundDescription('human_selected1.wav');
 * console.log(desc); // "Yes, milord?"
 * ```
 */
export const getSoundDescription = (filename: string): string | undefined => {
  return soundDescriptions[filename];
};
