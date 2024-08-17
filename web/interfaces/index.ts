export interface IWord {
  word: string,
  revealed: string,
}
export interface IState {
  layout: IWord[],
  clues: number,
  choosing: boolean,  
}
