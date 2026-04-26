import useTypedSequence from "./useTypedSequence";

export default function useKonami(onTrigger, options) {
  useTypedSequence(["w", "a", "l", "k", "i", "n", "g", "u", "y"], onTrigger, options);
  useTypedSequence(["ArrowUp","ArrowUp",
      "ArrowDown","ArrowDown",
      "ArrowLeft","ArrowRight",
      "ArrowLeft","ArrowRight",
      "b","a"], onTrigger, options);
}
