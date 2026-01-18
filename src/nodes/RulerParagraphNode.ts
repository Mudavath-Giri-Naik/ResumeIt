
import { EditorConfig, LexicalNode, NodeKey, ParagraphNode, RangeSelection, SerializedParagraphNode, Spread } from 'lexical';

export type SerializedRulerParagraphNode = Spread<
    {
        paddingLeft?: number;
        textIndent?: number;
        paddingRight?: number;
    },
    SerializedParagraphNode
>;


export class RulerParagraphNode extends ParagraphNode {
    __paddingLeft: number;
    __textIndent: number;
    __paddingRight: number;

    static getType(): string {
        return 'ruler-paragraph';
    }

    static clone(node: RulerParagraphNode): RulerParagraphNode {
        return new RulerParagraphNode(
            node.__paddingLeft,
            node.__textIndent,
            node.__paddingRight,
            node.__key
        );
    }

    constructor(paddingLeft: number = 0, textIndent: number = 0, paddingRight: number = 0, key?: NodeKey) {
        super(key);
        this.__paddingLeft = paddingLeft;
        this.__textIndent = textIndent;
        this.__paddingRight = paddingRight;
    }

    // View
    createDOM(config: EditorConfig): HTMLElement {
        const dom = super.createDOM(config);
        this.updateDOMStyles(dom);
        return dom;
    }

    updateDOM(prevNode: RulerParagraphNode, dom: HTMLElement, config: EditorConfig): boolean {
        const isUpdated = super.updateDOM(prevNode, dom, config);
        if (
            prevNode.__paddingLeft !== this.__paddingLeft ||
            prevNode.__textIndent !== this.__textIndent ||
            prevNode.__paddingRight !== this.__paddingRight
        ) {
            this.updateDOMStyles(dom);
            return false;
        }
        return isUpdated;
    }

    updateDOMStyles(dom: HTMLElement) {
        dom.style.paddingLeft = this.__paddingLeft ? `${this.__paddingLeft}px` : '';
        dom.style.textIndent = this.__textIndent ? `${this.__textIndent}px` : '';
        dom.style.paddingRight = this.__paddingRight ? `${this.__paddingRight}px` : '';
    }

    static importJSON(serializedNode: SerializedRulerParagraphNode): RulerParagraphNode {
        const node = $createRulerParagraphNode(
            serializedNode.paddingLeft,
            serializedNode.textIndent,
            serializedNode.paddingRight
        );
        node.setFormat(serializedNode.format as any);
        node.setIndent(serializedNode.indent);
        node.setDirection(serializedNode.direction);
        return node;
    }

    exportJSON(): SerializedRulerParagraphNode {
        return {
            ...super.exportJSON(),
            paddingLeft: this.__paddingLeft,
            textIndent: this.__textIndent,
            paddingRight: this.__paddingRight,
            type: 'ruler-paragraph',
        };
    }

    insertNewAfter(selection?: RangeSelection, restoreSelection = true): RulerParagraphNode {
        const newElement = $createRulerParagraphNode(
            this.__paddingLeft,
            this.__textIndent,
            this.__paddingRight
        );
        newElement.setDirection(this.getDirection());
        newElement.setFormat(this.getFormat());
        this.insertAfter(newElement, restoreSelection);
        return newElement;
    }

    // Setters
    setPaddingLeft(val: number): void {
        const self = this.getWritable();
        self.__paddingLeft = val;
    }

    setTextIndent(val: number): void {
        const self = this.getWritable();
        self.__textIndent = val;
    }

    setPaddingRight(val: number): void {
        const self = this.getWritable();
        self.__paddingRight = val;
    }

    // Getters
    getPaddingLeft(): number {
        return this.__paddingLeft;
    }

    getTextIndent(): number {
        return this.__textIndent;
    }

    getPaddingRight(): number {
        return this.__paddingRight;
    }
}

export function $createRulerParagraphNode(paddingLeft = 0, textIndent = 0, paddingRight = 0): RulerParagraphNode {
    return new RulerParagraphNode(paddingLeft, textIndent, paddingRight);
}

export function $isRulerParagraphNode(node: LexicalNode | null | undefined): node is RulerParagraphNode {
    return node instanceof RulerParagraphNode;
}
