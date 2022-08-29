import  nanoid from 'nanoid';
import { customAlphabet , urlAlphabet } from 'nanoid';

export const newNanoID = (numOfChars = 10) => {
    // return customAlphabet(urlAlphabet, numOfChars);
    return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', numOfChars);
}

