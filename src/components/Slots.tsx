import attIcon from '../assets/icons/att.png';
import noAttIcon from '../assets/icons/no-att.png';
import {
	centerStyle,
	deckSlotStyle,
	flexRowStyle,
	neutralColor,
	selectedColor,
	boardSlotStyle,
	violet,
} from '../styles/Style';
import {
	ANIMALS_POINTS,
	CLANS,
	ClanName,
	animalsPics,
	rolesIcons,
	elementsIcons,
	rolesTooltipContents,
} from '../utils/data';
import { getAnimalCard, getPowerCard, isAnimalCard, isPowerCard } from '../utils/helpers';
import { SlotType } from '../utils/interface';
import './styles.css';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from 'react-tooltip';

export const SlotBack = () => (
	<div
		style={{
			borderRadius: 5,
			backgroundColor: violet,
			color: 'white',
			...centerStyle,
			height: '7vh',
			width: '2.5vw',
			fontSize: '0.9em',
		}}>
		<h6>K</h6>
	</div>
);

interface SlotProps {
	cardId?: string;
	selected?: boolean;
	selectSlot?: (slotNb?: number) => void;
	nb?: number;
	graveyard?: boolean;
	isDoubleAP: boolean;
}

interface DeckSlotProps {
	cardId?: string;
	selected?: boolean;
	selectSlot?: (slotNb?: number) => void;
	nb?: number;
	graveyard?: boolean;
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
	const bigStyle: React.CSSProperties = !!isBigStyle ? { height: '20vh', width: '8vw', fontSize: '1em' } : {};
	return (
		<div
			style={{
				...boardSlotStyle,
				backgroundColor: violet,
				justifyContent: 'space-evenly',
				borderColor: selected ? selectedColor : violet,
				...bigStyle,
			}}
			onClick={() => select()}>
			<h6>{name?.toUpperCase()}</h6>
			<Tooltip anchorSelect={`#${tooltipId}`} content={description} />
			<InfoIcon id={tooltipId} style={{ color: 'white', width: '1.1vw' }} />
		</div>
	);
};

