import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { useEffect, useRef, useState } from 'react';
import { executeBotTurn } from '../GameBot/BotActions';
import {
	attackOppAnimal,
	attackOwner,
	changeHasAttacked,
	drawCardFromMainDeck,
	enableAttackForOpponentAnimals,
	enableAttackingAndPlayingPowerCards,
	placeAnimalOnBoard,
	placeKingOnBoard,
	placeKingWithoutSacrifice,
	setElementLoad,
	setPowerCardAsActive,
} from '../backend/actions';
import { add2Hp, minus1Hp } from '../backend/animalsAbilities';
import {
	cancelAttacks,
	cancelUsingPowerCards,
	changeElement,
	doubleTanksAP,
	draw2Cards,
	resetBoard,
	return2animalsFromGYToDeck,
	reviveAnyPowerFor1hp,
	reviveLastPower,
	sacrifice1HpToReviveAnyAnimal,
	sacrifice3HpToSteal,
	sacrificeAnimalToGet3Hp,
	stealCardFromOpponent,
	switch2Cards,
	switchDeck,
} from '../backend/powers';
import { addOneRound, addPowerToGraveYard } from '../backend/unitActions';
import { flexColumnStyle } from '../styles/Style';
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
	isAttackerInElement,
	isJokerInElement,
	isKing,
	isKingInElement,
	isPowerCard,
	waitFor,
} from '../utils/helpers';
import { Board, Player, PlayerType, Round } from '../utils/interface';
import { BoardView } from './Board';
import { ElementPopup } from './Elements';
import { CardsPopup } from './GraveyardsView';
import { CurrentPView, OpponentPView } from './PlayersView';

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

	const [selectedCurrPSlotNb, setSelectedCurrPSlotNb] = useState<number>();
	const [selectedOppSlotsNbs, setSelectedOppSlotsNbs] = useState<number[]>([]);
	const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);
	const [canPlaceKingWithoutSacrifice, setCanPlaceKingWithoutSacrifice] = useState<boolean>(false);
	const [nbCardsToPlay, setNbCardsToPlay] = useState(3);
	const [hasAttacked, setHasAttacked] = useState(false);
	const [cardsIdsForPopup, setCardsIdsForPopup] = useState<string[]>([]);
	const [selectedCardsIdsForPopup, setSelectedCardsIdsForPopup] = useState<string[]>([]);
	const [isJokerActive, setIsJokerActive] = useState(false);

	const activePowerCard = useRef('');
	const canKingAttackAgain = useRef(false);

	const openCardsPopup = cardsIdsForPopup?.length > 0;
	const isOppSlotsEmpty = getIsOppSlotsEmpty(oppPSlots);
	const isOppSlotsAllFilled = getIsOppSlotsAllFilled(oppPSlots);
	const idsInOppPSlots = selectedOppSlotsNbs.map(nb => oppPSlots[nb ?? 3]?.cardId);
	const idInCurrPSlot = currPSlots[selectedCurrPSlotNb ?? 3]?.cardId;

	useEffect(() => {
		if (isMyRound) {
			activateMonkeyAbility(currPSlots, false, elementType);
		}

		if (round.nb < 3 || !isMyRound) {
			return;
		}

		setNbCardsToPlay(2);
		setHasAttacked(false);
		setCanPlaceKingWithoutSacrifice(false);
		setSelectedCurrPSlotNb(undefined);
		setSelectedOppSlotsNbs([]);
		setElementLoad(gameId, getOpponentIdFromCurrentId(playerType), 1);
	}, [round.nb]);

	const selectCurrSlotNb = async (slotNb: number) => {
		setSelectedCurrPSlotNb(nb => (slotNb === nb ? undefined : slotNb));
		if (isKing(idInCurrPSlot)) {
			return;
		}
		setSelectedOppSlotsNbs(selectedSlotsNbs =>
			selectedSlotsNbs.length >= 1 ? [selectedOppSlotsNbs[selectedSlotsNbs.length - 1]] : [],
		);
	};

	const selectOppSlotsNbs = async (slotNb: number) => {
		if (!isKing(idInCurrPSlot)) {
			setSelectedOppSlotsNbs(selectedSlotsNbs =>
				selectedSlotsNbs.includes(slotNb) ? [] : [slotNb],
			);
			return;
		}

		setSelectedOppSlotsNbs(selectedSlotsNbs =>
			selectedSlotsNbs.includes(slotNb)
				? selectedSlotsNbs.filter(nb => nb != slotNb)
				: selectedSlotsNbs.length === 2
				? [selectedOppSlotsNbs[1], slotNb]
				: [...selectedSlotsNbs, slotNb],
		);
	};

	const getCurrSlotNb = () => {
		for (let i = 0; i < 3; i++) {
			if (!isAnimalCard(currPSlots[i]?.cardId)) {
				return i;
			}
		}
		return 0;
	};

	const handlePlacingKing = async (
		cardId: string,
		slotNb: number,
		kingClan: ClanName,
	): Promise<void> => {
		const animalIdInSlotNb = currPSlots[slotNb!]?.cardId;
		const sacrificedAnimal = getAnimalCard(animalIdInSlotNb);

		if (!canPlaceKingWithoutSacrifice && sacrificedAnimal?.clan !== kingClan) {
			return;
		}

		if (canPlaceKingWithoutSacrifice) {
			await placeKingWithoutSacrifice(gameId, playerType, cardId, slotNb);
			setCanPlaceKingWithoutSacrifice(false);
		} else {
			await placeKingOnBoard(gameId, playerType, cardId, animalIdInSlotNb!, slotNb);
		}

		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
	};

	const playAnimalCard = async (cardId: string, slotNb: number): Promise<void> => {
		const { role, clan } = getAnimalCard(cardId)!;

		if (role === KING) {
			await handlePlacingKing(cardId, slotNb, clan);
			return;
		} else {
			await placeAnimalOnBoard(gameId, playerType, slotNb, cardId, elementType);
		}

		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));

		if (isJokerInElement(cardId, elementType)) {
			await waitFor(700);
			activateMonkeyAbility(currPSlots, true);
		}
	};

	const isPowerCardPlayable = (cardId: string) => {
		switch (getOriginalCardId(cardId!)) {
			case 'rev-any-anim-1hp':
				if (isEmpty(animalGY)) return false;
				break;
			case 'steal-anim-3hp':
				if (
					selectedOppSlotsNbs?.length != 1 ||
					!isAnimalCard(idsInOppPSlots[0]) ||
					currPlayer.hp < 3
				)
					return false;
				break;
			case 'sacrif-anim-3hp':
				if (isNil(selectedCurrPSlotNb) || idInCurrPSlot === EMPTY) return false;
				break;
			case '2-anim-gy':
				if (isEmpty(animalGY) || animalGY?.length < 2) return false;
				break;
			case 'rev-any-pow-1hp':
				if (isEmpty(powerGY)) return false;
				break;
			case 'switch-2-cards':
				if (currPlayer.cardsIds.length < 2 || oppPlayer.cardsIds.length < 2) return false;
				break;
			case 'rev-last-pow':
				if (isEmpty(powerGY)) return false;
				break;
		}
		return true;
	};

	const closePopupAndProcessPowerCard = async () => {
		await processPostPowerCardPlay();
	};

	const selectCardForPopup = async (cardId: string) => {
		if (isEmpty(cardId)) {
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

		let activateJokerAbilityNow = false;

		switch (getOriginalCardId(activePowerCard.current)) {
			case 'rev-any-pow-1hp':
				await reviveAnyPowerFor1hp(gameId, playerType, cardId);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'rev-any-anim-1hp':
				const slotNbForRevive = getCurrSlotNb();
				await sacrifice1HpToReviveAnyAnimal(gameId, playerType, cardId, slotNbForRevive!);
				if (isJokerInElement(cardId, elementType)) {
					activateJokerAbilityNow = true;
				}
				break;
			case '2-anim-gy':
				await return2animalsFromGYToDeck(gameId, playerType, [...selectedCardsIdsForPopup, cardId]);
				break;
			case 'switch-2-cards':
				await switch2Cards(gameId, playerType, activePowerCard.current, [
					...selectedCardsIdsForPopup,
					cardId,
				]);
				break;
		}

		await processPostPowerCardPlay();

		if (activateJokerAbilityNow) {
			await waitFor(700);
			activateMonkeyAbility(currPSlots, true);
		}
	};

	const playPowerCard = async (cardId: string) => {
		if (!isPowerCardPlayable(cardId)) {
			return false;
		}

		const { name } = getPowerCard(cardId)!;

		await setPowerCardAsActive(gameId, playerType, cardId!, name!);
		activePowerCard.current = cardId;
		let activateJokerAbilityNow = false;
		console.log('executing power card ', cardId);
		switch (getOriginalCardId(cardId!)) {
			case 'block-att':
				await cancelAttacks(gameId, getOpponentIdFromCurrentId(playerType));
				break;
			case 'rev-last-pow':
				await reviveLastPower(gameId, playerType);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'rev-any-pow-1hp':
				setCardsIdsForPopup(powerGY);
				return;
			case 'rev-any-anim-1hp':
				setCardsIdsForPopup(animalGY);
				return;
			case 'steal-anim-3hp':
				const slotNbForSteal = getCurrSlotNb();
				await sacrifice3HpToSteal(
					gameId,
					playerType,
					idsInOppPSlots[0],
					selectedOppSlotsNbs[0]!,
					slotNbForSteal!,
				);
				if (isJokerInElement(idsInOppPSlots[0], elementType)) {
					activateJokerAbilityNow = true;
				}
				break;
			case 'switch-decks':
				await minus1Hp(gameId, playerType);
				await switchDeck(gameId);
				break;
			case 'switch-2-cards':
				setCardsIdsForPopup(currPlayer.cardsIds);
				return;
			case 'sacrif-anim-3hp':
				await sacrificeAnimalToGet3Hp(
					gameId,
					playerType,
					idInCurrPSlot,
					selectedCurrPSlotNb,
					elementType,
				);
				break;
			case '2hp':
				await add2Hp(gameId, playerType);
				break;
			case 'draw-2':
				await draw2Cards(gameId, playerType);
				break;
			case '2-anim-gy':
				setCardsIdsForPopup(animalGY);
				return;
			case 'block-pow':
				await cancelUsingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
				break;
			case 'reset-board':
				await minus1Hp(gameId, playerType);
				await resetBoard(gameId, playerType, currPSlots, oppPSlots);
				break;
			case 'place-king':
				setCanPlaceKingWithoutSacrifice(true);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'double-tanks-ap':
				await doubleTanksAP(gameId, playerType);
				break;
			case 'charge-element':
				await setElementLoad(gameId, playerType, 3);
				break;
		}
		await processPostPowerCardPlay();
		if (activateJokerAbilityNow) {
			await waitFor(700);
			activateMonkeyAbility(currPSlots, true);
		}
	};

	const processPostPowerCardPlay = async () => {
		setCardsIdsForPopup([]);

		await addPowerToGraveYard(gameId, activePowerCard.current);

		setSelectedCurrPSlotNb(undefined);
		setSelectedOppSlotsNbs([]);
		setSelectedCardsIdsForPopup([]);
		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));

		activePowerCard.current = '';
	};

	const setElement = () => {
		if (spectator) return;
		setShowEnvPopup(true);
	};

	const playCard = async (cardId?: string, slotNb?: number) => {
		if (spectator) {
			return;
		}

		console.log({ playerType }, { cardId }, { round }, { nbCardsToPlay });
		if (isEmpty(cardId) || isEmpty(playerType) || nbCardsToPlay === 0 || !isMyRound) {
			return;
		}

		if (isAnimalCard(cardId) && !isNil(slotNb)) {
			await playAnimalCard(cardId!, slotNb);
			return;
		}

		if (isPowerCard(cardId)) {
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
	};

	const finishRoundBot = async () => {
		await executeBotTurn(gameId);
		await enableAttackingAndPlayingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
		await addOneRound(gameId, playerType);
		await enableAttackForOpponentAnimals(gameId, playerType, currPSlots);
		await setElementLoad(gameId, PlayerType.ONE, 1);
	};

	const finishRound = async () => {
		try {
			showCountDown.curr = false;
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

	const attack = async (
		currAnimalId?: string,
		oppoAnimalId?: string,
		currslotnb?: number,
		oppslotnb?: number,
	) => {
		if (spectator) {
			return;
		}

		if (!isAnimalCard(currAnimalId) || currAnimalId === oppoAnimalId) {
			return;
		}

		const isAttackAnimalsEnabled =
			round.nb >= 3 &&
			isMyRound &&
			currPlayer.canAttack &&
			!hasAttacked &&
			currPSlots[currslotnb ?? 3]?.canAttack;

		const isAttackOwnerEnabled =
			isAttackAnimalsEnabled &&
			!isAnimalCard(oppoAnimalId) &&
			(isAttackerInElement(currAnimalId, elementType) || isOppSlotsEmpty) &&
			!isOppSlotsAllFilled;

		console.log({ isAttackAnimalsEnabled }, { isAttackOwnerEnabled });

		if (isAttackOwnerEnabled) {
			await attackOppHp(currslotnb!, currAnimalId!);
			return;
		}

		if (isAttackAnimalsEnabled && isAnimalCard(oppoAnimalId)) {
			await attackAnimal(currAnimalId, oppoAnimalId, currslotnb, oppslotnb);
		}
	};

	const attackAnimal = async (
		currAnimalId?: string,
		oppoAnimalId?: string,
		currslotnb?: number,
		oppslotnb?: number,
	) => {
		if (!canAnimalAKillAnimalD(currAnimalId, oppoAnimalId, currPlayer.tanksWithDoubleAP)) {
			return;
		}

		setHasAttacked(true);
		await changeHasAttacked(gameId, playerType, currslotnb!, true);
		await attackOppAnimal(gameId, playerType, currAnimalId!, oppoAnimalId!, oppslotnb!);

		const canSecondAttackWithKing =
			isKingInElement(currAnimalId, elementType) && !canKingAttackAgain.current;
		if (canSecondAttackWithKing) {
			canKingAttackAgain.current = true;
			setHasAttacked(false);
			return;
		}

		await waitFor(300);
		await changeHasAttacked(gameId, playerType, currslotnb!, false);
		setHasAttacked(true);
		canKingAttackAgain.current = false;
	};

	const attackOppHp = async (currSlotNb: number, animalId: string) => {
		setHasAttacked(true);
		await changeHasAttacked(gameId, playerType, currSlotNb, true);
		const isDoubleAP = currPlayer.tanksWithDoubleAP;
		await attackOwner(gameId, getOpponentIdFromCurrentId(playerType), animalId, isDoubleAP);
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
		canPlaceKingWithoutSacrifice,
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

			<BoardView
				board={board}
				selectedCurrentPSlotNb={selectedCurrPSlotNb}
				selectCurrentSlot={selectCurrSlotNb}
				selectedOppSlotsNbs={selectedOppSlotsNbs}
				selectOppSlotsNbs={selectOppSlotsNbs}
				tanksWithDoubleAPOfCurr={currPlayer.tanksWithDoubleAP}
				tanksWithDoubleAPOfOpp={oppPlayer.tanksWithDoubleAP}
				isMyRound={isMyRound}
				playCard={playCard}
				localState={localState}
				attack={attack}
				attackState={attackState}
			/>

			<CurrentPView
				player={currPlayer}
				round={round}
				playCard={playCard}
				finishRound={finishRound}
				nbCardsToPlay={nbCardsToPlay}
				setElement={setElement}
				spectator={spectator}
				showCountDown={showCountDown}
			/>
			{openCardsPopup && (
				<CardsPopup
					cardsIds={cardsIdsForPopup}
					selectedIds={selectedCardsIdsForPopup}
					selectCardsPolished={selectCardForPopup}
					closeCardSelectionPopup={closePopupAndProcessPowerCard}
					dropClose={false}
					isJokerActive={isJokerActive}
				/>
			)}
		</div>
	);
}
