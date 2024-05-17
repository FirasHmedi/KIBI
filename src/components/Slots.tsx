import { FaShield } from 'react-icons/fa6';
import { GiHeartMinus, GiHeartPlus, GiShieldOpposition } from 'react-icons/gi';

import { TbSword, TbSwords } from 'react-icons/tb';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Tooltip } from 'react-tooltip';
import {
	airColor,
	boardSlotStyle,
	centerStyle,
	deckSlotStyle,
	earthColor,
	fireColor,
	flexColumnStyle,
	flexRowStyle,
	lightViolet,
	selectedColor,
	violet,
	waterColor,
} from '../styles/Style';
import {
	ANIMALS_POINTS,
	CLANS,
	ClanName,
	KING,
	RoleName,
	animalsPics,
	elementsIcons,
} from '../utils/data';
import { getAnimalCard, getPowerCard, isAnimalCard, isPowerCard } from '../utils/helpers';
import { SlotType } from '../utils/interface';
import { PowerCardIcon } from './Elements';
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
	canAttackOpponent?: boolean;
	canSacrifice?: boolean;
	sacrificeAnimalFun?: any;
}

interface DeckSlotProps {
	cardId?: string;
	selected?: boolean;
	selectSlot?: (slotNb?: number) => void;
	nb?: number;
	graveyard?: boolean;
	isStealCard?: boolean;
}

export const PowerBoardSlot = ({
	cardId,
	isBigStyle,
}: {
	cardId: string;
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

	return (
		<div
			style={{
				...boardSlotStyle,
				backgroundColor: violet,
				...bigStyle,
				...flexColumnStyle,
				alignItems: 'center',
				height: '100%',
				justifyContent: 'space-between',
				width: '5.4rem',
			}}>
			<div
				style={{
					width: '4.6rem',
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'flex-start',
					height: '1.9rem',
					paddingRight: 2,
					paddingTop: 2,
				}}>
				<Tooltip anchorSelect={`#${tooltipId}`} content={name} />
				{gainArray.length > 0
					? gainArray.map(index => (
							<span key={index}>
								<GiHeartPlus style={{ color: 'white', width: '1rem', height: '1rem' }} />
							</span>
					  ))
					: lossArray.length > 0
					? lossArray.map(index => (
							<span key={index} id={tooltipId}>
								<GiHeartMinus style={{ color: 'white', width: '1rem', height: '1rem' }} />
							</span>
					  ))
					: null}
			</div>
			<div id={tooltipId}>
				<PowerCardIcon id={cardId} />
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
	isStealCard,
	index,
	graveyard = false,
}: {
	cardId: string;
	selected?: boolean;
	isBigStyle?: boolean;
	isStealCard?: boolean;
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
			{isStealCard ? (
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
							height: '1.9rem',
							paddingRight: 2,
							paddingTop: 2,
						}}>
						<Tooltip anchorSelect={`#${tooltipId}`} content={name} />
						{gainArray.length > 0
							? gainArray.map(index => (
									<span key={index}>
										<GiHeartPlus style={{ color: 'white', width: '1rem', height: '1rem' }} />
									</span>
							  ))
							: lossArray.length > 0
							? lossArray.map(index => (
									<span key={index} id={tooltipId}>
										<GiHeartMinus style={{ color: 'white', width: '1rem', height: '1rem' }} />
									</span>
							  ))
							: null}
					</div>
					<div id={tooltipId}>
						<PowerCardIcon id={cardId} />
					</div>
					<div style={{ height: '2rem', width: '100%' }} />
				</div>
			)}
		</div>
	);
};

