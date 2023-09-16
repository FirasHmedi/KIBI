import _ from 'lodash';
import { useState } from 'react';
import { flexColumnStyle } from '../styles/Style';
import {
	cancelAttacks,
	cancelUsingPowerCards,
	changeElement,
	draw2Cards,
	handleKingAbility,
	resetBoard,
	reviveLastPower,
	return2animalsFromGYToDeck,
	sacrifice1HpToReviveLastAnimal,
	sacrifice1HpToReviveAnyAnimal,
	sacrifice3HpToSteal,
	sacrificeAnimalToGet3Hp,
	shieldOwnerPlus3Hp,
	switchDeck,
	reviveAnyPowerFor1hp,
} from '../utils/abilities';
import {
	activateJokerAbility,
	activateJokersAbilities,
	attackAnimal,
	attackOwner,
	changeHasAttacked,
	enableAttackForOpponentAnimals,
	enableAttackingAndPlayingPowerCards,
	placeAnimalOnBoard,
	placeKingOnBoard,
	placeKingWithoutSacrifice,
	setElementLoad,
	setPowerCardAsActive,
} from '../utils/actions';
import {
	ANIMALS_POINTS,
	ClanName,
	EMPTY,
	JOKER,
	KING,
	NEUTRAL,
	envCardsIds,
	getAnimalCard,
	getOriginalCardId,
	getPowerCard,
	isAnimalInEnv,
	isKing,
} from '../utils/data';
import { getOpponentIdFromCurrentId, isAnimalCard, isPowerCard, waitFor } from '../utils/helpers';
import { Board, Player, Round } from '../utils/interface';
import { addOneRound, addPowerToGraveYard } from '../utils/unitActions';
import { BoardView } from './Board';
import { ElementPopup } from './Elements';
import { CurrentPView, OpponentPView } from './PlayersView';
import { addSnapShot } from '../utils/logsSnapShot';

