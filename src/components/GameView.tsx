import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { useEffect, useRef, useState } from 'react';
import { executeBotTurn } from '../GameBot/BotActions';
import {
	activateTankAbility,
	attackOppAnimal,
	attackOwner,
	changeHasAttacked,
	drawCardFromMainDeck,
	enableAttackForOpponentAnimals,
	enableAttackingAndPlayingPowerCards,
	placeAnimalOnBoard,
	setElementLoad,
	setPowerCardAsActive,
} from '../backend/actions';
import { add1Hp, add2Hp, minus1Hp, minus2Hp } from '../backend/animalsAbilities';
import {
	cancelAttacks,
	cancelUsingPowerCards,
	changeElement,
	draw2Cards,
	resetBoard,
	return2animalsFromGYToDeck,
	sacrifice1HpToReviveAnyAnimal,
	sacrifice3HpToSteal,
	sacrificeAnimalToGet3Hp,
	stealCardFromOpponent,
	switch2Cards,
	switchDeck,
} from '../backend/powers';
import {
	addOneRound,
	addPowerToGraveYard,
	deletePowerCardFromGraveYardById,
	removeHpFromPlayer,
} from '../backend/unitActions';
import { centerStyle, flexColumnStyle, violet } from '../styles/Style';
import { BOT, ClanName, EMPTY, JOKER, KING, POWER_CARDS_WITH_2_SELECTS } from '../utils/data';
import {
	canAnimalAKillAnimalD,
	getAnimalCard,
	getIsOppSlotsAllFilled,
	getIsOppSlotsEmpty,
	getOpponentIdFromCurrentId,
	getOriginalCardId,
	getPowerCard,
	isAnimalCard,
	isAnimalInSlots,
	isAttackerInElement,
	isJokerInElement,
	isKingInElement,
	isPowerCard,
	isTankInElement,
	waitFor,
} from '../utils/helpers';
import { Board, Player, PlayerType, Round, SlotType } from '../utils/interface';
import { BoardView } from './Board';
import { ElementPopup, RoundView } from './Elements';
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
}

