import { useEffect, useRef } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FaHeart } from 'react-icons/fa';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import { Tooltip } from 'react-tooltip';




import { GiHeartMinus } from 'react-icons/gi';
import {
	airColor,
	centerStyle,
	earthColor,
	fireColor,
	flexColumnStyle,
	flexRowStyle,
	violet,
	waterColor,
} from '../styles/Style';
import { ROUND_DURATION } from '../utils/data';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import './styles.css';
import BlockAttacksIcon from '/src/assets/icons/block-attacks-violet.svg';
import BlockPowersIcon from '/src/assets/icons/block-pow-violet.svg';

export const BlockElement = ({ type }: any) => {
	if (type === 'pow')
		return <img src={BlockPowersIcon} style={{ height: '3rem', width: '3rem' }} />;
	else return <img src={BlockAttacksIcon} style={{ height: '3rem', width: '3rem' }} />;
};

export const CountDown = ({ finishRound }: any) => (
	<CountdownCircleTimer
		isPlaying
		duration={ROUND_DURATION}
		colors={`#8e44ad`}
		onComplete={() => {
			if (!!finishRound) finishRound();
		}}
		size={40}
		strokeLinecap='butt'
		strokeWidth={0.5}>
		{({ remainingTime }) => <h5 style={{ color: violet }}>{remainingTime}</h5>}
	</CountdownCircleTimer>
);

export const CurrentPView = ({
	player,
	round,
	finishRound,
	nbCardsToPlay,
	setElement,
	spectator,
	updateCardsOrder,
	hasAttacked,
	isConfirmActive,
	setIsConfirmActive,
}: {
	player: Player;
	round: Round;
	playCard: (cardId?: string) => Promise<void>;
	finishRound: () => void;
	nbCardsToPlay: number;
	setElement: () => void;
	spectator?: boolean;
	updateCardsOrder: any;
	hasAttacked : any;
	isConfirmActive:any;
	setIsConfirmActive:any;
}) => {
	const { playerType } = player;
	const cardsIds = player.cardsIds ?? [];
	const isMyRound = round?.player === playerType;



const Buttons = () => {
	
    const handleFinishClick = () => {
        if (hasAttacked.current) {
            finishRound();
        } else {
            setIsConfirmActive(true);
            toast("Don't forget to attack"); // Trigger the toast notification
        }
    };

    const handleConfirmClick = () => {
        finishRound();
        setIsConfirmActive(false);
    };

    const cardsToPlay =
        nbCardsToPlay > 1 ? `${nbCardsToPlay} cards` : nbCardsToPlay === 1 ? '1 card' : 'No cards';

    if (spectator) {
        return null;
    }

    return (
        <div style={{ position: 'absolute', right: '14vw', bottom: '12vh' }}>
            <div style={{ ...flexColumnStyle, alignItems: 'center', justifyContent: 'center', width: '14vw' }}>
                {!!nbCardsToPlay && isMyRound && (
                    <h5 style={{ color: violet, padding: 10 }}>{cardsToPlay} left</h5>
                )}
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {!isConfirmActive && (
                        <button
                            style={{
                                fontWeight: 'bold',
                                minWidth: '4vw',
                                fontSize: '0.8em',
                                width: '4.5vw',
                                padding: 2,
                                color: 'white',
                                backgroundColor: isMyRound ? violet : 'grey',
                                borderRadius: 5,
                            }}
                            disabled={!isMyRound}
                            onClick={handleFinishClick}>
                            FINISH
                        </button>
                    )}
                    { isConfirmActive && (
                        <>
                            <button
                                style={{
                                    fontWeight: 'bold',
                                    minWidth: '4vw',
                                    fontSize: '0.8em',
                                    width: '4.5vw',
                                    padding: 2,
                                    color: 'white',
                                    backgroundColor: isMyRound ? violet : 'grey',
                                    borderRadius: 5,
                                    marginLeft: '10px',
                                }}
                                disabled={!isMyRound}
                                onClick={handleConfirmClick}
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content="Don't forget to attack">
                                CONFIRM
                            </button>
                            <Tooltip id="my-tooltip" />
                        </>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};


	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'flex-end',
				width: '100%',
				justifyContent: 'center',
				gap: 8,
			}}>
			<Buttons />
			<PlayerDataView
				player={player}
				setElement={setElement}
				isMyRound={isMyRound}
				isMe={true}
				finishRound={finishRound}
			/>
			<CurrentPDeck cardsIds={cardsIds} updateCardsOrder={updateCardsOrder} />
			<EmptyElement />
		</div>
	);
};

