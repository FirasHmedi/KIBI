import { FaHeart } from 'react-icons/fa';
import { IoIosInformationCircle } from 'react-icons/io';
import { TbSword } from 'react-icons/tb';

import { useDrag, useDrop } from 'react-dnd';
import { Tooltip } from 'react-tooltip';
import attIcon from '../assets/icons/att.png';
import noAttIcon from '../assets/icons/no-att.png';
import {
	boardSlotStyle,
	centerStyle,
	deckSlotStyle,
	flexRowStyle,
	lightViolet,
	selectedColor,
	violet,
} from '../styles/Style';
import { ANIMALS_POINTS, CLANS, ClanName, TANK, animalsPics, elementsIcons } from '../utils/data';
import {
	getAnimalCard,
	getPowerCard,
	isAnimalCard,
	isAnimalInEnv,
	isPowerCard,
} from '../utils/helpers';
import { SlotType } from '../utils/interface';
import './styles.css';
export interface DropItem {
	id: string;
	// Ajoutez ici d'autres propriétés si nécessaire
}

export const SlotBack = ({ shadow }: { shadow?: boolean }) => (
	<div
		style={{
			borderRadius: 5,
			backgroundColor: violet,
			color: 'white',
			...centerStyle,
			height: '7vh',
			width: '3vw',
			fontSize: '0.9em',
			boxShadow: shadow ? '6px 6px 0px 0px #7f26a4' : undefined,
		}}>
		<h5>K</h5>
	</div>
);

interface SlotProps {
	cardId?: string;
	selected?: boolean;
	selectSlot?: any;
	nb?: number;
	graveyard?: boolean;
	tankIdWithDoubleAP?: string;
	playCard: any;
	localState: any;
}

interface DeckSlotProps {
	cardId?: string;
	selected?: boolean;
	selectSlot?: (slotNb?: number) => void;
	nb?: number;
	graveyard?: boolean;
	isJokerActive?: boolean;
}

export const PowerBoardSlot = ({
	cardId,
	select,
	selected,
	isBigStyle,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
	isBigStyle?: boolean;
}) => {
	const { name, description } = getPowerCard(cardId) ?? {};
	const tooltipId = `power-deck-anchor${cardId}`;
	const bigStyle: React.CSSProperties = !!isBigStyle
		? { height: '20vh', width: '8vw', fontSize: '1em' }
		: {};
	return (
		<div
			style={{
				...boardSlotStyle,
				backgroundColor: violet,
				justifyContent: 'space-evenly',
				boxShadow: selected ? `0 0 1.5px 2.5px ${selectedColor}` : undefined,
				...bigStyle,
			}}
			onClick={() => select()}>
			<h6>{name?.toUpperCase()}</h6>
			<Tooltip anchorSelect={`#${tooltipId}`} content={description} />
			<IoIosInformationCircle id={tooltipId} style={{ color: 'white', width: '1.2vw' }} />
		</div>
	);
};

export const PowerDeckSlot = ({
	cardId,
	select,
	selected,
	isBigStyle,
	isJokerActive,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
	isBigStyle?: boolean;
	isJokerActive?: boolean;
}) => {
	const [, drag] = useDrag(
		() => ({
			type: 'powercard',
			item: { id: cardId },
			collect: monitor => ({ isDragging: !!monitor.getItem() }),
		}),
		[cardId],
	);
	const { name, description } = getPowerCard(cardId) ?? {};
	const tooltipId = `power-deck-anchor${cardId}`;
	const bigStyle: React.CSSProperties = !!isBigStyle
		? { height: '20vh', width: '8vw', fontSize: '1em' }
		: {};
	return (
		<div ref ={drag}
			style={{
				...deckSlotStyle,
				backgroundColor: violet,
				justifyContent: 'center',
				borderColor: selected ? selectedColor : violet,
				...bigStyle,
			}}
			onClick={() => select()}>
			{isJokerActive ? (
				<h5>K</h5>
			) : (
				<>
					<h6>{name?.toUpperCase()}</h6>
					<div>
						<Tooltip anchorSelect={`#${tooltipId}`} content={description} />
						<IoIosInformationCircle id={tooltipId} style={{ color: 'white', width: '1.3vw' }} />
					</div>
				</>
			)}
		</div>
	);
};

