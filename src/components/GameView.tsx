import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { flexColumnStyle, violet } from '../styles/Style';
import isNil from 'lodash/isNil';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
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
import { ANIMALS_POINTS, ClanName, EMPTY, KING, ROUND_DURATION, TANK, envCardsIds } from '../utils/data';
import {
	getAnimalCard,
	getCard,
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
import {  Board, Card, Player, PlayerType, Round } from '../utils/interface';
import { BoardView } from './Board';
import { ElementPopup } from './Elements';
import { CurrentPView, OpponentPView } from './PlayersView';
import { BotV0 } from '../GameBot/BotActions';

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
	const [selectedGYAnimals, setSelectedGYAnimals] = useState<string[]>([]);
	const [selectedGYPower, setSelectedGYPower] = useState<string[]>([]);
	const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);
	const [canPlaceKingWithoutSacrifice, setCanPlaceKingWithoutSacrifice] = useState<boolean>(false);
	const playerType = currentPlayer.playerType!;
	const idsInOppPSlots = selectedOppSlotsNbs.map(nb => opponentPSlots[nb ?? 3]?.cardId);
	const idInCurrPSlot = currentPSlots[selectedCurrPSlotNb ?? 3]?.cardId;
	const [nbCardsToPlay, setNbCardsToPlay] = useState(3);
	const [hasAttacked, setHasAttacked] = useState(false);
	const [twoAnimalsToPlace, setTwoAnimalsToPlace] = useState<number>(0);

	const isMyRound = round.player === playerType;
	

	useEffect(() => {
		if (round.nb >= 3 && isMyRound) {
			setNbCardsToPlay(2);
			setHasAttacked(false);
			setCanPlaceKingWithoutSacrifice(false);
			setSelectedGYAnimals([]);
			setSelectedGYPower([]);
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
			await placeKingOnBoard(gameId, playerType, cardId, idInCurrPSlot, selectedCurrPSlotNb!, elementType);
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
		console.log('isPowerCardPlayable ', cardId);
		switch (getOriginalCardId(cardId!)) {
			case 'rev-any-anim-1hp':
				const slotNbForRevive = getCurrSlotNb();
				if (isNil(slotNbForRevive) || isEmpty(selectedGYAnimals) || selectedGYAnimals?.length != 1) return false;
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
				if (selectedGYAnimals?.length != 2) return false;
				break;
			case 'rev-any-pow-1hp':
				if (isEmpty(selectedGYPower) || selectedGYPower.length != 1) return false;
				break;
			case 'place-2-anim-1-hp':
				const currPAnimals = currentPlayer.cardsIds.filter(id => isAnimalCard(id));
				if (currPAnimals.length < 2) return false;
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
		console.log('card is playable');
		return true;
	};

	const playPowerCard = async (cardId: string) => {
		if (!isPowerCardPlayable(cardId)) {
			return false;
		}

		const { name } = getPowerCard(cardId)!;

		await setPowerCardAsActive(gameId, playerType, cardId!, name!);
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
				await reviveAnyPowerFor1hp(gameId, playerType, selectedGYPower[0]);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'rev-any-anim-1hp':
				const slotNbForRevive = getCurrSlotNb();
				await sacrifice1HpToReviveAnyAnimal(gameId, playerType, selectedGYAnimals![0], slotNbForRevive!);
				break;
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
				await return2animalsFromGYToDeck(gameId, playerType, selectedGYAnimals);
				break;
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
			case 'place-2-anim-1-hp':
				await minus1Hp(gameId, playerType);
				setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay ?? 0) + 2);
				setTwoAnimalsToPlace(2);
				break;
		}

		await addPowerToGraveYard(gameId, cardId!);

		if (envCardsIds.includes(getOriginalCardId(cardId!))) {
			setShowEnvPopup(true);
		}

		setSelectedGYAnimals([]);
		setSelectedGYPower([]);
		setSelectedCurrPSlotNb(undefined);
		setSelectedOppSlotsNbs([]);

		if (cardId != 'place-king') {
			setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
		}
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

		if (!isEmpty(selectedGYPower) && cardId !== selectedGYPower[0] && getOriginalCardId(cardId) !== 'rev-any-pow-1hp') {
			console.log({ selectedGYPower }, getOriginalCardId(cardId));
			return;
		}

		if (selectedGYPower[0] === cardId) {
			setSelectedGYPower([]);
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
	const finishRoundPlayer = async () => {
		setShowCountDown(false);
		await enableAttackingAndPlayingPowerCards(gameId, playerType);
		await addOneRound(gameId, getOpponentIdFromCurrentId(playerType));
		await enableAttackForOpponentAnimals(gameId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
		await activateJokersAbilities(gameId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
	}
	const finishRoundBot = async () => {
		setShowCountDown(false);
		await enableAttackingAndPlayingPowerCards(gameId, playerType);
		await addOneRound(gameId, getOpponentIdFromCurrentId(playerType));
		await enableAttackForOpponentAnimals(gameId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
		await activateJokersAbilities(gameId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
		console.log(round.nb);
		await BotV0(opponentPlayer,gameId,elementType,opponentPSlots,round.nb,currentPSlots);
		await drawCardFromMainDeck(gameId,  getOpponentIdFromCurrentId(playerType))
		await enableAttackingAndPlayingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
		await addOneRound(gameId, playerType);
		await enableAttackForOpponentAnimals(gameId,playerType,currentPSlots);
		await activateJokersAbilities(gameId, playerType, currentPSlots);
	}

	const finishRound = async () => {
		try {
			if(opponentPlayer.playerName === 'bot')
			{
			await finishRoundBot();
			}
			else {
				await finishRoundPlayer();
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
		if (animalA.role === KING && animalA.clan === elementType && isAnimalCard(idsInOppPSlots[1])) {
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
				paddingTop: '1vh',
				paddingBottom: '1vh',
			}}>
			<OpponentPView player={opponentPlayer} />

			{!spectator && showEnvPopup && <ElementPopup changeElement={changeEnvWithPopup} />}

			<BoardView
				board={board}
				selectedCurrentPSlotNb={selectedCurrPSlotNb}
				selectCurrentSlot={selectCurrSlotNb}
				selectedOppSlotsNbs={selectedOppSlotsNbs}
				selectOppSlotsNbs={selectOppSlotsNbs}
				selectedGYAnimals={selectedGYAnimals}
				setSelectedGYAnimals={setSelectedGYAnimals}
				selectedGYPower={selectedGYPower}
				setSelectedGYPower={setSelectedGYPower}
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
				gameId={gameId}
			/>

			{showCountDown && (
				<div style={{ position: 'absolute', right: '12vw', bottom: '9vh' }}>
					<CountdownCircleTimer
						isPlaying
						duration={ROUND_DURATION}
						colors={`#8e44ad`}
						onComplete={() => {
							finishRound();
						}}
						size={42}
						strokeWidth={3}>
						{({ remainingTime }) => <h5 style={{ color: violet }}>{remainingTime}</h5>}
					</CountdownCircleTimer>
				</div>
			)}
		</div>
	);
}



