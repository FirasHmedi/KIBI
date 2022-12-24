import React from "react";
import { Stories } from "./Stories";
import { AddStory } from "../addstory/AddStory";
import { stories } from "../../utils/utils";

function Home() {
	return (
		<>
			<AddStory />
			<Stories stories={stories} />
		</>
	);
}

export default Home;
