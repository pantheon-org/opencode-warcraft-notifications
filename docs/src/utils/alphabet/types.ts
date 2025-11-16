import type { Glyph, LetterName } from './letters/types';
import { letterA } from "./letters/letter-a";
import { letterB } from "./letters/letter-b";
import { letterC } from "./letters/letter-c";
import { letterD } from "./letters/letter-d";
import { letterE } from "./letters/letter-e";
import { letterF } from "./letters/letter-f";
import { letterG } from "./letters/letter-g";
import { letterH } from "./letters/letter-h";
import { letterI } from "./letters/letter-i";
import { letterJ } from "./letters/letter-j";
import { letterK } from "./letters/letter-k";
import { letterL } from "./letters/letter-l";
import { letterM } from "./letters/letter-m";
import { letterN } from "./letters/letter-n";
import { letterO } from "./letters/letter-o";
import { letterP } from "./letters/letter-p";
import { letterQ } from "./letters/letter-q";
import { letterR } from "./letters/letter-r";
import { letterS } from "./letters/letter-s";
import { letterT } from "./letters/letter-t";
import { letterU } from "./letters/letter-u";
import { letterV } from "./letters/letter-v";
import { letterW } from "./letters/letter-w";
import { letterX } from "./letters/letter-x";
import { letterY } from "./letters/letter-y";
import { letterZ } from "./letters/letter-z";

export type Alphabet = {
  [key in LetterName]: Glyph;
};

export const ALPHABET: Alphabet = {
    A: letterA,
    B: letterB,
    C: letterC,
    D: letterD,
    E: letterE,
    F: letterF,
    G: letterG,
    H: letterH,
    I: letterI,
    J: letterJ,
    K: letterK,
    L: letterL,
    M: letterM,
    N: letterN,
    O: letterO,
    P: letterP,
    Q: letterQ,
    R: letterR,
    S: letterS,
    T: letterT,
    U: letterU,
    V: letterV,
    W: letterW,
    X: letterX,
    Y: letterY,
    Z: letterZ,
};



/**
 * Get available characters in the font
 */
export const getAvailableCharacters = (): string[] => {
  return Object.keys(ALPHABET);
}