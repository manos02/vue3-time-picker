type __VLS_Props = {
    items: Array<{
        key: string | number;
        value: any;
        text: string;
        disabled?: boolean;
    }>;
    activeIndex: number;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    "update:activeIndex": (index: number) => any;
    select: (v: any) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:activeIndex"?: ((index: number) => any) | undefined;
    onSelect?: ((v: any) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    menu: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
