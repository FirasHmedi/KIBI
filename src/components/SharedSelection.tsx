import { useState } from 'react';
import {
	buttonStyle,
	centerStyle,
	flexColumnStyle,
	flexRowStyle,
	neutralColor,
	selectedColor,
	violet,
} from '../styles/Style';
import { ANIMALS_CARDS, ANIMALS_POINTS, CLANS, KING, TANK, rolesIcons } from '../utils/data';
import { getOpponentIdFromCurrentId } from '../utils/helpers';
import { AnimalCard, PlayerType } from '../utils/interface';
import { PowerBoardSlot } from './Slots';
import { setItem, getGamePath } from '../backend/db';
import _ from 'lodash';

interface Props {
	playerType: PlayerType;
	gameId: string;
	oneCards: string[];
	twoCards: string[];
	playerToSelect?: PlayerType;
	powerCards?: string[];
}

export const SharedSelection = ({ playerType, gameId, oneCards, twoCards, playerToSelect, powerCards }: Props) => {
	const [idSelected, setIdSelected] = useState<string>();
	const myCards = playerType === PlayerType.ONE ? oneCards : twoCards;
	const oppCards = playerType === PlayerType.ONE ? twoCards : oneCards;
	const switchCardsTypes = myCards.length >= 8 && oppCards.length >= 8;
	const changePlayerToSelect = oppCards.length === 8 && myCards.length === 7;

	const selectCard = (id: string) => {
		if (myCards.includes(id) || oppCards.includes(id)) return;
		setIdSelected(selectedId => (selectedId === id ? undefined : id));
	};

	const submitCard = async () => {
		if (!idSelected || myCards.includes(idSelected) || oppCards.includes(idSelected)) return;

		await setItem(getGamePath(gameId) + `${playerType}`, {
			cardsIds: [...myCards, idSelected],
		});

		const playerToSelect = changePlayerToSelect ? playerType : getOpponentIdFromCurrentId(playerType);
		await setItem(getGamePath(gameId), {
			playerToSelect,
		});
		setIdSelected(undefined);
	};

	const submitTestCards = async () => {
		if (myCards.length === 8) return;
		const cardsIds = (
			playerType === PlayerType.ONE
				? ANIMALS_CARDS.filter((_, index) => index >= 0 && index < 8)
				: ANIMALS_CARDS.filter((_, index) => index >= 8 && index < 16)
		).map(animal => animal.id);

		await setItem(getGamePath(gameId) + `${playerType}`, {
			cardsIds: cardsIds,
		});

		const playerToSelect = changePlayerToSelect ? playerType : getOpponentIdFromCurrentId(playerType);
		await setItem(getGamePath(gameId), {
			playerToSelect,
		});
	};

	const submitRandomSelection = async () => {
		const oneCardsIds: string[] = [];
		const twoCardsIds: string[] = [];
		let i = 0,
			j = 0;
		const animalsWithoutKings = _.shuffle(ANIMALS_CARDS)
			.filter(({ role, id }) => {
				if (role === KING) {
					if (i < 2) {
						oneCardsIds.push(id);
						i++;
					} else if (j < 2) {
						twoCardsIds.push(id);
						j++;
					}
					return false;
				}
				return true;
			})
			.map(animal => animal.id);

		animalsWithoutKings.forEach((id, index) => {
			index < 6 ? oneCardsIds.push(id) : twoCardsIds.push(id);
		});

		oneCardsIds.push(powerCards![1]);
		twoCardsIds.push(powerCards![2]);

		await setItem(getGamePath(gameId) + PlayerType.ONE, {
			cardsIds: oneCardsIds,
		});

		await setItem(getGamePath(gameId) + PlayerType.TWO, {
			cardsIds: twoCardsIds,
		});

		await setItem(getGamePath(gameId), {
			playerToSelect: PlayerType.ONE,
		});
	};

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				width: '100%',
				height: '80vh',
				gap: 16,
				marginTop: 10,
			}}>
			{playerToSelect === playerType ? <h4>Your turn to choose a card</h4> : <h4>Opponent turn to choose a card</h4>}
			{!switchCardsTypes ? (
				<>
					<div
						style={{
							...centerStyle,
							justifyContent: 'space-between',
							gap: 8,
						}}>
						{ANIMALS_CARDS.filter((_, index) => index >= 0 && index < 8).map((animal: AnimalCard, index: number) => (
							<AnimalSelectionSlot
								key={index}
								animal={animal}
								idSelected={idSelected}
								toggleAnimalSelection={selectCard}
								myCards={myCards}
								oppCards={oppCards}
							/>
						))}
					</div>
					<div
						style={{
							...centerStyle,
							justifyContent: 'space-between',
							gap: 8,
						}}>
						{ANIMALS_CARDS.filter((_, index) => index >= 8 && index < 16).map((animal: AnimalCard, index: number) => (
							<AnimalSelectionSlot
								key={index}
								animal={animal}
								idSelected={idSelected}
								toggleAnimalSelection={selectCard}
								myCards={myCards}
								oppCards={oppCards}
							/>
						))}
					</div>
				</>
			) : (
				<div style={{ ...flexRowStyle, gap: 20 }}>
					{powerCards?.map(id => (
						<PowerSelectionSlot
							id={id}
							key={id}
							selectCard={selectCard}
							myCards={myCards}
							oppCards={oppCards}
							idSelected={idSelected}
						/>
					))}
				</div>
			)}
			<button
				style={{
					...buttonStyle,
					backgroundColor: playerToSelect !== playerType || !idSelected ? neutralColor : violet,
					padding: 4,
					fontSize: 14,
				}}
				disabled={playerToSelect !== playerType && !!idSelected}
				onClick={() => submitCard()}>
				CHOOSE
			</button>
			<button
				style={{
					...buttonStyle,
					backgroundColor: playerToSelect !== playerType ? neutralColor : 'red',
					padding: 4,
					fontSize: 14,
				}}
				disabled={playerToSelect !== playerType}
				onClick={() => submitTestCards()}>
				TEST CHOOSE
			</button>
			<button
				style={{
					...buttonStyle,
					backgroundColor: playerType !== PlayerType.ONE ? neutralColor : violet,
					padding: 4,
					fontSize: 14,
				}}
				disabled={playerType !== PlayerType.ONE}
				onClick={() => submitRandomSelection()}>
				RANDOM SELECTION
			</button>
			<div style={{ position: 'absolute', bottom: '2vh', left: '2vw' }}>
				<h4 style={{ padding: 2 }}>{playerType}</h4>
			</div>
		</div>
	);
};