export const OpponentPView = ({ player, spectator }: { player: Player; spectator?: boolean }) => {
	return (
		<div
			style={{
				...flexColumnStyle,
				width: '20vw',
				alignItems: 'center',
				justifyContent: 'safe center',
				gap: 10,
			}}>
			<OpponentDataView player={player} />
			<OpponentPDeck cardsIds={player?.cardsIds} spectator={spectator} />
			{spectator && <EmptyElement />}
		</div>
	);
};

export const EmptyElement = ({ width = '11vw' }: any) => {
	return <div style={{ width }}></div>;
};

const PlayerDataView = ({
	player,
	setElement,
	isMe,
}: {
	player: Player;
	setElement?: any;
	isMyRound?: boolean;
	isMe?: boolean;
	finishRound?: any;
}) => {
	const { hp, playerType, canPlayPowers, isDoubleAP, canAttack, envLoadNb } = player;
	const hpRef = useRef<number>(0);
	const [hpChange, setHpChange] = useState<string>();

	useEffect(() => {
		if (hp > hpRef.current) {
			setHpChange('+' + (hp - hpRef.current));
			setTimeout(() => {
				setHpChange(undefined);
			}, 1000);
		} else if (hp < hpRef.current) {
			setHpChange('-' + (hpRef.current - hp));
			setTimeout(() => {
				setHpChange(undefined);
			}, 1000);
		}
		hpRef.current = hp;
	}, [hp]);

	const ElementButton = () => (
		<button
			style={{
				...centerStyle,
				borderRadius: 5,
				backgroundColor: violet,
				color: 'white',
				height: '4vw',
				width: '4vw',
				fontSize: '1em',
				...flexColumnStyle,
				alignItems: 'center',
			}}
			onClick={() => setElement()}>
			<div style={{ ...centerStyle, zIndex: 1, position: 'relative', top: '2vw' }}>
				<GiHeartMinus style={{ color: 'white', width: '1.3rem', height: '1.3rem' }} />
			</div>
			<div style={{ position: 'relative', top: '-0.65rem' }}>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<div
						style={{
							width: '2vw',
							height: '2vw',
							backgroundColor: fireColor,
							borderTopLeftRadius: 5,
						}}></div>
					<div
						style={{
							width: '2vw',
							height: '2vw',
							backgroundColor: airColor,
							borderTopRightRadius: 5,
						}}></div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<div
						style={{
							width: '2vw',
							height: '2vw',
							backgroundColor: waterColor,
							borderBottomLeftRadius: 5,
						}}></div>
					<div
						style={{
							width: '2vw',
							height: '2vw',
							backgroundColor: earthColor,
							borderBottomRightRadius: 5,
						}}></div>
				</div>
			</div>
		</button>
	);

	return (
		<div
			style={{
				color: violet,
				fontSize: '0.9em',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'flex-end',
				gap: 12,
				width: '10vw',
			}}>
			{isMe && (
				<div
					style={{
						position: 'absolute',
						right: '3vw',
						bottom: '4vh',
						height: '4vh',
						...centerStyle,
					}}>
					<h4>{playerType?.toUpperCase()}</h4>
				</div>
			)}

			<div
				style={{
					...flexRowStyle,
					alignItems: 'center',
					gap: 2,
				}}>
				<div
					style={{
						...flexRowStyle,
						alignItems: 'center',
					}}>
					<div style={{ width: '3rem' }}>
						{hpChange ? <h4 style={{ fontSize: '1.7rem' }}>{hpChange}</h4> : <div />}
					</div>
					<div style={{ ...flexRowStyle, alignItems: 'center', justifyContent: 'center' }}>
						<h4 style={{ fontSize: '1.5rem' }}> {hpRef.current}</h4>
						<FaHeart style={{ color: violet, fontSize: '1.1rem' }} />
					</div>
				</div>

				<div style={{ width: '3rem' }}></div>
			</div>

			{isMe && <ElementButton />}

			<div
				style={{
					...flexColumnStyle,
					position: 'absolute',
					left: '5vw',
					bottom: isMe ? '10vh' : undefined,
					top: isMe ? undefined : '15vh',
					width: '12vw',
					gap: 12,
					fontSize: '1.1em',
				}}>
				{canAttack === false && canPlayPowers === false ? (
					<div style={{ ...flexRowStyle, gap: 8 }}>
						<BlockElement type='att' />
						<BlockElement type='pow' />
					</div>
				) : canAttack === false ? (
					<BlockElement type='att' />
				) : canPlayPowers === false ? (
					<BlockElement type='pow' />
				) : null}
				{isDoubleAP && <h4>Animals AP X 2</h4>}
			</div>
		</div>
	);
};

