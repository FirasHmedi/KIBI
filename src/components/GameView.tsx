import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { executeBotTurn } from '../GameBot/BotActions';
import { canAttackOwner } from '../GameBot/powerCardCheckers';
import {
	activateTankAbility,
	attackOppAnimal,
	attackOwner,
	drawCardFromMainDeck,
	enableAttackForOpponentAnimals,
	enableAttackingAndPlayingPowerCards,
	placeAnimalOnBoard,
	setPowerCardAsActive,
} from '../backend/actions';
import { add1Hp, add2Hp, minus1Hp } from '../backend/animalsAbilities';
import { getPlayerPath, setItem } from '../backend/db';
import {
	blockAttacksMinusHp,
	blockPowersMinusHp,
	changeElement,
	draw2Cards,
	resetBoardMinusHp,
	return2animalsFromGYToDeck,
	returnOneAnimalFromGYToDeck,
	returnOnePowerFromGYToDeck,
	sacrifice1HpToReviveAnyAnimal,
	sacrifice3HpToSteal,
	sacrificeAnimalToGet2Hp,
	sacrificeAnimalToGet3Hp,
	stealCardFromOpponent,
	switch2Cards,
	switchDeckMinusHp,
} from '../backend/powers';
import {
	addAnimalToBoard,
	addInfoToLog,
	addOneRound,
	addPowerToGraveYard,
	deleteAnimalCardFromGraveYardById,
	deletePowerCardFromGraveYardById,
	isOne,
	isTwo,
	removeHpFromPlayer,
} from '../backend/unitActions';
import { centerStyle, flexColumnStyle } from '../styles/Style';
import { BOT, ClanName, EMPTY, KING, POWER_CARDS_WITH_2_SELECTS } from '../utils/data';
import {
	canAnimalAKillAnimalD,
	getAnimalCard,
	getCardIdThatAttacksOwner,
	getISlotsAllEmpty,
	getOpponentIdFromCurrentId,
	getOriginalCardId,
	getPowerCard,
	hasAttackerInElement,
	hasKingInElement,
	isAnimalCard,
	isAnimalInSlots,
	isAttackerInElement,
	isCard,
	isGameFinished,
	isJokerInElement,
	isPowerCard,
	isPowerCardPlayable,
	isTankInElement,
	showToast,
} from '../utils/helpers';
import { Board, Player, PlayerType, Round, SlotType } from '../utils/interface';
import { BoardView } from './Board';
import { ElementPopup, GameLeftInfo } from './Elements';
import GameFinished from './GameFinished';
import { CardsPopup } from './GraveyardsView';
import { CountDown, CurrentPView, OpponentPView } from './PlayersView';

interface GameViewProps {
	round: Round;
	gameId: string;
	board: Board;
	oppPlayer: Player;
	currPlayer: Player;
	spectator?: boolean;
	showCountDown: any;
	logs: string[];
	status: string;
	winner?: string;
	ROUND_DURATION: number;
}