const PowerSelectionSlot = ({ id, idSelected, selectCard, myCards = [], oppCards = [] }: any) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
			{myCards.includes(id) ? <h5>For me</h5> : oppCards.includes(id) ? <h5>For Opponent</h5> : <h5></h5>}
			<PowerBoardSlot
				cardId={id}
				selected={idSelected === id}
				select={() => {
					selectCard(id);
				}}
				isBigStyle={true}
			/>
		</div>
	);
};

const AnimalSelectionSlot = ({ animal, idSelected, toggleAnimalSelection, myCards = [], oppCards = [] }: any) => {
	const { id, name, clan, role, ability }: AnimalCard = animal;
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			{myCards.includes(id) ? <h5>For me</h5> : oppCards.includes(id) ? <h5>For Opponent</h5> : <h5></h5>}
			<div
				key={id}
				style={{
					...flexColumnStyle,
					border: 'solid 4px #95a5a6',
					borderRadius: 5,
					borderColor:
						idSelected === id ? selectedColor : myCards.includes(id) || oppCards.includes(id) ? violet : neutralColor,
					backgroundColor: CLANS[clan].color,
					color: 'white',
					fontSize: '1.3em',
					height: '17vh',
					width: '7vw',
					flexShrink: 0,
					justifyContent: 'space-between',
				}}
				onClick={() => toggleAnimalSelection(id)}>
				<h6>{name?.toUpperCase()}</h6>
				{ability && <h6 style={{ fontSize: '0.5em', fontWeight: 'initial' }}>{ability}</h6>}
				<div
					style={{
						...flexRowStyle,
						width: '100%',
						justifyContent: 'space-around',
						alignItems: 'center',
						paddingBottom: 4,
					}}>
					<h6 style={{ fontSize: '0.5em' }}>{ANIMALS_POINTS[role].ap} AP</h6>
					<img src={rolesIcons[role]} style={{ width: 22, filter: 'brightness(0) invert(1)' }}></img>
					<h6 style={{ fontSize: '0.5em' }}>{ANIMALS_POINTS[role].hp} HP</h6>
				</div>
			</div>
		</div>
	);
};
