import {centerStyle, flexColumnStyle, flexRowStyle, greyBackground, violet} from "../../styles/Style";
import {AnimalBoardSlot, PowerBoardSlot} from "../../components/Slots";
import {ANIMALS_CARDS, ANIMALS_CARDS_IDS, POWER_CARDS, POWERS_CARDS_IDS} from "../../utils/data";


function Cards() {
    return (
        <div
            style={{...flexColumnStyle, ...centerStyle, width: '100%', backgroundColor: greyBackground, color: violet}}>
            <h1 style={{margin:'20px'}}>Animal Cards</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', ...centerStyle}}>
                {ANIMALS_CARDS.map((animal,index) => (
                    <div style={{padding: "10px"}}>
                        <AnimalBoardSlot key={index} cardId={animal.id} select={() => {
                        }}/>
                        <h6>{animal.name} ({animal.clan})</h6>
                    </div>
                ))}
            </div>
            <h1 style={{margin:'20px'}}>Power Cards</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', ...centerStyle}}>
                    {POWER_CARDS.map((card,index) => (
                    <div style={{padding: "10px"}}>
                        <PowerBoardSlot key={index} cardId={"one-"+card.id} select={() => {
                        }}/>
                    </div>
                ))}

            </div>
        </div>

    )
}

export default Cards;
