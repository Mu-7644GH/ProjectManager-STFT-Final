import  nanoid from 'nanoid';
import { customAlphabet , urlAlphabet } from 'nanoid';

export const newNanoID = (numOfChars = 10) => {
    // return customAlphabet(urlAlphabet, numOfChars);
    return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', numOfChars);
}
export const customNanoid = (numOfChars = 10) => {
    // return customAlphabet(urlAlphabet, numOfChars);
    let nanoid2 =  customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', numOfChars);
    return nanoid2();
}

