import isEmpty from 'lodash/isEmpty';
import { useState } from 'react';
import { flexColumnStyle, violet } from '../styles/Style';

import { ANIMALS_POINTS, ATTACKER, ClanName, EMPTY, KING, ROUND_DURATION, envCardsIds } from '../utils/data';
import {
	getAnimalCard,
	getOpponentIdFromCurrentId,
	getOriginalCardId,
	getPowerCard,
	isAnimalCard,
	isAnimalInEnv,
	isKing,
	isPowerCard,
	waitFor,
} from '../utils/helpers';
import { Board, Player, Round } from '../utils/interface';
import { BoardView } from './Board';
import { ElementPopup } from './Elements';
import { CurrentPView, OpponentPView } from './PlayersView';
import { addSnapShot } from '../backend/logsSnapShot';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import {
	cancelAttacks,
	reviveLastPower,
	reviveAnyPowerFor1hp,
	sacrifice1HpToReviveAnyAnimal,
	sacrifice3HpToSteal,
	switchDeck,
	sacrificeAnimalToGet3Hp,
	shieldOwnerPlus2Hp,
	draw2Cards,
	return2animalsFromGYToDeck,
	cancelUsingPowerCards,
	resetBoard,
	doubleAnimalsAP,
	changeElement,
} from '../backend/abilities';
import {
	placeKingWithoutSacrifice,
	placeKingOnBoard,
	placeAnimalOnBoard,
	setPowerCardAsActive,
	setElementLoad,
	activateJokersAbilities,
	enableAttackingAndPlayingPowerCards,
	enableAttackForOpponentAnimals,
	changeHasAttacked,
	attackAnimal,
	attackOwner,
} from '../backend/actions';
import { add1Hp, minus1Hp } from '../backend/animalsAbilities';
import { addPowerToGraveYard, addOneRound } from '../backend/unitActions';
import isNil from 'lodash/isNil';

