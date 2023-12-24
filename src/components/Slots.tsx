import { FaShield } from 'react-icons/fa6';
import { GiHeartMinus, GiHeartPlus } from 'react-icons/gi';

import { TbSword } from 'react-icons/tb';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Tooltip } from 'react-tooltip';
import {
	boardSlotStyle,
	centerStyle,
	deckSlotStyle,
	flexColumnStyle,
	flexRowStyle,
	lightViolet,
	selectedColor,
	violet,
} from '../styles/Style';
import {
	ANIMALS_POINTS,
	CLANS,
	ClanName,
	KING,
	RoleName,
	animalsPics,
	elementsIcons,
	getPowerCardIcon,
} from '../utils/data';
import { getAnimalCard, getPowerCard, isAnimalCard, isPowerCard } from '../utils/helpers';
import { SlotType } from '../utils/interface';
import './styles.css';
import powerIcon from '/src/assets/icons/power-icon.svg';

export interface DropItem {
	id: string;
	nb?: number;
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
	isDoubleAP?: boolean;
	playCard: any;
	localState: any;
	attack?: any;
	attackState?: any;
	opponent?: boolean;
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
	const { name, description, gain, loss } = getPowerCard(cardId) ?? {};
	const tooltipId = `power-deck-anchor${cardId}`;
	const bigStyle: React.CSSProperties = !!isBigStyle
		? { height: '20vh', width: '8vw', fontSize: '1em' }
		: {};
	const gainArray = Array(gain ?? 0)
		.fill(0)
		.map((_, i) => i);
	const lossArray = Array(loss ?? 0)
		.fill(0)
		.map((_, i) => i);

	const { src, h, w } = getPowerCardIcon(cardId)!;

	return (
		<div
			style={{
				...boardSlotStyle,
				backgroundColor: violet,
				boxShadow: selected ? `0 0 1.5px 2.5px ${selectedColor}` : undefined,
				...bigStyle,
				...flexColumnStyle,
				alignItems: 'center',
				height: '100%',
				justifyContent: 'space-between',
				width: '5.4rem',
			}}
			onClick={() => select()}>
			<div
				style={{
					width: '4.6rem',
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'flex-start',
					height: '1.7rem',
					paddingRight: 2,
					paddingTop: 2,
				}}>
				<Tooltip anchorSelect={`#${tooltipId}`} content={name} />
				{gainArray.length > 0
					? gainArray.map(index => (
							<span key={index}>
								<GiHeartPlus style={{ color: 'white', width: '1.3rem', height: '1.3rem' }} />
							</span>
					  ))
					: lossArray.length > 0
					? lossArray.map(index => (
							<span key={index} id={tooltipId}>
								<GiHeartMinus style={{ color: 'white', width: '1.3rem', height: '1.3rem' }} />
							</span>
					  ))
					: null}
			</div>
			<div id={tooltipId}>
				<img src={src} style={{ width: w, height: h }} />
			</div>
			<Tooltip anchorSelect={`#${tooltipId}`} content={description} />
			<div style={{ height: '2rem', width: '100%' }} />
		</div>
	);
};

