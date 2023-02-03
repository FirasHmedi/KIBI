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
} from '../../utils/data';
import { addStory } from '../../utils/db';
import { isNotEmpty } from '../../utils/helpers';
import SaveIcon from '@mui/icons-material/Save';

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const AddStoryForm = ({ open, handleClose }: Props) => {
  const [content, setContent] = useState('');
  const [selectedEnvTag, setSelectedEnvTag] = useState(TAGS_ENV[0]);

  const selectEnvTag = (name: string) =>
    name !== selectedEnvTag ? setSelectedEnvTag(name) : undefined;

  const isSaveEnabled = () =>
    isNotEmpty(content, MIN_LENGTH_CONTENT) && isNotEmpty(selectedEnvTag);

  const submitStory = async () => {
    try {
      const story = {
        summary: content,
        content: content,
        tags: [selectedEnvTag],
        wrName: 'ZERO-ONE',
        wrId: Math.floor(Math.random() * 10000000).toString(),
      };
      await addStory(story);
      handleClose();
    } catch (e) {}
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
          outline: 'none',
          backgroundColor: primary,
          color: softGrey,
          borderRadius: 5,
          display: 'flex',
          width: '50vw',
          height: '70vh',
          flexDirection: 'column',
          position: 'absolute',
          top: '13vh',
          left: '23vw',
          overflowY: 'auto',
          paddingLeft: '1.5vw',
          paddingRight: '1.5vw',
          paddingTop: '2vh',
          paddingBottom: '2vh',
        }}>
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
              'Start it ...'
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
