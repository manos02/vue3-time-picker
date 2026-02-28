import { InternalFormat } from './TimePicker/types';
/** Check if format uses 12-hour clock (h or hh) */
export declare function is12h(fmt: string): boolean;
export declare function isPm(fmt: string): boolean;
export declare function hasK(fmt: string): boolean;
/** Parse time string into { h, m, s } numbers */
export declare function parseFromModel(str: string | null | undefined, fmt: string): {
    h: number;
    m: number;
    s: number;
};
export declare function to12(h24: number): number;
export declare function to24(h12: number, isPM: boolean): number;
export declare function hasSeconds(fmt: string): boolean;
export declare function formatTime(fmt: string, time: InternalFormat): string;
export declare function compareTimes(a: InternalFormat, b: InternalFormat): number;
export declare function clampTimeToBounds(time: InternalFormat, minTime?: InternalFormat | null, maxTime?: InternalFormat | null): InternalFormat;
export declare function isTimeWithinBounds(time: InternalFormat, minTime?: InternalFormat | null, maxTime?: InternalFormat | null): boolean;
export declare function isTimeInRanges(time: InternalFormat, ranges: Array<[InternalFormat, InternalFormat]>): boolean;
