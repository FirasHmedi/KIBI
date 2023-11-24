import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { useEffect, useRef, useState } from 'react';
import { executeBotTurn } from '../GameBot/BotActions';
import {
	cancelAttacks,
	cancelUsingPowerCards,
	changeElement,
	doubleTankAP,
	draw2Cards,
	resetBoard,
	return2animalsFromGYToDeck,
	reviveAnyPowerFor1hp,
	reviveLastPower,
	sacrifice1HpToReviveAnyAnimal,
	sacrifice3HpToSteal,
	sacrificeAnimalToGet3Hp,
	switch2RandomCards,
	switchDeck,
} from '../backend/abilities';
import {
	activateJokersAbilities,
	attackAnimal,
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
import { addOneRound, addPowerToGraveYard } from '../backend/unitActions';
import { flexColumnStyle } from '../styles/Style';
import { ANIMALS_POINTS, ClanName, EMPTY, KING, TANK, envCardsIds } from '../utils/data';
import {
	getAnimalCard,
	getOpponentIdFromCurrentId,
	getOriginalCardId,
	getPowerCard,
	isAnimalCard,
	isAnimalInEnv,
	isAttacker,
	isKing,
	isPowerCard,
	isTank,
	waitFor,
} from '../utils/helpers';
import { Board, Player, PlayerType, Round } from '../utils/interface';
import { BoardView } from './Board';
import { ElementPopup } from './Elements';
import { GraveyardPopup } from './GraveyardsView';
import { CurrentPView, OpponentPView } from './PlayersView';

interface GameViewProps {
	round: Round;
	gameId: string;
	board: Board;
	opponentPlayer: Player;
	currentPlayer: Player;
	spectator?: boolean;
	showCountDown: boolean;
	setShowCountDown: any;
}

export function GameView({
	round,
	gameId,
	board,
	opponentPlayer,
	currentPlayer,
	spectator,
	showCountDown,
	setShowCountDown,
}: GameViewProps) {
	const { opponentPSlots, currentPSlots, elementType } = board;

	const [selectedCurrPSlotNb, setSelectedCurrPSlotNb] = useState<number>();
	const [selectedOppSlotsNbs, setSelectedOppSlotsNbs] = useState<number[]>([]);
	const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);
	const [canPlaceKingWithoutSacrifice, setCanPlaceKingWithoutSacrifice] = useState<boolean>(false);
	const playerType = currentPlayer.playerType!;
	const idsInOppPSlots = selectedOppSlotsNbs.map(nb => opponentPSlots[nb ?? 3]?.cardId);
	const idInCurrPSlot = currentPSlots[selectedCurrPSlotNb ?? 3]?.cardId;
	const [nbCardsToPlay, setNbCardsToPlay] = useState(3);
	const [hasAttacked, setHasAttacked] = useState(false);
	const [twoAnimalsToPlace, setTwoAnimalsToPlace] = useState<number>(0);
	const [openGY, setOpenGY] = useState(false);
	const [cardsIdsForPopup, setCardsIdsForPopup] = useState<string[]>([]);
	const [selectedCardsIdsForPopup, setSelectedCardsIdsForPopup] = useState<string[]>([]);
	const activePowerCard = useRef('');

	const isMyRound = round.player === playerType;

	useEffect(() => {
		if (round.nb >= 3 && isMyRound) {
			setNbCardsToPlay(2);
			setHasAttacked(false);
			setCanPlaceKingWithoutSacrifice(false);
			setSelectedCurrPSlotNb(undefined);
			setSelectedOppSlotsNbs([]);
			setElementLoad(gameId, getOpponentIdFromCurrentId(playerType), 1);
		}
	}, [round.nb]);

	const isAttackAnimalEnabled =
		round.nb >= 3 &&
		isMyRound &&
		currentPlayer.canAttack &&
		!hasAttacked &&
		isAnimalCard(idInCurrPSlot) &&
		isAnimalCard(idsInOppPSlots[0]) &&
		currentPSlots[selectedCurrPSlotNb ?? 3]?.canAttack;

	const isOppSlotsEmpty =
		!isAnimalCard(opponentPSlots[0]?.cardId) &&
		!isAnimalCard(opponentPSlots[1]?.cardId) &&
		!isAnimalCard(opponentPSlots[2]?.cardId);

	const isOppSlotsAllFilled =
		isAnimalCard(opponentPSlots[0]?.cardId) &&
		isAnimalCard(opponentPSlots[1]?.cardId) &&
		isAnimalCard(opponentPSlots[2]?.cardId);

	const isAttackerAbilityActive = isAttacker(idInCurrPSlot) && isAnimalInEnv(idInCurrPSlot, elementType);

	const isAttackOwnerEnabled =
		round.nb >= 3 &&
		isMyRound &&
		currentPlayer.canAttack &&
		!hasAttacked &&
		isAnimalCard(idInCurrPSlot) &&
		(isAttackerAbilityActive || isOppSlotsEmpty) &&
		!isOppSlotsAllFilled &&
		currentPSlots[selectedCurrPSlotNb ?? 3]?.canAttack;

	const selectCurrSlotNb = async (slotNb: number) => {
		setSelectedCurrPSlotNb(nb => (slotNb === nb ? undefined : slotNb));
		if (!isKing(idInCurrPSlot)) {
			setSelectedOppSlotsNbs(selectedSlotsNbs =>
				selectedSlotsNbs.length >= 1 ? [selectedOppSlotsNbs[selectedSlotsNbs.length - 1]] : [],
			);
		}
	};

	const selectOppSlotsNbs = async (slotNb: number) => {
		if (!isKing(idInCurrPSlot)) {
			setSelectedOppSlotsNbs(selectedSlotsNbs => (selectedSlotsNbs.includes(slotNb) ? [] : [slotNb]));
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

	const handlePlacingKing = async (cardId: string): Promise<void> => {
		if (canPlaceKingWithoutSacrifice) {
			await placeKingWithoutSacrifice(gameId, playerType, cardId, selectedCurrPSlotNb!);
			setCanPlaceKingWithoutSacrifice(false);
		} else {
			await placeKingOnBoard(gameId, playerType, cardId, idInCurrPSlot, selectedCurrPSlotNb!);
		}
	};

	const getCurrSlotNb = () => {
		let nb;
		for (let i = 0; i < 3; i++) {
			if (!isAnimalCard(currentPSlots[i]?.cardId)) {
				nb = i;
			}
		}
		return selectedCurrPSlotNb != null ? selectedCurrPSlotNb : nb;
	};

	const playAnimalCard = async (cardId: string): Promise<void> => {
		const { role, clan } = getAnimalCard(cardId)!;

		if (role === KING) {
			const sacrificedAnimal = getAnimalCard(idInCurrPSlot);
			if (twoAnimalsToPlace === 0 && !canPlaceKingWithoutSacrifice && sacrificedAnimal?.clan !== clan) {
				return;
			}
			await handlePlacingKing(cardId);
		} else {
			const slotNb = getCurrSlotNb();
			if (isNil(slotNb)) {
				return;
			}
			await placeAnimalOnBoard(gameId, playerType, slotNb, cardId, elementType);
		}

		setTwoAnimalsToPlace(animalsNb => (animalsNb > 1 ? animalsNb - 1 : 0));
		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
	};

	const isPowerCardPlayable = (cardId: string) => {
		switch (getOriginalCardId(cardId!)) {
			case 'rev-any-anim-1hp':
				const slotNbForRevive = getCurrSlotNb();
				if (isNil(slotNbForRevive) || isEmpty(board.animalGY)) return false;
				break;
			case 'steal-anim-3hp':
				const slotNbForSteal = getCurrSlotNb();
				if (
					isNil(slotNbForSteal) ||
					selectedOppSlotsNbs?.length != 1 ||
					!idsInOppPSlots[0] ||
					idsInOppPSlots[0] === EMPTY
				)
					return false;
				break;
			case 'sacrif-anim-3hp':
				if (isNil(selectedCurrPSlotNb) || idInCurrPSlot === EMPTY) return false;
				break;
			case '2-anim-gy':
				if (isEmpty(board?.animalGY) || board.animalGY?.length < 2) return false;
				break;
			case 'rev-any-pow-1hp':
				if (isEmpty(board?.powerGY)) return false;
				break;
			case 'switch-2-randoms':
				if (currentPlayer.cardsIds.length < 2 || opponentPlayer.cardsIds.length < 2) return false;
				break;
			case 'double-tank-ap':
				if (!isTank(idInCurrPSlot)) return false;
				break;
			case 'rev-last-pow':
				if (isEmpty(board.powerGY)) return false;
				break;
		}
		return true;
	};

	const closePopupAndProcessPowerCard = async () => {
		setOpenGY(false);
		await processPostPowerCardPlay();
	};

	const selectCardForPopup = async (cardId: string) => {
		if (isEmpty(cardId)) {
			return;
		}
		if (getOriginalCardId(activePowerCard.current) === '2-anim-gy' && isEmpty(selectedCardsIdsForPopup)) {
			setSelectedCardsIdsForPopup([cardId]);
			return;
		}
		setOpenGY(false);
		switch (getOriginalCardId(activePowerCard.current)) {
			case 'rev-any-pow-1hp':
				await reviveAnyPowerFor1hp(gameId, playerType, cardId);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'rev-any-anim-1hp':
				const slotNbForRevive = getCurrSlotNb();
				await sacrifice1HpToReviveAnyAnimal(gameId, playerType, cardId, slotNbForRevive!);
				break;
			case '2-anim-gy':
				await return2animalsFromGYToDeck(gameId, playerType, [...selectedCardsIdsForPopup, cardId]);
				break;
		}
		await processPostPowerCardPlay();
	};

	const playPowerCard = async (cardId: string) => {
		if (!isPowerCardPlayable(cardId)) {
			return false;
		}

		const { name } = getPowerCard(cardId)!;

		await setPowerCardAsActive(gameId, playerType, cardId!, name!);
		activePowerCard.current = cardId;

		console.log('executing power card');
		switch (getOriginalCardId(cardId!)) {
			case 'block-att':
				await cancelAttacks(gameId, getOpponentIdFromCurrentId(playerType));
				break;
			case 'rev-last-pow':
				await reviveLastPower(gameId, playerType);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'rev-any-pow-1hp':
				setCardsIdsForPopup(board.powerGY);
				setOpenGY(true);
				return;
			case 'rev-any-anim-1hp':
				setCardsIdsForPopup(board.animalGY);
				setOpenGY(true);
				return;
			case 'steal-anim-3hp':
				const slotNbForSteal = getCurrSlotNb();
				await sacrifice3HpToSteal(gameId, playerType, idsInOppPSlots[0], selectedOppSlotsNbs[0]!, slotNbForSteal!);
				break;
			case 'switch-decks':
				await minus1Hp(gameId, playerType);
				await switchDeck(gameId);
				break;
			case 'switch-2-randoms':
				await switch2RandomCards(gameId);
				break;
			case 'sacrif-anim-3hp':
				await sacrificeAnimalToGet3Hp(gameId, playerType, idInCurrPSlot, selectedCurrPSlotNb, elementType);
				break;
			case '2hp':
				await add2Hp(gameId, playerType);
				break;
			case 'draw-2':
				await draw2Cards(gameId, playerType);
				break;
			case '2-anim-gy':
				setCardsIdsForPopup(board.animalGY);
				setOpenGY(true);
				return;
			case 'block-pow':
				await cancelUsingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
				break;
			case 'reset-board':
				await minus1Hp(gameId, playerType);
				await resetBoard(gameId, playerType, currentPSlots, opponentPSlots);
				break;
			case 'place-king':
				setCanPlaceKingWithoutSacrifice(true);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'double-tank-ap':
				await doubleTankAP(gameId, playerType, idInCurrPSlot);
				break;
			case 'charge-element':
				await setElementLoad(gameId, playerType, 3);
				break;
		}
		await processPostPowerCardPlay();
	};

	const processPostPowerCardPlay = async () => {
		await addPowerToGraveYard(gameId, activePowerCard.current);

		if (envCardsIds.includes(getOriginalCardId(activePowerCard.current!))) {
			setShowEnvPopup(true);
		}

		setSelectedCurrPSlotNb(undefined);
		setSelectedOppSlotsNbs([]);
		setSelectedCardsIdsForPopup([]);
		setCardsIdsForPopup([]);

		if (getOriginalCardId(activePowerCard.current) != 'place-king') {
			setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
		}

		activePowerCard.current = '';
	};

	const setElement = () => {
		if (spectator) return;
		setShowEnvPopup(true);
	};

	const playCard = async (cardId?: string) => {
		console.log({ playerType }, { cardId }, { selectedCurrPSlotNb }, { round });
		if (isEmpty(cardId) || isEmpty(playerType)) {
			return;
		}

		if (isAnimalCard(cardId)) {
			console.log('will play animal card');
			await playAnimalCard(cardId!);
			return;
		}

		if (twoAnimalsToPlace > 0) return;

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
		await activateJokersAbilities(gameId, playerType, currentPSlots);
	};

	const finishRoundBot = async () => {
		await executeBotTurn(gameId);
		await enableAttackingAndPlayingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
		await addOneRound(gameId, playerType);
		await enableAttackForOpponentAnimals(gameId, playerType, currentPSlots);
		await activateJokersAbilities(gameId, playerType, currentPSlots);
		setElementLoad(gameId, PlayerType.ONE, 1);
	};

	const finishRound = async () => {
		try {
			setShowCountDown(false);
			await enableAttackingAndPlayingPowerCards(gameId, playerType);
			await addOneRound(gameId, getOpponentIdFromCurrentId(playerType));
			await enableAttackForOpponentAnimals(gameId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
			await activateJokersAbilities(gameId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
			if (opponentPlayer?.playerName === 'bot') {
				await drawCardFromMainDeck(gameId, PlayerType.TWO);
				await finishRoundBot();
			}
		} catch (e) {
			console.error(e);
		}
	};

	const attack = async () => {
		if (isAttackerAbilityActive && isAnimalCard(idsInOppPSlots[0]) && isAttackAnimalEnabled) {
			await attackOppAnimal();
			return;
		}
		if (isAttackOwnerEnabled) {
			await attackOppHp();
			return;
		}
		if (isAttackAnimalEnabled) {
			await attackOppAnimal();
		}
	};

	const attackOppAnimal = async () => {
		const animalA = getAnimalCard(idInCurrPSlot);
		const animalD = getAnimalCard(idsInOppPSlots[0]);
		if (!animalA || !animalD) return;

		const animalAAP =
			animalA.role === TANK && currentPlayer?.tankIdWithDoubleAP === idInCurrPSlot
				? ANIMALS_POINTS[animalA.role].ap * 2
				: ANIMALS_POINTS[animalA.role].ap;

		const animalDHP = ANIMALS_POINTS[animalD.role].hp;

		if (animalAAP < animalDHP) {
			return;
		}

		setHasAttacked(true);
		await changeHasAttacked(gameId, playerType, selectedCurrPSlotNb!, true);
		await attackAnimal(gameId, playerType, idInCurrPSlot, idsInOppPSlots[0], selectedOppSlotsNbs[0]!);
		const canSecondAttackWithKing =
			animalA.role === KING && animalA.clan === elementType && isAnimalCard(idsInOppPSlots[1]);
		if (canSecondAttackWithKing) {
			await attackAnimal(gameId, playerType, idInCurrPSlot, idsInOppPSlots[1], selectedOppSlotsNbs[1]!);
		}
		await waitFor(300);
		await changeHasAttacked(gameId, playerType, selectedCurrPSlotNb!, false);
	};

	const attackOppHp = async () => {
		setHasAttacked(true);
		await changeHasAttacked(gameId, playerType, selectedCurrPSlotNb!, true);
		const isDoubleAP = currentPlayer.tankIdWithDoubleAP === idInCurrPSlot;
		await attackOwner(gameId, getOpponentIdFromCurrentId(playerType), idInCurrPSlot, isDoubleAP);
		await waitFor(300);
		await changeHasAttacked(gameId, playerType, selectedCurrPSlotNb!, false);
	};

	return (
		<div
			style={{
				...flexColumnStyle,
				width: '100%',
				height: '90vh',
				justifyContent: 'space-between',
				paddingTop: '5vh',
				paddingBottom: '5vh',
			}}>
			<OpponentPView player={opponentPlayer} spectator={spectator} />

			{!spectator && showEnvPopup && <ElementPopup changeElement={changeEnvWithPopup} />}

			<BoardView
				board={board}
				selectedCurrentPSlotNb={selectedCurrPSlotNb}
				selectCurrentSlot={selectCurrSlotNb}
				selectedOppSlotsNbs={selectedOppSlotsNbs}
				selectOppSlotsNbs={selectOppSlotsNbs}
				roundNb={round.nb}
				tankIdWithDoubleAPOfCurr={currentPlayer.tankIdWithDoubleAP}
				tankIdWithDoubleAPOfOpp={opponentPlayer.tankIdWithDoubleAP}
				isMyRound={isMyRound}
			/>

			<CurrentPView
				player={currentPlayer}
				round={round}
				playCard={playCard}
				finishRound={finishRound}
				attackOpponentAnimal={attackOppAnimal}
				attackOppHp={attackOppHp}
				attack={attack}
				isAttackAnimalEnabled={isAttackAnimalEnabled}
				isAttackOwnerEnabled={isAttackOwnerEnabled}
				nbCardsToPlay={nbCardsToPlay}
				setElement={setElement}
				spectator={spectator}
				showCountDown={showCountDown}
			/>

			{openGY && (
				<GraveyardPopup
					cardsIds={cardsIdsForPopup}
					selectedIds={selectedCardsIdsForPopup}
					selectCardsPolished={selectCardForPopup}
					closeCardSelectionPopup={closePopupAndProcessPowerCard}
					dropClose={false}
				/>
			)}
		</div>
	);
}