const OpponentDataView = ({
	player,
	isMe,
}: {
	player: Player;
	setElement?: any;
	isMyRound?: boolean;
	isMe?: boolean;
	finishRound?: any;
	chargeElement?: any;
}) => {
	const { hp, canPlayPowers, isDoubleAP, canAttack } = player;
	const hpRef = useRef<number>(0);
	const [hpChange, setHpChange] = useState<string>();

	useEffect(() => {
		if (hp > hpRef.current) {
			setHpChange('+' + (hp - hpRef.current));
			setTimeout(() => {
				setHpChange(undefined);
			}, 1000);
		} else if (hp < hpRef.current) {
			setHpChange('-' + (hpRef.current - hp));
			setTimeout(() => {
				setHpChange(undefined);
			}, 1000);
		}
		hpRef.current = hp;
	}, [hp]);

	return (
		<div
			style={{
				color: violet,
				fontSize: '0.9em',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 12,
				width: '10vw',
			}}>
			<div
				style={{
					...flexRowStyle,
					alignItems: 'center',
					gap: 1,
				}}>
				<div
					style={{
						...flexRowStyle,
						alignItems: 'center',
						gap: 8,
					}}>
					<div style={{ width: '3rem' }}>
						{hpChange ? <h4 style={{ fontSize: '1.7rem' }}>{hpChange}</h4> : <div />}
					</div>
					<div style={{ ...flexRowStyle, alignItems: 'center', justifyContent: 'center' }}>
						<h4 style={{ fontSize: '1.5rem' }}> {hpRef.current}</h4>
						<FaHeart style={{ color: violet, fontSize: '1.1rem' }} />
					</div>
				</div>

				<div style={{ width: '3rem' }}></div>
			</div>

			<div
				style={{
					...flexColumnStyle,
					position: 'absolute',
					left: '18vw',
					top: '10vh',
					width: '12vw',
					gap: 12,
					fontSize: '1.1em',
				}}>
				{canAttack === false && canPlayPowers === false ? (
					<div style={{ ...flexRowStyle, gap: 8 }}>
						<BlockElement type='att' />
						<BlockElement type='pow' />
					</div>
				) : canAttack === false ? (
					<BlockElement type='att' />
				) : canPlayPowers === false ? (
					<BlockElement type='pow' />
				) : null}
				{isDoubleAP && <h4>Animals AP X 2</h4>}
			</div>
		</div>
	);
};
