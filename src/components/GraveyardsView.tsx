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
import { DeckSlot } from './Slots';
import monkey from '/src/assets/icons/monkey.svg';

export const PowerGraveyard = ({ cardsIds }: { cardsIds: string[] }) => {
	return <Graveyard name={'Power'} cardsIds={cardsIds} />;
};

export const AnimalGraveyard = ({ cardsIds }: { cardsIds: string[] }) => {
	return <Graveyard name={'Animal'} cardsIds={cardsIds} />;
};

export const Graveyard = ({ name, cardsIds = [] }: { name: string; cardsIds: string[] }) => {
	const [isPopupOpen, setPopupOpen] = useState(false);

	const openCardSelectionPopup = () => setPopupOpen(true);
	const closeCardSelectionPopup = () => setPopupOpen(false);
	const cardsNb = cardsIds.length;
	const hasCards = cardsNb > 0;
	const pluralName = cardsNb > 1 ? `${cardsNb} ${name}s` : cardsNb === 1 ? `1 ${name}` : name;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				color: violet,
			}}>
			<div style={{ marginBottom: 4, ...centerStyle }}>
				<h5>{pluralName}</h5>
				<GiTombstone style={{ width: '2.4rem', height: '2.4rem' }} />
			</div>
			{hasCards ? (
				<div onClick={openCardSelectionPopup} style={topCardStyle}>
					<DeckSlot cardId={cardsIds[cardsNb - 1]} />
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
	title = '',
}: {
	cardsIds: string[];
	selectedIds?: string[];
	selectCardsPolished?: (cardId: string) => void;
	closeCardSelectionPopup?: any;
	dropClose?: boolean;
	isJokerActive?: boolean;
	title?: any;
}) => {
	const shuffledCards = isJokerActive ? shuffle(cardsIds) : cardsIds;
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
						<h2>Pick a card to steal</h2>
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
							cardId={cardId}
							selected={selectedIds?.includes(cardId)}
							isJokerActive={isJokerActive}
						/>
					</div>
				))}
			</div>
		</div>
	);
};