export const PowerDeckSlot = ({
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
	const bigStyle: React.CSSProperties = !!isBigStyle ? { height: '20vh', width: '8vw', fontSize: '1em' } : {};
	return (
		<div
			style={{
				...deckSlotStyle,
				backgroundColor: violet,
				justifyContent: 'center',
				borderColor: selected ? selectedColor : violet,
				...bigStyle,
			}}
			onClick={() => select()}>
			<h6>{name?.toUpperCase()}</h6>
			<div>
				<Tooltip anchorSelect={`#${tooltipId}`} content={description} />
				<InfoIcon id={tooltipId} style={{ color: 'white', width: '1.1vw' }} />
			</div>
		</div>
	);
};

export const AnimalBoardSlot = ({
	cardId,
	select,
	selected,
	isDoubleAP,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
	isDoubleAP: boolean;
}) => {
	const { clan, name, role, ability } = getAnimalCard(cardId)!;
	if (!name || !clan || !role) return <></>;

	const { hp, ap } = ANIMALS_POINTS[role];
	const roleTooltipContent = ability;
	const roleTooltipId = `role-anchor${cardId}`;

	return (
		<div
			style={{
				...boardSlotStyle,
				justifyContent: 'space-between',
				borderColor: selected ? selectedColor : CLANS[clan!]?.color,
				borderWidth: selected ? '2.5px' : '2px',
			}}
			onClick={() => select()}>
			{!!name && name?.toLowerCase() in animalsPics && (
				<img
					src={animalsPics[name.toLowerCase() as keyof typeof animalsPics]}
					style={{ height: '12vh', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
			)}

			<div
				style={{
					...flexRowStyle,
					width: '100%',
					justifyContent: 'space-around',
					alignItems: 'center',
					fontSize: '1.1em',
					backgroundColor: CLANS[clan!]?.color,
					height: '3.5vh',
				}}>
				<h6>{isDoubleAP ? ap * 2 : ap} AP</h6>
				<Tooltip anchorSelect={`#${roleTooltipId}`} content={roleTooltipContent} style={{ width: '10vw' }} />
				<img id={roleTooltipId} src={rolesIcons[role]} style={{ width: 24, filter: 'brightness(0) invert(1)' }}></img>
				<h6>{hp} HP</h6>
			</div>
		</div>
	);
};

export const AnimalDeckSlot = ({
	cardId,
	select,
	selected,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
}) => {
	const { clan, name, ability, role } = getAnimalCard(cardId)!;
	const { hp, ap } = ANIMALS_POINTS[role];
	return (
		<div
			style={{
				...deckSlotStyle,
				backgroundColor: CLANS[clan!]?.color,
				justifyContent: 'space-between',
				borderColor: selected ? selectedColor : CLANS[clan!]?.color,
			}}
			onClick={() => select()}>
			<h6 style={{ fontSize: '0.85em', paddingTop: 4 }}>{name?.toUpperCase()}</h6>
			{ability && <h6 style={{ fontSize: '0.65em' }}>{ability}</h6>}
			<div
				style={{
					...flexRowStyle,
					width: '100%',
					justifyContent: 'space-around',
					alignItems: 'center',
					paddingBottom: 4,
				}}>
				<h6>{ap} AP</h6>
				<img src={rolesIcons[role]} style={{ width: 22, filter: 'brightness(0) invert(1)' }}></img>
				<h6>{hp} HP</h6>
			</div>
		</div>
	);
};

export const BoardSlot = ({ cardId, selected, selectSlot, nb, isDoubleAP }: SlotProps) => {
	const selectSlotPolished = () => {
		if (!!selectSlot) {
			selected ? selectSlot(undefined) : selectSlot(nb);
		}
	};

	if (cardId && isAnimalCard(cardId)) {
		return <AnimalBoardSlot cardId={cardId} select={selectSlotPolished} selected={selected} isDoubleAP={isDoubleAP} />;
	}

	if (cardId && isPowerCard(cardId)) {
		return <PowerBoardSlot cardId={cardId} select={selectSlotPolished} selected={selected} />;
	}

	return (
		<div
			style={{
				...boardSlotStyle,
				backgroundColor: neutralColor,
				justifyContent: 'center',
				borderColor: selected ? selectedColor : neutralColor,
			}}
			onClick={() => selectSlotPolished()}></div>
	);
};

export const DeckSlot = ({ cardId, selected, selectSlot, nb }: DeckSlotProps) => {
	const selectSlotPolished = () => {
		if (!!selectSlot) {
			selected ? selectSlot(undefined) : selectSlot(nb);
		}
	};

	if (cardId && isAnimalCard(cardId)) {
		return <AnimalDeckSlot cardId={cardId} select={selectSlotPolished} selected={selected} />;
	}

	if (cardId && isPowerCard(cardId)) {
		return <PowerDeckSlot cardId={cardId} select={selectSlotPolished} selected={selected} />;
	}

	return (
		<div
			style={{
				...deckSlotStyle,
				backgroundColor: neutralColor,
				justifyContent: 'center',
				borderColor: selected ? selectedColor : neutralColor,
			}}
			onClick={() => selectSlotPolished()}></div>
	);
};

export const ElementSlot = ({ elementType }: { elementType?: ClanName }) => (
	<div
		style={{
			...centerStyle,
			borderRadius: 5,
			backgroundColor: CLANS[elementType!]?.color,
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
				style={{ height: '5vh', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
		)}
	</div>
);

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
	selectedSlotNb,
	selectSlot,
	opponent,
	current,
	elementType,
	isDoubleAP,
}: {
	slots: SlotType[];
	selectedSlotNb?: number;
	selectSlot: (slotNb?: number) => void;
	opponent?: boolean;
	current?: boolean;
	elementType?: ClanName;
	isDoubleAP: boolean;
}) => {
	const compoundSlots = [slots[0], slots[1], slots[2]];

	// @ts-ignore
	const mainColor = elementType == 'neutral' ? 'transparent' : CLANS[elementType].color;
	const glow = {
		boxShadow: ` 0 0 0.5vw 0.25vw ${mainColor}`,
		borderRadius: 5,
	};
	return (
		<div
			style={{
				...centerStyle,
				width: '25vw',
				justifyContent: 'space-evenly',
			}}>
			{compoundSlots.map((slot, index) => (
				<div key={index}>
					<div className={slot?.hasAttacked ? (current ? 'up-transition' : 'down-transition') : undefined}>
						{current && <CanAttackIconsView slot={slot} />}
					</div>
					<div style={getAnimalCard(slot?.cardId)?.clan == elementType ? glow : undefined}>
						<BoardSlot
							nb={index}
							isDoubleAP={isDoubleAP}
							selectSlot={selectSlot}
							cardId={slot?.cardId}
							selected={selectedSlotNb === index}
						/>
					</div>
					{opponent && <CanAttackIconsView slot={slot} />}
				</div>
			))}
		</div>
	);
};