export const AnimalBoardSlot = ({
	cardId,
	select,
	selected,
	tankIdWithDoubleAP,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
	tankIdWithDoubleAP?: string;
}) => {
	const { clan, name, role, ability } = getAnimalCard(cardId)!;
	if (!name || !clan || !role) return <></>;

	const { hp, ap } = ANIMALS_POINTS[role];
	const isTankDoubleAP = role === TANK && cardId === tankIdWithDoubleAP;
	const roleTooltipContent = ability;
	const roleTooltipId = `role-anchor${cardId}`;

	return (
		<div
			style={{
				...boardSlotStyle,
				justifyContent: 'space-between',
				backgroundColor: CLANS[clan!]?.color,
				boxShadow: selected
					? `0 0 1.5px 2.5px ${selectedColor}`
					: `0 0 1px 2px ${CLANS[clan!]?.color}`,
			}}
			onClick={() => select()}>
			{!!name && name?.toLowerCase() in animalsPics && (
				<div
					style={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
					}}>
					<img
						src={animalsPics[name.toLowerCase() as keyof typeof animalsPics]}
						style={{ width: '7rem', height: '5.5rem' }}></img>
				</div>
			)}

			<div
				id={roleTooltipId}
				style={{
					...flexRowStyle,
					width: '100%',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					fontSize: '1.2rem',
					backgroundColor: CLANS[clan!]?.color,
					height: '2rem',
				}}>
				<div style={{ ...centerStyle, gap: 2 }}>
					<h4>{isTankDoubleAP ? ap * 2 : ap}</h4>
					<TbSword />
				</div>

				<div style={{ ...centerStyle, gap: 2 }}>
					<h4>{hp}</h4>
					<FaHeart />
				</div>
				<Tooltip
					anchorSelect={`#${roleTooltipId}`}
					content={roleTooltipContent}
					style={{ width: '5vw', fontSize: '0.7rem' }}
					place='bottom'
				/>
			</div>
		</div>
	);
};

export const AnimalDeckSlot = ({
	cardId,
	select,
	selected,
	isJokerActive,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
	isJokerActive?: boolean;
}) => {
	const [, drag] = useDrag(
		() => ({
			type: 'animalcard',
			item: { id: cardId },
			collect: monitor => ({ isDragging: !!monitor.getItem() }),
		}),
		[cardId],
	);
	const { clan, name, ability, role } = getAnimalCard(cardId)!;
	const { hp, ap } = ANIMALS_POINTS[role];
	const roleTooltipContent = ability;
	const roleTooltipId = `role-anchor${cardId}`;

	return (
		<div
			ref={drag}
			style={{
				...deckSlotStyle,
				backgroundColor: CLANS[clan!]?.color,
				justifyContent: 'space-between',
				borderColor: selected ? selectedColor : CLANS[clan!]?.color,
			}}
			onClick={() => select()}>
			{!isJokerActive && (
				<>
					<img
						src={animalsPics[name!.toLowerCase() as keyof typeof animalsPics]}
						style={{ width: '4.5rem', height: '4.5rem' }}></img>

					<div
						id={roleTooltipId}
						style={{
							...flexRowStyle,
							width: '100%',
							justifyContent: 'space-evenly',
							alignItems: 'center',
							paddingBottom: 4,
							fontSize: '0.9rem',
						}}>
						<div style={{ ...centerStyle, gap: 2 }}>
							<h4>{ap}</h4>
							<TbSword />
						</div>
						<div style={{ ...centerStyle, gap: 2 }}>
							<h4>{hp}</h4>
							<FaHeart />
						</div>
						<Tooltip
							anchorSelect={`#${roleTooltipId}`}
							content={roleTooltipContent}
							style={{ width: '5vw', fontSize: '0.7rem' }}
							place='bottom'
						/>
					</div>
				</>
			)}
		</div>
	);
};

export const BoardSlot = ({
	cardId,
	selected,
	selectSlot,
	nb,
	tankIdWithDoubleAP,
	playCard,
	localState,
}: SlotProps) => {
	const [, drop] = useDrop(
		{
			accept: 'animalcard',
			drop: (item: DropItem) => {
				if (!!playCard) playCard(item.id, nb);
			},
		},
		[cardId, localState],
	);

	if (isAnimalCard(cardId)) {
		return (
			<div ref={drop}>
				<AnimalBoardSlot
					cardId={cardId!}
					select={() => selectSlot(nb)}
					selected={selected}
					tankIdWithDoubleAP={tankIdWithDoubleAP}
				/>
			</div>
		);
	}
	return (
		<div
			ref={drop}
			style={{
				...boardSlotStyle,
				justifyContent: 'center',
				border: `solid 1px ${lightViolet}`,
				boxShadow: selected ? `0 0 1.5px 2.5px ${selectedColor}` : undefined,
			}}
			onClick={() => selectSlot(nb)}></div>
	);
};

