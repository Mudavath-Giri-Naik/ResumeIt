import { Extension } from "@tiptap/core";

export interface ParagraphSpacingOptions {
  types: string[];
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    paragraphSpacing: {
      setParagraphSpacing: (options: { marginTop?: string; marginBottom?: string }) => ReturnType;
      removeParagraphSpacing: () => ReturnType;
    };
  }
}

export const ParagraphSpacing = Extension.create<ParagraphSpacingOptions>({
  name: "paragraphSpacing",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          marginTop: {
            default: null,
            parseHTML: (element) => element.style.marginTop || null,
            renderHTML: (attributes) => {
              if (!attributes.marginTop) return {};
              return { style: `margin-top: ${attributes.marginTop}` };
            },
          },
          marginBottom: {
            default: null,
            parseHTML: (element) => element.style.marginBottom || null,
            renderHTML: (attributes) => {
              if (!attributes.marginBottom) return {};
              return { style: `margin-bottom: ${attributes.marginBottom}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setParagraphSpacing:
        (options: { marginTop?: string; marginBottom?: string }) =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const { tr } = state;
          let hasChanges = false;

          // Process all nodes in the selection
          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const attrs = { ...node.attrs };
              let changed = false;

              if (options.marginTop !== undefined) {
                attrs.marginTop = options.marginTop || null;
                changed = true;
              }
              if (options.marginBottom !== undefined) {
                attrs.marginBottom = options.marginBottom || null;
                changed = true;
              }

              if (changed) {
                tr.setNodeMarkup(pos, undefined, attrs);
                hasChanges = true;
              }
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
                let changed = false;

                if (options.marginTop !== undefined) {
                  attrs.marginTop = options.marginTop || null;
                  changed = true;
                }
                if (options.marginBottom !== undefined) {
                  attrs.marginBottom = options.marginBottom || null;
                  changed = true;
                }

                if (changed) {
                  tr.setNodeMarkup(pos, undefined, attrs);
                  hasChanges = true;
                }
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
      removeParagraphSpacing:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const { tr } = state;
          let hasChanges = false;

          state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              const attrs = { ...node.attrs };
              if (attrs.marginTop || attrs.marginBottom) {
                attrs.marginTop = null;
                attrs.marginBottom = null;
                tr.setNodeMarkup(pos, undefined, attrs);
                hasChanges = true;
              }
            }
          });

          if (!hasChanges) {
            const $from = selection.$from;
            for (let depth = $from.depth; depth > 0; depth--) {
              const node = $from.node(depth);
              if (this.options.types.includes(node.type.name)) {
                const pos = $from.before(depth);
                const attrs = { ...node.attrs };
                if (attrs.marginTop || attrs.marginBottom) {
                  attrs.marginTop = null;
                  attrs.marginBottom = null;
                  tr.setNodeMarkup(pos, undefined, attrs);
                  hasChanges = true;
                }
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
