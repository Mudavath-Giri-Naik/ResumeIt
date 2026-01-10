import { Node, mergeAttributes } from "@tiptap/core";

export interface HorizontalRuleOptions {
  HTMLAttributes: Record<string, any>;
  thickness: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    horizontalRule: {
      /**
       * Insert a horizontal rule
       */
      setHorizontalRule: (options?: { thickness?: string }) => ReturnType;
    };
  }
}

export const HorizontalRule = Node.create<HorizontalRuleOptions>({
  name: "horizontalRule",

  addOptions() {
    return {
      HTMLAttributes: {},
      thickness: "1px",
    };
  },

  group: "block",

  parseHTML() {
    return [{ tag: "hr" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    // Get thickness from node attributes, HTMLAttributes, or default
    const thickness = (node?.attrs?.thickness || 
                      HTMLAttributes?.thickness || 
                      HTMLAttributes?.["data-thickness"] ||
                      this.options.thickness);
    
    // Create style string with full width and specified thickness
    const style = `border: none; border-top: ${thickness} solid #000; width: 100%; max-width: 100%; margin: 12px 0; display: block; box-sizing: border-box;`;
    
    return [
      "hr",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style,
        "data-thickness": thickness,
      }),
    ];
  },

  addCommands() {
    return {
      setHorizontalRule:
        (options = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              thickness: options.thickness || this.options.thickness,
            },
          });
        },
    };
  },

  addAttributes() {
    return {
      thickness: {
        default: "1px",
        parseHTML: (element) => {
          // Try to get from data attribute first
          const dataThickness = element.getAttribute("data-thickness");
          if (dataThickness) {
            return dataThickness;
          }
          
          // Try to parse from style attribute
          const style = element.getAttribute("style");
          if (style) {
            const match = style.match(/border-top:\s*(\d+px)/);
            if (match) {
              return match[1];
            }
          }
          
          // Fallback to thickness attribute or default
          return element.getAttribute("thickness") || "1px";
        },
        renderHTML: (attributes) => {
          if (!attributes.thickness) {
            return {};
          }
          // Store thickness in data attribute for easy parsing
          return {
            "data-thickness": attributes.thickness,
          };
        },
      },
    };
  },
});
