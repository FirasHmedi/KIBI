import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Card } from '../../utils/data';
import { getItems } from '../../utils/db';

interface Props {
  items: Card[];
}

export const Items = () => {
  const [items, setItems] = useState<Card[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function waitStories() {
      const _items = (await getItems()) ?? [];
      setItems(_items);
    }
    waitStories();
  }, []);

  return <div  ></div>;
};
