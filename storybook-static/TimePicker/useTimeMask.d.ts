import { Ref, ComputedRef } from 'vue';
import { InternalFormat } from './types';
export declare function useTimeMask(format: Ref<string> | ComputedRef<string>): {
    inputValue: Ref<string, string>;
    handleKeydown: (e: KeyboardEvent) => void;
    handleInput: (e: Event) => void;
    handlePaste: (e: ClipboardEvent) => void;
    setFromTime: (time: InternalFormat) => void;
    getParsedTime: () => InternalFormat | null;
    isComplete: ComputedRef<boolean>;
    totalDigits: ComputedRef<number>;
    displayPosToDigitIndex: (pos: number) => number;
    ampm: Ref<"PM" | "AM", "PM" | "AM">;
    ampmLowercase: ComputedRef<boolean>;
};
