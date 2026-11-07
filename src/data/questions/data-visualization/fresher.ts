import { defineQuestions } from "../author"
import { g } from "../brief"

const M = "https://matplotlib.org/stable"
const S = "https://seaborn.pydata.org"

export default defineQuestions("data-visualization", "fresher", [
  g({
    slug: "figure-axes-artist",
    topic: "Matplotlib",
    d: "easy",
    title: "What are a Figure, an Axes and an Artist in Matplotlib?",
    kw: ["figure", "axes", "artist", "subplot", "anatomy"],
    intent:
      "Checks that you understand the objects behind every Matplotlib plot.",
    short:
      "When you look at a Matplotlib visualisation you are almost always looking at Artists placed on a Figure. The Figure is the overall container, for example the whole window or image. An Axes is the region where data is plotted: it typically has a pair of Axis artists that define the data coordinate system, plus methods to add labels, titles and legends. Anything drawn, such as lines, text, colorbars and legends, is an Artist. Almost everything on the figure is created with methods on the Axes, which is why the Axes class is the gateway to much of Matplotlib.",
    detail: [
      "A figure can contain several Axes, and an Axes can have many Artists, such as lines from ax.plot or images from ax.imshow.",
      "To change the x-axis label you call ax.set_xlabel, and to plot data you call ax.plot(x, y).",
      "The only Artist that is not part of an Axes is the Figure itself.",
    ],
    ex: "fig, ax = plt.subplots() creates a Figure and one Axes, and ax.set_title adds a title to that Axes.",
    mistakes: [
      "Calling an Axes the same thing as the Figure.",
      "Confusing an Axes with an Axis, which is only the x or y axis part of it.",
    ],
    follow: ["What are the two Matplotlib interfaces?"],
    points: [
      "Figure holds everything",
      "Axes is where data is drawn",
      "Artists are the drawn elements",
      "Axes methods do most of the work",
    ],
    notes: "Figure contains Axes; Axes contain Artists.",
    src: [
      ["Matplotlib: Introduction to Figures", `${M}/users/explain/figure/figure_intro.html`],
      ["Matplotlib: Introduction to Axes", `${M}/users/explain/axes/axes_intro.html`],
    ],
  }),
  g({
    slug: "explicit-vs-pyplot-interface",
    topic: "Matplotlib",
    d: "medium",
    title: "What is the difference between the explicit Axes interface and the pyplot interface?",
    kw: ["pyplot", "axes interface", "object-oriented", "gca", "implicit"],
    intent:
      "Checks that you can read and write both styles and choose one deliberately.",
    short:
      "Matplotlib has two major interfaces. The explicit 'Axes' interface, also called object-oriented, creates a Figure, uses a subplots method to create Axes objects, and calls drawing methods on those Axes. The implicit 'pyplot' interface keeps track of the last Figure and Axes created and adds artists to the object it thinks you want. pyplot can be convenient for interactive work and simple scripts. The documentation notes that web snippets sometimes mix both styles. The Axes interface is how Matplotlib is implemented, and much fine-tuning ends up being done there.",
    detail: [
      "plt.gcf returns the current figure and plt.gca the current Axes in the implicit interface.",
      "Keeping references to the objects lets you customise them after creation but before display.",
      "Downstream libraries such as pandas offer a plot method on data classes.",
    ],
    ex: "fig, axs = plt.subplots(1, 2) then axs[0].plot(...) is explicit, while plt.subplot(1, 2, 1) then plt.plot(...) is implicit.",
    mistakes: [
      "Mixing both styles in the same figure and losing track of the current Axes.",
      "Using pyplot state for multi-panel figures where it becomes confusing.",
    ],
    follow: ["How do you create several subplots?"],
    points: [
      "Explicit uses Figure and Axes objects",
      "Implicit tracks the current Axes",
      "Both draw the same thing",
      "Prefer explicit for complex figures",
    ],
    notes: "plt.plot is shorthand for ax.plot on the current Axes.",
    src: [
      ["Matplotlib: Application interfaces (APIs)", `${M}/users/explain/figure/api_interfaces.html`],
    ],
  }),
  g({
    slug: "plt-subplots-grid",
    topic: "Matplotlib",
    d: "easy",
    title: "How do you create several plots in one figure with plt.subplots?",
    kw: ["subplots", "nrows", "ncols", "sharex", "sharey"],
    intent:
      "Checks that you can lay out multiple panels cleanly.",
    short:
      "plt.subplots is a utility wrapper that creates a figure and a set of subplots in one call. You pass nrows and ncols, which default to 1, and it returns the Figure and an array of Axes. With a 2 by 2 grid you get a (2, 2) array of Axes that you index, for example axs[0, 1], and each can have data added. The sharex and sharey options control whether subplots share an axis: True or 'all' shares across all, 'row' or 'col' shares by row or column, and False keeps each independent. When an x-axis is shared down a column, only the bottom subplot gets tick labels.",
    detail: [
      "squeeze is True by default, so a single row or column returns a 1D array of Axes, and one subplot returns a single Axes object.",
      "width_ratios and height_ratios set relative sizes.",
      "Passing layout='constrained' avoids overlapping labels.",
    ],
    ex: "fig, axs = plt.subplots(nrows=2, ncols=2, layout='constrained') makes four panels to compare four metrics.",
    mistakes: [
      "Indexing a 1D array of Axes as if it were 2D after squeeze.",
      "Letting labels overlap between panels.",
    ],
    follow: ["How do you stop labels overlapping?"],
    points: [
      "Returns figure and Axes array",
      "nrows and ncols set the grid",
      "sharex and sharey align axes",
      "layout avoids overlap",
    ],
    notes: "fig, axs = plt.subplots(nrows, ncols).",
    code: [
      "Two panels sharing the x-axis",
      `fig, (ax1, ax2) = plt.subplots(2, 1, sharex=True, layout="constrained")
ax1.plot(x, y1)
ax1.set_ylabel("Sales")
ax2.plot(x, y2)
ax2.set_ylabel("Visits")
ax2.set_xlabel("Day")`,
      [
        "subplots returns the figure and one Axes per row.",
        "sharex=True gives both panels the same x range and only labels the bottom one.",
        "constrained layout keeps labels from overlapping.",
      ],
      "python",
    ],
    src: [
      ["Matplotlib: pyplot.subplots", `${M}/api/_as_gen/matplotlib.pyplot.subplots.html`],
      ["Matplotlib: Introduction to Axes", `${M}/users/explain/axes/axes_intro.html`],
    ],
  }),
  g({
    slug: "showing-figures-notebook-script",
    topic: "Matplotlib",
    d: "easy",
    title: "Why does a plot not appear in a script, and how do notebooks differ?",
    kw: ["plt.show", "backend", "jupyter inline", "matplotlib.use", "interactive"],
    intent:
      "Checks that you know how figures are displayed in different environments.",
    short:
      "How you view a figure depends on how you use Matplotlib and which backend is active. In a Jupyter notebook or an IDE that renders notebooks, the default inline backend displays a static figure when the cell runs. In standalone scripts, or interactively from an IPython shell, the figure is not shown until you call plt.show(), which opens it in a GUI window, usually with a toolbar with zoom and pan. By default plt.show() blocks the script until the window is closed. Backends are typically chosen in matplotlibrc or with matplotlib.use. Interactive plots in Jupyter need a magic such as %matplotlib widget.",
    detail: [
      "Static inline plots by default trim or expand the figure to a tight box around the artists.",
      "The ipympl backend for widget plots is a separate package.",
      "Common GUI backends use Qt, Tk or Wx toolkits, or the native macOS backend.",
    ],
    ex: "A script that builds a chart but never calls plt.show() or savefig produces no visible output.",
    mistakes: [
      "Forgetting plt.show() in a script.",
      "Expecting interactive zoom from the default inline backend.",
    ],
    follow: ["How do you save a figure instead?"],
    points: [
      "Backend decides how it is shown",
      "Notebook shows inline automatically",
      "Scripts need plt.show()",
      "widget backend for interactivity",
    ],
    notes: "Script: plt.show(). Notebook: inline by default.",
    src: [
      ["Matplotlib: Introduction to Figures", `${M}/users/explain/figure/figure_intro.html`],
    ],
  }),
  g({
    slug: "saving-figures-savefig",
    topic: "Matplotlib",
    d: "easy",
    title: "How do you save a Matplotlib figure, and what do dpi and format control?",
    kw: ["savefig", "dpi", "png", "svg", "bbox_inches"],
    intent:
      "Checks that you can export a chart for a report or slide.",
    short:
      "Call fig.savefig with a file name. For example, fig.savefig('MyFigure.png', dpi=200) writes a PNG at 200 dots per inch to the current directory, and the name can include a relative or absolute path. Many outputs are supported: raster formats such as PNG, GIF, JPEG and TIFF, and vector formats such as PDF, EPS and SVG. By default the saved size is set by the figure size in inches and, for raster formats, the dpi; if dpi is not set, the figure's dpi is used. The bbox_inches argument can change the saved area.",
    detail: [
      "Vector formats keep sharp lines at any zoom, while raster formats have a fixed resolution.",
      "The dpi still matters for vector files if the figure contains rasterised artists.",
      "plt.savefig saves the current figure in the pyplot interface.",
    ],
    ex: "A chart for a printed report is saved as a PDF, and the same chart for a web page is saved as a PNG.",
    mistakes: [
      "Saving a raster image at low dpi for print.",
      "Saving a raster image at a resolution too low for its use.",
    ],
    follow: ["Which format would you use for a slide?"],
    points: [
      "savefig writes to a file",
      "dpi sets raster resolution",
      "PNG, JPEG, PDF, SVG supported",
      "bbox_inches adjusts the area",
    ],
    notes: "fig.savefig('name.png', dpi=200).",
    src: [
      ["Matplotlib: Introduction to Figures", `${M}/users/explain/figure/figure_intro.html`],
      ["Matplotlib: pyplot.savefig", `${M}/api/_as_gen/matplotlib.pyplot.savefig.html`],
    ],
  }),
  g({
    slug: "matplotlib-plot-type-families",
    topic: "Chart choice",
    d: "easy",
    title: "How are Matplotlib plot types grouped, and which function suits which data?",
    kw: ["plot types", "scatter", "bar", "hist", "boxplot"],
    intent:
      "Checks that you can match a chart function to the shape of the data.",
    short:
      "The plot types overview groups commands by the kind of data. Pairwise data, meaning (x, y), tabular or functional data, uses plot, scatter, bar, stem, fill_between, stackplot and stairs. Statistical distributions use hist, boxplot, errorbar, violinplot, eventplot, hist2d, hexbin, pie and ecdf. Gridded data, meaning arrays and images on regular grids, uses imshow, pcolormesh, contour, contourf, barbs, quiver and streamplot. There are further groups for irregularly gridded data and for three-dimensional data. Start by asking which kind of data you have and what you want the viewer to see.",
    detail: [
      "scatter draws a scatter plot of y versus x with varying marker size or colour.",
      "hist computes the counts for you before drawing the distribution.",
      "The gallery shows examples for every plot type.",
    ],
    ex: "To compare two numeric columns you use scatter; to see how one column is spread you use hist or boxplot.",
    mistakes: [
      "Choosing a chart type before looking at the data type.",
      "Treating all chart functions as interchangeable regardless of data shape.",
    ],
    follow: ["When would you use a histogram instead of a bar chart?"],
    points: [
      "Pairwise data: plot, scatter, bar",
      "Distributions: hist, boxplot, violinplot",
      "Gridded data: imshow, contour",
      "Match chart to data",
    ],
    notes: "Pick by data type: pairwise, distribution or gridded.",
    src: [["Matplotlib: Plot types", `${M}/plot_types/index.html`]],
  }),
  g({
    slug: "histogram-and-bins",
    topic: "Chart choice",
    d: "easy",
    title: "What does a histogram show, and why does the bin choice matter?",
    kw: ["histogram", "bins", "distribution", "hist", "density"],
    intent:
      "Checks that you read distribution charts critically.",
    short:
      "A histogram is a bar plot where the axis for the data variable is divided into discrete bins and the height of each bar shows how many observations fall in that bin. In Matplotlib, hist uses numpy.histogram to count the values in each bin and then draws the result. It lets you see the range, central tendency, skew, possible bimodality and outliers. The bin size is an important parameter: the wrong size can mislead by obscuring features or by creating apparent features out of random variability. Seaborn's documentation advises checking that your impression holds across different bin sizes.",
    detail: [
      "Automatic bin choices depend on assumptions about the data, so do not rely on them blindly.",
      "If data is already binned, use bar or stairs to plot the counts.",
      "density=True changes counts to a density.",
    ],
    ex: "A salary histogram looks bimodal with 20 bins but looks like one hump with 5 bins, so the analyst tries several.",
    mistakes: [
      "Trusting one default bin count.",
      "Drawing conclusions about two peaks after checking only one bin size.",
    ],
    follow: ["What other plot shows a distribution?"],
    points: [
      "Counts per bin",
      "Shows shape, skew and outliers",
      "Bin size changes the story",
      "Try several bin sizes",
    ],
    notes: "Always test a few bin sizes before concluding.",
    src: [
      ["Matplotlib: pyplot.hist", `${M}/api/_as_gen/matplotlib.pyplot.hist.html`],
      ["Seaborn: Visualizing distributions of data", `${S}/tutorial/distributions.html`],
    ],
  }),
  g({
    slug: "box-plot-reading",
    topic: "Chart choice",
    d: "easy",
    title: "How do you read a box plot?",
    kw: ["box plot", "quartiles", "whiskers", "outliers", "median"],
    intent:
      "Checks that you can read the common summary chart for comparing groups.",
    short:
      "A box plot, or box-and-whisker plot, shows the distribution of quantitative data in a way that makes it easy to compare variables or levels of a categorical variable. The box shows the quartiles of the dataset, and the whiskers extend to show the rest of the distribution, except for points that are determined to be outliers. Seaborn's whis parameter controls how far the whiskers extend and defaults to 1.5. Because a box plot is compact, many groups can sit side by side.",
    detail: [
      "Seaborn's boxplot takes a categorical variable for one axis and a numeric variable for the other.",
      "Points beyond the whiskers are drawn individually as outliers.",
      "A violin plot plays a similar role and shows a density estimate.",
    ],
    ex: "Comparing delivery times across five cities with one box per city shows which city has the widest spread.",
    mistakes: [
      "Reading the box edges as minimum and maximum.",
      "Treating every plotted outlier as an error.",
    ],
    follow: ["How is a violin plot different?"],
    points: [
      "Box shows quartiles",
      "Whiskers show the rest of the range",
      "Outliers are plotted separately",
      "Good for comparing groups",
    ],
    notes: "Box = middle half of the data; whiskers = the rest minus outliers.",
    src: [
      ["Seaborn: boxplot", `${S}/generated/seaborn.boxplot.html`],
      ["Matplotlib: boxplot", `${M}/plot_types/stats/boxplot_plot.html`],
    ],
  }),
  g({
    slug: "constrained-vs-tight-layout",
    topic: "Matplotlib",
    d: "medium",
    title: "How do you stop labels and titles overlapping in Matplotlib?",
    kw: ["constrained layout", "tight_layout", "overlap", "layout engine", "colorbar"],
    intent:
      "Checks that you know the layout engines and which one is recommended.",
    short:
      "Use constrained layout, which automatically adjusts subplots so decorations such as tick labels, legends and colorbars do not overlap while preserving the logical layout you asked for. Turn it on with layout='constrained' in plt.subplots or plt.figure, or through rcParams, and it typically needs to be activated before any Axes are added. Tight layout was Matplotlib's first layout engine; it is experimental, only checks the extents of tick labels, axis labels and titles, and the documentation says the more modern constrained layout should typically be used. Calling tight_layout turns constrained layout off.",
    detail: [
      "Constrained layout is more flexible: it handles colorbars on multiple Axes, nested subfigures and Axes that span rows or columns.",
      "Compressed layout moves fixed aspect-ratio Axes closer together.",
      "Without any layout engine, titles and labels can be clipped outside the figure.",
    ],
    ex: "A 2 by 2 figure with long y labels is created with layout='constrained' so nothing is clipped.",
    mistakes: [
      "Calling tight_layout on a figure that already uses constrained layout.",
      "Fixing overlap by shrinking fonts instead of using a layout engine.",
    ],
    follow: ["How do you place a shared colorbar?"],
    points: [
      "layout='constrained'",
      "Prevents overlapping decorations",
      "tight_layout is older and limited",
      "Enable before adding Axes",
    ],
    notes: "Prefer layout='constrained' over tight_layout.",
    src: [
      ["Matplotlib: Constrained layout guide", `${M}/users/explain/axes/constrainedlayout_guide.html`],
      ["Matplotlib: Tight layout guide", `${M}/users/explain/axes/tight_layout_guide.html`],
    ],
  }),
  g({
    slug: "axis-scales-log",
    topic: "Matplotlib",
    d: "medium",
    title: "When and how do you use a logarithmic axis in Matplotlib?",
    kw: ["log scale", "set_yscale", "set_xscale", "axis scale", "linear"],
    intent:
      "Checks that you can change the scale to show data across wide ranges.",
    short:
      "By default Matplotlib displays data on a linear scale, but it also supports logarithmic scales and some less common ones. You usually change it with the set_xscale or set_yscale methods, for example ax.set_yscale('log'). A log scale suits data spanning several orders of magnitude, where equal steps on the axis mean equal ratios. The ticks then use locators and formatters that depend on the scale. Remember to label the axis clearly, because readers may assume a linear scale.",
    detail: [
      "Locators and formatters decide where ticks go and how they are written.",
      "Colour mappings can also be non-linear, for example with a logarithmic normalisation.",
      "Scales are set per axis, so x and y can differ.",
    ],
    ex: "A chart of company revenues from small to very large firms uses a log y-axis so all points are visible.",
    mistakes: [
      "Forgetting that the default scale is linear.",
      "Not stating on the axis label that the scale is logarithmic.",
    ],
    follow: ["How do you customise tick positions?"],
    points: [
      "Linear is the default",
      "set_xscale and set_yscale",
      "Log for wide ranges",
      "Label the scale clearly",
    ],
    notes: "ax.set_yscale('log') for multiplicative data.",
    src: [["Matplotlib: Axis scales", `${M}/users/explain/axes/axes_scales.html`]],
  }),
  g({
    slug: "ticks-and-tick-labels",
    topic: "Matplotlib",
    d: "easy",
    title: "How do you customise tick positions and labels in Matplotlib?",
    kw: ["ticks", "set_xticks", "tick labels", "locator", "formatter"],
    intent:
      "Checks that you can make axes readable and meaningful.",
    short:
      "Each x and y Axis has default tick locators and formatters that depend on the scale. The simplest customisation uses set_xticks and set_yticks, which can be used on major or minor ticks. You pass positions and, optionally, labels, and the labels list must have the same length as the positions array. For finer control you can set locators and formatters directly on the axis. Use this to show meaningful positions, such as every month, and readable text, such as a currency format.",
    detail: [
      "Locators choose where ticks go, and formatters choose how the tick values are written.",
      "Minor ticks can be set the same way as major ones.",
      "Automatic ticks are fine for quick exploration, but manual ticks help in a report.",
    ],
    ex: "An x-axis showing months uses set_xticks with twelve positions and the month names as labels.",
    mistakes: [
      "Passing labels of a different length from the positions.",
      "Leaving cluttered default ticks on a presentation chart.",
    ],
    follow: ["How do locators differ from formatters?"],
    points: [
      "Default locators and formatters",
      "set_xticks sets positions and labels",
      "Labels must match positions",
      "Minor ticks are supported",
    ],
    notes: "Positions via locator; text via formatter.",
    src: [["Matplotlib: Axis ticks", `${M}/users/explain/axes/axes_ticks.html`]],
  }),
  g({
    slug: "legend-handles-and-labels",
    topic: "Matplotlib",
    d: "easy",
    title: "How does a legend get its entries in Matplotlib?",
    kw: ["legend", "label", "handles", "get_legend_handles_labels", "legend entry"],
    intent:
      "Checks that you know how to label plotted data so a legend works.",
    short:
      "A legend is made up of legend entries, and each entry is exactly one key and one label. Calling legend() with no arguments automatically fetches the handles and labels from the Axes, which is the same as calling ax.get_legend_handles_labels() and passing the result to ax.legend. You give each artist a label when you plot it, for example ax.plot(x, y, label='Sales'). Artists with an empty label, or a label starting with an underscore, are ignored. For full control, pass the handles you want directly. Not every artist can be added to a legend, so a proxy artist may be needed.",
    detail: [
      "The legend key is the coloured or patterned marker, and the label is the text describing it.",
      "The handle is the original object used to build the entry.",
      "Passing handles and labels to legend() gives full control over the entries.",
    ],
    ex: "Two lines are plotted with label='2024' and label='2025', then ax.legend() shows both.",
    mistakes: [
      "Calling legend before any labelled artists exist.",
      "Using a label that starts with an underscore and wondering why it is missing.",
    ],
    follow: ["What is a proxy artist?"],
    points: [
      "Entry = key + label",
      "Set label when plotting",
      "legend() collects them automatically",
      "Underscore labels are ignored",
    ],
    notes: "label= on each artist, then ax.legend().",
    src: [["Matplotlib: Legend guide", `${M}/users/explain/axes/legend_guide.html`]],
  }),
  g({
    slug: "annotations-add-context",
    topic: "Storytelling",
    d: "medium",
    title: "How do annotations help a chart tell a story, and how do you add one in Matplotlib?",
    kw: ["annotate", "annotation", "xy", "xytext", "arrow"],
    intent:
      "Checks that you can guide the viewer to the main point of a chart.",
    short:
      "Annotations are graphical elements, often pieces of text, that explain, add context to, or otherwise highlight some portion of the visualised data. In Matplotlib you use annotate. You give two points: xy, the location of the data being annotated, and xytext, the location of the text. Axes.annotate can also draw an optional arrow from the text to the data, and the arrow can be styled. The simpler text method can place text but gives less flexibility in positioning and styling. Use annotation to point out the one event or value the audience should notice.",
    detail: [
      "annotate supports several coordinate systems, so you can position relative to data or to the axes.",
      "Keep annotations short and place them where they do not hide the data.",
      "text can also annotate, but it gives less flexibility in positioning and styling.",
    ],
    ex: "A sales line chart has an arrow and a short note at the peak: 'Festival week'.",
    mistakes: [
      "Annotating many points until the chart is cluttered.",
      "Placing the text on top of the data it explains.",
    ],
    follow: ["How else can you direct attention in a chart?"],
    points: [
      "annotate with xy and xytext",
      "Optional arrow",
      "text is simpler but less flexible",
      "Highlight the key message",
    ],
    notes: "Annotate the one thing the audience must see.",
    src: [["Matplotlib: Annotations", `${M}/users/explain/text/annotations.html`]],
  }),
  g({
    slug: "colormap-classes",
    topic: "Chart choice",
    d: "medium",
    title: "What are sequential, diverging, cyclic and qualitative colormaps, and when do you use each?",
    kw: ["colormap", "sequential", "diverging", "cyclic", "qualitative"],
    intent:
      "Checks that you pick colour schemes to match the meaning of the data.",
    short:
      "Matplotlib splits colormaps into four classes by function. Sequential colormaps change lightness, and often saturation, incrementally, often with a single hue, and suit information that has an ordering. Diverging colormaps change lightness of two colours that meet at an unsaturated middle, and suit data with a critical middle value, such as deviation around zero. Cyclic colormaps begin and end at the same colour, and suit values that wrap around, such as phase angle, wind direction or time of day. Qualitative colormaps are miscellaneous colours for information with no ordering or relationships.",
    detail: [
      "Choose by what you are plotting, whether there is a critical value, and any standard in your field.",
      "Seaborn describes the same idea: qualitative palettes for categories, sequential for numbers, diverging for numbers with a categorical boundary.",
      "Qualitative colormaps are often miscellaneous colours without a progression.",
    ],
    ex: "Temperature difference from average uses a diverging map centred at zero, while population density uses a sequential map.",
    mistakes: [
      "Using a qualitative palette for an ordered numeric variable.",
      "Using a diverging map when there is no meaningful middle.",
    ],
    follow: ["What does perceptually uniform mean?"],
    points: [
      "Sequential for ordered values",
      "Diverging for a critical midpoint",
      "Cyclic for wrap-around values",
      "Qualitative for unordered categories",
    ],
    notes: "Match the colormap class to the structure of the data.",
    src: [
      ["Matplotlib: Choosing colormaps", `${M}/users/explain/colors/colormaps.html`],
      ["Seaborn: Choosing color palettes", `${S}/tutorial/color_palettes.html`],
    ],
  }),
  g({
    slug: "perceptually-uniform-colormaps",
    topic: "Chart choice",
    d: "hard",
    title: "What is a perceptually uniform colormap, and why does it matter?",
    kw: ["perceptually uniform", "lightness", "colormap", "hue", "interpretation"],
    intent:
      "Checks that you understand why some colour scales misrepresent data.",
    short:
      "A perceptually uniform colormap is one in which equal steps in the data are perceived as equal steps in the colour space. Researchers have found that the human brain perceives changes in the lightness parameter as changes in the data much better than changes in hue. So colormaps with monotonically increasing lightness are better interpreted by viewers. For many applications, the documentation says a perceptually uniform colormap is the best choice. Other factors are your knowledge of the data, whether there is an intuitive colour scheme, and whether the audience expects a standard in your field.",
    detail: [
      "A map whose perceived change varies along its length can create apparent features that are not in the data.",
      "Colour can be described in a colour space such as CIELAB, with lightness and two colour axes.",
      "The page shows how lightness changes along the built-in colormaps.",
    ],
    ex: "A heatmap uses a lightness-increasing sequential colormap so equal differences look equal.",
    mistakes: [
      "Choosing a colormap only because it looks attractive.",
      "Using a map whose perceived steps are uneven.",
    ],
    follow: ["What does a colorbar add?"],
    points: [
      "Equal data steps look equal",
      "Lightness is read better than hue",
      "Monotonic lightness helps",
      "Consider audience conventions",
    ],
    notes: "Prefer colormaps whose lightness rises steadily.",
    src: [["Matplotlib: Choosing colormaps", `${M}/users/explain/colors/colormaps.html`]],
  }),
  g({
    slug: "colormap-normalization-vmin-vmax",
    topic: "Matplotlib",
    d: "hard",
    title: "How do vmin, vmax and normalisation control how data maps to colours?",
    kw: ["vmin", "vmax", "normalize", "colormap", "lognorm"],
    intent:
      "Checks that you can control how values are coloured so charts compare fairly.",
    short:
      "By default, objects that use colormaps map colours linearly from data values vmin to vmax. For example, with vmin=-1, vmax=1 and a diverging map, zero gets the centre colour. Matplotlib does this in two steps: a normalisation from the input data to the range 0 to 1, then a mapping onto the colormap. The default is the linear matplotlib.colors.Normalize. When you need a non-linear mapping, for example for data spanning many orders of magnitude, you can use another normalisation such as a logarithmic one. Setting the same vmin and vmax across plots lets you compare them.",
    detail: [
      "Normalizations are classes in the matplotlib.colors module.",
      "Without fixed limits, each plot scales colours to its own data, so colours in two plots may mean different values.",
      "Add a colorbar so viewers can decode the colours.",
    ],
    ex: "Two heatmaps of monthly sales share vmin and vmax, so the same colour means the same value in both.",
    mistakes: [
      "Comparing two heatmaps that use different colour limits.",
      "Using a linear scale when a few huge values hide the rest.",
    ],
    follow: ["Which colormap class suits data centred on zero?"],
    points: [
      "Linear mapping vmin to vmax by default",
      "Two steps: normalise, then colour",
      "Other norms exist, such as log",
      "Share limits to compare plots",
    ],
    notes: "Same vmin and vmax for fair comparison.",
    src: [["Matplotlib: Colormap normalization", `${M}/users/explain/colors/colormapnorms.html`]],
  }),
  g({
    slug: "what-is-seaborn",
    topic: "Seaborn",
    d: "easy",
    title: "What is Seaborn and how does it relate to Matplotlib and pandas?",
    kw: ["seaborn", "matplotlib", "pandas", "statistical graphics", "dataframe"],
    intent:
      "Checks that you know when to reach for Seaborn rather than raw Matplotlib.",
    short:
      "Seaborn is a library for making statistical graphics in Python. It builds on top of Matplotlib and integrates closely with pandas data structures, and it uses Matplotlib to draw its plots. Its plotting functions operate on dataframes and arrays containing whole datasets and internally perform the necessary semantic mapping and statistical aggregation to produce informative plots. Its dataset-oriented, declarative API lets you focus on what the elements of the plot mean instead of how to draw them. By convention it is imported as sns, and Matplotlib can still be used to customise the result.",
    detail: [
      "sns.set_theme() applies Seaborn's default theme through Matplotlib's rcParam system.",
      "You can skip the theme and still use the plotting functions.",
      "load_dataset gives quick access to example datasets.",
    ],
    ex: "sns.relplot(data=tips, x='total_bill', y='tip', hue='smoker') draws a coloured scatter plot straight from a DataFrame.",
    mistakes: [
      "Thinking Seaborn replaces Matplotlib rather than building on it.",
      "Forgetting plt.show() in a script.",
    ],
    follow: ["What does set_theme change?"],
    points: [
      "Statistical graphics library",
      "Built on Matplotlib",
      "Works with pandas DataFrames",
      "Declarative API",
    ],
    notes: "Seaborn = Matplotlib + pandas + statistical defaults.",
    src: [["Seaborn: An introduction to seaborn", `${S}/tutorial/introduction.html`]],
  }),
  g({
    slug: "long-form-vs-wide-form",
    topic: "Seaborn",
    d: "medium",
    title: "What is the difference between long-form and wide-form data in Seaborn?",
    kw: ["long-form", "wide-form", "tidy data", "pivot", "dataframe"],
    intent:
      "Checks that you can shape a DataFrame so a plot function can use it.",
    short:
      "Seaborn treats long-form and wide-form tables differently. In a long-form table each variable is a column and each observation is a row. You give columns roles in the plot by explicitly assigning them to x, y or hue, which suits datasets of arbitrary complexity as long as variables and observations are clear. In a wide-form table, which is like a spreadsheet, the columns and rows hold levels of different variables, so the variables are linked to the dimensions of the table instead of named fields. Pivoting converts long-form data into wide-form.",
    detail: [
      "The flights dataset has year, month and passengers as columns in long form.",
      "pivot with index, columns and values reshapes it to wide form.",
      "Long form is usually easier to map to hue, size and style.",
    ],
    ex: "Sales per region per month is stored as one row per region-month, so hue='region' can colour the lines.",
    mistakes: [
      "Passing wide data and expecting hue to pick up a column that does not exist.",
      "Assuming every function accepts both forms equally.",
    ],
    follow: ["How do you reshape wide data into long data?"],
    points: [
      "Long: each variable a column",
      "Long: each observation a row",
      "Wide: spreadsheet-like layout",
      "pivot goes long to wide",
    ],
    notes: "Long-form maps cleanly to x, y and hue.",
    src: [["Seaborn: Data structures accepted by seaborn", `${S}/tutorial/data_structure.html`]],
  }),
  g({
    slug: "axes-level-vs-figure-level",
    topic: "Seaborn",
    d: "medium",
    title: "What is the difference between axes-level and figure-level Seaborn functions?",
    kw: ["axes-level", "figure-level", "displot", "relplot", "catplot"],
    intent:
      "Checks that you understand why Seaborn plots return different objects and behave differently.",
    short:
      "Seaborn functions are either axes-level or figure-level. Axes-level functions, such as histplot or scatterplot, plot onto a single Matplotlib Axes object, which is the return value. Figure-level functions interface with Matplotlib through a Seaborn object, usually a FacetGrid, that manages the figure. Each module has one figure-level function that offers a unified interface to its axes-level functions: displot for distributions, relplot for relationships, and catplot for categorical data. The most useful feature of figure-level functions is easily creating figures with several subplots using col and row. Their legend is placed outside the plot.",
    detail: [
      "displot draws a histogram by default and selects kde or ecdf with the kind parameter.",
      "Axes-level functions accept an ax argument that lets you specify exactly where each plot goes.",
      "Figure-level functions manage their own figure, so you work with the grid object they return.",
    ],
    ex: "sns.displot(data=penguins, x='flipper_length_mm', col='species') makes one panel per species.",
    mistakes: [
      "Expecting a figure-level function to return an Axes.",
      "Forgetting that the legend of a figure-level plot sits outside the plot.",
    ],
    follow: ["What is FacetGrid?"],
    points: [
      "Axes-level draws on one Axes",
      "Figure-level manages the whole figure",
      "displot, relplot, catplot are figure-level",
      "col and row make facets",
    ],
    notes: "Axes-level fits into your figure; figure-level builds its own.",
    src: [["Seaborn: Overview of seaborn plotting functions", `${S}/tutorial/function_overview.html`]],
  }),
  g({
    slug: "seaborn-distribution-functions",
    topic: "Seaborn",
    d: "medium",
    title: "Which Seaborn functions visualise a distribution?",
    kw: ["histplot", "kdeplot", "ecdfplot", "rugplot", "displot"],
    intent:
      "Checks that you know several ways to look at one variable's spread.",
    short:
      "The distributions module has axes-level functions histplot, kdeplot, ecdfplot and rugplot, which are grouped under the figure-level displot, jointplot and pairplot. The histogram is the default approach in displot. A kernel density estimate plot draws a smooth estimate of the distribution, and an empirical cumulative distribution plot shows the proportion of observations at or below each value. Each approach has advantages and drawbacks. Distribution plots answer questions about the range, central tendency, skew, bimodality and outliers, and whether these differ across subsets.",
    detail: [
      "The documentation says an early step in analysis should be understanding how variables are distributed.",
      "Functions in a module share code, so switching between representations is easy.",
      "jointplot combines the joint and marginal distributions of two variables.",
    ],
    ex: "sns.displot(penguins, x='flipper_length_mm', kind='kde') draws a smooth density instead of a histogram.",
    mistakes: [
      "Relying on a single representation.",
      "Over-smoothing a density estimate and hiding two peaks.",
    ],
    follow: ["Why is the bin size important?"],
    points: [
      "histplot, kdeplot, ecdfplot, rugplot",
      "displot is the figure-level wrapper",
      "Histogram is the default",
      "Look at shape, skew, outliers",
    ],
    notes: "displot(kind='hist' | 'kde' | 'ecdf').",
    src: [["Seaborn: Visualizing distributions of data", `${S}/tutorial/distributions.html`]],
  }),
  g({
    slug: "relational-hue-size-style",
    topic: "Seaborn",
    d: "medium",
    title: "How do hue, size and style add variables to a relational plot in Seaborn?",
    kw: ["relplot", "scatterplot", "lineplot", "hue", "style"],
    intent:
      "Checks that you can add dimensions to a scatter or line plot without overdoing it.",
    short:
      "relplot is the figure-level function for statistical relationships using scatter plots and line plots; it combines a FacetGrid with scatterplot (kind='scatter', the default) or lineplot (kind='line'). A two-dimensional plot of x against y can be enhanced by mapping up to three additional variables using the semantics hue, size and style. The documentation notes that showing all three independently can be hard to interpret and is often ineffective, and that using redundant semantics, such as hue and style for the same variable, can help accessibility. Numeric variables on hue use a sequential colormap by default.",
    detail: [
      "A scatter plot depicts the joint distribution of two variables as a cloud of points, one per observation.",
      "scatterplot is the basic function when both variables are numeric.",
      "col and row on relplot split the data into facets.",
    ],
    ex: "A tips plot colours points by smoker and uses marker size for party size.",
    mistakes: [
      "Mapping so many variables that the legend is unreadable.",
      "Using colour alone to separate groups.",
    ],
    follow: ["How does lineplot treat repeated observations?"],
    points: [
      "relplot = scatter or line",
      "hue, size, style add variables",
      "Redundant semantics aid accessibility",
      "Too many semantics hurt clarity",
    ],
    notes: "Use hue, size and style sparingly.",
    src: [
      ["Seaborn: Visualizing statistical relationships", `${S}/tutorial/relational.html`],
      ["Seaborn: lineplot", `${S}/generated/seaborn.lineplot.html`],
    ],
  }),
  g({
    slug: "lineplot-aggregation-interval",
    topic: "Seaborn",
    d: "hard",
    title: "What does Seaborn's lineplot do when there are several observations at one x value?",
    kw: ["lineplot", "estimator", "errorbar", "confidence interval", "aggregation"],
    intent:
      "Checks that you know about built-in statistical aggregation and uncertainty bands.",
    short:
      "Seaborn's plotting functions perform statistical aggregation internally. lineplot has an estimator parameter whose default is 'mean', and an errorbar parameter whose default is ('ci', 95), so when several observations share an x value it plots the mean and draws a band showing a 95 percent confidence interval, computed by bootstrapping with n_boot resamples (default 1000). The err_style parameter is 'band' by default. You can change the estimator or errorbar settings. Always state in the caption what the line and band represent.",
    detail: [
      "A seed parameter makes the bootstrapped intervals reproducible.",
      "The same defaults, a mean with a 95 percent interval, appear in barplot.",
      "Data is sorted by x by default, with sort=True.",
    ],
    ex: "A line of average daily sales shows a shaded band because each day has many store observations.",
    mistakes: [
      "Reading the shaded band as the full data range.",
      "Not saying which statistic and interval are shown.",
    ],
    follow: ["How does barplot show uncertainty?"],
    points: [
      "Default estimator is the mean",
      "Default band is a 95 percent interval",
      "Bootstrapping is used",
      "Explain the band in the caption",
    ],
    notes: "Line = mean; band = bootstrapped confidence interval.",
    src: [["Seaborn: lineplot", `${S}/generated/seaborn.lineplot.html`]],
  }),
  g({
    slug: "categorical-plot-families",
    topic: "Chart choice",
    d: "medium",
    title: "What are the three families of categorical plots in Seaborn?",
    kw: ["catplot", "stripplot", "swarmplot", "boxplot", "barplot"],
    intent:
      "Checks that you can pick a categorical chart based on the question you want to answer.",
    short:
      "Seaborn groups categorical plots into three families that show the data at different levels of granularity. Categorical scatterplots are stripplot, the default kind in catplot, which uses random jitter to separate points, and swarmplot. Categorical distribution plots are boxplot, violinplot and boxenplot. Categorical estimate plots are pointplot, barplot and countplot. The figure-level catplot gives unified access to all of them through its kind parameter. When deciding which to use, think about the question you want to answer, then switch kinds to see the data from several perspectives.",
    detail: [
      "Jitter solves the problem that all points of one category would otherwise lie at the same position.",
      "The jitter parameter controls its size or disables it.",
      "Estimate plots summarise, while scatterplots show every observation.",
    ],
    ex: "To compare delivery times per day you might begin with a strip plot, then switch to a box plot for the spread.",
    mistakes: [
      "Using only a bar of means and hiding the spread.",
      "Not trying a second kind to see the raw points.",
    ],
    follow: ["When would you use a count plot?"],
    points: [
      "Scatter, distribution and estimate families",
      "catplot is the figure-level interface",
      "Granularity differs by family",
      "Choose by the question",
    ],
    notes: "Strip/swarm show points; box/violin show spread; bar/point show estimates.",
    src: [["Seaborn: Visualizing categorical data", `${S}/tutorial/categorical.html`]],
  }),
  g({
    slug: "barplot-vs-countplot",
    topic: "Chart choice",
    d: "easy",
    title: "What is the difference between a bar plot and a count plot in Seaborn?",
    kw: ["barplot", "countplot", "estimate", "error bar", "categorical"],
    intent:
      "Checks that you know one bar chart shows a statistic and the other shows counts.",
    short:
      "A Seaborn bar plot represents an aggregate or statistical estimate for a numeric variable with the height of each rectangle, and indicates the uncertainty around that estimate with an error bar. By default the estimator is the mean and the error bar is a 95 percent confidence interval. Bar plots include 0 in the axis range, so they are a good choice when 0 is a meaningful value. A count plot shows the counts of observations in each categorical bin using bars, and can be thought of as a histogram across a categorical variable instead of a quantitative one.",
    detail: [
      "countplot has the same basic API and options as barplot.",
      "In countplot you give only the categorical variable; the heights are counts.",
      "Use an ordering of categories so the bars are easy to compare.",
    ],
    ex: "barplot shows average bill per day, while countplot shows how many bills were recorded per day.",
    mistakes: [
      "Using a bar plot of means with no mention of the spread.",
      "Truncating the axis when zero is meaningful.",
    ],
    follow: ["Which plot would show the spread within each day?"],
    points: [
      "barplot shows an estimate",
      "Error bar shows uncertainty",
      "countplot shows counts",
      "Zero baseline matters",
    ],
    notes: "barplot = statistic per category; countplot = how many per category.",
    src: [
      ["Seaborn: barplot", `${S}/generated/seaborn.barplot.html`],
      ["Seaborn: countplot", `${S}/generated/seaborn.countplot.html`],
    ],
  }),
  g({
    slug: "violin-vs-box-plot",
    topic: "Chart choice",
    d: "medium",
    title: "How does a violin plot differ from a box plot?",
    kw: ["violinplot", "boxplot", "kde", "density", "distribution comparison"],
    intent:
      "Checks that you know when a density shape adds information over quartiles.",
    short:
      "A violin plot draws a patch representing a kernel density estimate and adds observations or box plot statistics. It plays a similar role as a box-and-whisker plot: it shows the distribution of quantitative data across levels of one or more categorical variables so the distributions can be compared. The Seaborn tutorial says it uses the kernel density estimate to provide a richer description of the distribution than a box plot. By default a miniature box plot is drawn inside the violin. The cut and bandwidth settings affect how far the density extends and how smooth it is.",
    detail: [
      "inner controls what is drawn inside, with the box as the default.",
      "split=True can place two hue levels on each side of one violin.",
      "cut sets how far the density extends past the extreme data points, and setting it to 0 limits the violin to the data range.",
    ],
    ex: "Violins for each department show that one has two clusters of salaries, which a box plot would hide.",
    mistakes: [
      "Reading density width as a count without noticing smoothing.",
      "Using violins for very small samples.",
    ],
    follow: ["How do you read a box plot?"],
    points: [
      "Shows a density shape",
      "Similar role to a box plot",
      "Can reveal multiple peaks",
      "Smoothing affects the picture",
    ],
    notes: "Violin = box plot plus density shape.",
    src: [
      ["Seaborn: violinplot", `${S}/generated/seaborn.violinplot.html`],
      ["Seaborn: boxplot", `${S}/generated/seaborn.boxplot.html`],
    ],
  }),
  g({
    slug: "seaborn-color-palettes",
    topic: "Seaborn",
    d: "medium",
    title: "How should you choose colours for categories and for numeric values in Seaborn?",
    kw: ["color palette", "hue", "qualitative", "sequential", "diverging"],
    intent:
      "Checks that you use colour to carry meaning and keep plots accessible.",
    short:
      "Seaborn describes palettes in three categories: qualitative palettes for categorical data, sequential palettes for numeric data, and diverging palettes for numeric data with a categorical boundary. To represent categories, vary hue, because the visual system notices hue differences and points with different hues but similar brightness seem equally important. Sequential palettes vary mainly in luminance, suiting data from low to high. Be cautious: with more than a handful of colours a plot becomes hard to interpret, and not everyone sees colours the same way, so vary shape or another attribute as well as colour.",
    detail: [
      "Hue, saturation and lightness (luminance) are the perceptual components of colour.",
      "The default Seaborn palette is a qualitative palette with ten distinct hues.",
      "Colour Brewer palettes such as Set2 and Paired are available through color_palette.",
    ],
    ex: "Four product lines are shown with four distinct hues and different marker shapes.",
    mistakes: [
      "Using shades of one blue for unordered categories.",
      "Using a long list of colours that readers must keep checking in the legend.",
    ],
    follow: ["Which colormap class suits data around zero?"],
    points: [
      "Qualitative, sequential, diverging",
      "Vary hue for categories",
      "Luminance for ordered values",
      "Add shape for accessibility",
    ],
    notes: "Hue for categories; lightness for order.",
    src: [["Seaborn: Choosing color palettes", `${S}/tutorial/color_palettes.html`]],
  }),
  g({
    slug: "seaborn-themes-and-context",
    topic: "Storytelling",
    d: "easy",
    title: "How do you change the look of Seaborn plots for a report or a talk?",
    kw: ["set_theme", "set_style", "set_context", "themes", "presentation"],
    intent:
      "Checks that you can adapt a chart to its audience and medium.",
    short:
      "Seaborn comes with customised themes and a high-level interface to control the look of Matplotlib figures. Calling set_theme applies its defaults. Seaborn splits the parameters into two independent groups: style, controlled with axes_style and set_style, and scaling, controlled with plotting_context and set_context. There are five preset themes: darkgrid, whitegrid, dark, white and ticks, with darkgrid as the default. The scaling lets you translate a figure between presentation contexts, for example making a version with readable fonts when projected during a talk.",
    detail: [
      "The grid helps a plot act as a lookup table for quantitative information.",
      "Seaborn's theme uses Matplotlib's rcParams, so it affects all Matplotlib plots after it is set.",
      "In versions before 0.8, set_theme was called on import; later versions need an explicit call.",
    ],
    ex: "The analyst uses the whitegrid style for a report and a larger context for slides.",
    mistakes: [
      "Using a tiny paper-size font on a projected slide.",
      "Forgetting that set_theme changes later Matplotlib figures too.",
    ],
    follow: ["How do annotations help in a presentation?"],
    points: [
      "set_theme applies defaults",
      "Style and context are separate",
      "Five preset themes",
      "Context scales for audience",
    ],
    notes: "set_style changes the look; set_context changes the scale.",
    src: [
      ["Seaborn: Controlling figure aesthetics", `${S}/tutorial/aesthetics.html`],
      ["Seaborn: An introduction to seaborn", `${S}/tutorial/introduction.html`],
    ],
  }),
  g({
    slug: "facetgrid-small-multiples",
    topic: "Chart choice",
    d: "medium",
    title: "What are small multiples, and how does FacetGrid create them?",
    kw: ["facetgrid", "small multiples", "row", "col", "hue"],
    intent:
      "Checks that you can compare subsets of a dataset with repeated panels.",
    short:
      "Small multiples, also called lattice or trellis plots, draw multiple instances of the same plot on different subsets of your dataset, letting a viewer quickly extract a large amount of information about complex data. In Seaborn the FacetGrid class does this. You give it a dataframe and the names of variables for the row, column and hue dimensions; a grid can use up to three dimensions. The variables should be categorical or discrete. relplot, displot, catplot and lmplot use FacetGrid internally and return it, so you can tweak it afterwards. In most cases you use those figure-level functions.",
    detail: [
      "Row and column map to the arrangement of axes, and hue is a third dimension shown by colour.",
      "The figure-level functions handle bookkeeping that synchronises the plots in the grid.",
      "Panels share axes by default, which makes them directly comparable.",
    ],
    ex: "A relplot with col='time' shows lunch and dinner tips in two side-by-side panels.",
    mistakes: [
      "Faceting by a variable with dozens of levels.",
      "Letting each panel use a different axis range when comparison is the goal.",
    ],
    follow: ["How do axes-level and figure-level functions differ?"],
    points: [
      "Same plot on subsets",
      "row, col and hue dimensions",
      "Used by relplot, displot, catplot, lmplot",
      "Categorical variables work best",
    ],
    notes: "Facet by a categorical variable to compare groups side by side.",
    src: [["Seaborn: Building structured multi-plot grids", `${S}/tutorial/axis_grids.html`]],
  }),
  g({
    slug: "pairplot-pairwise-relationships",
    topic: "Seaborn",
    d: "easy",
    title: "What does pairplot show, and when would you use it?",
    kw: ["pairplot", "pairwise", "scatter matrix", "diagonal", "exploration"],
    intent:
      "Checks that you can quickly explore relationships across many numeric columns.",
    short:
      "pairplot plots pairwise relationships in a dataset. By default it creates a grid of Axes in which each numeric variable is shared across the y-axes of one row and the x-axes of one column. The diagonal plots are treated differently: a univariate distribution plot shows the marginal distribution of the variable in that column. The default kind of the off-diagonal plots is a scatter plot, and you can colour by a categorical variable with hue. It is a quick way to scan for relationships and unusual values in the early exploration stage, before choosing specific charts.",
    detail: [
      "corner=True draws only the lower triangle to avoid duplicates.",
      "vars, x_vars and y_vars choose which columns appear.",
      "With many columns the grid becomes large and hard to read.",
    ],
    ex: "A pairplot of four body measurements coloured by species shows which pairs separate the species.",
    mistakes: [
      "Running it on dozens of columns and getting an unreadable grid.",
      "Treating a visible pattern as proof of cause.",
    ],
    follow: ["What does a heatmap of correlations add?"],
    points: [
      "Grid of pairwise scatter plots",
      "Diagonal shows each distribution",
      "hue colours by group",
      "Exploration tool",
    ],
    notes: "pairplot = quick overview of all numeric pairs.",
    src: [["Seaborn: pairplot", `${S}/generated/seaborn.pairplot.html`]],
  }),
  g({
    slug: "heatmap-matrix",
    topic: "Seaborn",
    d: "easy",
    title: "What is a heatmap and which options matter in Seaborn?",
    kw: ["heatmap", "annot", "cmap", "center", "colorbar"],
    intent:
      "Checks that you can display a matrix, such as a correlation table, readably.",
    short:
      "Seaborn's heatmap plots rectangular data as a colour-encoded matrix. It is an axes-level function that draws into the current Axes unless you pass ax, and part of the Axes space is used for a colorbar unless cbar is False. Useful options are annot to write the values in the cells with fmt to format them, cmap to choose the colormap, vmin and vmax to set the colour limits, and center to set the value at the centre of a diverging colormap. mask hides cells, and square makes cells square. Use a diverging map centred at zero for data such as correlations.",
    detail: [
      "The data must be 2D and can be a DataFrame, in which case row and column names become labels.",
      "robust=True uses robust quantiles for the colour range, which limits the effect of outliers.",
      "Annotating values helps readers who cannot judge colour precisely.",
    ],
    ex: "A correlation matrix is shown as a heatmap with annot=True and center=0.",
    mistakes: [
      "Using a sequential map for values centred on zero.",
      "Plotting a huge matrix with unreadable labels.",
    ],
    follow: ["How does vmin and vmax affect comparison?"],
    points: [
      "Colour-encoded matrix",
      "annot writes the values",
      "cmap, vmin, vmax, center control colour",
      "Colorbar by default",
    ],
    notes: "heatmap(data, annot=True, center=0) for correlation-style data.",
    code: [
      "Correlation heatmap",
      `corr = df.corr(numeric_only=True)
sns.heatmap(corr, annot=True, fmt=".2f", cmap="vlag", center=0)`,
      [
        "df.corr builds a square matrix of correlations.",
        "annot and fmt write each value with two decimals.",
        "center=0 puts the neutral colour at zero for a diverging map.",
      ],
      "python",
    ],
    src: [["Seaborn: heatmap", `${S}/generated/seaborn.heatmap.html`]],
  }),
  g({
    slug: "regplot-exploration-not-analysis",
    topic: "Seaborn",
    d: "medium",
    title: "What do regplot and lmplot show, and are they a replacement for statistical analysis?",
    kw: ["regplot", "lmplot", "linear regression", "exploratory analysis", "statsmodels"],
    intent:
      "Checks that you treat a fitted line as a visual guide, not a finished result.",
    short:
      "regplot and lmplot visualise a linear fit. In the simplest use, both draw a scatter plot of two variables, x and y, and then fit a regression model and plot the resulting line with a confidence interval. The documentation says the regression plots are primarily intended to add a visual guide that emphasises patterns in a dataset during exploratory data analysis. Seaborn is not itself a package for statistical analysis; to obtain quantitative measures related to the fit of regression models, use statsmodels. lmplot is figure-level and can facet, while regplot is axes-level.",
    detail: [
      "Exploring a dataset through visualisation is as important as exploring it through tables of statistics.",
      "lmplot combines regplot with a FacetGrid.",
      "A line through noisy data does not prove a relationship.",
    ],
    ex: "An analyst plots bill against tip with regplot, then fits a model with statsmodels to get coefficients.",
    mistakes: [
      "Quoting the plotted line as if it were model results.",
      "Fitting a straight line to clearly curved data.",
    ],
    follow: ["What is the difference between correlation and causation?"],
    points: [
      "Scatter plus fitted line",
      "Visual guide for exploration",
      "Not a replacement for statistics",
      "Use statsmodels for numbers",
    ],
    notes: "Plot to explore; model to measure.",
    src: [["Seaborn: Estimating regression fits", `${S}/tutorial/regression.html`]],
  }),
])
