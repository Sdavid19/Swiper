 export const shortenString = (word: string, letterNumberToShow: number) => {
    if (word.length > letterNumberToShow) {
      return word.slice(0, letterNumberToShow) + "...";
    } else {
      return word;
    }
  }