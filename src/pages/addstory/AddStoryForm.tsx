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
import {
  MAX_LENGTH_CONTENT,
  MIN_LENGTH_CONTENT,
  TAGS_ENV,
  TAGS_STATE,
} from '../../utils/data';
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
  const [selectedStateTag, setSelectedStateTag] = useState(TAGS_STATE[0]);
  const [selectedEnvTag, setSelectedEnvTag] = useState(TAGS_ENV[0]);

  const selectStateTag = (name: string) =>
    name !== selectedStateTag ? setSelectedStateTag(name) : undefined;
  const selectEnvTag = (name: string) =>
    name !== selectedEnvTag ? setSelectedEnvTag(name) : undefined;

  const isSaveEnabled = () =>
    isNotEmpty(content, MIN_LENGTH_CONTENT) &&
    isNotEmpty(selectedStateTag) &&
    isNotEmpty(selectedEnvTag);

  const submitStory = async () => {
    try {
      const story = {
        summary: content,
        content: content,
        tags: [selectedStateTag, selectedEnvTag],
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
          width: '56vw',
          height: '80vh',
          flexDirection: 'column',
          position: 'absolute',
          top: '8vh',
          left: '20vw',
          overflowY: 'auto',
          paddingLeft: '1.5vw',
          paddingRight: '1.5vw',
          paddingTop: '2vh',
          paddingBottom: '2vh',
        }}>
        <div
          style={{
            width: '100%',
            gap: 10,
            paddingBottom: 10,
            paddingTop: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            height: '7vh',
          }}>
          <div>
            {TAGS_STATE.map(tag => (
              <button
                style={{ marginRight: 10 }}
                key={tag}
                onClick={() => selectStateTag(tag)}>
                <Tag
                  tag={tag}
                  bgColor={tag === selectedStateTag ? kaki : softKaki}
                />
              </button>
            ))}
          </div>
          <div>
            {TAGS_ENV.map(tag => (
              <button
                style={{ marginRight: 10 }}
                key={tag}
                onClick={() => selectEnvTag(tag)}>
                <Tag
                  tag={tag}
                  bgColor={tag === selectedEnvTag ? kaki : softKaki}
                />
              </button>
            ))}
          </div>
        </div>
        <Box
          style={{
            flex: 5,
            borderColor: kaki,
            display: 'flex',
            width: '100%',
          }}
          mt={2}
          mb={2}>
          <textarea
            value={content}
            onChange={(event: any) => setContent(event.target.value)}
            style={{
              flex: 1,
              outline: 'none',
              fontWeight: 400,
              lineHeight: 1.8,
              fontSize: '1rem',
              fontFamily: 'Segoe UI',
              color: softGrey,
              backgroundColor: 'transparent',
              resize: 'none',
              overflow: 'hidden',
              overflowY: 'auto',
              borderWidth: 0,
            }}
            placeholder={
              'Once upon a time ? no just kidding, write whatever you like...'
            }
          />
        </Box>
        <div
          style={{
            ...centerStyle,
            justifyContent: 'space-between',
          }}>
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
      width: '4.8vw',
      padding: 4,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
    }}
    onClick={() => submitStory()}
    disabled={!isEnabled}>
    <SaveIcon />
  </button>
);
