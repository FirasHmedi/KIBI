import { useState } from 'react';
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
	return <Graveyard name={'Power graveyard'} cardsIds={cardsIds} />;
};

export const AnimalGraveyard = ({ cardsIds }: { cardsIds: string[] }) => {
	return <Graveyard name={'Animal graveyard'} cardsIds={cardsIds} />;
};

export const Graveyard = ({ name, cardsIds = [] }: { name: string; cardsIds: string[] }) => {
	const [isPopupOpen, setPopupOpen] = useState(false);

	const openCardSelectionPopup = () => setPopupOpen(true);
	const closeCardSelectionPopup = () => setPopupOpen(false);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				color: violet,
			}}>
			<h5 style={{ marginBottom: 4 }}>
				{name} ({cardsIds.length})
			</h5>
			{cardsIds.length > 0 ? (
				<div onClick={openCardSelectionPopup} style={topCardStyle}>
					<DeckSlot cardId={cardsIds[cardsIds?.length - 1]} />
				</div>
			) : (
				<div
					style={{
						...deckSlotStyle,
						border: `solid 1px ${lightViolet}`,
						justifyContent: 'center',
					}}></div>
			)}
			{isPopupOpen && (
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
}: {
	cardsIds: string[];
	selectedIds?: string[];
	selectCardsPolished?: (cardId: string) => void;
	closeCardSelectionPopup?: any;
	dropClose?: boolean;
	isJokerActive?: boolean;
}) => {
	return (
		<div
			style={graveyardPopupContainer}
			onClick={() => {
				if (dropClose) closeCardSelectionPopup();
			}}>
			<button style={closeButtonStyle} onClick={closeCardSelectionPopup}>
				<MdCancel style={{ color: 'white', width: '3vw', height: 'auto' }} />
			</button>
			{isJokerActive && (
				<div style={{ ...flexRowStyle, ...centerStyle, marginTop: 45, gap: 20 }}>
					<img src={monkey} style={{ height: '3rem', width: '3rem' }}></img>
					<h2 style={{ color: 'white' }}>Pick a card to steal</h2>
				</div>
			)}

			<div style={graveyardPopupContent}>
				{cardsIds.map((cardId, index) => (
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