export const AnimalBoardSlot = ({
	cardId,
	attack,
	nb,
	attackState,
	isDoubleAP,
}: {
	cardId: string;
	isDoubleAP?: boolean;
	attack?: any;
	nb?: number;
	attackState?: any;
}) => {
	const [canAttack, setcanAttack] = useState(true);
	const [, drag] = useDrag(
		() => ({
			type: 'moveBoardCard',
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
			accept: 'moveBoardCard',
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
	const aps = [...Array(ap ?? 1).keys()];
	const hps = [...Array(hp ?? 1).keys()];
	const ref = useRef(null);
	drag(drop(ref));

	return (
		<div
			ref={ref}
			style={{
				...boardSlotStyle,
				justifyContent: 'space-between',
				backgroundColor: CLANS[clan!]?.color,
				boxShadow: `0 0 1px 2px ${CLANS[clan!]?.color}`,
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
						style={{ width: '4rem', height: '3rem' }}></img>
				</div>
			)}

			<div
				style={{
					...flexRowStyle,
					width: '100%',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					fontSize: '1rem',
					backgroundColor: CLANS[clan!]?.color,
					height: '2rem',
				}}>
				<div style={{ ...centerStyle }}>
					{ap === 1 ? (
						<TbSword style={{ fontSize: '1.1rem' }} />
					) : (
						<TbSwords style={{ fontSize: '1.1rem' }} />
					)}
				</div>

				<div style={{ ...centerStyle }}>
					{hp === 1 ? (
						<FaShield style={{ fontSize: '1rem' }} />
					) : (
						<GiShieldOpposition style={{ fontSize: '1.3rem' }} />
					)}
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
						<GiHeartMinus style={{ color: 'white', width: '1rem', height: '1rem' }} />
					</span>
				)}
			</div>
			<img
				src={animalsPics[name!.toLowerCase() as keyof typeof animalsPics]}
				style={{ width: '2.2rem', height: '2.2rem', flex: 1 }}
			/>
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
				<div style={{ ...centerStyle }}>
					{ap === 1 ? (
						<TbSword style={{ fontSize: '1.1rem' }} />
					) : (
						<TbSwords style={{ fontSize: '1.1rem' }} />
					)}
				</div>

				<div style={{ ...centerStyle }}>
					{hp === 1 ? (
						<FaShield style={{ fontSize: '1rem' }} />
					) : (
						<GiShieldOpposition style={{ fontSize: '1.3rem' }} />
					)}
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
	isStealCard,
	index,
	graveyard = false,
}: {
	cardId: string;
	select: () => void;
	selected?: boolean;
	isStealCard?: boolean;
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
				backgroundColor: CLANS[clan!]?.color,
				border: 'solid 1.5px',
				borderColor: CLANS[clan!]?.color,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			{isStealCard ? (
				<h5>K</h5>
			) : (
				<AnimalDeckSlotView cardId={cardId} name={name} role={role} ability={ability} />
			)}
		</div>
	);
};

import sacrificeAnimalGrey from '/src/assets/icons/sacrifice-animal-grey.svg';
import sacrificeAnimalViolet from '/src/assets/icons/sacrifice-animal-violet.svg';

export const BoardSlot = ({
	cardId,
	nb,
	isDoubleAP,
	playCard,
	localState,
	attack,
	attackState,
	opponent,
	canAttackOpponent,
	sacrificeAnimalFun,
	canSacrifice = true,
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
			accept: 'moveBoardCard',
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
			<div style={{ ...flexColumnStyle, alignItems: 'center' }}>
				<div ref={drop}>
					<AnimalBoardSlot
						cardId={cardId!}
						isDoubleAP={isDoubleAP}
						attack={attack}
						nb={nb}
						attackState={attackState}
					/>
				</div>
				{canSacrifice && !opponent && (
					<button
						style={{
							position: 'relative',
							top: '1rem',
							marginBottom: '-1rem',
							borderRadius: 10,
							...centerStyle,
						}}
						disabled={!canSacrifice}
						onClick={() => {
							sacrificeAnimalFun(cardId, nb);
						}}>
						<img
							id='sacrificeButton'
							src={sacrificeAnimalViolet}
							style={{ width: '1.4rem', height: '1.4rem' }}
						/>
						<Tooltip
							style={{ fontSize: '0.5rem' }}
							anchorSelect={'#sacrificeButton'}
							content={'Sacrifice for 2HP'}
						/>
					</button>
				)}
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
					...centerStyle,
				}}></div>
		);
	}

	return (
		<div style={{ ...flexColumnStyle, alignItems: 'center' }}>
			<div
				ref={drop}
				style={{
					...boardSlotStyle,
					justifyContent: 'center',
					border: `solid 1px ${lightViolet}`,
				}}></div>
			{!opponent && (
				<button
					style={{
						position: 'relative',
						top: '1rem',
						marginBottom: '-1rem',
						borderRadius: 10,
						...centerStyle,
					}}
					disabled={true}>
					<img src={sacrificeAnimalGrey} style={{ width: '1.4rem', height: '1.4rem' }} />
				</button>
			)}
		</div>
	);
};

export const DeckSlot = ({
	cardId,
	selected,
	selectSlot,
	nb,
	isStealCard,
	index,
	graveyard,
}: any) => {
	const selectSlotPolished = () => {
		if (!!selectSlot) {
			selected ? selectSlot(undefined) : selectSlot(nb);
		}
	};

	if (isAnimalCard(cardId)) {
		return (
			<AnimalDeckSlot
				cardId={cardId}
				select={selectSlotPolished}
				selected={selected}
				isStealCard={isStealCard}
				index={index}
				graveyard={graveyard}
			/>
		);
	}

	if (isPowerCard(cardId)) {
		return (
			<PowerDeckSlot
				cardId={cardId}
				selected={selected}
				isStealCard={isStealCard}
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
				color: 'white',
				flexDirection: 'column',
				height: '3.2rem',
				width: '3.2rem',
				justifyContent: 'center',
				flexShrink: 0,
				fontSize: '1em',
			}}>
			{elementType !== 'neutral' ? (
				<img
					src={elementsIcons[elementType!]}
					style={{
						height: '4vh',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}></img>
			) : (
				<div style={{}}>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<div
							style={{
								width: '1.6rem',
								height: '1.6rem',
								backgroundColor: fireColor,
								borderTopLeftRadius: 5,
							}}></div>
						<div
							style={{
								width: '1.6rem',
								height: '1.6rem',
								backgroundColor: airColor,
								borderTopRightRadius: 5,
							}}></div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<div
							style={{
								width: '1.6rem',
								height: '1.6rem',
								backgroundColor: waterColor,
								borderBottomLeftRadius: 5,
							}}></div>
						<div
							style={{
								width: '1.6rem',
								height: '1.6rem',
								backgroundColor: earthColor,
								borderBottomRightRadius: 5,
							}}></div>
					</div>
				</div>
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
	canAttackOpponent,
	sacrificeAnimal,
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
	canAttackOpponent?: boolean;
	sacrificeAnimal?: any;
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
					<BoardSlot
						nb={index}
						isDoubleAP={isDoubleAP}
						cardId={slot?.cardId}
						playCard={playCard}
						localState={localState}
						attack={attack}
						attackState={attackState}
						opponent={opponent}
						canAttackOpponent={canAttackOpponent}
						sacrificeAnimalFun={sacrificeAnimal}
					/>
				</div>
			))}
		</div>
	);
};