export function GameView({
	round,
	gameId,
	board,
	opponentPlayer,
	currentPlayer,
	spectator,
	showCountDown,
	setShowCountDown,
}: {
	round: Round;
	gameId: string;
	board: Board;
	opponentPlayer: Player;
	currentPlayer: Player;
	spectator?: boolean;
	showCountDown: boolean;
	setShowCountDown: any;
}) {
	const { opponentPSlots, currentPSlots, elementType } = board;

	const [selectedCurrPSlotNb, setSelectedCurrPSlotNb] = useState<number>();
	const [selectedOppPSlotNb, setSelectedOppPSlotNb] = useState<number>();
	const [selectedGYAnimals, setSelectedGYAnimals] = useState<string[]>([]);
	const [selectedGYPower, setSelectedGYPower] = useState<string[]>([]);
	const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);
	const [canPlaceKingWithoutSacrifice, setCanPlaceKingWithoutSacrifice] = useState<boolean>(false);
	const playerType = currentPlayer.playerType!;
	const idInOppPSlot = opponentPSlots[selectedOppPSlotNb ?? 3]?.cardId;
	const idInCurrPSlot = currentPSlots[selectedCurrPSlotNb ?? 3]?.cardId;
	const [nbCardsToPlay, setNbCardsToPlay] = useState(3);
	const [hasAttacked, setHasAttacked] = useState(false);
	const [twoAnimalsToPlace, setTwoAnimalsToPlace] = useState<number>(0);

	const canOtherAnimalsDefendKing = () => {
		const animal = getAnimalCard(idInCurrPSlot);
		if (animal?.role === ATTACKER && elementType === animal.clan) {
			return false;
		}
		const king = getAnimalCard(idInOppPSlot);
		if (!king || king?.role !== KING) {
			return false;
		}
		for (let i = 0; i < 3; i++) {
			const oppAnimal = getAnimalCard(opponentPSlots[i]?.cardId);
			if (oppAnimal?.role !== king.role && king.clan === oppAnimal?.clan) {
				return true;
			}
		}
		return false;
	};

	const isAttackAnimalEnabled =
		round.nb >= 3 &&
		round.player === playerType &&
		currentPlayer.canAttack &&
		!hasAttacked &&
		isAnimalCard(idInCurrPSlot) &&
		isAnimalCard(idInOppPSlot) &&
		currentPSlots[selectedCurrPSlotNb ?? 3]?.canAttack &&
		!canOtherAnimalsDefendKing();

	const isOppSlotsEmpty =
		!isAnimalCard(opponentPSlots[0]?.cardId) &&
		!isAnimalCard(opponentPSlots[1]?.cardId) &&
		!isAnimalCard(opponentPSlots[2]?.cardId);

	const isOppSlotsAllFilled =
		isAnimalCard(opponentPSlots[0]?.cardId) &&
		isAnimalCard(opponentPSlots[1]?.cardId) &&
		isAnimalCard(opponentPSlots[2]?.cardId);

	const isAttackOwnerEnabled =
		round.nb >= 3 &&
		round.player === playerType &&
		currentPlayer.canAttack &&
		!hasAttacked &&
		isAnimalCard(idInCurrPSlot) &&
		((isKing(idInCurrPSlot) && isAnimalInEnv(idInCurrPSlot, elementType)) || isOppSlotsEmpty) &&
		!isOppSlotsAllFilled &&
		currentPSlots[selectedCurrPSlotNb ?? 3]?.canAttack;

	const handlePlacingKing = async (cardId: string, clan: ClanName): Promise<void> => {
		if (canPlaceKingWithoutSacrifice) {
			await placeKingWithoutSacrifice(gameId, playerType, cardId, selectedCurrPSlotNb!);
			setCanPlaceKingWithoutSacrifice(false);
		} else {
			await placeKingOnBoard(gameId, playerType, cardId, idInCurrPSlot, selectedCurrPSlotNb!, elementType);
		}
	};

	const playAnimalCard = async (cardId: string): Promise<void> => {
		const { role, clan } = getAnimalCard(cardId)!;

		if (role === KING) {
			const sacrificedAnimal = getAnimalCard(idInCurrPSlot);
			if (twoAnimalsToPlace === 0 && !canPlaceKingWithoutSacrifice && sacrificedAnimal?.clan !== clan) {
				return;
			}
			await handlePlacingKing(cardId, clan);
		} else {
			await placeAnimalOnBoard(gameId, playerType, selectedCurrPSlotNb!, cardId, elementType);
		}

		setTwoAnimalsToPlace(animalsNb => (animalsNb > 1 ? animalsNb - 1 : 0));
		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
	};

	const isPowerCardPlayable = (cardId: string) => {
		switch (getOriginalCardId(cardId!)) {
			case 'rev-any-anim-1hp':
				if (isNil(selectedCurrPSlotNb) || isEmpty(selectedGYAnimals) || selectedGYAnimals?.length != 1) return false;
				break;
			case 'steal-anim-3hp':
				if (isNil(selectedCurrPSlotNb) || isNil(selectedOppPSlotNb) || !idInOppPSlot || idInOppPSlot === EMPTY)
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
				if ((currentPlayer.cardsIds ?? []).filter(id => isAnimalCard(id))?.length <= 2) return false;
				break;
		}
		return true;
	};

	const playPowerCard = async (cardId: string) => {
		if (!isPowerCardPlayable(cardId)) {
			return false;
		}

		const { name } = getPowerCard(cardId)!;

		await setPowerCardAsActive(gameId, playerType, cardId!, name!);

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
				await sacrifice1HpToReviveAnyAnimal(gameId, playerType, selectedGYAnimals![0], selectedCurrPSlotNb!);
				break;
			case 'steal-anim-3hp':
				await sacrifice3HpToSteal(gameId, playerType, idInOppPSlot, selectedOppPSlotNb!, selectedCurrPSlotNb!);
				break;
			case 'switch-decks':
				await minus1Hp(gameId, playerType);
				await switchDeck(gameId);
				break;
			case 'sacrif-anim-3hp':
				await sacrificeAnimalToGet3Hp(gameId, playerType, idInCurrPSlot, selectedCurrPSlotNb, elementType);
				break;
			case '1hp':
				await add1Hp(gameId, playerType);
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
			case 'double-ap':
				await doubleAnimalsAP(gameId, playerType, true);
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
		setSelectedCurrPSlotNb(undefined);

		if (cardId != 'place-king') {
			setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
		}
	};

	const setElement = () => {
		if (spectator) return;
		setShowEnvPopup(true);
	};

	const playCard = async (cardId?: string) => {
		console.log({ playerType }, { cardId }, 'isAnimal', isAnimalCard(cardId), 'isPower', isPowerCard(cardId), {
			selectedCurrPSlotNb,
		});
		if (isEmpty(cardId) || isEmpty(playerType)) return;

		if (!isEmpty(selectedGYPower) && cardId !== selectedGYPower[0] && getOriginalCardId(cardId) !== 'rev-any-pow-1hp')
			return;

		if (selectedGYPower[0] === cardId) {
			setSelectedGYPower([]);
		}

		if (isAnimalCard(cardId) && selectedCurrPSlotNb != null) {
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

	const finishRound = async () => {
		setShowCountDown(false);
		await addSnapShot(gameId);
		await doubleAnimalsAP(gameId, playerType, false);
		await enableAttackingAndPlayingPowerCards(gameId, playerType);
		await addOneRound(gameId, getOpponentIdFromCurrentId(playerType));
		await enableAttackForOpponentAnimals(gameId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
		await activateJokersAbilities(gameId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
		setNbCardsToPlay(2);
		setHasAttacked(false);
		setCanPlaceKingWithoutSacrifice(false);
		setSelectedGYAnimals([]);
		setSelectedGYPower([]);
		setSelectedCurrPSlotNb(undefined);
		setSelectedCurrPSlotNb(undefined);
		setElementLoad(gameId, getOpponentIdFromCurrentId(playerType), 1);
	};

	const attackOppAnimal = async () => {
		if (!isAttackAnimalEnabled) return;

		const animalA = getAnimalCard(idInCurrPSlot);
		const animalD = getAnimalCard(idInOppPSlot);
		if (
			!animalA ||
			!animalD ||
			(ANIMALS_POINTS[animalA.role].ap < ANIMALS_POINTS[animalD.role].hp && !currentPlayer.isDoubleAP)
		)
			return;

		setHasAttacked(true);
		await changeHasAttacked(gameId, playerType, selectedCurrPSlotNb!, true);
		await attackAnimal(gameId, playerType, idInCurrPSlot, idInOppPSlot, selectedOppPSlotNb!);
		await waitFor(500);
		await changeHasAttacked(gameId, playerType, selectedCurrPSlotNb!, false);
	};

	const attackOppHp = async () => {
		if (!isAttackOwnerEnabled) return;
		setHasAttacked(true);
		await changeHasAttacked(gameId, playerType, selectedCurrPSlotNb!, true);
		await attackOwner(gameId, getOpponentIdFromCurrentId(playerType), idInCurrPSlot, currentPlayer.isDoubleAP);
		await waitFor(500);
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
				selectCurrentSlot={setSelectedCurrPSlotNb}
				selectedOpponentPSlotNb={selectedOppPSlotNb}
				selectOpponentSlot={setSelectedOppPSlotNb}
				selectedGYAnimals={selectedGYAnimals}
				setSelectedGYAnimals={setSelectedGYAnimals}
				selectedGYPower={selectedGYPower}
				setSelectedGYPower={setSelectedGYPower}
				roundNb={round.nb}
				isDoubleOpponentAP={opponentPlayer.isDoubleAP}
				isDoubleCurrentAP={currentPlayer.isDoubleAP}
			/>

			<CurrentPView
				player={currentPlayer}
				round={round}
				playCard={playCard}
				finishRound={finishRound}
				attackOpponentAnimal={attackOppAnimal}
				attackOppHp={attackOppHp}
				isAttackAnimalEnabled={isAttackAnimalEnabled}
				isAttackOwnerEnabled={isAttackOwnerEnabled}
				nbCardsToPlay={nbCardsToPlay}
				setElement={setElement}
				spectator={spectator}
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