export function GameView({
	round,
	roomId,
	board,
	opponentPlayer,
	currentPlayer,
	spectator,
}: {
	round: Round;
	roomId: string;
	board: Board;
	opponentPlayer: Player;
	currentPlayer: Player;
	spectator?: boolean;
}) {
	const { opponentPSlots, currentPSlots, elementType } = board;

	const [selectedCurrPSlotNb, setSelectedCurrPSlotNb] = useState<number>();
	const [selectedOppPSlotNb, setSelectedOppPSlotNb] = useState<number>();
	const [selectedGYAnimals, setSelectedGYAnimals] = useState<string[]>([]);
	const [selectedGYPower, setSelectedGYPower] = useState<string[]>([]);
	const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);
	const [canPlaceKingWithoutSacrifice, setCanPlaceKingWithoutSacrifice] = useState<boolean>(false);
	const playerType = currentPlayer.playerType!;
	const animalIdInOppPSlot = opponentPSlots[selectedOppPSlotNb ?? 3]?.cardId;
	const animalIdInCurrPSlot = currentPSlots[selectedCurrPSlotNb ?? 3]?.cardId;
	const [nbCardsToPlay, setNbCardsToPlay] = useState(3);
	const [hasAttacked, setHasAttacked] = useState(false);
	const [twoAnimalsToPlace, setTwoAnimalsToPlace] = useState<number>(0);

	const canOtherAnimalsDefendKing = () => {
		const king = getAnimalCard(animalIdInOppPSlot);
		if (!king || king?.role !== KING) {
			return false;
		}
		for (let i = 0; i < 3; i++) {
			const animal = getAnimalCard(opponentPSlots[i]?.cardId);
			if (animal?.role !== king.role && king.clan === animal?.clan) {
				return true;
			}
		}
		return false;
	};

	const isAttackAnimalEnabled =
		round.nb != 1 &&
		round.nb != 2 &&
		round.player === playerType &&
		currentPlayer.canAttack &&
		!hasAttacked &&
		!_.isNil(selectedCurrPSlotNb) &&
		!_.isNil(selectedOppPSlotNb) &&
		!_.isEmpty(animalIdInCurrPSlot) &&
		animalIdInCurrPSlot !== EMPTY &&
		!_.isEmpty(animalIdInOppPSlot) &&
		animalIdInOppPSlot !== EMPTY &&
		currentPSlots[selectedCurrPSlotNb]?.canAttack &&
		!canOtherAnimalsDefendKing();

	const isOppSlotsEmpty =
		!isAnimalCard(opponentPSlots[0]?.cardId) &&
		!isAnimalCard(opponentPSlots[1]?.cardId) &&
		!isAnimalCard(opponentPSlots[2]?.cardId);

	const isAllOppSlotsFilled =
		isAnimalCard(opponentPSlots[0]?.cardId) &&
		isAnimalCard(opponentPSlots[1]?.cardId) &&
		isAnimalCard(opponentPSlots[2]?.cardId);

	const isAttackOwnerEnabled =
		round.nb != 1 &&
		round.nb != 2 &&
		round.player === playerType &&
		currentPlayer.canAttack &&
		!hasAttacked &&
		!!animalIdInCurrPSlot &&
		isAnimalCard(animalIdInCurrPSlot) &&
		!_.isNil(selectedCurrPSlotNb) &&
		((isKing(animalIdInCurrPSlot) && isAnimalInEnv(animalIdInCurrPSlot, elementType)) || isOppSlotsEmpty) &&
		currentPSlots[selectedCurrPSlotNb]?.canAttack &&
		!isAllOppSlotsFilled;

	const handlePlacingKing = async (cardId: string, clan: ClanName): Promise<void> => {
		if (canPlaceKingWithoutSacrifice) {
			await placeKingWithoutSacrifice(roomId, playerType, cardId, selectedCurrPSlotNb!);
			setCanPlaceKingWithoutSacrifice(false);
		} else {
			await placeKingOnBoard(roomId, playerType, cardId, animalIdInCurrPSlot, selectedCurrPSlotNb!);
		}
	};

	const playAnimalCard = async (cardId: string): Promise<void> => {
		const { role, clan } = getAnimalCard(cardId)!;

		if (role === KING) {
			const sacrificedAnimal = getAnimalCard(animalIdInCurrPSlot);
			if (twoAnimalsToPlace === 0 && !canPlaceKingWithoutSacrifice && sacrificedAnimal?.clan !== clan) {
				return;
			}
			await handlePlacingKing(cardId, clan);
		} else {
			await placeAnimalOnBoard(roomId, playerType, selectedCurrPSlotNb!, cardId);
		}

		if (role === JOKER && clan === elementType) {
			await activateJokerAbility(roomId, cardId, playerType);
		}

		setTwoAnimalsToPlace(animalsNb => (animalsNb > 1 ? animalsNb - 1 : 0));
		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
	};

	const isPowerCardPlayable = (cardId: string) => {
		switch (getOriginalCardId(cardId!)) {
			case 'rev-any-anim-1hp':
				if (_.isNil(selectedCurrPSlotNb) || _.isEmpty(selectedGYAnimals) || selectedGYAnimals?.length != 1)
					return false;
				break;
			case 'steal-anim-3hp':
				if (
					_.isNil(selectedCurrPSlotNb) ||
					_.isNil(selectedOppPSlotNb) ||
					!animalIdInOppPSlot ||
					animalIdInOppPSlot === EMPTY
				)
					return false;
				break;
			case 'sacrif-anim-3hp':
				if (_.isNil(selectedCurrPSlotNb) || animalIdInCurrPSlot === EMPTY) return false;
				break;
			case '2-anim-gy':
				if (selectedGYAnimals?.length != 2) return false;
				break;
			case 'rev-any-pow-1hp':
				if (_.isEmpty(selectedGYPower) || selectedGYPower.length != 1) return false;
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

		await setPowerCardAsActive(roomId, playerType, cardId!, name!);

		switch (getOriginalCardId(cardId!)) {
			case 'block-att':
				await cancelAttacks(roomId, getOpponentIdFromCurrentId(playerType));
				break;
			case 'rev-last-pow':
				await reviveLastPower(roomId, playerType);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'rev-any-pow-1hp':
				await reviveAnyPowerFor1hp(roomId, playerType, selectedGYPower[0]);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'rev-any-anim-1hp':
				await sacrifice1HpToReviveAnyAnimal(roomId, playerType, selectedGYAnimals![0], selectedCurrPSlotNb!);
				break;
			case 'steal-anim-3hp':
				await sacrifice3HpToSteal(roomId, playerType, animalIdInOppPSlot, selectedOppPSlotNb!, selectedCurrPSlotNb!);
				break;
			case 'switch-decks':
				await switchDeck(roomId);
				break;
			case 'sacrif-anim-3hp':
				await sacrificeAnimalToGet3Hp(roomId, playerType, animalIdInCurrPSlot, selectedCurrPSlotNb);
				break;
			case '3hp':
				await shieldOwnerPlus3Hp(roomId, playerType);
				break;
			case 'draw-2':
				await draw2Cards(roomId, playerType);
				break;
			case '2-anim-gy':
				await return2animalsFromGYToDeck(roomId, playerType, selectedGYAnimals);
				break;
			case 'block-pow':
				await cancelUsingPowerCards(roomId, getOpponentIdFromCurrentId(playerType));
				break;
			case 'reset-board':
				await resetBoard(roomId, playerType, currentPSlots, opponentPSlots);
				break;
			case 'place-king':
				setCanPlaceKingWithoutSacrifice(true);
				setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
				break;
			case 'double-king-ap':
				await handleKingAbility(roomId, playerType, true);
				break;
			case 'load-env':
				await setElementLoad(roomId, playerType, 3);
				break;
			case 'place-2-anim-1-hp':
				setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay ?? 0) + 2);
				setTwoAnimalsToPlace(2);
				break;
		}

		await addPowerToGraveYard(roomId, cardId!);

		if (envCardsIds.includes(getOriginalCardId(cardId!))) {
			setShowEnvPopup(true);
		}

		setSelectedGYAnimals([]);
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
		if (_.isEmpty(cardId) || _.isEmpty(playerType)) return;

		if (!_.isEmpty(selectedGYPower) && cardId !== selectedGYPower[0] && getOriginalCardId(cardId) !== 'rev-any-pow-1hp')
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

	const changeEnvWithPopup = async (elementType: ClanName) => {
		await changeElement(roomId, elementType, playerType);
		setShowEnvPopup(false);
		await activateJokersAbilities(roomId, playerType, currentPSlots);
	};

	const finishRound = async () => {
		await addSnapShot(roomId);
		await handleKingAbility(roomId, playerType, false);
		await enableAttackingAndPlayingPowerCards(roomId, playerType);
		await addOneRound(roomId, getOpponentIdFromCurrentId(playerType));
		await enableAttackForOpponentAnimals(roomId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
		await activateJokersAbilities(roomId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
		setNbCardsToPlay(2);
		setHasAttacked(false);
		setCanPlaceKingWithoutSacrifice(false);
		setSelectedGYAnimals([]);
		setSelectedCurrPSlotNb(undefined);
		setSelectedCurrPSlotNb(undefined);
		setElementLoad(roomId, getOpponentIdFromCurrentId(playerType), 1);
	};

	const attackOppAnimal = async () => {
		if (!isAttackAnimalEnabled) return;

		const animalA = getAnimalCard(animalIdInCurrPSlot);
		const animalD = getAnimalCard(animalIdInOppPSlot);
		if (!animalA || !animalD || ANIMALS_POINTS[animalA.role].ap < ANIMALS_POINTS[animalD.role].hp) return;

		setHasAttacked(true);
		await changeHasAttacked(roomId, playerType, selectedCurrPSlotNb, true);
		await attackAnimal(roomId, playerType, animalIdInCurrPSlot, animalIdInOppPSlot, selectedOppPSlotNb);
		await waitFor(500);
		await changeHasAttacked(roomId, playerType, selectedCurrPSlotNb, false);
	};

	const attackOppHp = async () => {
		if (!isAttackOwnerEnabled) return;
		setHasAttacked(true);
		await changeHasAttacked(roomId, playerType, selectedCurrPSlotNb!, true);
		await attackOwner(roomId, getOpponentIdFromCurrentId(playerType), animalIdInCurrPSlot, currentPlayer.isDoubleAP);
		await waitFor(500);
		await changeHasAttacked(roomId, playerType, selectedCurrPSlotNb!, false);
	};

	return (
		<div
			style={{
				...flexColumnStyle,
				width: '100%',
				height: '96vh',
				justifyContent: 'space-between',
				paddingTop: '2vh',
				paddingBottom: '2vh',
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
		</div>
	);
}
