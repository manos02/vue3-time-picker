import { InternalFormat } from './types';
type __VLS_Props = {
    open: boolean;
    initTime: InternalFormat;
    format: string;
    minTime?: InternalFormat | null;
    maxTime?: InternalFormat | null;
    disabledRanges?: Array<[InternalFormat, InternalFormat]>;
    isTimeDisabled?: (time: InternalFormat) => boolean;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    open: () => any;
    close: () => any;
    "update:initTime": (v: InternalFormat) => any;
    "update:open": (v: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onOpen?: (() => any) | undefined;
    onClose?: (() => any) | undefined;
    "onUpdate:initTime"?: ((v: InternalFormat) => any) | undefined;
    "onUpdate:open"?: ((v: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    root: HTMLDivElement;
}, any>;
export default _default;
