import React, { useState } from "react";
import { Stories } from "./Stories";
import { AddStory } from "../addstory/AddStory";
import { AddStoryForm } from "../addstory/AddStoryForm";

function Home() {
	const [open, setOpen] = useState(false);
	const openForm = () => setOpen(true);
	const closeForm = () => setOpen(false);
	return (
		<>
			<div onClick={openForm}>
				<AddStory />
			</div>
			<Stories />
			<AddStoryForm open={open} handleClose={closeForm} />
		</>
	);
}

export default Home;