export const DeckSlot = ({ cardId, selected, selectSlot, nb, isJokerActive }: DeckSlotProps) => {
	const selectSlotPolished = () => {
		if (!!selectSlot) {
			selected ? selectSlot(undefined) : selectSlot(nb);
		}
	};

	if (cardId && isAnimalCard(cardId)) {
		return (
			<AnimalDeckSlot
				cardId={cardId}
				select={selectSlotPolished}
				selected={selected}
				isJokerActive={isJokerActive}
			/>
		);
	}

	if (cardId && isPowerCard(cardId)) {
		return <PowerDeckSlot cardId={cardId} select={selectSlotPolished} selected={selected} />;
	}

	return (
		<div
			style={{
				...deckSlotStyle,
				justifyContent: 'center',
				border: `solid 1px ${lightViolet}`,
				borderColor: selected ? violet : undefined,
				color: violet,
				fontSize: '0.7em',
			}}
			onClick={() => selectSlotPolished()}>
			Power card
		</div>
	);
};

export const ElementSlot = ({ elementType }: { elementType?: ClanName }) => {
	return (
		<div
			style={{
				...centerStyle,
				borderRadius: 5,
				backgroundColor: elementType !== 'neutral' ? CLANS[elementType!]?.color : undefined,
				border: elementType === 'neutral' ? `solid 1px ${lightViolet}` : undefined,
				color: 'white',
				flexDirection: 'column',
				height: '3vw',
				width: '3vw',
				justifyContent: 'center',
				flexShrink: 0,
				fontSize: '0.6em',
			}}>
			{elementType !== 'neutral' && (
				<img
					src={elementsIcons[elementType!]}
					style={{
						height: '5vh',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}></img>
			)}
		</div>
	);
};

const CanAttackIconsView = ({ slot }: { slot: SlotType }) => {
	const val = 24;
	return isAnimalCard(slot?.cardId) ? (
		slot?.canAttack ? (
			<img src={attIcon} style={{ width: val }}></img>
		) : (
			<img src={noAttIcon} style={{ width: 28 }}></img>
		)
	) : (
		<div style={{ height: val }} />
	);
};

export const BoardSlots = ({
	slots,
	selectedSlots,
	selectSlot,
	opponent,
	current,
	elementType,
	tankIdWithDoubleAP,
	playCard,
	localState,
}: {
	slots: SlotType[];
	selectedSlots: number[];
	selectSlot: (slotNb: number) => void;
	opponent?: boolean;
	current?: boolean;
	elementType?: ClanName;
	tankIdWithDoubleAP?: string;
	playCard?: any;
	localState?: any;
}) => {
	const compoundSlots = [slots[0], slots[1], slots[2]];
	// @ts-ignore
	// const mainColor = elementType == 'neutral' ? 'transparent' : CLANS[elementType].color;
	const glow = {
		/*boxShadow: ` 0 0 0.2vw 0.12vw ${mainColor}`, borderRadius: 5,*/
	};
	return (
		<div
			style={{
				...centerStyle,
				width: '28rem',
				justifyContent: 'space-evenly',
			}}>
			{compoundSlots.map((slot, index) => (
				<div
					key={index}
					className={
						slot?.hasAttacked ? (current ? 'up-transition' : 'down-transition') : undefined
					}>
					<div>{current && <CanAttackIconsView slot={slot} />}</div>
					<div style={isAnimalInEnv(slot?.cardId, elementType) ? glow : undefined}>
						<BoardSlot
							nb={index}
							tankIdWithDoubleAP={tankIdWithDoubleAP}
							selectSlot={selectSlot}
							cardId={slot?.cardId}
							selected={selectedSlots.includes(index)}
							playCard={playCard}
							localState={localState}
						/>
					</div>
					{opponent && <CanAttackIconsView slot={slot} />}
				</div>
			))}
		</div>
	);
};
