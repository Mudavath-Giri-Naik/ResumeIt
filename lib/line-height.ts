import { Extension } from "@tiptap/core";

export interface LineHeightOptions {
  types: string[];
  defaultLineHeight: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType;
    };
  }
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      defaultLineHeight: "1.5",
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const { tr } = state;
          let hasChanges = false;

          // Process all nodes in the selection
          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const attrs = { ...node.attrs };
              attrs.lineHeight = lineHeight || null;
              tr.setNodeMarkup(pos, undefined, attrs);
              hasChanges = true;
            }
          });

          // If nothing was found in selection, update the current paragraph
          if (!hasChanges) {
            const $from = selection.$from;
            for (let depth = $from.depth; depth > 0; depth--) {
              const node = $from.node(depth);
              if (this.options.types.includes(node.type.name)) {
                const pos = $from.before(depth);
                const attrs = { ...node.attrs };
                attrs.lineHeight = lineHeight || null;
                tr.setNodeMarkup(pos, undefined, attrs);
                hasChanges = true;
                break;
              }
            }
          }

          if (hasChanges && dispatch) {
            dispatch(tr);
            return true;
          }
          return false;
        },
    };
  },
});