export function GameView({
	round,
	gameId,
	board,
	oppPlayer,
	currPlayer,
	spectator,
	showCountDown,
	logs,
	status,
	winner,
	ROUND_DURATION,
}: GameViewProps) {
	const { oppPSlots, currPSlots, elementType, animalGY, powerGY } = board;
	const playerType = currPlayer.playerType!;
	const isMyRound = round.player === playerType;

	const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);
	const [nbCardsToPlay, setNbCardsToPlay] = useState(3);
	const [cardsIdsForPopup, setCardsIdsForPopup] = useState<string[]>([]);
	const [selectedCardsIdsForPopup, setSelectedCardsIdsForPopup] = useState<string[]>([]);
	const [isJokerActive, setIsJokerActive] = useState(false);
	const [isStealCard, setIsStealCard] = useState(false);

	const activePowerCard = useRef('');
	const hasAttacked = useRef(false);
	const hasAttackedOpp = useRef(false);
	const hasExtraAttack = useRef(false);
	const lastAnimalIdThatAttacked = useRef<string>('');
	const gyTitle = useRef('');

	const openCardsPopup = cardsIdsForPopup?.length > 0;
	const isOppSlotsEmpty = getISlotsAllEmpty(oppPSlots);
	const isOppDoubleAP = oppPlayer.isDoubleAP;
	const isCurrDoubleAP = currPlayer.isDoubleAP;
	const [isConfirmActive, setIsConfirmActive] = useState(false);

	useEffect(() => {
		if (isMyRound) {
			activateMonkeyAbility(currPSlots, elementType);
			(async function () {
				await activateTankAbility(gameId, playerType, currPSlots, elementType);
			})();
		}

		if (round.nb < 3 || !isMyRound) {
			return;
		}

		setNbCardsToPlay(2);
		hasAttacked.current = false;
		hasAttackedOpp.current = false;
	}, [round.nb]);

	const getCurrSlotNb = () => {
		for (let i = 0; i < 3; i++) {
			if (!isAnimalCard(currPSlots[i]?.cardId)) {
				return i;
			}
		}
		return 0;
	};

	const updateCardsOrder = async (newCardsIds: string[]) => {
		await setItem(getPlayerPath(gameId, playerType), { cardsIds: newCardsIds });
	};

	const playAnimalCard = async (cardId: string, slotNb: number): Promise<void> => {
		const { role } = getAnimalCard(cardId)!;

		if (role === KING) {
			if (currPlayer.hp < 2) {
				return;
			}
			await minus1Hp(gameId, playerType);
		}

		await placeAnimalOnBoard(gameId, playerType, slotNb, cardId);

		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));

		if (isJokerInElement(cardId, elementType)) {
			openJokerPopup();
			return;
		}

		if (isTankInElement(cardId, elementType)) {
			await add1Hp(gameId, playerType);
		}
	};

	const closePopupAndProcessPowerCard = async () => {
		if (isJokerActive) {
			setCardsIdsForPopup([]);
			setIsJokerActive(false);
			return;
		}
		await processPostPowerCardPlay();
	};

	const findSlotNumberByCardId = (cardId: string, slots: SlotType[]): number | null => {
		for (let i = 0; i < slots.length; i++) {
			if (slots[i].cardId === cardId) {
				return i;
			}
		}
		return null;
	};

	const selectCardForPopup = async (cardId: string) => {
		if (isEmpty(cardId) || selectedCardsIdsForPopup[0] === cardId) {
			return;
		}
		if (
			POWER_CARDS_WITH_2_SELECTS.includes(getOriginalCardId(activePowerCard.current)) &&
			isEmpty(selectedCardsIdsForPopup)
		) {
			setSelectedCardsIdsForPopup([cardId]);
			return;
		}

		setCardsIdsForPopup([]);
		setIsStealCard(false);

		if (isJokerActive && isCard(cardId)) {
			const cardName = isAnimalCard(cardId)
				? getAnimalCard(cardId)?.name!
				: getPowerCard(cardId)?.name!;

			if (isAnimalCard(cardId)) {
				await returnOneAnimalFromGYToDeck(gameId, playerType, cardId);
			} else {
				await returnOnePowerFromGYToDeck(gameId, playerType, cardId);
			}

			await addInfoToLog(gameId, 'Joker returned ' + cardName);
			setIsJokerActive(false);
			return;
		}

		const { activateJokerAbilityNow, activateTankAbilityNow, skip } =
			await executePowerCardsWithPopup(cardId)!;

		if (skip) {
			return;
		}

		await processPostPowerCardPlay();

		if (activateJokerAbilityNow) {
			openJokerPopup();
		}
		if (activateTankAbilityNow) {
			await add1Hp(gameId, playerType);
		}
	};

	const executePowerCardsWithPopup = async (cardId: string) => {
		switch (getOriginalCardId(activePowerCard.current)) {
			case 'steal-card-1hp':
				await stealCardFromOpponent(gameId, playerType, cardId);
				return {
					activateJokerAbilityNow: false,
					activateTankAbilityNow: false,
				};
			case 'rev-any-pow-1hp':
				if (powerGY?.includes(cardId)) {
					setSelectedCardsIdsForPopup([]);
					await removeHpFromPlayer(gameId, playerType, 1);
					await deletePowerCardFromGraveYardById(gameId, cardId);
					await playPowerAfterRevive(cardId);
				}
				return {
					activateJokerAbilityNow: false,
					activateTankAbilityNow: false,
					skip: true,
				};
			case 'rev-any-anim-1hp':
				const slotNbForRevive = getCurrSlotNb();
				await sacrifice1HpToReviveAnyAnimal(gameId, playerType, cardId, slotNbForRevive!);
				return {
					activateJokerAbilityNow: isJokerInElement(cardId, elementType),
					activateTankAbilityNow: isTankInElement(cardId, elementType),
				};
			case '2-anim-gy':
				await return2animalsFromGYToDeck(gameId, playerType, [...selectedCardsIdsForPopup, cardId]);
				break;
			case 'sacrif-anim-3hp':
				const slotNb = findSlotNumberByCardId(cardId, currPSlots);
				await sacrificeAnimalToGet3Hp(gameId, playerType, cardId, slotNb!, elementType);
				break;
			case 'steal-anim-3hp':
				const slotNbForSteal = getCurrSlotNb();
				const slotNbtoSteal = findSlotNumberByCardId(cardId, oppPSlots);
				await sacrifice3HpToSteal(gameId, playerType, cardId, slotNbtoSteal!, slotNbForSteal!);
				return {
					activateJokerAbilityNow: isJokerInElement(cardId, elementType),
					activateTankAbilityNow: isTankInElement(cardId, elementType),
				};
			case 'switch-2-cards':
				await switch2Cards(gameId, playerType, activePowerCard.current, [
					...selectedCardsIdsForPopup,
					cardId,
				]);
				break;
		}

		return {
			activateJokerAbilityNow: false,
			activateTankAbilityNow: false,
		};
	};

	const playPowerAfterRevive = async (cardId: string) => {
		if (
			getOriginalCardId(cardId) === 'rev-last-pow' ||
			getOriginalCardId(cardId) === 'rev-any-pow-1hp' ||
			!isPowerCardPlayable(cardId, {
				currPSlots,
				currPlayer,
				animalGY,
				powerGY,
				isOppSlotsEmpty,
				oppPlayer,
			})
		) {
			return;
		}

		console.log('Executing power card ', cardId);

		const { name } = getPowerCard(cardId)!;
		let lastAnimCard;
		await setPowerCardAsActive(gameId, playerType, cardId!, name!);
		activePowerCard.current = cardId;

		switch (getOriginalCardId(cardId!)) {
			case 'block-att':
				await blockAttacksMinusHp(gameId, playerType);
				break;
			case 'block-pow':
				await blockPowersMinusHp(gameId, playerType);
				break;
			case 'reset-board':
				await resetBoardMinusHp(gameId, playerType, currPSlots, oppPSlots);
				break;
			case 'switch-decks':
				await switchDeckMinusHp(gameId, playerType);
				break;
			case 'rev-last-anim':
				lastAnimCard = animalGY[animalGY.length - 1];
				await deleteAnimalCardFromGraveYardById(gameId, lastAnimCard);
				const slotNbForRevive = getCurrSlotNb();
				await addAnimalToBoard(gameId, playerType, slotNbForRevive, lastAnimCard!);
				break;
			case 'rev-any-anim-1hp':
				gyTitle.current = 'Choose an animal to revive';
				setCardsIdsForPopup(animalGY);
				return;
			case 'steal-anim-3hp':
				gyTitle.current = 'Steal an animal from Opponent';
				const opponentIds = oppPSlots.map(slot => slot.cardId).filter(cardId => cardId !== EMPTY);
				setCardsIdsForPopup(opponentIds);
				return;
			case 'switch-2-cards':
				gyTitle.current = 'Switch 2 cards with Opponent';
				const filteredIds = currPlayer.cardsIds.filter(id => id !== cardId);
				setCardsIdsForPopup(filteredIds);
				return;
			case 'sacrif-anim-3hp':
				gyTitle.current = 'Sacrifice an animal for HP';
				const currentIds = currPSlots.map(slot => slot.cardId).filter(cardId => cardId !== EMPTY);
				setCardsIdsForPopup(currentIds);
				return;
			case '2hp':
				await add2Hp(gameId, playerType);
				break;
			case 'draw-2':
				await draw2Cards(gameId, playerType);
				break;
			case '2-anim-gy':
				gyTitle.current = 'Select 2 Animal to return to deck';
				setCardsIdsForPopup(animalGY);
				return;
			case 'steal-card-1hp':
				gyTitle.current = 'Steal a card from Opponent';
				setIsStealCard(true);
				setCardsIdsForPopup(oppPlayer.cardsIds);
				return;
		}
		await processPostPowerCardPlay(lastAnimCard);
	};

	const playPowerCard = async (cardId: string) => {
		if (
			!isPowerCardPlayable(cardId, {
				currPSlots,
				currPlayer,
				animalGY,
				powerGY,
				isOppSlotsEmpty,
				oppPlayer,
			})
		) {
			return false;
		}

		console.log('Executing power card ', cardId);

		const { name } = getPowerCard(cardId)!;
		let lastAnimCard;
		await setPowerCardAsActive(gameId, playerType, cardId!, name!);
		activePowerCard.current = cardId;
		switch (getOriginalCardId(cardId!)) {
			case 'block-att':
				await blockAttacksMinusHp(gameId, playerType);
				break;
			case 'block-pow':
				await blockPowersMinusHp(gameId, playerType);
				break;
			case 'reset-board':
				await resetBoardMinusHp(gameId, playerType, currPSlots, oppPSlots);
				break;
			case 'switch-decks':
				await switchDeckMinusHp(gameId, playerType);
				break;
			case '2hp':
				await add2Hp(gameId, playerType);
				break;
			case 'draw-2':
				await draw2Cards(gameId, playerType);
				break;
			case 'rev-last-pow':
				const lastPowerCard = powerGY[powerGY.length - 1];
				await addPowerToGraveYard(gameId, activePowerCard.current);
				await deletePowerCardFromGraveYardById(gameId, lastPowerCard);
				await playPowerAfterRevive(lastPowerCard);
				return;
			case 'rev-any-pow-1hp':
				gyTitle.current = 'Select a power card to activate';
				await addPowerToGraveYard(gameId, activePowerCard.current);
				setCardsIdsForPopup(powerGY);
				return;
			case 'rev-last-anim':
				lastAnimCard = animalGY[animalGY.length - 1];
				await deleteAnimalCardFromGraveYardById(gameId, lastAnimCard);
				const slotNbForRevive = getCurrSlotNb();
				await addAnimalToBoard(gameId, playerType, slotNbForRevive, lastAnimCard!);
				break;
			case 'rev-any-anim-1hp':
				gyTitle.current = 'Select an animal to revive';
				setCardsIdsForPopup(animalGY);
				return;
			case 'steal-anim-3hp':
				gyTitle.current = 'Select an animal to steal';
				const oppAnimalsIds = oppPSlots.map(slot => slot.cardId).filter(cardId => cardId !== EMPTY);
				setCardsIdsForPopup(oppAnimalsIds);
				return;
			case 'switch-2-cards':
				gyTitle.current = 'Select 2 cards to switch';
				const filteredIds = currPlayer.cardsIds.filter(id => id !== cardId);
				setCardsIdsForPopup(filteredIds);
				return;
			case 'sacrif-anim-3hp':
				gyTitle.current = 'Select an animal to sacrifice';
				const currentIds = currPSlots.map(slot => slot.cardId).filter(cardId => cardId !== EMPTY);
				setCardsIdsForPopup(currentIds);
				return;
			case '2-anim-gy':
				gyTitle.current = 'Select 2 Animals to return to deck';
				setCardsIdsForPopup(animalGY);
				return;
			case 'steal-card-1hp':
				gyTitle.current = 'Steal a card from Opponent';
				setIsStealCard(true);
				setCardsIdsForPopup(oppPlayer.cardsIds);
				return;
		}

		await processPostPowerCardPlay(lastAnimCard);
	};

	const processPostPowerCardPlay = async (lastAnimCard?: string) => {
		setCardsIdsForPopup([]);

		await addPowerToGraveYard(gameId, activePowerCard.current);

		setSelectedCardsIdsForPopup([]);
		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));

		activePowerCard.current = '';

		if (isAnimalCard(lastAnimCard)) {
			if (isJokerInElement(lastAnimCard, elementType)) {
				openJokerPopup(lastAnimCard);
			}
			if (isTankInElement(lastAnimCard, elementType)) {
				await add1Hp(gameId, playerType);
			}
		}
	};

	const setElement = async () => {
		if (currPlayer.hp < 2 || spectator || !isMyRound) {
			return;
		}
		setShowEnvPopup(true);
	};

	const playCard = async (cardId?: string, slotNb?: number) => {
		console.log({ playerType }, { cardId }, { round }, { nbCardsToPlay });

		if (isGameFinished(status) || spectator || isEmpty(cardId) || isEmpty(playerType)) {
			return;
		}

		if (nbCardsToPlay === 0) {
			showToast('Already played cards');
			return;
		}

		if (!isMyRound) {
			showToast('Not your round to play');
			return;
		}

		if (isAnimalCard(cardId) && !isNil(slotNb)) {
			await playAnimalCard(cardId!, slotNb);
			return;
		}

		if (isPowerCard(cardId)) {
			if (currPlayer.canPlayPowers) {
				await playPowerCard(cardId!);
			} else {
				showToast('Blocked from playing powers');
			}
		}
	};

	const changeEnvWithPopup = async (newElementType?: ClanName) => {
		if (isGameFinished(status) || !newElementType || spectator || newElementType === elementType) {
			setShowEnvPopup(false);
			return;
		}
		await changeElement(gameId, newElementType, playerType);
		await minus1Hp(gameId, playerType);
		await addInfoToLog(gameId, playerType + ' changed element to ' + newElementType);
		setShowEnvPopup(false);
		await activateTankAbility(gameId, playerType, currPSlots, newElementType);
		activateMonkeyAbility(currPSlots, newElementType);
	};

	const finishRoundBot = async () => {
		await executeBotTurn(gameId);
		await enableAttackingAndPlayingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
		await addOneRound(gameId, playerType);
		await enableAttackForOpponentAnimals(gameId, playerType, currPSlots);
	};

	const finishRound = async () => {
		hasExtraAttack.current = false;
		lastAnimalIdThatAttacked.current = '';
		if (isGameFinished(status) || spectator) {
			return;
		}
		try {
			showCountDown.current = false;
			await enableAttackingAndPlayingPowerCards(gameId, playerType);
			await addOneRound(gameId, getOpponentIdFromCurrentId(playerType));
			await enableAttackForOpponentAnimals(
				gameId,
				getOpponentIdFromCurrentId(playerType),
				oppPSlots,
			);
			if (oppPlayer?.playerName === BOT) {
				await drawCardFromMainDeck(gameId, PlayerType.TWO);
				await finishRoundBot();
			}
		} catch (e) {
			console.error(e);
		}
	};

	const simpleCanAttackCondts =
		round.nb >= 3 && isMyRound && currPlayer.canAttack && !hasAttacked.current;

	const isAttackDisabled = !simpleCanAttackCondts || getISlotsAllEmpty(currPSlots);

	const attackerAttackTwice =
		isAttackerInElement(lastAnimalIdThatAttacked.current, elementType) && !isOppSlotsEmpty;

	const canAttackOpponent =
		simpleCanAttackCondts &&
		!attackerAttackTwice &&
		(isOppSlotsEmpty || hasAttackerInElement(currPSlots, elementType));

	const attackPlayer = async () => {
		if (
			round.nb < 3 ||
			!isMyRound ||
			!currPlayer.canAttack ||
			hasAttacked.current ||
			(!isOppSlotsEmpty && !hasAttackerInElement(currPSlots, elementType))
		) {
			return;
		}

		const cardId = getCardIdThatAttacksOwner(
			currPSlots,
			elementType,
			lastAnimalIdThatAttacked.current,
		);

		if (!isAnimalCard(cardId) || cardId === lastAnimalIdThatAttacked.current) {
			return;
		}

		hasAttacked.current = true;
		await attackOwner(gameId, getOpponentIdFromCurrentId(playerType), cardId, isCurrDoubleAP);
		hasAttackedOpp.current = true;
		handleSecondAttackRule(cardId);
	};

	const attack = async (
		currAnimalId?: string,
		oppoAnimalId?: string,
		currslotnb?: number,
		oppslotnb?: number,
	) => {
		if (
			isNil(currAnimalId) ||
			isGameFinished(status) ||
			spectator ||
			currAnimalId === oppoAnimalId ||
			!isAnimalInSlots(currPSlots, currAnimalId) ||
			isNil(currslotnb)
		) {
			return;
		}
		if (round.nb < 3) {
			showToast('Attack is disabled in first round');
			return false;
		}

		if (!currPlayer.canAttack) {
			showToast('Blocked from attacking');
			return false;
		}

		if (hasAttacked.current) {
			showToast('Already attacked');
			return false;
		}

		if (!isAnimalInSlots(oppPSlots, oppoAnimalId)) {
			showToast('Attack an opponent animal');
			return false;
		}

		if (currAnimalId === lastAnimalIdThatAttacked.current) {
			showToast('Choose another animal');
			return false;
		}

		const isAttackAnimalsEnabled =
			round.nb >= 3 && isMyRound && currPlayer.canAttack && !hasAttacked.current;

		console.log(
			'p canAttack',
			currPlayer.canAttack,
			{ hasAttacked },
			'isOppAnimalInSlots',
			isAnimalInSlots(oppPSlots, oppoAnimalId),
			{ isAttackAnimalsEnabled },
		);

		if (isAttackAnimalsEnabled && isAnimalInSlots(oppPSlots, oppoAnimalId)) {
			return await attackAnimal(currAnimalId, oppoAnimalId, oppslotnb);
		}
	};

	const attackAnimal = async (currAnimalId?: string, oppoAnimalId?: string, oppSlotNb?: number) => {
		if (!canAnimalAKillAnimalD(currAnimalId, oppoAnimalId, isCurrDoubleAP)) {
			return false;
		}

		hasAttacked.current = true;
		await attackOppAnimal(gameId, playerType, currAnimalId!, oppoAnimalId!, oppSlotNb!);

		handleSecondAttackRule(currAnimalId!);
	};

	const handleSecondAttackRule = (cardId: string) => {
		const canSecondAttack = hasKingInElement(currPSlots, elementType) && !hasExtraAttack.current;

		if (canSecondAttack) {
			lastAnimalIdThatAttacked.current = cardId!;
			hasExtraAttack.current = true;
			hasAttacked.current = false;
			return;
		}

		hasAttacked.current = true;
		hasExtraAttack.current = false;
		lastAnimalIdThatAttacked.current = '';
	};

	const sacrificeAnimal = async (animalId: string, slotNb: number) => {
		if (!isMyRound) {
			showToast('Not your round to play');
			return;
		}
		if (spectator || isNil(slotNb) || !isAnimalInSlots(currPSlots, animalId)) {
			return;
		}
		await sacrificeAnimalToGet2Hp(gameId, playerType, animalId, slotNb);
	};

	const activateMonkeyAbility = (slots: any[] = [], elementType?: ClanName) => {
		console.log('Try activate monkey ability ', { slots }, { elementType });
		for (let i = 0; i < slots.length; i++) {
			if (isJokerInElement(slots[i]?.cardId, elementType)) {
				openJokerPopup();
				return;
			}
		}
	};

	const openJokerPopup = (lastAnimCard?: string) => {
		if (isEmpty(animalGY)) {
			return;
		}
		const graveyardCards = [...animalGY].filter(id => lastAnimCard !== id);
		setCardsIdsForPopup(graveyardCards);
		setIsJokerActive(true);
	};

	const localState = {
		round,
		nbCardsToPlay,
		activePowerCard,
		board,
		status,
		elementType,
	};

	const attackState = {
		round,
		hasExtraAttack,
		lastAnimalIdThatAttacked,
		currPlayer,
		oppPlayer,
		board,
		hasAttacked,
		currPSlots,
		canAttackOwner,
		status,
		elementType,
	};

	const playerNameOne =
		(isOne(currPlayer?.playerType) ? currPlayer.playerName : oppPlayer.playerName) ??
		PlayerType.ONE;
	const playerNameTwo =
		(isTwo(currPlayer?.playerType) ? currPlayer.playerName : oppPlayer.playerName) ??
		PlayerType.TWO;

	const winnerName =
		((winner as PlayerType) === playerType ? currPlayer.playerName : oppPlayer.playerName) ??
		'Anonymous';

	return (
		<>
			<ToastContainer />
			<div
				style={{
					...flexColumnStyle,
					width: '100%',
					height: '99vh',
					justifyContent: 'space-between',
					paddingBottom: '1vh',
				}}>
				<OpponentPView player={oppPlayer} spectator={spectator} />

				{!isGameFinished(status) && !spectator && showEnvPopup && (
					<ElementPopup changeElement={changeEnvWithPopup} />
				)}

				<GameLeftInfo
					round={round}
					logs={logs}
					playerOneName={playerNameOne}
					playerTwoName={playerNameTwo}
					playerType={playerType}
				/>

				<BoardView
					board={board}
					isMyRound={isMyRound}
					playCard={playCard}
					localState={localState}
					attack={attack}
					attackPlayer={attackPlayer}
					attackState={attackState}
					isOppDoubleAP={isOppDoubleAP}
					isCurrDoubleAP={isCurrDoubleAP}
					setElement={setElement}
					canAttackOpponent={canAttackOpponent}
					sacrificeAnimal={sacrificeAnimal}
				/>
				<CurrentPView
					player={currPlayer}
					round={round}
					finishRound={finishRound}
					nbCardsToPlay={nbCardsToPlay}
					spectator={spectator}
					updateCardsOrder={updateCardsOrder}
					hasAttacked={hasAttacked}
					isConfirmActive={false}
					setIsConfirmActive={setIsConfirmActive}
					isAttackDisabled={isAttackDisabled}
					status={status}
				/>
				{openCardsPopup && !spectator && (
					<CardsPopup
						cardsIds={cardsIdsForPopup}
						selectedIds={selectedCardsIdsForPopup}
						selectCardsPolished={selectCardForPopup}
						closeCardSelectionPopup={closePopupAndProcessPowerCard}
						dropClose={false}
						isJokerActive={isJokerActive}
						isStealCard={isStealCard}
						title={gyTitle}
					/>
				)}
				{isGameFinished(status) && <GameFinished status={status} winnerName={winnerName} />}
				{!isGameFinished(status) && showCountDown.current && (
					<div
						style={{
							position: 'absolute',
							left: '6vw',
							bottom: '2.5vh',
							height: '4vh',
							...centerStyle,
						}}>
						<CountDown finishRound={finishRound} ROUND_DURATION={ROUND_DURATION} />
					</div>
				)}
			</div>
		</>
	);
}
