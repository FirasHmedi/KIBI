import { Box, Modal, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Tag } from '../../components/Tag';
import {
  black,
  centerStyle,
  kaki,
  primary,
  softGrey,
  softKaki,
} from '../../styles/Style';
import { MAX_LENGTH_CONTENT, MIN_LENGTH_CONTENT, TAGS } from '../../utils/data';
import { addStory } from '../../utils/db';
import { isNotEmpty } from '../../utils/helpers';
import SaveIcon from '@mui/icons-material/Save';

interface Props {
  open: boolean;
  handleClose: () => void;
  openSnackbar: () => void;
}

export const AddStoryForm = ({ open, handleClose, openSnackbar }: Props) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(
    TAGS.map((tag) => ({ name: tag, selected: false }))
  );

  const getTagColor = (selected: boolean) => (selected ? kaki : softKaki);
  const toggleTag = (name: string) =>
    setTags((tags) =>
      tags.map((tag) => {
        return tag.name === name ? { ...tag, selected: !tag.selected } : tag;
      })
    );

  const isSaveEnabled = () =>
    isNotEmpty(tags.filter((tag) => tag.selected)) &&
    isNotEmpty(content, MIN_LENGTH_CONTENT);

  const submitStory = async () => {
    try {
      const story = {
        summary: content,
        content: content,
        tags: tags.filter((tag) => tag.selected).map((tag) => tag.name),
        wrName: 'ZERO-ONE',
        wrId: Math.floor(Math.random() * 10000000).toString(),
      };
      await addStory(story);
      handleClose();
      //openSnackbar();
    } catch (e) {}
  };
  console.log('open ', open);
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
          outline: 'none',
          backgroundColor: primary,
          color: softGrey,
          borderRadius: 5,
          display: 'flex',
          width: '76vw',
          height: '86vh',
          flexDirection: 'column',
          position: 'absolute',
          top: '5vh',
          left: '10vw',
          overflowY: 'auto',
          paddingLeft: '2vw',
          paddingRight: '2vw',
          paddingTop: '2vh',
          paddingBottom: '2vh',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'inline-block',
            gap: 10,
          }}
        >
          {tags.map((tag: any) => (
            <button
              style={{ marginRight: 10 }}
              key={tag.name}
              onClick={() => toggleTag(tag.name)}
            >
              <Tag tag={tag.name} bgColor={getTagColor(tag.selected)} />
            </button>
          ))}
        </div>
        <Box
          style={{
            flex: 5,
            borderColor: kaki,
            display: 'flex',
            width: '100%',
          }}
          mt={3}
          mb={3}
        >
          <textarea
            value={content}
            onChange={(event: any) => setContent(event.target.value)}
            style={{
              flex: 1,
              outline: 'none',
              fontWeight: 400,
              lineHeight: 1.8,
              fontSize: '2.5vh',
              fontFamily: 'Segoe UI',
              color: softGrey,
              backgroundColor: 'transparent',
              resize: 'none',
              overflow: 'hidden',
              overflowY: 'auto',
              borderWidth: 0,
            }}
            placeholder={
              'Once upon a time ? no just kidding, write whatever you like'
            }
          />
        </Box>
        <div
          style={{
            ...centerStyle,
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: kaki, fontWeight: 'bold' }}>
            {MAX_LENGTH_CONTENT - content.length}
          </span>
          <SaveButton isEnabled={isSaveEnabled()} submitStory={submitStory} />
        </div>
      </Box>
    </Modal>
  );
};

const SaveButton = ({
  isEnabled,
  submitStory,
}: {
  isEnabled: boolean;
  submitStory: () => void;
}) => (
  <button
    style={{
      backgroundColor: isEnabled ? kaki : softKaki,
      color: black,
      borderRadius: 5,
      width: '3.8vw',
      padding: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
    }}
    onClick={() => submitStory()}
    disabled={!isEnabled}
  >
    <SaveIcon />
  </button>
);
