import { defineQuestions } from "../author"
import { q } from "../compact"

const C = "https://developer.mozilla.org/en-US/docs/Web/CSS"
const P = `${C}/Reference/Properties`
const V = `${C}/Reference/Values`
const G = `${C}/Guides`

export default defineQuestions("css", "fresher", [
  q({
    slug: "css-box-model",
    topic: "Box model",
    d: "easy",
    title: "What is the CSS box model?",
    kw: ["box model", "content", "padding", "border", "margin"],
    intent:
      "A core check that you can describe how every element's size and spacing are made up.",
    short:
      "Every element is a rectangular box made of four layers, from the inside out: the content, the padding around the content, the border around the padding, and the margin outside the border. Width and height normally set the content area, so padding and border are added to the total space the box takes up. Margin is the space between this box and its neighbours.",
    detail: [
      "Padding is inside the border and shows the element's background; margin is outside and is always transparent.",
      "Browser developer tools draw the box model for the selected element, which is the quickest way to debug spacing.",
      "How width is calculated depends on `box-sizing`.",
    ],
    ex: "A button with `padding: 12px 20px` and a 1px border is larger than its text. The extra space is padding plus border, and a margin keeps it away from the next button.",
    code: [
      [
        "Four layers on one element",
        "css",
        `.card {\n  width: 200px;\n  padding: 16px;\n  border: 2px solid #333;\n  margin: 24px;\n}`,
        [
          "The content is 200px wide by default.",
          "Padding and border add to the box size.",
          "Margin adds space outside the border.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting that padding and border are added to the width.",
      "Using margin when the space should be inside the box (padding).",
    ],
    follow: ["How does box-sizing change this?"],
    points: [
      "Content, padding, border, margin",
      "Padding is inside the border",
      "Margin is outside and transparent",
      "Dev tools show the box",
    ],
    notes: ["Content > padding > border > margin."],
    src: [
      [
        "MDN: The box model",
        "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model",
      ],
    ],
  }),
  q({
    slug: "box-sizing-border-box",
    topic: "Box model",
    d: "easy",
    title: "What does box-sizing: border-box do?",
    kw: ["box-sizing", "border-box", "content-box", "width", "layout"],
    intent:
      "Checks you know why most projects set border-box and how width is calculated.",
    short:
      "`box-sizing` controls what `width` and `height` mean. The default, `content-box`, sets only the content area, so padding and border make the element bigger than its width. With `border-box`, width and height include the content, padding and border, so an element with `width: 200px` stays 200px wide however much padding you add. Margin is never included in either mode.",
    detail: [
      "`border-box` makes sizing in percentage grids and card layouts far easier to predict.",
      "Many projects apply it to everything with a universal selector or a reset.",
      "It can be changed per element when needed.",
    ],
    ex: "Two cards each `width: 50%` with padding overflow their row under `content-box`, but fit side by side with `border-box`.",
    code: [
      [
        "A common reset",
        "css",
        `*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}`,
        [
          "The rule applies to all elements and the generated before/after boxes.",
          "Width now includes padding and border.",
        ],
      ],
    ],
    mistakes: [
      "Expecting margin to be included in border-box width.",
      "Mixing both modes and getting inconsistent sizes.",
    ],
    follow: ["Is margin inside the width in border-box?"],
    points: [
      "Default is content-box",
      "border-box includes padding and border",
      "Margin is never included",
      "Often set globally",
    ],
    notes: ["border-box = width is the whole visible box."],
    src: [["MDN: box-sizing", `${P}/box-sizing`]],
  }),
  q({
    slug: "margin-vs-padding",
    topic: "Box model",
    d: "easy",
    title: "What is the difference between margin and padding?",
    kw: ["margin", "padding", "spacing", "background", "shorthand"],
    intent:
      "Checks you pick the right spacing property and know the shorthand.",
    short:
      "Padding is the space between an element's content and its border, and it sits inside the element, so the element's background colour fills it. Margin is the space outside the border that separates the element from others, and it is transparent. Both accept one to four values in the shorthand, in the order top, right, bottom, left, and margin can be negative or `auto` while padding cannot be negative.",
    detail: [
      "`margin: 0 auto` centres a block element with a set width horizontally.",
      "With two values the first is vertical and the second horizontal: `padding: 8px 16px`.",
      "Click targets grow with padding but not with margin.",
    ],
    ex: "A nav link gets `padding` so the whole box is clickable and shows the hover background, while `margin` keeps links apart.",
    mistakes: [
      "Using margin to enlarge a clickable area.",
      "Trying to use a negative padding.",
    ],
    follow: ["What does margin: 0 auto do?"],
    points: [
      "Padding inside, margin outside",
      "Background covers padding, not margin",
      "Shorthand: top right bottom left",
      "Margin may be negative or auto",
    ],
    notes: ["Padding inside the border, margin outside."],
    src: [
      ["MDN: margin", `${P}/margin`],
      ["MDN: padding", `${P}/padding`],
    ],
  }),
  q({
    slug: "margin-collapsing",
    topic: "Box model",
    d: "medium",
    title: "What is margin collapsing?",
    kw: [
      "margin collapse",
      "vertical margins",
      "block elements",
      "siblings",
      "bfc",
    ],
    intent:
      "Checks you understand a classic CSS surprise with vertical spacing.",
    short:
      "Margin collapsing happens when the top and bottom margins of block elements meet, such as adjacent siblings or a parent and its first or last child. Instead of adding up, they combine into one margin equal to the largest of them. Only vertical margins collapse; horizontal margins never do. Margins of flex and grid items also do not collapse.",
    detail: [
      "If one paragraph has `margin-bottom: 20px` and the next `margin-top: 30px`, the gap is 30px, not 50px.",
      "Padding, a border, or making the parent a flex or grid container stops a parent and child margin from collapsing.",
      "An empty block's own top and bottom margins can collapse together.",
    ],
    ex: "A heading's top margin seems to push the whole section down instead of moving inside it, because it collapsed with the section's own margin. Adding `padding-top` to the section stops that.",
    mistakes: [
      "Adding margins and expecting them to sum.",
      "Not realising a child margin escaped its parent.",
    ],
    follow: ["How can you stop a parent and child margin collapsing?"],
    points: [
      "Only vertical margins",
      "Result is the largest, not the sum",
      "Does not happen in flex or grid items",
      "Padding or border prevents parent-child collapse",
    ],
    notes: ["Collapsed gap = max of the margins."],
    src: [
      ["MDN: Mastering margin collapsing", `${G}/Box_model/Margin_collapsing`],
    ],
  }),
  q({
    slug: "display-block-inline",
    topic: "Box model",
    d: "easy",
    title: "What is the difference between block, inline and inline-block?",
    kw: ["display", "block", "inline", "inline-block", "flow layout"],
    intent: "Checks you know how the display value changes sizing and flow.",
    short:
      "A `block` element starts on a new line and stretches to fill the available width, and it respects width, height, margin and padding on all sides. An `inline` element flows within a line of text, ignores width and height, and its vertical margins do not push other lines apart. `inline-block` flows like inline but lets you set width, height and vertical spacing like a block. `display: none` removes the element from the layout.",
    detail: [
      "`div` and `p` are block by default; `span` and `a` are inline.",
      "`display: flex` and `display: grid` create modern layout containers.",
      "`visibility: hidden` hides an element but still reserves its space, unlike `display: none`.",
    ],
    ex: "Making navigation `a` elements `inline-block` with padding lets each link have a proper tappable box while staying in one row.",
    mistakes: [
      "Setting width on an inline element and seeing no change.",
      "Confusing display none with visibility hidden.",
    ],
    follow: [
      "What is the difference between display none and visibility hidden?",
    ],
    points: [
      "Block: new line, full width",
      "Inline: in the text flow, no width or height",
      "inline-block: inline flow with box sizing",
      "none removes it from layout",
    ],
    notes: ["Block breaks the line; inline does not."],
    src: [
      ["MDN: display", `${P}/display`],
      ["MDN: visibility", `${P}/visibility`],
    ],
  }),
  q({
    slug: "position-property",
    topic: "Box model",
    d: "medium",
    title: "How do the CSS position values differ?",
    kw: ["position", "relative", "absolute", "fixed", "sticky"],
    intent: "Checks you can choose between the five positioning schemes.",
    short:
      "`static` is the default normal flow. `relative` keeps the element in flow but lets you offset it from where it would be. `absolute` removes it from flow and positions it against its nearest positioned ancestor, so the parent usually gets `position: relative`. `fixed` positions it against the viewport so it stays on screen when scrolling. `sticky` acts like relative until a scroll threshold is reached, then sticks like fixed within its container.",
    detail: [
      "The offsets are `top`, `right`, `bottom` and `left`; they do nothing on a static element.",
      "An absolutely positioned element no longer takes up space, so siblings move into its place.",
      "A sticky element needs an offset such as `top: 0` and sticks only within its parent.",
    ],
    ex: "A badge on a product card is `position: absolute; top: 8px; right: 8px` inside a card that is `position: relative`.",
    code: [
      [
        "A corner badge",
        "css",
        `.card { position: relative; }\n.badge {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n}`,
        [
          "The card becomes the positioning reference.",
          "The badge is placed relative to the card, not the page.",
        ],
      ],
    ],
    mistakes: [
      "Using absolute without a positioned parent so it lands relative to the page.",
      "Expecting sticky to work without an offset value.",
    ],
    follow: ["What is the nearest positioned ancestor?"],
    points: [
      "static is default",
      "relative offsets but keeps its space",
      "absolute leaves the flow",
      "fixed uses the viewport, sticky switches on scroll",
    ],
    notes: ["Absolute needs a relative parent."],
    src: [["MDN: position", `${P}/position`]],
  }),
  q({
    slug: "z-index-stacking",
    topic: "Box model",
    d: "medium",
    title: "How does z-index work and what is a stacking context?",
    kw: ["z-index", "stacking context", "layering", "overlap", "opacity"],
    intent: "Checks you know why a high z-index sometimes does not win.",
    short:
      "`z-index` sets the order in which overlapping elements are painted; a higher value is drawn in front within the same stacking context. It applies to positioned elements and to flex and grid items. A stacking context is an isolated layer group: an element inside one can never be placed in front of something outside it, regardless of its z-index. Contexts are created by the root element, by positioned elements with a z-index value, and by properties such as `opacity` below 1 or `transform`.",
    detail: [
      "A child with `z-index: 9999` still sits below a sibling of its parent if the parent's context is lower.",
      "Keep a small scale of z-index values and document them instead of increasing numbers endlessly.",
      "Developer tools can show which element creates a stacking context.",
    ],
    ex: "A dropdown hidden behind a modal's backdrop is often caused by the dropdown being inside a parent that created a lower stacking context.",
    mistakes: [
      "Escalating z-index to huge numbers.",
      "Putting z-index on a static element and expecting an effect.",
    ],
    follow: ["What creates a new stacking context?"],
    points: [
      "Higher value paints in front",
      "Needs positioning or a flex/grid item",
      "Stacking contexts isolate children",
      "opacity and transform create one",
    ],
    notes: ["z-index only competes inside one stacking context."],
    src: [
      ["MDN: z-index", `${P}/z-index`],
      ["MDN: Stacking context", `${G}/Positioned_layout/Stacking_context`],
    ],
  }),
  q({
    slug: "flexbox-basics",
    topic: "Flexbox",
    d: "easy",
    title: "What is Flexbox and when do you use it?",
    kw: [
      "flexbox",
      "display flex",
      "main axis",
      "cross axis",
      "one-dimensional",
    ],
    intent: "Checks the basic model of flex layout.",
    short:
      "Flexbox is a one-dimensional layout model for arranging items in a row or a column inside a container. Setting `display: flex` on the container makes its children flex items, laid out along the main axis (a row by default) with the cross axis running perpendicular. It handles alignment, spacing and distributing free space, so it suits navigation bars, toolbars, card rows and centring.",
    detail: [
      "`flex-direction` switches the main axis between row and column.",
      "Items can grow, shrink and wrap to fit the container.",
      "For layouts in rows and columns at once, CSS Grid is the better fit.",
    ],
    ex: "A top bar uses flex with the logo on the left and the links on the right, vertically centred.",
    code: [
      [
        "A simple flex row",
        "css",
        `.bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}`,
        [
          "`display: flex` turns the children into flex items.",
          "`justify-content` spreads them along the main axis.",
          "`align-items` centres them on the cross axis.",
        ],
      ],
    ],
    mistakes: [
      "Applying flex properties to the item instead of the container.",
      "Using flex for a full two-dimensional page layout.",
    ],
    follow: ["What happens when you set flex-direction: column?"],
    points: [
      "One-dimensional layout",
      "Container and items",
      "Main and cross axis",
      "Row by default",
    ],
    notes: ["Flex: one axis at a time."],
    src: [
      [
        "MDN: Basic concepts of flexbox",
        `${G}/Flexible_box_layout/Basic_concepts`,
      ],
    ],
  }),
  q({
    slug: "justify-content-vs-align-items",
    topic: "Flexbox",
    d: "easy",
    title: "What is the difference between justify-content and align-items?",
    kw: [
      "justify-content",
      "align-items",
      "main axis",
      "cross axis",
      "centering",
    ],
    intent:
      "Checks you understand that alignment follows the axis, not horizontal or vertical.",
    short:
      "`justify-content` distributes items along the main axis, and `align-items` aligns them along the cross axis. With the default row direction the main axis is horizontal, so `justify-content` is horizontal and `align-items` is vertical. With `flex-direction: column` the axes swap. To centre something both ways, use both set to `center`.",
    detail: [
      "Common `justify-content` values are `flex-start`, `center`, `space-between` and `space-around`.",
      "`align-items` values include `stretch` (the default), `center`, `flex-start` and `flex-end`.",
      "`align-self` overrides alignment for a single item.",
    ],
    ex: "Centring a login card on the screen uses a full-height flex container with both properties set to `center`.",
    code: [
      [
        "Centre both ways",
        "css",
        `.page {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}`,
        [
          "`justify-content` centres on the main axis.",
          "`align-items` centres on the cross axis.",
        ],
      ],
    ],
    mistakes: [
      "Thinking justify is always horizontal.",
      "Forgetting the container needs a height for vertical centring.",
    ],
    follow: ["What does align-self do?"],
    points: [
      "justify-content: main axis",
      "align-items: cross axis",
      "Column direction swaps them",
      "Both center to centre",
    ],
    notes: ["Axes depend on flex-direction."],
    src: [
      ["MDN: justify-content", `${P}/justify-content`],
      ["MDN: align-items", `${P}/align-items`],
    ],
  }),
  q({
    slug: "flex-grow-shrink-basis",
    topic: "Flexbox",
    d: "medium",
    title:
      "What do flex-grow, flex-shrink and flex-basis mean, and what does flex: 1 do?",
    kw: ["flex", "flex-grow", "flex-shrink", "flex-basis", "flex 1"],
    intent: "Checks you understand how flex items share space.",
    short:
      "`flex-basis` is an item's starting size along the main axis, `flex-grow` says how much of the leftover space it takes, and `flex-shrink` says how much it gives up when space is short. The `flex` shorthand sets all three. `flex: 1` means grow 1, shrink 1 and a basis of 0, so items with it share the free space equally.",
    detail: [
      "An item with `flex-grow: 2` gets twice the share of free space of one with `1`.",
      "`flex: none` keeps an item at its own size; `flex: auto` grows and shrinks from its content size.",
      "`min-width: 0` is often needed when long content stops a flex item from shrinking.",
    ],
    ex: "In a layout with a fixed sidebar and a content area, the sidebar has `flex: 0 0 240px` and the main area `flex: 1` to fill the rest.",
    code: [
      [
        "Sidebar and content",
        "css",
        `.sidebar { flex: 0 0 240px; }\n.content { flex: 1; }`,
        [
          "The sidebar neither grows nor shrinks and starts at 240px.",
          "The content takes all remaining space.",
        ],
      ],
    ],
    mistakes: [
      "Using width and flex-basis together and expecting width to win.",
      "Forgetting the shorthand sets all three values.",
    ],
    follow: ["What does flex: 0 0 240px mean?"],
    points: [
      "basis = start size",
      "grow = share of extra space",
      "shrink = share of the shortage",
      "flex: 1 shares free space equally",
    ],
    notes: ["flex: 1 = 1 1 0."],
    src: [["MDN: flex", `${P}/flex`]],
  }),
  q({
    slug: "flex-wrap-and-gap",
    topic: "Flexbox",
    d: "easy",
    title: "How do flex-wrap and gap work?",
    kw: ["flex-wrap", "gap", "wrapping", "spacing", "flex container"],
    intent: "Checks you can build wrapping rows with consistent spacing.",
    short:
      "By default a flex container keeps all items on one line and may shrink them. `flex-wrap: wrap` lets items move onto new lines when they do not fit. The `gap` property adds space between items, and between rows and columns when they wrap, without adding space at the outer edges, so it replaces margins on each item.",
    detail: [
      "`gap` is a shorthand for `row-gap` and `column-gap`.",
      "`gap` also works in Grid layouts.",
      "With wrapping, `align-content` controls how the lines are spread across the cross axis.",
    ],
    ex: "A row of tag chips uses `flex-wrap: wrap; gap: 8px` so the chips flow onto a second line on a narrow screen with even spacing.",
    code: [
      [
        "Wrapping chips",
        "css",
        `.tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}`,
        [
          "Items wrap when the row is full.",
          "`gap` spaces them evenly in both directions.",
        ],
      ],
    ],
    mistakes: [
      "Leaving the default nowrap and squashing items.",
      "Using margins that leave extra space at the edges.",
    ],
    follow: ["Does gap work in grid?"],
    points: [
      "nowrap is the default",
      "wrap lets items flow onto new lines",
      "gap spaces between items only",
      "gap also works in grid",
    ],
    notes: ["Prefer gap over per-item margins."],
    src: [
      ["MDN: flex-wrap", `${P}/flex-wrap`],
      ["MDN: gap", `${P}/gap`],
    ],
  }),
  q({
    slug: "grid-basics",
    topic: "Grid",
    d: "easy",
    title: "What is CSS Grid and how is it different from Flexbox?",
    kw: [
      "css grid",
      "two-dimensional",
      "rows and columns",
      "grid container",
      "flexbox",
    ],
    intent: "Checks you can choose between the two layout systems.",
    short:
      "CSS Grid is a two-dimensional layout system that places items in rows and columns at the same time. You define tracks on the container with `grid-template-columns` and `grid-template-rows`, and children fill the cells. Flexbox lays items out along one axis and lets content decide sizes, while Grid starts from the layout you define. Use Grid for page layouts and galleries, and Flexbox for aligning items within a row or column; they combine well.",
    detail: [
      "`display: grid` creates the container.",
      "Items can span several columns or rows with `grid-column` and `grid-row`.",
      "Grid and Flexbox can be nested, for example a grid page with flex toolbars.",
    ],
    ex: "A dashboard uses Grid for the overall header, sidebar and content areas, and Flexbox inside the header to align the logo and buttons.",
    mistakes: [
      "Using Flexbox with fixed widths to fake a grid.",
      "Thinking you must pick only one of the two.",
    ],
    follow: ["How do you make an item span two columns?"],
    points: [
      "Two-dimensional",
      "Tracks defined on the container",
      "Items placed in cells",
      "Works alongside Flexbox",
    ],
    notes: ["Grid: rows and columns; Flex: one axis."],
    src: [
      ["MDN: Basic concepts of grid layout", `${G}/Grid_layout/Basic_concepts`],
    ],
  }),
  q({
    slug: "grid-template-columns-fr",
    topic: "Grid",
    d: "easy",
    title:
      "How do you define columns with grid-template-columns, fr and repeat()?",
    kw: ["grid-template-columns", "fr unit", "repeat", "tracks", "columns"],
    intent: "Checks you can write a basic grid definition.",
    short:
      "`grid-template-columns` lists the width of each column. The `fr` unit means a fraction of the free space in the grid container, so `1fr 2fr` gives the second column twice the share of the first. `repeat(3, 1fr)` is shorthand for three equal columns. You can mix units, for example `200px 1fr` for a fixed sidebar and a flexible content column.",
    detail: [
      "`gap` adds space between the tracks.",
      "Rows can be defined with `grid-template-rows`, or created automatically as needed.",
      "`fr` divides what is left after fixed-size tracks and gaps are taken.",
    ],
    ex: "A product list uses `grid-template-columns: repeat(3, 1fr); gap: 16px` for three equal cards per row.",
    code: [
      [
        "Three equal columns",
        "css",
        `.products {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}`,
        [
          "`repeat(3, 1fr)` is three equal flexible tracks.",
          "`gap` separates them.",
        ],
      ],
    ],
    mistakes: [
      "Using percentages and gaps together and overflowing the row.",
      "Forgetting display: grid.",
    ],
    follow: ["What does 1fr 2fr mean?"],
    points: [
      "Columns listed as tracks",
      "fr = share of free space",
      "repeat() avoids repetition",
      "Can mix px and fr",
    ],
    notes: ["repeat(3, 1fr) = three equal columns."],
    src: [
      ["MDN: grid-template-columns", `${P}/grid-template-columns`],
      ["MDN: repeat()", `${V}/repeat`],
    ],
  }),
  q({
    slug: "grid-template-areas",
    topic: "Grid",
    d: "medium",
    title: "How does grid-template-areas make layouts readable?",
    kw: ["grid-template-areas", "grid-area", "named areas", "page layout"],
    intent: "Checks you know the named-areas approach to page layout.",
    short:
      "`grid-template-areas` lets you draw the layout as strings of area names on the container, one string per row. Each child then picks its area with the `grid-area` property. Repeating a name across cells makes the area span them, and a dot leaves a cell empty. Changing the strings in a media query rearranges the whole layout without touching the HTML.",
    detail: [
      "Each named area must form a rectangle.",
      "It is combined with `grid-template-columns` and `grid-template-rows` for sizes.",
      "It reads like an ASCII sketch of the page.",
    ],
    ex: "A page layout is written as header across the top, sidebar and main below it, and footer across the bottom, and on mobile the same areas are stacked in one column.",
    code: [
      [
        "Named areas",
        "css",
        `.layout {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n}\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main { grid-area: main; }\n.footer { grid-area: footer; }`,
        [
          "Each string is a row of the grid.",
          "Repeating `header` makes it span both columns.",
          "Children are assigned with `grid-area`.",
        ],
      ],
    ],
    mistakes: [
      "Naming an area in a non-rectangular shape.",
      "Forgetting to set grid-area on the children.",
    ],
    follow: ["How would you change the layout for mobile?"],
    points: [
      "Rows drawn as strings",
      "grid-area assigns children",
      "Repeated names span cells",
      "Areas must be rectangles",
    ],
    notes: ["Draw the layout, then assign names."],
    src: [["MDN: grid-template-areas", `${P}/grid-template-areas`]],
  }),
  q({
    slug: "auto-fit-minmax-grid",
    topic: "Grid",
    d: "medium",
    title: "How do you build a responsive card grid without media queries?",
    kw: ["auto-fit", "auto-fill", "minmax", "responsive grid", "repeat"],
    intent: "Checks you know the common repeat(auto-fit, minmax()) pattern.",
    short:
      "Use `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`. `minmax(200px, 1fr)` makes each column at least 200px and at most an equal share of the space, and `auto-fit` creates as many such columns as fit in the container. As the container narrows, columns drop to the next row. The difference between the keywords is that `auto-fit` collapses empty tracks so items stretch, while `auto-fill` keeps the empty tracks.",
    detail: [
      "No media query is needed because the browser recalculates the column count.",
      "On very narrow screens a minimum larger than the container can overflow, so a smaller minimum or `min()` can help.",
      "It works well with `gap`.",
    ],
    ex: "A gallery page shows four cards per row on a desktop, two on a tablet and one on a phone, all from a single declaration.",
    code: [
      [
        "Responsive grid",
        "css",
        `.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}`,
        [
          "Each column is at least 200px.",
          "`auto-fit` packs as many columns as fit.",
          "Spare space is shared by `1fr`.",
        ],
      ],
    ],
    mistakes: [
      "Mixing up auto-fit and auto-fill.",
      "Using a minimum wider than small screens.",
    ],
    follow: ["What is the difference between auto-fit and auto-fill?"],
    points: [
      "repeat with auto-fit",
      "minmax sets min and max size",
      "No media query needed",
      "auto-fit collapses empty tracks",
    ],
    notes: ["repeat(auto-fit, minmax(200px, 1fr))."],
    src: [
      ["MDN: repeat()", `${V}/repeat`],
      ["MDN: minmax()", `${V}/minmax`],
    ],
  }),
  q({
    slug: "css-specificity",
    topic: "Specificity",
    d: "medium",
    title: "How is CSS specificity calculated?",
    kw: [
      "specificity",
      "selectors",
      "id selector",
      "class selector",
      "inline style",
    ],
    intent: "Checks you can predict which rule wins when selectors conflict.",
    short:
      "When several rules target the same property, the one with the more specific selector wins. Specificity ranks inline styles highest, then ID selectors, then classes, attributes and pseudo-classes, and lowest type selectors and pseudo-elements. It is compared category by category, so a single ID beats any number of classes. The universal selector and combinators add nothing. If specificity is equal, the rule that comes later wins.",
    detail: [
      "`#nav a` has one ID and one type; `.menu .link` has two classes, so the ID rule wins.",
      "Keep selectors flat and low in specificity so they are easy to override.",
      "Developer tools show which rule won and which declarations were overridden.",
    ],
    ex: "A button style is ignored because a more specific `.form button.primary` rule elsewhere sets the colour. The fix is to align selector specificity, not to add `!important`.",
    code: [
      [
        "Which colour wins?",
        "css",
        `#menu a { color: red; }      /* 1 ID, 1 type */\n.nav .link { color: blue; }   /* 2 classes */\n/* a.link inside #menu is red */`,
        [
          "The ID counts in a higher category than any number of classes.",
          "So the first rule wins even though the second has more parts.",
        ],
      ],
    ],
    mistakes: [
      "Counting classes as if ten of them beat an ID.",
      "Reaching for !important to fix specificity problems.",
    ],
    follow: ["What happens when specificity is equal?"],
    points: [
      "Inline > ID > class/attribute/pseudo-class > type",
      "Compared category by category",
      "Later wins on a tie",
      "Keep specificity low",
    ],
    notes: ["One ID outranks any number of classes."],
    src: [["MDN: Specificity", `${G}/Cascade/Specificity`]],
  }),
  q({
    slug: "cascade-and-important",
    topic: "Specificity",
    d: "medium",
    title: "What is the cascade, and why should !important be avoided?",
    kw: ["cascade", "important", "source order", "origin", "override"],
    intent:
      "Checks you know how conflicts are resolved and the cost of !important.",
    short:
      "The cascade is the algorithm that decides which declaration applies when several set the same property: it considers importance and origin first, then selector specificity, and finally source order, where the later rule wins. A declaration with `!important` beats normal declarations regardless of specificity. Overusing it makes styles hard to override later, because the only way to beat it is another `!important` with higher specificity.",
    detail: [
      "Author styles beat the browser's default styles.",
      "Among two `!important` declarations, specificity and order decide again.",
      "Use more specific selectors, source order or cascade layers instead.",
    ],
    ex: "A third-party widget's style is overridden by a single deliberate `!important` rule in a utility class, which is an accepted narrow use, while whole stylesheets full of it become unmaintainable.",
    mistakes: [
      "Sprinkling !important to win quick fixes.",
      "Ignoring source order between equal selectors.",
    ],
    follow: ["How else can you override a style?"],
    points: [
      "Importance and origin, then specificity, then order",
      "!important beats normal rules",
      "Hard to undo",
      "Prefer specificity and order",
    ],
    notes: ["!important is a last resort."],
    src: [
      ["MDN: Introduction to the CSS cascade", `${G}/Cascade/Introduction`],
      ["MDN: !important", `${V}/important`],
    ],
  }),
  q({
    slug: "css-inheritance",
    topic: "Specificity",
    d: "easy",
    title: "What is inheritance in CSS and which properties inherit?",
    kw: ["inheritance", "inherit", "initial", "unset", "font"],
    intent:
      "Checks you understand why some styles reach children and others do not.",
    short:
      "Inheritance means a child element takes the computed value of some properties from its parent if it has no value of its own. Text-related properties such as `color`, `font-family`, `font-size` and `line-height` inherit by default, while box properties such as `margin`, `padding`, `border` and `background` do not. The keywords `inherit`, `initial` and `unset` let you control this explicitly.",
    detail: [
      "Setting `font-family` on `body` styles nearly all text on the page.",
      "`inherit` forces a value from the parent, `initial` resets to the property's default.",
      "`unset` acts like `inherit` for inherited properties and like `initial` for others.",
    ],
    ex: "Setting `color` on a `div` colours its paragraphs, but a border set on the `div` does not appear around each paragraph.",
    mistakes: [
      "Expecting borders and margins to be inherited.",
      "Setting fonts on every element instead of on body.",
    ],
    follow: ["What does the unset keyword do?"],
    points: [
      "Text properties inherit",
      "Box properties do not",
      "inherit, initial, unset",
      "Set fonts once on body",
    ],
    notes: ["Typography inherits; the box does not."],
    src: [["MDN: Inheritance", `${G}/Cascade/Inheritance`]],
  }),
  q({
    slug: "is-and-where-selectors",
    topic: "Specificity",
    d: "hard",
    title: "How do :is() and :where() differ in specificity?",
    kw: [":is", ":where", "selector list", "zero specificity", ":not"],
    intent:
      "Checks deeper knowledge of how grouping selectors affect specificity.",
    short:
      "Both `:is()` and `:where()` take a list of selectors and match any of them, which shortens repeated selectors. The difference is specificity: `:is()` takes the specificity of its most specific argument, while `:where()` always contributes zero. That makes `:where()` ideal for base styles that are easy to override, and `:is()` suitable when you want the normal weight of the selectors inside it.",
    detail: [
      "`:is(h1, h2, h3) a` replaces three separate selectors.",
      "`:where(ul, ol) li` adds no specificity beyond the `li`.",
      "The negation pseudo-class `:not()` also takes the specificity of its argument.",
    ],
    ex: "A CSS reset uses `:where()` for its rules so any single class in the application styles overrides it without a fight.",
    code: [
      [
        "Specificity differs",
        "css",
        `:is(#main, .box) p { color: red; }   /* counts the ID */\n:where(#main, .box) p { color: red; }  /* counts only p */`,
        [
          "The first takes the specificity of `#main`.",
          "The second adds zero, so only `p` counts.",
        ],
      ],
    ],
    mistakes: [
      "Assuming the two are interchangeable.",
      "Using :is() in a reset and making it hard to override.",
    ],
    follow: ["Why is :where useful in a reset?"],
    points: [
      "Both match a selector list",
      ":is takes the highest argument's specificity",
      ":where is always zero",
      "Great for easy-to-override defaults",
    ],
    notes: ["is = weighted, where = zero."],
    src: [
      ["MDN: :is()", `${C}/Reference/Selectors/:is`],
      ["MDN: :where()", `${C}/Reference/Selectors/:where`],
    ],
  }),
  q({
    slug: "media-queries-mobile-first",
    topic: "Responsive design",
    d: "easy",
    title: "What are media queries and what does mobile-first mean?",
    kw: [
      "media query",
      "min-width",
      "mobile first",
      "breakpoint",
      "responsive",
    ],
    intent: "Checks you can apply styles by screen size in a sensible order.",
    short:
      'A media query applies CSS only when a condition is true, such as a minimum viewport width: `@media (min-width: 768px) { ... }`. Mobile-first means writing the base styles for small screens and then adding `min-width` queries that enhance the layout for larger screens. This keeps the default code simple, and phones load fewer overrides. Pages also need `<meta name="viewport" content="width=device-width, initial-scale=1">` for queries to behave properly on phones.',
    detail: [
      "Breakpoints should be chosen where the content starts to look wrong, not by specific devices.",
      "Media queries can also test things like `prefers-color-scheme` and `prefers-reduced-motion`.",
      "`max-width` queries work too, but a desktop-first approach needs more overrides.",
    ],
    ex: "A product list is one column by default and becomes three columns inside `@media (min-width: 768px)`.",
    code: [
      [
        "Mobile-first",
        "css",
        `.cards { display: grid; gap: 16px; }\n\n@media (min-width: 768px) {\n  .cards { grid-template-columns: repeat(3, 1fr); }\n}`,
        [
          "The base rule is the phone layout.",
          "The query adds columns from 768px upwards.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting the viewport meta tag.",
      "Choosing breakpoints from device names instead of content.",
    ],
    follow: ["Why add a viewport meta tag?"],
    points: [
      "@media applies conditionally",
      "Mobile-first uses min-width",
      "Breakpoints follow content",
      "Needs the viewport meta tag",
    ],
    notes: ["Small screen base, enhance upward."],
    src: [
      ["MDN: Using media queries", `${G}/Media_queries/Using`],
      ["MDN: @media", `${C}/Reference/At-rules/@media`],
    ],
  }),
  q({
    slug: "css-relative-units",
    topic: "Responsive design",
    d: "easy",
    title: "What is the difference between px, em, rem, % and vw?",
    kw: ["rem", "em", "px", "percentage", "viewport units"],
    intent: "Checks you know what each unit is relative to.",
    short:
      "`px` is a fixed CSS pixel. `em` is relative to the font size of the element (or, for the `font-size` property, its parent). `rem` is relative to the font size of the root element, so it stays predictable. A percentage is relative to something that depends on the property, often the parent's size. `vw` and `vh` are 1% of the viewport width and height. Using `rem` for text and spacing respects the user's own font-size setting.",
    detail: [
      "`em` values compound when nested, which can surprise you.",
      "`vh` on mobile browsers can behave oddly with the address bar, and newer units such as `dvh` exist for that.",
      "Border widths and thin lines are often left in `px`.",
    ],
    ex: "Setting `font-size: 1.25rem` for a heading scales with the user's browser font preference, while `width: 100%` makes a container fill its parent.",
    mistakes: [
      "Nesting em values and getting a runaway size.",
      "Using px for everything and ignoring user font settings.",
    ],
    follow: ["Why is rem more predictable than em?"],
    points: [
      "px fixed",
      "em relative to the element's font size",
      "rem relative to the root font size",
      "vw and vh relative to the viewport",
    ],
    notes: ["rem for type and spacing."],
    src: [["MDN: CSS length values", `${V}/length`]],
  }),
  q({
    slug: "clamp-fluid-sizing",
    topic: "Responsive design",
    d: "medium",
    title: "What does clamp() do and how can it make fluid sizes?",
    kw: ["clamp", "fluid typography", "min", "max", "viewport units"],
    intent: "Checks you know a modern way to size without many breakpoints.",
    short:
      "`clamp(min, preferred, max)` returns the preferred value but never smaller than the minimum or larger than the maximum. For example `font-size: clamp(1rem, 2.5vw, 2rem)` grows with the viewport width but stays between 1rem and 2rem. It provides fluid typography and spacing with a single declaration and without breakpoints.",
    detail: [
      "The three arguments can use different units.",
      "The related `min()` and `max()` functions pick the smaller or larger of their values.",
      "Mixing `rem` into the preferred value helps text still respond to user zoom settings.",
    ],
    ex: "A hero heading scales smoothly from phone to desktop with one `clamp()` instead of three font-size media queries.",
    code: [
      [
        "Fluid heading",
        "css",
        `h1 {\n  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);\n}`,
        [
          "The size follows the viewport in the middle value.",
          "It never goes below 1.5rem or above 3rem.",
        ],
      ],
    ],
    mistakes: [
      "Making the minimum larger than the maximum.",
      "Using only vw units so text ignores user zoom.",
    ],
    follow: ["How do min() and max() differ from clamp()?"],
    points: [
      "clamp(min, preferred, max)",
      "Fluid without breakpoints",
      "Bounds protect extremes",
      "Mix rem with vw",
    ],
    notes: ["Bounded fluid value."],
    src: [["MDN: clamp()", `${V}/clamp`]],
  }),
  q({
    slug: "css-custom-properties",
    topic: "Responsive design",
    d: "medium",
    title:
      "What are CSS custom properties (variables) and how do you use them?",
    kw: ["custom properties", "css variables", "var", ":root", "theming"],
    intent: "Checks you can reuse values and theme with native CSS.",
    short:
      "Custom properties are values you define with a name starting with two dashes, such as `--brand: #0a7`, and read with `var(--brand)`. They are usually declared on `:root` so the whole page can use them. They follow the cascade and inherit, so redefining one on a selector or an ancestor changes it for that subtree, which makes theming, such as dark mode, simple. `var()` takes an optional fallback and JavaScript can change them at runtime.",
    detail: [
      "Unlike preprocessor variables, they exist in the browser and can change after load.",
      "Use `var(--space, 16px)` to give a fallback if the property is not defined.",
      'A dark theme can redefine the same variables inside a `[data-theme="dark"]` selector.',
    ],
    ex: "A site defines colours once on `:root` and flips them for dark mode inside `@media (prefers-color-scheme: dark)`.",
    code: [
      [
        "Define and use",
        "css",
        `:root { --brand: #0a7; --space: 16px; }\n.button {\n  background: var(--brand);\n  padding: var(--space);\n}\n[data-theme="dark"] { --brand: #4cc; }`,
        [
          "Variables are declared once on `:root`.",
          "`var()` reads them.",
          "A selector can redefine them for a theme.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting the double dash prefix.",
      "Expecting a missing variable to silently work without a fallback.",
    ],
    follow: ["How would you switch to a dark theme?"],
    points: [
      "Defined as --name",
      "Read with var()",
      "Cascade and inherit",
      "Changeable at runtime",
    ],
    notes: ["Redefine on a subtree to theme it."],
    src: [
      [
        "MDN: Using CSS custom properties",
        `${G}/Cascading_variables/Using_custom_properties`,
      ],
      ["MDN: var()", `${V}/var`],
    ],
  }),
  q({
    slug: "container-queries",
    topic: "Responsive design",
    d: "hard",
    title:
      "What are container queries and how do they differ from media queries?",
    kw: [
      "container query",
      "container-type",
      "@container",
      "component",
      "responsive component",
    ],
    intent: "Checks awareness of component-level responsiveness.",
    short:
      "A media query responds to the viewport, while a container query responds to the size of an ancestor container. You mark an element with `container-type: inline-size`, then use `@container (min-width: 400px) { ... }` to style its descendants based on the container's width. This lets a component adapt to the space it is placed in, such as a sidebar or main column, no matter the screen size.",
    detail: [
      "Container queries make components reusable across layouts.",
      "The container itself cannot be styled by its own query; only its descendants can.",
      "They are supported by current major browsers, but check support if you must support older ones.",
    ],
    ex: "A card shows its image beside the text when its container is wide, and above the text when it sits in a narrow sidebar.",
    code: [
      [
        "A container query",
        "css",
        `.card-wrap { container-type: inline-size; }\n\n@container (min-width: 400px) {\n  .card { display: flex; }\n}`,
        [
          "`container-type` makes the wrapper a query container.",
          "The `@container` rule checks the wrapper's width, not the viewport.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting to declare container-type.",
      "Trying to style the container itself from its own query.",
    ],
    follow: ["When is a media query still better?"],
    points: [
      "Query the container, not the viewport",
      "Needs container-type",
      "Components adapt to their space",
      "Descendants only",
    ],
    notes: ["Media = viewport, container = ancestor."],
    src: [
      ["MDN: Container queries", `${G}/Containment/Container_queries`],
      ["MDN: container-type", `${P}/container-type`],
    ],
  }),
  q({
    slug: "object-fit-and-aspect-ratio",
    topic: "Responsive design",
    d: "easy",
    title:
      "How do you keep images from stretching with object-fit and aspect-ratio?",
    kw: ["object-fit", "aspect-ratio", "cover", "image sizing", "distortion"],
    intent: "Checks you can fit images into fixed boxes without distortion.",
    short:
      "`object-fit` controls how an image or video fills its box when the box has a different shape: `cover` fills the box and crops the extra, `contain` shows the whole image with empty space, and `fill` (the default) stretches it. `aspect-ratio` reserves a box with a set ratio such as `16 / 9`, so the layout does not jump while images load. Together they give consistent, undistorted thumbnails.",
    detail: [
      "`object-position` chooses which part is kept when cropping with `cover`.",
      "`max-width: 100%` with `height: auto` is the classic way to stop images overflowing their container.",
      "Setting width and height attributes on `img` also lets browsers reserve space before loading.",
    ],
    ex: "A grid of square profile photos uses `aspect-ratio: 1` with `object-fit: cover` so every face fills its tile without being squashed.",
    code: [
      [
        "Square thumbnails",
        "css",
        `.thumb {\n  width: 100%;\n  aspect-ratio: 1 / 1;\n  object-fit: cover;\n}`,
        [
          "`aspect-ratio` fixes the box shape.",
          "`object-fit: cover` fills it and crops overflow.",
        ],
      ],
    ],
    mistakes: [
      "Setting both width and height and distorting the image.",
      "Not reserving space and causing layout shift.",
    ],
    follow: ["What is the difference between cover and contain?"],
    points: [
      "cover crops, contain letterboxes",
      "fill is the default and stretches",
      "aspect-ratio reserves the shape",
      "Prevents layout jumps",
    ],
    notes: ["cover + aspect-ratio for tidy thumbnails."],
    src: [
      ["MDN: object-fit", `${P}/object-fit`],
      ["MDN: aspect-ratio", `${P}/aspect-ratio`],
    ],
  }),
  q({
    slug: "pseudo-class-vs-pseudo-element",
    topic: "Specificity",
    d: "medium",
    title:
      "What is the difference between a pseudo-class and a pseudo-element?",
    kw: ["pseudo-class", "pseudo-element", ":hover", "::before", "content"],
    intent:
      "Checks you know the two selector kinds and the double-colon syntax.",
    short:
      "A pseudo-class selects an element in a particular state or position, written with one colon, such as `:hover`, `:focus`, `:first-child` or `:nth-child(2)`. A pseudo-element targets a part of an element or generates one, written with two colons, such as `::before`, `::after`, `::first-line` or `::placeholder`. `::before` and `::after` only appear when the `content` property is set.",
    detail: [
      "Pseudo-classes carry class-level specificity; pseudo-elements carry type-level.",
      "Generated content is not part of the DOM, so it is not selectable text.",
      "`:focus-visible` shows focus styles mainly for keyboard users.",
    ],
    ex: 'A button gets a darker background with `:hover`, and a decorative arrow added with `::after` that has `content: ""`.',
    code: [
      [
        "State and generated part",
        "css",
        `a:hover { text-decoration: underline; }\n.note::before {\n  content: "Note: ";\n  font-weight: bold;\n}`,
        [
          "`:hover` targets a state of the link.",
          "`::before` inserts generated content before the element's content.",
        ],
      ],
    ],
    mistakes: [
      "Forgetting `content` on ::before or ::after.",
      "Putting important text in generated content.",
    ],
    follow: ["What is :focus-visible for?"],
    points: [
      "Pseudo-class = state, one colon",
      "Pseudo-element = part, two colons",
      "::before needs content",
      "Generated content is not in the DOM",
    ],
    notes: ["State vs part."],
    src: [
      ["MDN: Pseudo-classes", `${C}/Reference/Selectors/Pseudo-classes`],
      ["MDN: Pseudo-elements", `${C}/Reference/Selectors/Pseudo-elements`],
    ],
  }),
  q({
    slug: "css-transitions",
    topic: "Animations",
    d: "easy",
    title: "How do CSS transitions work?",
    kw: [
      "transition",
      "duration",
      "timing function",
      "hover effect",
      "property",
    ],
    intent: "Checks you can animate between two states.",
    short:
      "A transition animates a property smoothly from its old value to its new one when the value changes, for example on hover or when a class is toggled. You set the `transition` shorthand on the element with the property to animate, a duration, an optional timing function such as `ease-in-out`, and an optional delay. Without a state change there is nothing to transition, and only animatable properties with a computable middle value can be animated.",
    detail: [
      "List only the properties you need instead of `all`.",
      "Put the transition on the base state so it also plays when the state ends.",
      "Respect `prefers-reduced-motion` for users who dislike animation.",
    ],
    ex: "A button's background fades to a darker colour over 200ms on hover instead of snapping.",
    code: [
      [
        "Hover transition",
        "css",
        `.button {\n  background: #0a7;\n  transition: background-color 200ms ease-in-out;\n}\n.button:hover { background: #086; }`,
        [
          "The transition is declared on the normal state.",
          "The colour change on `:hover` is animated over 200ms.",
        ],
      ],
    ],
    mistakes: [
      "Using transition: all everywhere.",
      "Defining the transition only on the hover state.",
    ],
    follow: ["What does the timing function control?"],
    points: [
      "Animates between two states",
      "Property, duration, timing, delay",
      "Declare on the base state",
      "Needs a change to trigger",
    ],
    notes: ["Transition = A to B on change."],
    src: [
      ["MDN: transition", `${P}/transition`],
      ["MDN: transition-timing-function", `${P}/transition-timing-function`],
    ],
  }),
  q({
    slug: "keyframe-animations",
    topic: "Animations",
    d: "medium",
    title: "How do CSS keyframe animations differ from transitions?",
    kw: ["@keyframes", "animation", "iteration count", "fill mode", "looping"],
    intent: "Checks you know when a transition is not enough.",
    short:
      "A keyframe animation is defined with `@keyframes`, which names a sequence of steps, and applied with the `animation` properties such as `animation-name`, `animation-duration`, `animation-iteration-count` and `animation-fill-mode`. Unlike a transition, it needs no state change, can have many intermediate steps, and can loop or alternate. Use a transition for a simple change between two states and keyframes for multi-step or repeating effects such as a spinner.",
    detail: [
      "Steps are written as `from` and `to`, or as percentages.",
      "`animation-fill-mode: forwards` keeps the final values after the animation ends.",
      "`animation-iteration-count: infinite` repeats it forever.",
    ],
    ex: "A loading spinner rotates continuously with a keyframe animation, which a transition cannot do on its own.",
    code: [
      [
        "A spinner",
        "css",
        `@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n.spinner {\n  animation: spin 1s linear infinite;\n}`,
        [
          "`@keyframes` defines the steps.",
          "`animation` runs `spin` for 1s, evenly, forever.",
        ],
      ],
    ],
    mistakes: [
      "Using a transition for a looping effect.",
      "Forgetting fill-mode so the element jumps back at the end.",
    ],
    follow: ["When would you pick a transition instead?"],
    points: [
      "@keyframes defines steps",
      "No state change needed",
      "Can loop and alternate",
      "fill-mode keeps end values",
    ],
    notes: ["Transitions for A to B, keyframes for sequences."],
    src: [
      ["MDN: @keyframes", `${C}/Reference/At-rules/@keyframes`],
      ["MDN: animation", `${P}/animation`],
      ["MDN: animation-fill-mode", `${P}/animation-fill-mode`],
    ],
  }),
  q({
    slug: "css-transform",
    topic: "Animations",
    d: "medium",
    title:
      "What does the CSS transform property do and how does it affect layout?",
    kw: ["transform", "translate", "rotate", "scale", "layout"],
    intent:
      "Checks you know transforms move an element visually without reflowing the page.",
    short:
      "`transform` applies visual changes such as `translate()`, `rotate()`, `scale()` and `skew()` to an element. The element is moved or drawn differently, but the space it occupied in the normal flow stays the same, so neighbouring elements do not move. That makes transforms a good choice for effects and animations compared with changing `top`, `left` or `width`, which affect the layout. A transformed element also creates its own stacking context.",
    detail: [
      "Several functions can be combined in one value, applied from left to right.",
      "`transform-origin` sets the point the transform is relative to.",
      "A popular centring trick uses `translate(-50%, -50%)` on an absolutely positioned element.",
    ],
    ex: "A card lifts slightly on hover with `transform: translateY(-4px)`, and nothing around it shifts.",
    mistakes: [
      "Animating `top` and `left` where transform would do.",
      "Forgetting it does not change the reserved layout space.",
    ],
    follow: ["Does a transform change other elements' positions?"],
    points: [
      "translate, rotate, scale, skew",
      "Layout space unchanged",
      "Creates a stacking context",
      "Origin can be changed",
    ],
    notes: ["Transform moves the paint, not the layout."],
    src: [["MDN: transform", `${P}/transform`]],
  }),
  q({
    slug: "prefers-reduced-motion",
    topic: "Animations",
    d: "medium",
    title: "How do you respect users who prefer reduced motion?",
    kw: [
      "prefers-reduced-motion",
      "accessibility",
      "motion",
      "media feature",
      "vestibular",
    ],
    intent: "Checks that animation is treated as an accessibility concern.",
    short:
      "The `prefers-reduced-motion` media feature detects when the user has asked their operating system to reduce motion. Wrap non-essential animation in a query for `no-preference`, or switch it off or shorten it inside `@media (prefers-reduced-motion: reduce)`. Large movements, parallax, and spinning or flashing effects can cause discomfort or nausea for some people, so providing an alternative is a basic accessibility practice.",
    detail: [
      "Essential feedback, such as a state change, can remain but be made subtle, for example a fade instead of a slide.",
      "The same setting is available in JavaScript through `window.matchMedia`.",
      "Never rely on animation alone to convey information.",
    ],
    ex: "A page that slides sections in on scroll renders them immediately in place for users with reduced motion on.",
    code: [
      [
        "Turn animation off",
        "css",
        `@media (prefers-reduced-motion: reduce) {\n  * {\n    animation: none !important;\n    transition: none !important;\n  }\n}`,
        [
          "The query matches when the user asked for less motion.",
          "Animations and transitions are disabled inside it.",
        ],
      ],
    ],
    mistakes: [
      "Ignoring the preference.",
      "Removing all feedback instead of making it gentler.",
    ],
    follow: ["Which animations should you remove first?"],
    points: [
      "User OS setting",
      "Query: reduce or no-preference",
      "Reduce large movement",
      "Never rely on motion alone",
    ],
    notes: ["Respect the reduce setting."],
    src: [
      [
        "MDN: prefers-reduced-motion",
        `${C}/Reference/At-rules/@media/prefers-reduced-motion`,
      ],
    ],
  }),
])
