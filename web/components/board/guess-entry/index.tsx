import { ChangeEvent, Dispatch, ReactHTMLElement, SetStateAction, useEffect, useState } from 'react';
import styles from './styles.module.scss'
import React from 'react';
import { IState } from '@/interfaces';

export type GuessEntryProps = {
  revealed: string,
  initialDisabled: boolean,
  correctWord: string,
  state: IState,
  setState: Dispatch<SetStateAction<IState>>,
}

//note to self, if we want to fully lock in the user, we are 
//most likely going to have to use inputRef in order to ensure
//that the user can't select anything else...
export default function GuessEntry({revealed, initialDisabled, correctWord, state, setState}: GuessEntryProps) {
  const [input, setInput] = useState(revealed);
  const [disabled, setDisabled] = useState(initialDisabled);

  //there's gotta be a better work around for this lol...
  if (input === "" && input != revealed) {
    setInput(revealed);
  }
  // const inputRef = React.useRef<HTMLInputElement>();

  // const handleBlur = () => {
  //   inputRef?.current?.focus();
  // };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      const isCorrect = input === correctWord; 

      if (isCorrect) {
        //change state to update and lock the word guessed
        const intermediateLayout = state.layout.map(({word, revealed}) => {
          if (word === correctWord) {
              return {word: word, revealed: word};
          } 
          
          return {word: word, revealed: revealed};   
        });

        //release next clue...
        let foundFirst = false;
        const newLayout = intermediateLayout.map(({word, revealed}) => {
          if (!foundFirst && word !== revealed) {
            const remainder = word.replace(revealed, "");    
            foundFirst = true;
            return {word: word, revealed: "" + revealed + remainder[0]};
          } 

          return {word: word, revealed: revealed};
        });

        const newState = {
          ...state,
          layout: newLayout,
          choosing: true,
        }

        setDisabled(true);
        setState(newState);
      } else {
        //change layout by one character
        //update the count in state,
        //we should be sure to change the style for a quick sec??

        //we know that input is definitely NOT correct...
        //release clue on where you are...
        //we know that revealed is always a subset of correct word
        const newCharacter = correctWord.replace(revealed, "")[0];

        const newLayout = state.layout.map(({word, revealed}) => {
          if (word === correctWord) {
            return {word: word, revealed: revealed + newCharacter}
          }

          return {word: word, revealed: revealed};
        });

        const newState = {
          ...state,
          layout: newLayout,
          choosing: true,
          clues: state.clues + 1,
        };

        setState(newState);
        setInput(revealed + newCharacter);
      }
    }
  }

  const handleSelect = () => {
    setState({...state, choosing: false});
  }

  const handleBlur = () => {
    setInput(revealed);
    setState({...state, choosing: true});
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length >= revealed.length) {
      setInput(event.target.value);
    }     
  }

  return (
    <>
      <input 
      className={!disabled ? styles.input : styles.startAndEnd}
      disabled={disabled}
      type='text' 
      placeholder={input}
      value={input} 
      onChange={handleChange}  
      onClick={handleSelect}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      // ref={inputRef as React.MutableRefObject<HTMLInputElement>}
      />
    </>
  );
}