export const PowerDeckSlot = ({
	cardId,
	selected,
	isBigStyle,
	isJokerActive,
	index,
	graveyard = false,
}: {
	cardId: string;
	selected?: boolean;
	isBigStyle?: boolean;
	isJokerActive?: boolean;
	index: number;
	graveyard: boolean;
}) => {
	const [, drag] = useDrag(
		() => ({
			type: 'movecard',
			item: { id: cardId, index },
			collect: monitor => ({ isDragging: !!monitor.getItem() }),
		}),
		[cardId],
	);
	const { name, gain, loss } = getPowerCard(cardId) ?? {};
	const tooltipId = `power-deck-anchor${cardId}`;
	const bigStyle: React.CSSProperties = !!isBigStyle
		? { height: '20vh', width: '8vw', fontSize: '1em' }
		: {};
	const gainArray = Array(gain ?? 0)
		.fill(0)
		.map((_, i) => i);
	const lossArray = Array(loss ?? 0)
		.fill(0)
		.map((_, i) => i);

	const { src, h, w } = getPowerCardIcon(cardId)!;

	const ref = useRef(null);
	drag(ref);

	return (
		<div
			ref={!graveyard ? ref : null}
			style={{
				...deckSlotStyle,
				backgroundColor: violet,
				border: 'solid 1.5px',
				borderColor: selected ? selectedColor : violet,
				...bigStyle,
				fontSize: '0.75em',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			{isJokerActive ? (
				<h5>K</h5>
			) : (
				<div
					style={{
						...flexColumnStyle,
						alignItems: 'center',
						height: '100%',
						justifyContent: 'space-between',
					}}>
					<div
						style={{
							width: '4.6rem',
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'flex-start',
							height: '1.7rem',
							paddingRight: 2,
							paddingTop: 2,
						}}>
						<Tooltip anchorSelect={`#${tooltipId}`} content={name} />
						{gainArray.length > 0
							? gainArray.map(index => (
									<span key={index}>
										<GiHeartPlus style={{ color: 'white', width: '1.3rem', height: '1.3rem' }} />
									</span>
							  ))
							: lossArray.length > 0
							? lossArray.map(index => (
									<span key={index} id={tooltipId}>
										<GiHeartMinus style={{ color: 'white', width: '1.3rem', height: '1.3rem' }} />
									</span>
							  ))
							: null}
					</div>
					<div id={tooltipId}>
						<img src={src} style={{ width: w, height: h }} />
					</div>
					<div style={{ height: '2rem', width: '100%' }} />
				</div>
			)}
		</div>
	);
};

export const AnimalBoardSlot = ({
	cardId,
	selected,
	attack,
	nb,
	attackState,
	isDoubleAP,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
	isDoubleAP?: boolean;
	attack?: any;
	nb?: number;
	attackState?: any;
}) => {
	const [canAttack, setcanAttack] = useState(true);
	const [, drag] = useDrag(
		() => ({
			type: 'attackcard',
			item: { id: cardId, nb: nb },
			collect: monitor => ({ isDragging: !!monitor.getItem() }),
		}),
		[cardId, nb, attackState],
	);

	const vibrateStyle = {
		animation: 'vibrate 0.5s linear',
	};

	useEffect(() => {
		let timer: string | number | NodeJS.Timeout | undefined;
		if (!canAttack) {
			timer = setTimeout(() => setcanAttack(true), 500);
		}
		return () => clearTimeout(timer);
	}, [canAttack]);

	const [, drop] = useDrop(
		{
			accept: 'attackcard',
			drop: (item: DropItem) => {
				console.log('animal', item.id, 'attacks', cardId);
				const animalAId = item.id;
				const animalDId = cardId;
				attack(animalAId, animalDId, item.nb, nb).then((isAttackValid: boolean) => {
					if (!isAttackValid) {
						setcanAttack(false);
					}
				});
			},
		},
		[cardId, attackState],
	);

	const { clan, name, role } = getAnimalCard(cardId)!;

	if (!name || !clan || !role) return <></>;

	const { hp, ap } = ANIMALS_POINTS[role];
	const ref = useRef(null);
	drag(drop(ref));

	return (
		<div
			ref={ref}
			style={{
				...boardSlotStyle,
				justifyContent: 'space-between',
				backgroundColor: CLANS[clan!]?.color,
				boxShadow: selected ? `0 0 1px 2px ${selectedColor}` : `0 0 1px 2px ${CLANS[clan!]?.color}`,
				...(!canAttack ? vibrateStyle : {}),
			}}>
			{!!name && name?.toLowerCase() in animalsPics && (
				<div
					style={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						flex: 1,
					}}>
					<img
						src={animalsPics[name.toLowerCase() as keyof typeof animalsPics]}
						style={{ width: '4.2rem', height: '3.2rem' }}></img>
				</div>
			)}

			<div
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
					<h4>{isDoubleAP ? ap * 2 : ap}</h4>
					<TbSword style={{ fontSize: '1.45rem' }} />
				</div>

				<div style={{ ...centerStyle, gap: 2 }}>
					<h4>{hp}</h4>
					<FaShield />
				</div>
			</div>
		</div>
	);
};

const AnimalDeckSlotView = ({ cardId, role, name, ability }: any) => {
	const { hp, ap } = ANIMALS_POINTS[role as RoleName];
	const roleTooltipContent = ability;
	const roleTooltipId = `role-anchor${cardId}`;
	return (
		<>
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'flex-end',
					paddingRight: 2,
					paddingTop: 1,
					height: '0.2rem',
				}}>
				{role === KING && (
					<span>
						<GiHeartMinus style={{ color: 'white', width: '1.3rem', height: '1.3rem' }} />
					</span>
				)}
			</div>
			<img
				id={roleTooltipId}
				src={animalsPics[name!.toLowerCase() as keyof typeof animalsPics]}
				style={{ width: '2.2rem', height: '2.2rem', flex: 1 }}
			/>
			<div
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
					<TbSword style={{ fontSize: '1.1rem' }} />
				</div>
				<div style={{ ...centerStyle, gap: 2 }}>
					<h4>{hp}</h4>
					<FaShield />
				</div>
				<Tooltip
					anchorSelect={`#${roleTooltipId}`}
					content={roleTooltipContent}
					style={{ width: '5vw', fontSize: '0.5rem' }}
					place='bottom'
				/>
			</div>
		</>
	);
};

export const AnimalDeckSlot = ({
	cardId,
	selected,
	isJokerActive,
	index,
	graveyard = false,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
	isJokerActive?: boolean;
	index: number;
	graveyard: boolean;
}) => {
	const [, drag] = useDrag(
		() => ({
			type: 'movecard',
			item: { id: cardId, index },
			collect: monitor => ({ isDragging: !!monitor.getItem() }),
		}),
		[cardId],
	);
	const { clan, name, ability, role } = getAnimalCard(cardId)!;
	const ref = useRef(null);
	drag(ref);

	return (
		<div
			ref={!graveyard ? ref : null}
			style={{
				...deckSlotStyle,
				backgroundColor: isJokerActive ? violet : CLANS[clan!]?.color,
				border: 'solid 1.5px',
				borderColor: selected ? selectedColor : isJokerActive ? violet : CLANS[clan!]?.color,
				alignItems: 'center',
				justifyContent: isJokerActive ? 'center' : 'space-between',
			}}>
			{isJokerActive ? (
				<h5>K</h5>
			) : (
				<AnimalDeckSlotView cardId={cardId} name={name} role={role} ability={ability} />
			)}
		</div>
	);
};

