import { SlotType } from './../utils/interface';
import {  getItemsOnce } from "../backend/db";


export const getBotSlots = async (gameId:string)  =>{
    let slots = await getItemsOnce("/games/"+gameId+"/board/two");
    return slots;

} 

export const getPlayerSlots = async (gameId:string) =>{
    let slots = await getItemsOnce("/games/"+gameId+"/board/one");
    return slots;

} 

export const getRoundNb = async (gameId:string) =>{
    let RoundNb = await getItemsOnce("/games/"+gameId+"/round/nb")
    return RoundNb;
}
export const getBotDeck = async (gameId:string) => {
    let BotDeck = await getItemsOnce("/games/"+gameId+"/two/cardsIds");
    return BotDeck;
}

export const getPlayerDeck = async (gameId:string) => {
    let playerDeck = await getItemsOnce("/games/"+gameId+"/one/cardsIds");
    return playerDeck;
}

export const getElementfromDb = async (gameId:string) => {
    let element = await getItemsOnce("/games/"+gameId+"/board/elementType");
    return element;
}