export function GameView({
	round,
	gameId,
	board,
	oppPlayer,
	currPlayer,
	spectator,
	showCountDown,
}: GameViewProps) {
	const { oppPSlots, currPSlots, elementType, animalGY, powerGY } = board;
	const playerType = currPlayer.playerType!;
	const isMyRound = round.player === playerType;

	const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);
	const [nbCardsToPlay, setNbCardsToPlay] = useState(3);
	const [cardsIdsForPopup, setCardsIdsForPopup] = useState<string[]>([]);
	const [selectedCardsIdsForPopup, setSelectedCardsIdsForPopup] = useState<string[]>([]);
	const [isJokerActive, setIsJokerActive] = useState(false);

	const activePowerCard = useRef('');
	const hasAttacked = useRef(false);
	const canKingAttackAgain = useRef(false);
	const gyTitle = useRef('');

	const openCardsPopup = cardsIdsForPopup?.length > 0;
	const isOppSlotsEmpty = getIsOppSlotsEmpty(oppPSlots);
	const isOppSlotsAllFilled = getIsOppSlotsAllFilled(oppPSlots);
	const isOppDoubleAP = oppPlayer.isDoubleAP;
	const isCurrDoubleAP = currPlayer.isDoubleAP;

	useEffect(() => {
		if (isMyRound) {
			activateMonkeyAbility(currPSlots, false, elementType);
			activateTankAbility(gameId, playerType, currPSlots, elementType);
		}

		if (round.nb < 3 || !isMyRound) {
			return;
		}

		setNbCardsToPlay(2);
		hasAttacked.current = false;
	}, [round.nb]);

	const getCurrSlotNb = () => {
		for (let i = 0; i < 3; i++) {
			if (!isAnimalCard(currPSlots[i]?.cardId)) {
				return i;
			}
		}
		return 0;
	};

	const playAnimalCard = async (cardId: string, slotNb: number): Promise<void> => {
		const { role } = getAnimalCard(cardId)!;

		if (role === KING) {
			if (currPlayer.hp < 2) {
				return;
			}
			await minus1Hp(gameId, playerType);
		}

		await placeAnimalOnBoard(gameId, playerType, slotNb, cardId, elementType);

		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));

		if (isJokerInElement(cardId, elementType)) {
			await waitFor(700);
			setCardsIdsForPopup(oppPlayer.cardsIds);
			setIsJokerActive(true);
		}

		if (isTankInElement(cardId, elementType)) {
			await waitFor(700);
			await add1Hp(gameId, playerType);
		}
	};

	const isPowerCardPlayable = (cardId: string) => {
		switch (getOriginalCardId(cardId!)) {
			case 'block-att':
				if (currPlayer.hp < 2) return false;
				break;
			case 'block-pow':
				if (currPlayer.hp < 2) return false;
				break;
			case 'reset-board':
				if (currPlayer.hp < 2) return false;
				break;
			case 'rev-any-anim-1hp':
				if (isEmpty(animalGY) || currPlayer.hp < 2) return false;
				break;
			case 'steal-anim-3hp':
				if (currPlayer.hp < 4 || isOppSlotsEmpty) return false;
				break;
			case 'sacrif-anim-3hp':
				if (
					!isAnimalCard(currPSlots[0].cardId) &&
					!isAnimalCard(currPSlots[1].cardId) &&
					!isAnimalCard(currPSlots[2].cardId)
				)
					return false;
				break;
			case '2-anim-gy':
				if (isEmpty(animalGY) || animalGY?.length < 2) return false;
				break;
			case 'rev-any-pow-1hp':
				if (isEmpty(powerGY) || currPlayer.hp < 2) return false;
				break;
			case 'switch-2-cards':
				if (currPlayer.cardsIds.length < 3 || oppPlayer.cardsIds.length < 2) return false;
				break;
			case 'rev-last-pow':
				if (isEmpty(powerGY)) return false;
				const lastPow = powerGY[powerGY.length - 1];
				if (
					getOriginalCardId(lastPow) === 'rev-last-pow' ||
					getOriginalCardId(lastPow) === 'rev-any-pow-1hp'
				) {
					return false;
				}
				break;
		}
		return true;
	};

	const closePopupAndProcessPowerCard = async () => {
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

		if (isJokerActive) {
			await stealCardFromOpponent(gameId, playerType, cardId);
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
			await waitFor(700);
			setCardsIdsForPopup(oppPlayer.cardsIds);
			setIsJokerActive(true);
		}
		if (activateTankAbilityNow) {
			await waitFor(700);
			await add1Hp(gameId, playerType);
		}
	};

	const executePowerCardsWithPopup = async (cardId: string) => {
		switch (getOriginalCardId(activePowerCard.current)) {
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
			!isPowerCardPlayable(cardId)
		) {
			return;
		}

		console.log('Executing power card ', cardId);

		const { name } = getPowerCard(cardId)!;
		await setPowerCardAsActive(gameId, playerType, cardId!, name!);
		activePowerCard.current = cardId;

		switch (getOriginalCardId(cardId!)) {
			case 'block-att':
				await cancelAttacks(gameId, getOpponentIdFromCurrentId(playerType));
				await minus1Hp(gameId, playerType);
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
			case 'switch-decks':
				await minus1Hp(gameId, playerType);
				await switchDeck(gameId);
				break;
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
			case 'block-pow':
				await cancelUsingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
				await minus1Hp(gameId, playerType);
				break;
			case 'reset-board':
				await minus1Hp(gameId, playerType);
				await resetBoard(gameId, playerType, currPSlots, oppPSlots);
				break;
		}
		await processPostPowerCardPlay();
	};

	const playPowerCard = async (cardId: string) => {
		if (!isPowerCardPlayable(cardId)) {
			return false;
		}

		console.log('Executing power card ', cardId);

		const { name } = getPowerCard(cardId)!;
		await setPowerCardAsActive(gameId, playerType, cardId!, name!);
		activePowerCard.current = cardId;
		switch (getOriginalCardId(cardId!)) {
			case 'block-att':
				await cancelAttacks(gameId, getOpponentIdFromCurrentId(playerType));
				await minus1Hp(gameId, playerType);
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
			case 'rev-any-anim-1hp':
				gyTitle.current = 'Select an animal to revive';
				setCardsIdsForPopup(animalGY);
				return;
			case 'steal-anim-3hp':
				gyTitle.current = 'Select an animal to steal';
				const opponentIds = oppPSlots.map(slot => slot.cardId).filter(cardId => cardId !== EMPTY);
				setCardsIdsForPopup(opponentIds);
				return;
			case 'switch-decks':
				await minus1Hp(gameId, playerType);
				await switchDeck(gameId);
				break;
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
			case '2hp':
				await add2Hp(gameId, playerType);
				break;
			case 'draw-2':
				await draw2Cards(gameId, playerType);
				break;
			case '2-anim-gy':
				gyTitle.current = 'Select 2 Animals to return to deck';
				setCardsIdsForPopup(animalGY);
				return;
			case 'block-pow':
				await cancelUsingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
				await minus1Hp(gameId, playerType);
				break;
			case 'reset-board':
				await minus1Hp(gameId, playerType);
				await resetBoard(gameId, playerType, currPSlots, oppPSlots);
				break;
		}

		await processPostPowerCardPlay();
	};

	const processPostPowerCardPlay = async () => {
		setCardsIdsForPopup([]);

		await addPowerToGraveYard(gameId, activePowerCard.current);

		setSelectedCardsIdsForPopup([]);
		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));

		activePowerCard.current = '';
	};

	const setElement = () => {
		if (spectator) return;
		setShowEnvPopup(true);
	};

	const chargeElement = async () => {
		if (spectator || currPlayer.envLoadNb === 1 || currPlayer.hp < 2 || !isMyRound) return;
		await minus2Hp(gameId, playerType);
		await setElementLoad(gameId, playerType, 1);
	};

	const playCard = async (cardId?: string, slotNb?: number) => {
		console.log({ playerType }, { cardId }, { round }, { nbCardsToPlay });

		if (spectator || isEmpty(cardId) || isEmpty(playerType) || nbCardsToPlay === 0 || !isMyRound) {
			return;
		}

		if (isAnimalCard(cardId) && !isNil(slotNb)) {
			await playAnimalCard(cardId!, slotNb);
			return;
		}

		if (isPowerCard(cardId) && currPlayer.canPlayPowers) {
			await playPowerCard(cardId!);
		}
	};

	const changeEnvWithPopup = async (elementType?: ClanName) => {
		if (!elementType) {
			setShowEnvPopup(false);
			return;
		}
		await changeElement(gameId, elementType, playerType);
		setShowEnvPopup(false);
		await waitFor(700);
		activateMonkeyAbility(currPSlots, false, elementType);
		await activateTankAbility(gameId, playerType, currPSlots, elementType);
	};

	const finishRoundBot = async () => {
		await executeBotTurn(gameId);
		await enableAttackingAndPlayingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
		await addOneRound(gameId, playerType);
		await enableAttackForOpponentAnimals(gameId, playerType, currPSlots);
	};

	const finishRound = async () => {
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
				showCountDown.current = true;
				await drawCardFromMainDeck(gameId, PlayerType.TWO);
				await finishRoundBot();
			}
		} catch (e) {
			console.error(e);
		}
	};

	const attack = async (
		currAnimalId?: string,
		oppoAnimalId?: string,
		currslotnb?: number,
		oppslotnb?: number,
	) => {
		if (
			!isAnimalCard(currAnimalId) ||
			currAnimalId === oppoAnimalId ||
			spectator ||
			!isAnimalInSlots(currPSlots, currAnimalId)
		) {
			return;
		}

		const isAttackAnimalsEnabled =
			round.nb >= 3 &&
			isMyRound &&
			currPlayer.canAttack &&
			!hasAttacked.current &&
			currPSlots[currslotnb ?? 3]?.canAttack;

		const isAttackOwnerEnabled =
			isAttackAnimalsEnabled &&
			!isAnimalCard(oppoAnimalId) &&
			(isAttackerInElement(currAnimalId, elementType) || isOppSlotsEmpty) &&
			!isOppSlotsAllFilled;

		console.log(
			'player canAttack',
			currPlayer.canAttack,
			'hasAttacked ',
			hasAttacked,
			'animal canAttack ',
			currPSlots[currslotnb ?? 3]?.canAttack,
			'isOppAnimalInSlots',
			isAnimalInSlots(oppPSlots, oppoAnimalId),
			{ isAttackAnimalsEnabled },
			{ isAttackOwnerEnabled },
		);

		if (isAttackOwnerEnabled) {
			await attackOppHp(currslotnb!, currAnimalId!);
			return;
		}

		if (isAttackAnimalsEnabled && isAnimalInSlots(oppPSlots, oppoAnimalId)) {
			await attackAnimal(currAnimalId, oppoAnimalId, currslotnb, oppslotnb);
		}
	};

	const attackAnimal = async (
		currAnimalId?: string,
		oppoAnimalId?: string,
		currslotnb?: number,
		oppslotnb?: number,
	) => {
		if (!canAnimalAKillAnimalD(currAnimalId, oppoAnimalId, isCurrDoubleAP)) {
			return;
		}

		hasAttacked.current = true;
		await changeHasAttacked(gameId, playerType, currslotnb!, true);
		await attackOppAnimal(gameId, playerType, currAnimalId!, oppoAnimalId!, oppslotnb!);

		const canSecondAttackWithKing =
			isKingInElement(currAnimalId, elementType) && !canKingAttackAgain.current;
		if (canSecondAttackWithKing) {
			canKingAttackAgain.current = true;
			hasAttacked.current = false;
			return;
		}

		await waitFor(300);
		await changeHasAttacked(gameId, playerType, currslotnb!, false);
		hasAttacked.current = true;
		canKingAttackAgain.current = false;
	};

	const attackOppHp = async (currSlotNb: number, animalId: string) => {
		hasAttacked.current = true;
		await changeHasAttacked(gameId, playerType, currSlotNb, true);
		await attackOwner(gameId, getOpponentIdFromCurrentId(playerType), animalId, isCurrDoubleAP);
		await waitFor(300);
		await changeHasAttacked(gameId, playerType, currSlotNb, false);
	};

	const activateMonkeyAbility = (
		slots: any[] = [],
		isJokerGood?: boolean,
		elementType?: ClanName,
	) => {
		console.log('Try activate monkey ability ', { slots }, { isJokerGood }, { elementType });
		if (!isJokerGood) {
			var hasJokerInElement = false;
			for (let i = 0; i < slots.length; i++) {
				const animal = getAnimalCard(slots[i]?.cardId);
				if (!!animal && animal.role === JOKER && animal.clan === elementType) {
					hasJokerInElement = true;
				}
			}
			if (!hasJokerInElement) return;
		}
		setCardsIdsForPopup(oppPlayer.cardsIds);
		setIsJokerActive(true);
	};

	const localState = {
		round,
		nbCardsToPlay,
		activePowerCard,
		board,
	};

	const attackState = {
		round,
		canKingAttackAgain,
		currPlayer,
		oppPlayer,
		board,
		hasAttacked,
		currPSlots,
	};

	return (
		<div
			style={{
				...flexColumnStyle,
				width: '100%',
				height: '92vh',
				justifyContent: 'space-between',
				paddingTop: '4vh',
				paddingBottom: '4vh',
			}}>
			<OpponentPView player={oppPlayer} spectator={spectator} />

			{!spectator && showEnvPopup && <ElementPopup changeElement={changeEnvWithPopup} />}

			<div
				style={{
					position: 'absolute',
					left: '2vw',
					top: '50vh',
					...flexColumnStyle,
					gap: 12,
					alignItems: 'flex-start',
					color: violet,
					width: '18vw',
					fontSize: '1.1em',
				}}>
				<RoundView nb={round?.nb} />
				<h6>Player {round.player.toUpperCase()} turn</h6>
			</div>

			<BoardView
				board={board}
				isMyRound={isMyRound}
				playCard={playCard}
				localState={localState}
				attack={attack}
				attackState={attackState}
				isOppDoubleAP={isOppDoubleAP}
				isCurrDoubleAP={isCurrDoubleAP}
			/>

			<CurrentPView
				player={currPlayer}
				round={round}
				playCard={playCard}
				finishRound={finishRound}
				nbCardsToPlay={nbCardsToPlay}
				setElement={setElement}
				spectator={spectator}
				chargeElement={chargeElement}
			/>
			{openCardsPopup && <h5>hello</h5>}
			{openCardsPopup && !spectator && (
				<CardsPopup
					cardsIds={cardsIdsForPopup}
					selectedIds={selectedCardsIdsForPopup}
					selectCardsPolished={selectCardForPopup}
					closeCardSelectionPopup={closePopupAndProcessPowerCard}
					dropClose={false}
					isJokerActive={isJokerActive}
					title={gyTitle}
				/>
			)}
			{showCountDown.current && (
				<div
					style={{
						position: 'absolute',
						right: '6vw',
						bottom: '4vh',
						height: '4vh',
						...centerStyle,
					}}>
					<CountDown finishRound={finishRound} />
				</div>
			)}
		</div>
	);
}
