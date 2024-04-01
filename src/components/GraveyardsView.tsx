import { shuffle } from 'lodash';
import { useState } from 'react';
import { GiTombstone } from 'react-icons/gi';
import { MdCancel } from 'react-icons/md';
import {
	centerStyle,
	closeButtonStyle,
	deckSlotStyle,
	flexRowStyle,
	graveyardPopupContainer,
	graveyardPopupContent,
	lightViolet,
	topCardStyle,
	violet,
} from '../styles/Style';
import {DeckSlot, DropItem} from './Slots';
import animalIcon from '/src/assets/icons/animal-icon.svg';
import monkey from '/src/assets/icons/monkey.svg';
import powerIcon from '/src/assets/icons/power-icon.svg';
import {useDrop} from "react-dnd";
import {sacrificeAnimalToGet2Hp} from "../backend/powers";

export const PowerGraveyard = ({ cardsIds }: { cardsIds: string[] }) => {
	return <Graveyard  src={powerIcon} cardsIds={cardsIds} />;
};

export const AnimalGraveyard = ({ cardsIds }: { cardsIds: string[] }) => {

	return <Graveyard  src={animalIcon} cardsIds={cardsIds} /> ;
};

export const Graveyard = ({ src, cardsIds = [] }: { src: string; cardsIds: string[] }) => {
	const [isPopupOpen, setPopupOpen] = useState(false);

	const openCardSelectionPopup = () => setPopupOpen(true);
	const closeCardSelectionPopup = () => setPopupOpen(false);
	const cardsNb = cardsIds.length;
	const hasCards = cardsNb > 0;
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				color: violet,
			}}>
			<div
				style={{
					...centerStyle,
					marginBottom: 6,
					justifyContent: 'center',
				}}>
				<h4 style={{ paddingLeft: 4 }}>{cardsNb}</h4>
				<img src={src} style={{ width: '1.4rem', height: '1.4rem', paddingLeft: 4 }} />
				<GiTombstone
					style={{
						width: '1.4rem',
						height: '1.4rem',
					}}
				/>
			</div>
			{hasCards ? (
				<div onClick={openCardSelectionPopup} style={topCardStyle}>
					<DeckSlot cardId={cardsIds[cardsNb - 1]} graveyard={true} />
				</div>
			) : (
				<div
					style={{
						...deckSlotStyle,
						border: `solid 1px ${lightViolet}`,
						justifyContent: 'center',
					}}></div>
			)}
			{isPopupOpen && hasCards && (
				<CardsPopup cardsIds={cardsIds} closeCardSelectionPopup={closeCardSelectionPopup} />
			)}
		</div>
	);
};

export const CardsPopup = ({
	cardsIds = [],
	selectedIds = [],
	selectCardsPolished,
	closeCardSelectionPopup,
	dropClose = true,
	isJokerActive,
	isStealCard = false,
	title = '',
}: {
	cardsIds: string[];
	selectedIds?: string[];
	selectCardsPolished?: (cardId: string) => void;
	closeCardSelectionPopup?: any;
	dropClose?: boolean;
	isJokerActive?: boolean;
	title?: any;
	isStealCard?: boolean;
}) => {
	const shuffledCards = isStealCard ? shuffle(cardsIds) : cardsIds;
	return (
		<div
			style={graveyardPopupContainer}
			onClick={() => {
				if (dropClose) closeCardSelectionPopup();
			}}>
			<button style={closeButtonStyle} onClick={closeCardSelectionPopup}>
				<MdCancel style={{ color: 'white', width: '3vw', height: 'auto' }} />
			</button>
			<div style={{ ...flexRowStyle, ...centerStyle, marginTop: 45, gap: 20, color: 'white' }}>
				{isJokerActive ? (
					<>
						<img src={monkey} style={{ height: '3rem', width: '3rem' }}></img>
						<h2>Pick a card to return to deck</h2>
					</>
				) : (
					<h2>{title.current}</h2>
				)}
			</div>

			<div style={graveyardPopupContent}>
				{shuffledCards.map((cardId, index) => (
					<div
						key={index}
						onClick={e => {
							e.stopPropagation();
							if (!!selectCardsPolished) {
								selectCardsPolished(cardId);
							}
						}}>
						<DeckSlot
							isStealCard={isStealCard}
							cardId={cardId}
							selected={selectedIds?.includes(cardId)}
							graveyard={true}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