export const BoardSlot = ({
	cardId,
	selected,
	selectSlot,
	nb,
	isDoubleAP,
	playCard,
	localState,
	attack,
	attackState,
	opponent,
}: SlotProps) => {
	const [, drop] = useDrop(
		{
			accept: 'movecard',
			drop: (item: DropItem) => {
				if ((!isPowerCard(item.id) && !isAnimalCard(item.id)) || !playCard) {
					return;
				}
				playCard(item.id, nb);
			},
		},
		[cardId, localState],
	);
	const [, drop2] = useDrop(
		{
			accept: 'attackcard',
			drop: (item: DropItem) => {
				const animalAId = item.id;
				const animalDId = cardId;
				console.log(animalAId, ' attacks ', animalDId);
				attack(animalAId, animalDId, item.nb, nb);
			},
		},
		[cardId, attackState],
	);

	if (isAnimalCard(cardId)) {
		return (
			<div ref={drop}>
				<AnimalBoardSlot
					cardId={cardId!}
					select={() => selectSlot(nb)}
					selected={selected}
					isDoubleAP={isDoubleAP}
					attack={attack}
					nb={nb}
					attackState={attackState}
				/>
			</div>
		);
	}

	if (opponent) {
		return (
			<div
				ref={drop2}
				style={{
					...boardSlotStyle,
					justifyContent: 'center',
					border: `solid 1px ${lightViolet}`,
					boxShadow: selected ? `0 0 1px 2px ${selectedColor}` : undefined,
				}}
				onClick={() => selectSlot(nb)}></div>
		);
	}

	return (
		<div
			ref={drop}
			style={{
				...boardSlotStyle,
				justifyContent: 'center',
				border: `solid 1px ${lightViolet}`,
				boxShadow: selected ? `0 0 1px 2px ${selectedColor}` : undefined,
			}}
			onClick={() => selectSlot(nb)}></div>
	);
};

export const DeckSlot = ({
	cardId,
	selected,
	selectSlot,
	nb,
	isJokerActive,
	index,
	graveyard,
}: any) => {
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
				index={index}
				graveyard={graveyard}
			/>
		);
	}

	if (cardId && isPowerCard(cardId)) {
		return (
			<PowerDeckSlot
				cardId={cardId}
				selected={selected}
				isJokerActive={isJokerActive}
				index={index}
				graveyard={graveyard}
			/>
		);
	}

	return (
		<div
			style={{
				...deckSlotStyle,
				justifyContent: 'center',
				border: `dashed 1px ${lightViolet}`,
				borderColor: selected ? violet : undefined,
				color: violet,
				fontSize: '0.7em',
			}}
			onClick={() => selectSlotPolished()}>
			<img src={powerIcon} style={{ width: '1.4rem', height: '1.4rem' }} />
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
				height: '4.5vw',
				width: '4.5vw',
				justifyContent: 'center',
				flexShrink: 0,
				fontSize: '1em',
			}}>
			{elementType !== 'neutral' && (
				<img
					src={elementsIcons[elementType!]}
					style={{
						height: '6vh',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}></img>
			)}
		</div>
	);
};

export const BoardSlots = ({
	slots,
	opponent,
	elementType,
	isDoubleAP,
	playCard,
	localState,
	attack,
	attackState,
}: {
	slots: SlotType[];
	opponent?: boolean;
	current?: boolean;
	elementType?: ClanName;
	isDoubleAP?: boolean;
	playCard?: any;
	localState?: any;
	attack?: any;
	attackState?: any;
}) => {
	const compoundSlots = [slots[0], slots[1], slots[2]];
	// @ts-ignore
	const mainColor = elementType == 'neutral' ? 'transparent' : CLANS[elementType].color;
	const glow: CSSProperties = {
		boxShadow: ` 0 0 0.6vw 0.4vw ${mainColor}`,
		borderRadius: 5,
	};

	return (
		<div
			style={{
				...centerStyle,
				width: '21rem',
				justifyContent: 'space-evenly',
			}}>
			{compoundSlots.map((slot, index) => (
				<div key={index}>
					{/*<div>{current && <CanAttackIconsView slot={slot} />}</div>*/}
					<BoardSlot
						nb={index}
						isDoubleAP={isDoubleAP}
						cardId={slot?.cardId}
						playCard={playCard}
						localState={localState}
						attack={attack}
						attackState={attackState}
						opponent={opponent}
					/>
					{/*opponent && <CanAttackIconsView slot={slot} />*/}
				</div>
			))}
		</div>
	);
};
