import { centerStyle, flexColumnStyle, violet } from '../../styles/Style';

function WalkThrough() {
	return (
		<div
			style={{
				...flexColumnStyle,
				...centerStyle,
				color: violet,
				overflowY: 'hidden',
				height: '100%',
				paddingLeft: '4vw',
				paddingRight: '4vw',
				paddingTop: '1vh',
				paddingBottom: '1vh',
			}}>
			<p>
				1V1 game, each player has cards and health, The first player that reaches 0hp loses. The
				cards are divided into 2 types: Animal cards and Power cards. It is played round by round,
				the first player plays his cards, may attack, then the second player gets the turn and do
				the same. Player health decreases when he gets a direct hit from an animal. Animal cards
				Divided into 4 colors (Red, Blue, Yellow and Green) Each color contains 4 animals (KING,
				ATTACKER, TANK and JOKER) Each Animal has Attack points (AP) and defense points (DP) Each
				animal has AP and DP, an animal can attack an animal if his AP more than DP King (2AP, 2DP)
				/ Attacker (2AP, 1DP) / Tank (1AP, 2DP) / Joker (1AP, 1DP) Power cards There are 12 power
				cards that have an ability that can influence the game At the start each player has 2 power
				cards and in each round he gets a random power card from the main Deck Element: activates
				all animals abilities in board, each player can change it in his round and it affects all
				animals board. To change element, player needs to sacrifice 2hp Animals abilities: Lion
				ability is to attack two animals Eagle ability is to attack opponent player Whale ability is
				to add +1hp to owner each round Monkey ability is to steal a card from the opponent deck
				Animal can attack and kill an animal with same or less DP than his AP. Rules You can only
				attack once in a round 3 animals defend player (you can’t attack player if he has 3 animals
				on board) The animals abilities can be used only if their element is activated Player can
				play 2 cards each round (first round 3 cards) If the player has 3 animals of the same color
				and the element is activated, each animal AP is doubled. Gameplay Before the start of the
				game, each player has 8 animals and 2 power card (randomly) The game contains player Decks,
				the board and graveyards Player deck contains animal and power cards The board divided into
				5 elements: 6 slots, animal graveyard, power graveyard, element slot and the main deck The 6
				slots: each player has 3 where he can place his animals Animal graveyard contains the
				animals that are killed Power graveyard contains the power card that are used Element slot
				indicate which element is activated, at the start of the game, it is neutral The main deck
				contains power cards, each round the player to play get one power card Each player has 9HP,
				the game ends when one of the players reaches 0 hp Each round, the player gets a power card
				from the main deck, he can play 2 cards except in first round, he can play 3 To change the
				element, you must sacrifice 2 hp You can attack the opponent’s placed animals or the
				opponent directly if he doesn't have any animal to defend
			</p>
		</div>
	);
}
export default WalkThrough;
