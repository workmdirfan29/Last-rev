import { defineQuestions } from "../author"
import { q } from "../compact"

const NP = "https://numpy.org/doc/stable"
const PD = "https://pandas.pydata.org/docs/user_guide"
const PA = "https://pandas.pydata.org/docs/reference/api"
const JU = "https://docs.jupyter.org/en/latest"

export default defineQuestions("python-data-science", "fresher", [
  q({
    slug: "ndarray-shape-dtype-and-axes",
    topic: "NumPy",
    d: "easy",
    title: "What are an ndarray's shape, dtype and axes?",
    kw: ["ndarray", "shape", "dtype", "axis", "dimensions"],
    intent: "Checks basic NumPy vocabulary.",
    short:
      "A NumPy `ndarray` is a grid of values that all have the same data type. `shape` is a tuple with the size of each dimension, such as `(3, 4)` for 3 rows and 4 columns, `ndim` is the number of dimensions, and `dtype` is the element type (int64, float64, bool and so on). Axes are the dimensions numbered from 0: for a 2-D array axis 0 runs down the rows and axis 1 across the columns. Operations like `sum(axis=0)` collapse the given axis. Knowing the shape and dtype explains most NumPy errors, so print them when debugging.",
    detail: [
      "`reshape` changes the shape without changing the data.",
      "The dtype determines memory use and numeric precision.",
      "A shape of `(n,)` is a 1-D array, not a column.",
    ],
    ex: "A 3x4 array of floats has shape `(3, 4)`; `a.sum(axis=0)` gives 4 column totals.",
    code: [
      [
        "Shape, dtype, axis",
        "python",
        `import numpy as np\n\na = np.arange(12).reshape(3, 4)\nprint(a.shape, a.ndim, a.dtype)   # (3, 4) 2 int64\nprint(a.sum(axis=0))              # column sums, shape (4,)\nprint(a.sum(axis=1))              # row sums, shape (3,)`,
        ["axis 0 collapses the rows, axis 1 the columns."],
      ],
    ],
    mistakes: [
      "Confusing which axis is collapsed.",
      "Mixing up shape (n,) and (n, 1).",
    ],
    follow: ["What does axis=1 mean for a 2-D array?"],
    points: [
      "Same-type elements",
      "shape, ndim, dtype",
      "Axes numbered from 0",
      "reshape keeps the data",
    ],
    notes: ["Know your shape."],
    src: [
      [
        "NumPy: The absolute basics for beginners",
        `${NP}/user/absolute_beginners.html`,
      ],
      ["NumPy: The N-dimensional array", `${NP}/reference/arrays.ndarray.html`],
    ],
  }),
  q({
    slug: "numpy-indexing-and-boolean-masks",
    topic: "NumPy",
    d: "medium",
    title: "How do slicing, fancy indexing and boolean masks work in NumPy?",
    kw: [
      "numpy indexing",
      "boolean mask",
      "fancy indexing",
      "slicing views",
      "np.where",
    ],
    intent: "Checks selecting data from arrays.",
    short:
      "Basic slicing `a[1:3, :2]` selects ranges along each axis and returns a view, not a copy. Fancy indexing with a list or array of integers, `a[[0, 2]]`, picks specific positions and returns a copy. A boolean mask is an array of True/False created by a comparison, `a[a > 5]`, which selects the elements where it is True (also a copy); combine conditions with `&`, `|` and `~` and parentheses, not `and`/`or`. `np.where(condition, x, y)` chooses between two values elementwise. Masks are the idiomatic replacement for loops that filter data.",
    detail: [
      "Assigning through a mask, `a[a < 0] = 0`, modifies the original array.",
      "Slicing is cheap because it shares memory.",
      "Negative indices count from the end.",
    ],
    ex: "Replacing all negative sensor readings with zero using a mask.",
    code: [
      [
        "Masks and where",
        "python",
        `import numpy as np\n\na = np.array([3, -1, 7, -5, 2])\nprint(a[a > 0])               # [3 7 2]\nprint(a[(a > 0) & (a < 5)])   # [3 2]\na[a < 0] = 0\nprint(np.where(a > 2, "big", "small"))`,
        ["Use `&` with parentheses, not `and`."],
      ],
    ],
    mistakes: [
      "Using and/or between arrays.",
      "Expecting fancy indexing to return a view.",
    ],
    follow: ["Which indexing returns a view?"],
    points: [
      "Slices are views",
      "Fancy and boolean indexing copy",
      "Combine masks with & | ~",
      "np.where for elementwise choice",
    ],
    notes: ["Filter with masks, not loops."],
    src: [
      ["NumPy: Indexing on ndarrays", `${NP}/user/basics.indexing.html`],
      ["NumPy: Copies and views", `${NP}/user/basics.copies.html`],
    ],
  }),
  q({
    slug: "numpy-broadcasting-rules",
    topic: "NumPy",
    d: "medium",
    title: "How does NumPy broadcasting work?",
    kw: [
      "broadcasting",
      "shape compatibility",
      "np.newaxis",
      "elementwise operations",
      "stretching",
    ],
    intent: "Checks a core NumPy concept.",
    short:
      "Broadcasting lets NumPy do arithmetic on arrays of different shapes without copying data. Compare shapes from the last dimension backwards: two dimensions are compatible if they are equal or one of them is 1, and a missing leading dimension counts as 1. The dimension of size 1 is conceptually stretched to match. So a `(3, 4)` array plus a `(4,)` array adds the vector to every row, and a `(3, 1)` column plus a `(1, 4)` row gives a `(3, 4)` result. If shapes are not compatible NumPy raises a `ValueError`. Use `np.newaxis` or `reshape` to add a dimension when you need a different alignment.",
    detail: [
      "It is fast because the loops run in compiled code and no tiled copy is made.",
      "Standardising columns, `(X - X.mean(axis=0)) / X.std(axis=0)`, relies on broadcasting.",
      "Check shapes when results look wrong.",
    ],
    ex: "Subtracting each column's mean from a table of measurements.",
    code: [
      [
        "Row and column broadcast",
        "python",
        `import numpy as np\n\nm = np.ones((3, 4))\nrow = np.array([1, 2, 3, 4])\ncol = np.array([[10], [20], [30]])\nprint((m + row).shape)    # (3, 4)\nprint((col + row).shape)  # (3, 4)`,
        ["Size-1 dimensions stretch to match."],
      ],
    ],
    mistakes: [
      "Subtracting a column mean without keeping dims.",
      "Ignoring a shape error message.",
    ],
    follow: ["Are (3, 4) and (3,) compatible?"],
    points: [
      "Compare shapes from the right",
      "Equal or 1 is compatible",
      "Size-1 dimensions stretch",
      "No data copied",
    ],
    notes: ["Match from the trailing axis."],
    src: [
      ["NumPy: Broadcasting", `${NP}/user/basics.broadcasting.html`],
      ["NumPy: The absolute basics", `${NP}/user/absolute_beginners.html`],
    ],
  }),
  q({
    slug: "numpy-views-versus-copies",
    topic: "NumPy",
    d: "medium",
    title: "When does NumPy return a view and when a copy?",
    kw: [
      "numpy view",
      "numpy copy",
      "shared memory",
      "base attribute",
      "unexpected modification",
    ],
    intent: "Checks a source of subtle bugs.",
    short:
      "A view is a new array object that shares the same memory as another array, so changing one changes the other; a copy owns its own data. Basic slicing and `reshape` (when possible) return views, whereas fancy indexing with integer arrays, boolean masks, `copy()` and most arithmetic return copies. Views are efficient but can cause surprising changes when you modify a slice, so call `.copy()` when you need independence. Check with `np.shares_memory(a, b)` or the `.base` attribute (None means the array owns its data). The NumPy documentation has a page that lists which operations give which.",
    detail: [
      "Modifying a large array through a small slice keeps the whole array alive in memory.",
      "`flatten()` copies, while `ravel()` returns a view when it can.",
      "Be careful when passing slices to functions that modify arrays in place.",
    ],
    ex: "Setting `b = a[:3]; b[0] = 99` changes `a[0]` too.",
    code: [
      [
        "View vs copy",
        "python",
        `import numpy as np\n\na = np.arange(5)\nb = a[:3]          # view\nb[0] = 99\nprint(a)            # [99  1  2  3  4]\n\nc = a[[0, 1]].copy()\nc[0] = -1\nprint(a[0])         # 99, unchanged`,
        ["The slice shares memory; the copy does not."],
      ],
    ],
    mistakes: [
      "Modifying a slice and expecting the original to stay intact.",
      "Assuming all indexing returns views.",
    ],
    follow: ["How can you check whether two arrays share memory?"],
    points: [
      "View shares memory",
      "Slicing gives views",
      "Fancy and boolean indexing copy",
      "Use .copy() for independence",
    ],
    notes: ["Same data, different window."],
    src: [
      ["NumPy: Copies and views", `${NP}/user/basics.copies.html`],
      ["NumPy: Indexing on ndarrays", `${NP}/user/basics.indexing.html`],
    ],
  }),
  q({
    slug: "vectorization-versus-python-loops",
    topic: "NumPy",
    d: "easy",
    title: "What is vectorization, and why is it faster than a Python loop?",
    kw: [
      "vectorization",
      "ufunc",
      "compiled loops",
      "performance",
      "elementwise",
    ],
    intent: "Checks the key NumPy performance idea.",
    short:
      "Vectorization means expressing an operation on whole arrays, such as `a * b + c` or `np.sqrt(a)`, so NumPy performs the loop inside optimised compiled code instead of running Python bytecode for each element. Universal functions (ufuncs) apply elementwise over arrays and support broadcasting. Because arrays store typed values contiguously, this avoids the per-element overhead of Python objects, and can be many times faster for large data. Replace explicit loops with array expressions, aggregations (`sum`, `mean`), masks and `np.where`. Some algorithms cannot be vectorised easily; then consider specialised libraries or compiled tools.",
    detail: [
      "Vectorised code is usually shorter and easier to read.",
      "Temporary arrays use memory, so for huge data process in chunks.",
      "Measure with `timeit` to confirm the benefit.",
    ],
    ex: "Computing the distance of a million points from the origin in one expression.",
    code: [
      [
        "Loop vs vector",
        "python",
        `import numpy as np\n\nx = np.random.default_rng(0).random(1_000_000)\n\ntotal = 0.0\nfor v in x:                 # slow Python loop\n    total += v * v\n\nfast = (x * x).sum()        # vectorised\nprint(np.isclose(total, fast))`,
        ["The vectorised line runs the loop in compiled code."],
      ],
    ],
    mistakes: [
      "Looping over arrays element by element.",
      "Assuming vectorisation helps tiny arrays.",
    ],
    follow: ["What is a ufunc?"],
    points: [
      "Whole-array expressions",
      "Loops run in compiled code",
      "ufuncs and broadcasting",
      "Measure the gain",
    ],
    notes: ["Think in arrays."],
    src: [
      [
        "NumPy: The absolute basics for beginners",
        `${NP}/user/absolute_beginners.html`,
      ],
      ["Python: timeit", "https://docs.python.org/3/library/timeit.html"],
    ],
  }),
  q({
    slug: "numpy-aggregations-and-axis-argument",
    topic: "NumPy",
    d: "easy",
    title:
      "How do aggregations like `sum`, `mean` and `std` use the axis argument?",
    kw: ["axis argument", "mean std", "keepdims", "np.sum", "aggregation"],
    intent: "Checks summarising arrays.",
    short:
      "Functions such as `sum`, `mean`, `std`, `min`, `max` and `argmax` reduce an array along an axis. Without `axis` they reduce all elements to a single number. With `axis=0` on a 2-D array they collapse the rows and return one result per column; `axis=1` collapses the columns and returns one per row. `keepdims=True` keeps the reduced axis with size 1, which helps later broadcasting, for example subtracting row means. Note `np.std` divides by N by default (`ddof=0`); pass `ddof=1` for the sample standard deviation. NaN values make most aggregations return NaN unless you use the `nan*` versions such as `np.nanmean`.",
    detail: [
      "`argmax` returns the index of the maximum, not the value.",
      "Cumulative versions (`cumsum`) keep the array shape.",
      "Specify dtype for accumulations if overflow is possible.",
    ],
    ex: "Computing each student's average across subjects with `scores.mean(axis=1)`.",
    mistakes: [
      "Forgetting ddof=1 for sample standard deviation.",
      "Not handling NaNs.",
    ],
    follow: ["What does keepdims do?"],
    points: [
      "No axis = single number",
      "axis=0 per column, axis=1 per row",
      "keepdims for broadcasting",
      "ddof and NaN handling",
    ],
    notes: ["Pick the axis you collapse."],
    src: [
      ["NumPy: numpy.mean", `${NP}/reference/generated/numpy.mean.html`],
      ["NumPy: numpy.std", `${NP}/reference/generated/numpy.std.html`],
    ],
  }),
  q({
    slug: "numpy-random-generator",
    topic: "NumPy",
    d: "easy",
    title: "How should you generate random numbers in NumPy?",
    kw: [
      "default_rng",
      "random generator",
      "seed",
      "random choice",
      "reproducible randomness",
    ],
    intent: "Checks modern random number practice.",
    short:
      "Create a generator with `rng = np.random.default_rng(seed)` and call its methods: `rng.random(5)` for floats in [0, 1), `rng.integers(0, 10, size=5)`, `rng.normal(loc, scale, size)`, `rng.choice(items, size, replace=False)` and `rng.shuffle(a)`. Passing a seed makes the sequence reproducible, and each generator keeps its own state, so different parts of a program do not interfere, unlike the old global `np.random.seed`. The NumPy documentation recommends the Generator API for new code. These are pseudo-random numbers suitable for simulation and sampling but not for security; use Python's `secrets` for tokens.",
    detail: [
      "Pass the generator to functions instead of using global state.",
      "`SeedSequence.spawn` creates independent streams for parallel work.",
      "Record the seed with experiment results.",
    ],
    ex: "Shuffling a dataset reproducibly before splitting.",
    code: [
      [
        "Reproducible generator",
        "python",
        `import numpy as np\n\nrng = np.random.default_rng(42)\nprint(rng.integers(0, 100, size=3))\nprint(rng.choice(["a", "b", "c"], size=2, replace=False))`,
        ["Same seed, same sequence."],
      ],
    ],
    mistakes: [
      "Using global np.random.seed in new code.",
      "Using NumPy random for passwords.",
    ],
    follow: ["How do you get independent streams for parallel workers?"],
    points: [
      "default_rng(seed)",
      "Methods on the generator",
      "Own state per generator",
      "Not for security",
    ],
    notes: ["Seeded generator, not global state."],
    src: [
      ["NumPy: Random generator", `${NP}/reference/random/generator.html`],
      ["NumPy: Random sampling", `${NP}/reference/random/index.html`],
    ],
  }),
  q({
    slug: "numpy-linear-algebra-basics",
    topic: "NumPy",
    d: "medium",
    title: "How do you do basic linear algebra in NumPy?",
    kw: [
      "matrix multiplication",
      "np.linalg",
      "solve",
      "inverse",
      "dot product",
    ],
    intent: "Checks matrix operations.",
    short:
      "Use the `@` operator or `np.matmul` for matrix multiplication; `*` is elementwise multiplication, a common mix-up. `np.dot` handles dot products, `a.T` transposes, and `np.linalg` offers `inv`, `det`, `eig`, `svd` and `norm`. To solve a linear system Ax = b use `np.linalg.solve(A, b)`, which is more accurate and efficient than computing the inverse and multiplying. Matrix shapes must be compatible: `(m, n) @ (n, p)` gives `(m, p)`. Near-singular matrices give unstable results, and exactly singular ones raise `LinAlgError`. These operations underlie linear regression, PCA and neural networks.",
    detail: [
      "Floating-point errors mean results are approximate; compare with `np.allclose`.",
      "`np.linalg.lstsq` solves least-squares problems for non-square systems.",
      "Prefer decompositions and solvers over explicit inverses.",
    ],
    ex: "Solving for coefficients of a small system of equations.",
    code: [
      [
        "Solve a system",
        "python",
        `import numpy as np\n\nA = np.array([[3.0, 1.0], [1.0, 2.0]])\nb = np.array([9.0, 8.0])\nx = np.linalg.solve(A, b)\nprint(x)                      # [2. 3.]\nprint(np.allclose(A @ x, b))  # True`,
        ["`solve` avoids forming the inverse."],
      ],
    ],
    mistakes: [
      "Using * for matrix multiplication.",
      "Inverting matrices when solve would do.",
    ],
    follow: ["Why prefer solve to inv?"],
    points: [
      "@ is matrix multiplication",
      "* is elementwise",
      "np.linalg.solve over inv",
      "Shapes must align",
    ],
    notes: ["@ for matrices, * for elements."],
    src: [
      ["NumPy: numpy.matmul", `${NP}/reference/generated/numpy.matmul.html`],
      [
        "NumPy: numpy.linalg.solve",
        `${NP}/reference/generated/numpy.linalg.solve.html`,
      ],
    ],
  }),
  q({
    slug: "pandas-loc-iloc-boolean-filtering",
    topic: "Pandas",
    d: "easy",
    title:
      "What is the difference between `loc`, `iloc` and boolean filtering in pandas?",
    kw: [
      "loc iloc",
      "boolean indexing",
      "query",
      "label vs position",
      "select rows columns",
    ],
    intent: "Checks the core selection syntax.",
    short:
      "`df.loc[rows, cols]` selects by label: row index labels and column names, and slices include the end label. `df.iloc[rows, cols]` selects by integer position, like Python slicing, excluding the end. Boolean filtering passes a True/False Series: `df[df['age'] > 30]` or `df.loc[df['age'] > 30, ['name', 'age']]`; combine conditions with `&`, `|`, `~` and parentheses. `df.query('age > 30 and city == \"Pune\"')` is a readable alternative. To change values, use `loc` with both row and column selectors in one step (`df.loc[mask, 'col'] = value`) rather than chained indexing.",
    detail: [
      "Unlabelled default indexes make labels and positions coincide, which hides the difference.",
      "`isin` filters by a list of values.",
      "Column selection `df['a']` returns a Series; `df[['a']]` returns a DataFrame.",
    ],
    ex: "Selecting the name and salary of employees in one department.",
    code: [
      [
        "Selecting",
        "python",
        `import pandas as pd\n\ndf = pd.DataFrame({"name": ["A", "B", "C"], "age": [25, 35, 45]}, index=[10, 20, 30])\nprint(df.loc[20, "name"])      # B  (label)\nprint(df.iloc[1, 0])           # B  (position)\nprint(df.loc[df["age"] > 30, "name"].tolist())   # ['B', 'C']`,
        ["`loc` uses labels, `iloc` positions."],
      ],
    ],
    mistakes: [
      "Using and/or between conditions.",
      "Assigning through chained indexing.",
    ],
    follow: ["Is the end of a loc slice inclusive?"],
    points: [
      "loc by label, iloc by position",
      "Boolean masks with & | ~",
      "query for readable filters",
      "Assign with loc",
    ],
    notes: ["Label or position?"],
    src: [
      ["pandas: Indexing and selecting data", `${PD}/indexing.html`],
      ["pandas: DataFrame.loc", `${PA}/pandas.DataFrame.loc.html`],
    ],
  }),
  q({
    slug: "pandas-groupby-split-apply-combine",
    topic: "Pandas",
    d: "medium",
    title: "How does `groupby` work in pandas?",
    kw: [
      "groupby",
      "split apply combine",
      "agg",
      "transform",
      "named aggregation",
    ],
    intent: "Checks aggregation skills.",
    short:
      "`groupby` follows the split-apply-combine pattern: split the DataFrame into groups by one or more keys, apply a function to each group, and combine the results. `df.groupby('city')['sales'].sum()` gives total sales per city. Use `agg` for several summaries at once, with named aggregation `agg(total=('sales', 'sum'), n=('id', 'count'))`; `transform` returns a result aligned to the original rows (for example, each row's share of its group total); `apply` runs arbitrary functions but is slower. `as_index=False` keeps the group keys as columns. By default rows with missing keys are dropped (`dropna=True`), so check null keys.",
    detail: [
      "Grouping by several columns gives a MultiIndex unless you reset it.",
      "`size()` counts rows per group including NaN; `count()` counts non-null values.",
      "Built-in aggregations are faster than custom functions.",
    ],
    ex: "Total and average order value per customer.",
    code: [
      [
        "Named aggregation",
        "python",
        `import pandas as pd\n\ndf = pd.DataFrame({"city": ["A", "A", "B"], "sales": [10, 20, 5]})\nout = df.groupby("city", as_index=False).agg(total=("sales", "sum"), avg=("sales", "mean"))\nprint(out)`,
        ["One row per group with named results."],
      ],
    ],
    mistakes: [
      "Confusing count and size.",
      "Forgetting that NaN keys are dropped.",
    ],
    follow: ["When do you use transform instead of agg?"],
    points: [
      "Split, apply, combine",
      "agg for summaries, transform for aligned results",
      "as_index=False",
      "NaN keys dropped by default",
    ],
    notes: ["Group, summarise, combine."],
    src: [
      ["pandas: Group by: split-apply-combine", `${PD}/groupby.html`],
      ["pandas: DataFrame.groupby", `${PA}/pandas.DataFrame.groupby.html`],
    ],
  }),
  q({
    slug: "pandas-merge-join-concat",
    topic: "Pandas",
    d: "medium",
    title: "How do `merge`, `join` and `concat` differ in pandas?",
    kw: ["merge", "join", "concat", "inner left outer", "key column"],
    intent: "Checks combining datasets.",
    short:
      "`pd.merge(left, right, on='key', how='inner')` combines tables like a SQL join: `inner` keeps keys present in both, `left` keeps all left rows, `right` all right rows, `outer` all keys from both. Use `left_on` and `right_on` for differently named keys, and `suffixes` to distinguish overlapping columns. `DataFrame.join` joins on the index by default. `pd.concat([a, b])` stacks tables vertically (axis=0) or side by side (axis=1) aligned on the index without matching keys. After merging, check row counts: duplicate keys on both sides multiply rows, and `validate='one_to_one'` or `'many_to_one'` makes pandas raise an error if the assumption is wrong. `indicator=True` shows where each row came from.",
    detail: [
      "Unmatched rows in a left join get NaN in the right columns.",
      "Check key dtypes match, otherwise the join finds nothing.",
      "Merge on columns rather than relying on the index when possible.",
    ],
    ex: "Adding customer details to an orders table with a left merge on customer id.",
    mistakes: ["Not validating key uniqueness.", "Mismatched key dtypes."],
    follow: ["How can you detect unexpected row multiplication?"],
    points: [
      "merge = SQL-style join",
      "how: inner, left, right, outer",
      "concat stacks tables",
      "validate and indicator for safety",
    ],
    notes: ["Join on keys, stack with concat."],
    src: [
      ["pandas: Merge, join, concatenate and compare", `${PD}/merging.html`],
      ["pandas: DataFrame.merge", `${PA}/pandas.DataFrame.merge.html`],
    ],
  }),
  q({
    slug: "pandas-pivot-table-and-reshaping",
    topic: "Pandas",
    d: "medium",
    title: "How do you reshape data with `pivot_table`, `melt` and `stack`?",
    kw: [
      "pivot_table",
      "melt",
      "wide vs long format",
      "stack unstack",
      "reshape",
    ],
    intent: "Checks reshaping between wide and long formats.",
    short:
      "Wide format has one column per category (months as columns); long format has one row per observation with a variable and a value column. `melt` turns wide into long: `df.melt(id_vars='product', var_name='month', value_name='sales')`. `pivot` and `pivot_table` go the other way: `pivot_table(index='product', columns='month', values='sales', aggfunc='sum')` aggregates duplicates and produces a summary grid, while `pivot` requires unique index/column pairs. `stack` and `unstack` move column levels into the index and back. Plotting and modelling libraries usually prefer long, tidy data, whereas reports prefer wide tables.",
    detail: [
      "Use `fill_value` in `pivot_table` to replace missing cells.",
      "`margins=True` adds totals.",
      "Reset the index afterwards if you need ordinary columns.",
    ],
    ex: "Turning a table with one column per month into a long table for plotting.",
    mistakes: [
      "Using pivot on duplicate pairs.",
      "Forgetting to reset the index.",
    ],
    follow: ["When do you prefer long format?"],
    points: [
      "melt: wide to long",
      "pivot_table: long to wide with aggregation",
      "pivot needs unique pairs",
      "Long format suits plotting and modelling",
    ],
    notes: ["Reshape to suit the task."],
    src: [
      ["pandas: Reshaping and pivot tables", `${PD}/reshaping.html`],
      [
        "pandas: DataFrame.pivot_table",
        `${PA}/pandas.DataFrame.pivot_table.html`,
      ],
    ],
  }),
  q({
    slug: "pandas-apply-versus-vectorized",
    topic: "Pandas",
    d: "medium",
    title: "Why is `apply` often slower than vectorised pandas operations?",
    kw: [
      "apply vs vectorization",
      "row-wise apply",
      "str accessor",
      "performance",
      "numpy operations",
    ],
    intent: "Checks performance awareness in pandas.",
    short:
      "`DataFrame.apply` and `Series.apply` call a Python function for every element or row, which carries Python-level overhead for each call. Built-in vectorised operations, such as arithmetic between columns, comparison masks, `.str` and `.dt` accessors, `np.where` and `clip`, run in optimised compiled code over whole arrays and are typically much faster on large data. The pandas performance guide recommends avoiding row-wise Python functions for large data. Use `apply` for logic that cannot be expressed vectorised, or for small data where clarity matters, and always profile with `timeit` before optimising. `np.select` handles multiple conditions without a loop.",
    detail: [
      "Row-wise `axis=1` apply is the slowest pattern.",
      "Precompute lookups with `map` and a dictionary.",
      "For heavy custom logic consider NumPy, Numba or pandas' evaluation tools.",
    ],
    ex: "Computing price times quantity as `df['price'] * df['qty']` instead of applying a function per row.",
    mistakes: [
      "Row-wise apply on millions of rows.",
      "Optimising without measuring.",
    ],
    follow: ["Which pandas accessors operate on whole columns?"],
    points: [
      "apply = a Python call per element or row",
      "Vectorised ops run in compiled code",
      "Use .str, .dt, np.where, np.select",
      "Profile first",
    ],
    notes: ["Prefer column operations."],
    src: [
      ["pandas: Enhancing performance", `${PD}/enhancingperf.html`],
      ["pandas: Essential basic functionality", `${PD}/basics.html`],
    ],
  }),
  q({
    slug: "pandas-copy-on-write-and-chained-assignment",
    topic: "Pandas",
    d: "hard",
    title: "What is chained assignment, and what does Copy-on-Write change?",
    kw: [
      "chained assignment",
      "SettingWithCopyWarning",
      "copy on write",
      "df.loc assignment",
      "views vs copies",
    ],
    intent: "Checks understanding of a notorious pandas pitfall.",
    short:
      "Chained assignment means indexing twice and assigning, such as `df[df['a'] > 0]['b'] = 1`. The first step may return a copy, so the assignment can silently modify a temporary object and leave `df` unchanged, which pandas used to flag with `SettingWithCopyWarning`. The reliable form does the selection and assignment in a single call: `df.loc[df['a'] > 0, 'b'] = 1`. Copy-on-Write is pandas' newer behaviour model, described in its user guide: any result of an indexing operation behaves as a copy, and data is physically copied only when you modify it, so chained assignment never updates the original and views no longer change parents.",
    detail: [
      "Use `.copy()` when you intend to modify a subset independently.",
      "Method chaining with `assign` avoids in-place surprises.",
      "Check the documentation for your pandas version, as defaults have changed over releases.",
    ],
    ex: "Setting a flag for rows that meet a condition with a single `loc` assignment.",
    code: [
      [
        "Single-step assignment",
        "python",
        `import pandas as pd\n\ndf = pd.DataFrame({"a": [1, -1, 2], "b": [0, 0, 0]})\n\n# wrong: chained, may not update df\n# df[df["a"] > 0]["b"] = 1\n\ndf.loc[df["a"] > 0, "b"] = 1\nprint(df)`,
        ["One `loc` call selects and assigns together."],
      ],
    ],
    mistakes: ["Chained indexing for assignment.", "Ignoring the warning."],
    follow: ["How do you write the safe version?"],
    points: [
      "Double indexing may modify a temporary",
      "Use df.loc[mask, col] = value",
      "Copy-on-Write: results behave as copies",
      "Use .copy() for independent subsets",
    ],
    notes: ["One step: select and assign together."],
    src: [
      ["pandas: Copy-on-Write", `${PD}/copy_on_write.html`],
      ["pandas: Indexing and selecting data", `${PD}/indexing.html`],
    ],
  }),
  q({
    slug: "pandas-datetime-and-resampling",
    topic: "Pandas",
    d: "medium",
    title: "How do you work with dates and time series in pandas?",
    kw: [
      "to_datetime",
      "dt accessor",
      "resample",
      "datetime index",
      "time zones",
    ],
    intent: "Checks time-series handling.",
    short:
      "Convert text to datetimes with `pd.to_datetime(col)`, giving `format=` when you know it and `errors='coerce'` to turn bad values into `NaT`. The `.dt` accessor extracts parts (`.dt.year`, `.dt.month`, `.dt.day_name()`). Setting a datetime column as the index enables slicing by date strings (`df['2026-01']`) and `resample`, which groups by time frequency: `df.resample('W').sum()` for weekly totals. Rolling windows (`rolling(7).mean()`) smooth data, and `shift` creates lags. Be explicit about time zones with `tz_localize` and `tz_convert`, and keep dates as datetimes rather than strings so sorting and arithmetic work.",
    detail: [
      "Ambiguous formats such as 03/04/2026 need `dayfirst` or an explicit format.",
      "Time zone-aware and naive timestamps cannot be mixed in comparisons.",
      "Sort the index before resampling.",
    ],
    ex: "Daily sales aggregated to monthly totals with `resample('MS')`.",
    code: [
      [
        "Datetimes and resample",
        "python",
        `import pandas as pd\n\ndf = pd.DataFrame({"when": ["2026-01-01", "2026-01-15", "2026-02-03"], "n": [1, 2, 3]})\ndf["when"] = pd.to_datetime(df["when"])\nmonthly = df.set_index("when").resample("MS")["n"].sum()\nprint(monthly)`,
        ["Index by date, then resample by frequency."],
      ],
    ],
    mistakes: [
      "Keeping dates as strings.",
      "Mixing naive and aware timestamps.",
    ],
    follow: ["What does errors='coerce' do?"],
    points: [
      "to_datetime with format",
      "dt accessor",
      "Date index and resample",
      "Handle time zones explicitly",
    ],
    notes: ["Real datetimes, not strings."],
    src: [
      ["pandas: Time series / date functionality", `${PD}/timeseries.html`],
      ["pandas: to_datetime", `${PA}/pandas.to_datetime.html`],
    ],
  }),
  q({
    slug: "pandas-categorical-and-memory",
    topic: "Pandas",
    d: "medium",
    title: "How can the categorical dtype and dtype choices reduce memory use?",
    kw: [
      "categorical dtype",
      "memory usage",
      "downcasting",
      "astype",
      "string columns",
    ],
    intent: "Checks memory-aware data handling.",
    short:
      "Text columns with few distinct values, like country or status, stored as Python strings repeat the same strings for every row. The `category` dtype stores each distinct value once and keeps small integer codes per row, which can cut memory substantially and speed up grouping. Check memory with `df.memory_usage(deep=True)` or `df.info(memory_usage='deep')`. Convert with `astype('category')`, or when reading with `dtype={'col': 'category'}`. Downcasting numeric columns (for example int64 to int32 or float64 to float32) also saves space when the range allows. Categoricals can also carry an order for sorting. The pandas scaling guide describes these techniques for larger datasets.",
    detail: [
      "Do not use categoricals for columns with mostly unique values.",
      "New categories must be added before assignment.",
      "Be careful that downcasting does not overflow or lose precision.",
    ],
    ex: "Converting a 'country' column in a 10 million row table to categorical.",
    mistakes: [
      "Categorical on high-cardinality columns.",
      "Downcasting without checking the value range.",
    ],
    follow: ["How do you measure a DataFrame's real memory use?"],
    points: [
      "Distinct values stored once",
      "memory_usage(deep=True)",
      "astype('category')",
      "Downcast numerics carefully",
    ],
    notes: ["Store repeated labels once."],
    src: [
      ["pandas: Categorical data", `${PD}/categorical.html`],
      ["pandas: Scaling to large datasets", `${PD}/scale.html`],
    ],
  }),
  q({
    slug: "pandas-working-with-data-larger-than-memory",
    topic: "Pandas",
    d: "hard",
    title: "How do you handle datasets that do not fit in memory with pandas?",
    kw: ["large datasets", "chunksize", "usecols", "parquet", "scaling pandas"],
    intent: "Checks strategies for scale.",
    short:
      "The pandas scaling guide suggests several steps. Load less: read only the columns you need with `usecols` and specify compact dtypes. Process in chunks: `pd.read_csv(path, chunksize=...)` returns an iterator of DataFrames so you aggregate each piece and combine the partial results. Use efficient formats such as Parquet, which is columnar and allows reading selected columns. Convert text to categoricals. When a single machine's memory is still not enough, use libraries that scale pandas-like operations, such as Dask, or push the aggregation into a database or warehouse and pull only the result. Always check whether sampling would be enough for exploration.",
    detail: [
      "Not every operation can be done chunk by chunk, for example sorting the whole data.",
      "Measure memory before and after changes.",
      "Keep intermediate results small.",
    ],
    ex: "Computing totals per customer from a 20 GB CSV by aggregating in chunks.",
    code: [
      [
        "Chunked aggregation",
        "python",
        `import pandas as pd\n\ntotals = {}\nfor chunk in pd.read_csv("big.csv", usecols=["customer", "amount"], chunksize=500_000):\n    for k, v in chunk.groupby("customer")["amount"].sum().items():\n        totals[k] = totals.get(k, 0) + v`,
        ["Only one chunk is in memory at a time."],
      ],
    ],
    mistakes: [
      "Loading everything then discovering it does not fit.",
      "Using row loops over big frames.",
    ],
    follow: ["Which operations are hard to do in chunks?"],
    points: [
      "Load fewer columns and smaller dtypes",
      "Chunked reading",
      "Columnar formats",
      "Scale-out tools or push down to the database",
    ],
    notes: ["Reduce early, aggregate in pieces."],
    src: [
      ["pandas: Scaling to large datasets", `${PD}/scale.html`],
      ["pandas: IO tools (chunking, Parquet)", `${PD}/io.html`],
    ],
  }),
  q({
    slug: "reading-csv-files-with-read-csv",
    topic: "Data loading (CSV, JSON, SQL)",
    d: "easy",
    title: "Which `read_csv` options matter most in practice?",
    kw: ["read_csv", "dtype", "parse_dates", "na_values", "usecols"],
    intent: "Checks careful CSV loading.",
    short:
      "`pd.read_csv` guesses a lot, so give it hints. `sep` sets the delimiter, `header` and `names` control column names, `usecols` limits columns, `dtype` fixes types (keep ids and zip codes as strings so leading zeros survive), `parse_dates` converts date columns, `na_values` lists extra markers to treat as missing such as 'N/A' or '-', `encoding` fixes decoding problems, `nrows` reads a sample, and `chunksize` streams large files. `on_bad_lines` decides what to do with malformed rows. After loading, check `df.dtypes` and `df.info()`: mixed types in a column usually mean dirty data. Reading only what you need is faster and saves memory.",
    detail: [
      "`index_col` makes a column the index.",
      "A thousands separator can be handled with `thousands=','`.",
      "Prefer explicit dtypes to type inference in pipelines.",
    ],
    ex: "Reading a customers file where phone numbers must stay as text.",
    mistakes: ["Letting ids become integers.", "Ignoring mixed-type warnings."],
    follow: ["How do you read just the first 1000 rows?"],
    points: [
      "sep, usecols, dtype",
      "parse_dates, na_values",
      "encoding and on_bad_lines",
      "Verify dtypes after loading",
    ],
    notes: ["Tell pandas what to expect."],
    src: [
      ["pandas: read_csv", `${PA}/pandas.read_csv.html`],
      ["pandas: IO tools", `${PD}/io.html`],
    ],
  }),
  q({
    slug: "reading-nested-json-with-json-normalize",
    topic: "Data loading (CSV, JSON, SQL)",
    d: "medium",
    title: "How do you load nested JSON into a DataFrame?",
    kw: [
      "read_json",
      "json_normalize",
      "nested json",
      "record_path",
      "flatten",
    ],
    intent: "Checks handling of semi-structured data.",
    short:
      "`pd.read_json` handles JSON that is already table-like (a list of records or column-oriented data), controlled by the `orient` argument. API responses are often nested: objects within objects and lists of records. `pd.json_normalize(data)` flattens nested dictionaries into columns with dotted names, `record_path='items'` expands a list of records into rows, and `meta=['id', 'customer.name']` carries parent fields into each row. Load the JSON with the `json` module first when you need to inspect or fix it. Check the resulting columns, since lists left inside cells need further expansion with `explode`. Define a schema or validate input for data from external sources.",
    detail: [
      "Missing keys become NaN.",
      "Large JSON files can be read as JSON Lines with `lines=True`.",
      "Convert types after flattening.",
    ],
    ex: "Flattening an orders API response into one row per line item with the order id repeated.",
    code: [
      [
        "json_normalize",
        "python",
        `import pandas as pd\n\ndata = [{"id": 1, "customer": {"name": "Asha"}, "items": [{"sku": "A", "qty": 2}, {"sku": "B", "qty": 1}]}]\ndf = pd.json_normalize(data, record_path="items", meta=["id", ["customer", "name"]])\nprint(df)`,
        ["One row per item with parent fields attached."],
      ],
    ],
    mistakes: [
      "Using read_json on deeply nested data.",
      "Leaving lists inside cells.",
    ],
    follow: ["What does record_path do?"],
    points: [
      "read_json for table-like JSON",
      "json_normalize flattens nesting",
      "record_path expands lists",
      "meta carries parent fields",
    ],
    notes: ["Flatten before analysing."],
    src: [
      ["pandas: json_normalize", `${PA}/pandas.json_normalize.html`],
      ["pandas: read_json", `${PA}/pandas.read_json.html`],
    ],
  }),
  q({
    slug: "reading-and-writing-sql-with-pandas",
    topic: "Data loading (CSV, JSON, SQL)",
    d: "medium",
    title: "How do you read from and write to SQL databases with pandas?",
    kw: [
      "read_sql",
      "to_sql",
      "sqlalchemy",
      "parameterized query",
      "if_exists",
    ],
    intent: "Checks database integration and safety.",
    short:
      "`pd.read_sql(query, connection)` runs a SQL query and returns a DataFrame; `df.to_sql(name, connection, if_exists='append', index=False)` writes a DataFrame to a table. Use a SQLAlchemy engine or connection (the standard library `sqlite3` connection also works for SQLite). Pass user values through the `params` argument, not by formatting them into the SQL string, to avoid SQL injection. Do filtering and aggregation in SQL so you transfer less data, and read big results in chunks with `chunksize`. For `to_sql`, `if_exists` controls whether to fail, replace or append, and `method='multi'` or batch sizes speed up inserts. Make the dtypes and the table schema explicit for production loads.",
    detail: [
      "`to_sql` is convenient but is not a replacement for proper bulk loading tools on very large data.",
      "Close connections or use context managers.",
      "Mind time zones and types when moving data between systems.",
    ],
    ex: "Querying last week's orders with a date parameter into a DataFrame.",
    mistakes: [
      "Formatting values into the SQL string.",
      "Pulling the whole table when a query could filter.",
    ],
    follow: ["What does if_exists control?"],
    points: [
      "read_sql and to_sql",
      "Use params for values",
      "Filter in the database",
      "if_exists: fail, replace, append",
    ],
    notes: ["Parameterise, push work to SQL."],
    src: [
      ["pandas: read_sql", `${PA}/pandas.read_sql.html`],
      ["pandas: DataFrame.to_sql", `${PA}/pandas.DataFrame.to_sql.html`],
    ],
  }),
  q({
    slug: "parquet-versus-csv",
    topic: "Data loading (CSV, JSON, SQL)",
    d: "medium",
    title: "Why choose Parquet over CSV for analytical data?",
    kw: [
      "parquet",
      "csv",
      "columnar format",
      "dtype preservation",
      "compression",
    ],
    intent: "Checks storage-format judgement.",
    short:
      "CSV is a plain-text format that every tool can read and humans can inspect, but it has no types (everything is text and must be parsed), no standard for dates and missing values, and it is slow and large for big data. Parquet is a binary columnar format: it stores column types, supports compression, and lets readers load only the columns they need, so it is usually smaller and much faster to read for analytics. pandas reads and writes it with `read_parquet` and `to_parquet` using an engine library such as pyarrow. Use CSV for small, human-readable exchange and Parquet for intermediate and large datasets within data pipelines.",
    detail: [
      "Schema is stored with the data, which avoids dtype guessing.",
      "Partitioning by column values speeds up filtered reads.",
      "Parquet files are not human-readable without tools.",
    ],
    ex: "Saving a cleaned 5 GB table as Parquet so later steps load only the needed columns.",
    mistakes: [
      "Exchanging large data as CSV by default.",
      "Expecting to open Parquet in a text editor.",
    ],
    follow: ["What does columnar storage allow?"],
    points: [
      "CSV: universal, untyped text",
      "Parquet: typed, compressed, columnar",
      "Read only needed columns",
      "Needs an engine like pyarrow",
    ],
    notes: ["CSV to share, Parquet to work."],
    src: [
      ["pandas: IO tools (Parquet)", `${PD}/io.html`],
      [
        "pandas: DataFrame.to_parquet",
        `${PA}/pandas.DataFrame.to_parquet.html`,
      ],
    ],
  }),
  q({
    slug: "cleaning-duplicates",
    topic: "Data cleaning",
    d: "easy",
    title: "How do you find and remove duplicate rows?",
    kw: [
      "duplicated",
      "drop_duplicates",
      "subset keep",
      "key uniqueness",
      "data quality",
    ],
    intent: "Checks a basic cleaning step.",
    short:
      "`df.duplicated()` returns a boolean Series marking repeated rows (the first occurrence is not marked by default), and `df.drop_duplicates()` removes them. Use `subset=['email']` to compare only certain columns and `keep='first'`, `'last'` or `False` to choose which to retain (False drops all copies). Decide first what makes a record a duplicate: identical rows, or the same business key with different values, which needs a rule such as keeping the latest by date after sorting. Count duplicates before deleting and investigate their source, since they may signal a faulty join or repeated extraction. Check key uniqueness explicitly with `df['id'].is_unique`.",
    detail: [
      "Normalise case and whitespace before checking, otherwise near-duplicates slip through.",
      "Keep an audit of removed rows.",
      "Fuzzy duplicates, such as spelling variations, need other techniques.",
    ],
    ex: "Keeping the most recent record per customer id.",
    code: [
      [
        "Keep latest per key",
        "python",
        `import pandas as pd\n\ndf = pd.DataFrame({"id": [1, 1, 2], "updated": ["2026-01-01", "2026-02-01", "2026-01-05"]})\nlatest = df.sort_values("updated").drop_duplicates("id", keep="last")\nprint(latest)`,
        ["Sort, then keep the last row per id."],
      ],
    ],
    mistakes: [
      "Dropping duplicates without checking why they exist.",
      "Ignoring case and spaces.",
    ],
    follow: ["How do you keep the newest record per id?"],
    points: [
      "duplicated and drop_duplicates",
      "subset and keep options",
      "Define what a duplicate is",
      "Investigate causes",
    ],
    notes: ["Understand duplicates before removing."],
    src: [
      [
        "pandas: DataFrame.drop_duplicates",
        `${PA}/pandas.DataFrame.drop_duplicates.html`,
      ],
      ["pandas: Duplicate labels", `${PD}/duplicates.html`],
    ],
  }),
  q({
    slug: "cleaning-missing-values-pandas",
    topic: "Data cleaning",
    d: "medium",
    title: "How do you decide between dropping and filling missing values?",
    kw: [
      "dropna",
      "fillna",
      "interpolate",
      "missing at random",
      "indicator column",
    ],
    intent: "Checks judgement in cleaning.",
    short:
      "Start by measuring: `df.isna().sum()` and the share of missing values per column. Dropping rows (`dropna`) is acceptable when few rows are affected and missingness is not systematic; dropping a column makes sense if most of it is empty. Filling (`fillna`) keeps rows: use a constant like 'unknown' for categories, the median for skewed numbers, forward fill or `interpolate` for ordered time series. Consider why values are missing: if missingness relates to the outcome, simple filling can bias results, and an indicator column can preserve the signal.",
    detail: [
      "`dropna(thresh=n)` keeps rows with at least n non-missing values.",
      "Fill using statistics from the training data only when preparing for machine learning.",
      "Report how many values were imputed.",
    ],
    ex: "Replacing blank strings with NaN, then filling missing ages with the median and adding an `age_missing` flag.",
    mistakes: [
      "Leaving placeholders like -1 as real values.",
      "Filling with the mean of data that has outliers.",
    ],
    follow: ["Why might you add an indicator column?"],
    points: [
      "Measure missingness first",
      "Drop when few and random",
      "Fill with sensible statistics",
      "Convert hidden placeholders",
    ],
    notes: ["Know why it's missing."],
    src: [
      ["pandas: Working with missing data", `${PD}/missing_data.html`],
      ["pandas: DataFrame.fillna", `${PA}/pandas.DataFrame.fillna.html`],
    ],
  }),
  q({
    slug: "fixing-dtypes-and-string-cleaning",
    topic: "Data cleaning",
    d: "medium",
    title: "How do you fix wrong data types and messy text in pandas?",
    kw: [
      "astype",
      "to_numeric coerce",
      "str accessor",
      "strip lower replace",
      "dtype conversion",
    ],
    intent: "Checks day-to-day cleaning operations.",
    short:
      "Wrong types appear as 'object' columns holding numbers as text. Convert with `astype` when the data is clean, and use `pd.to_numeric(col, errors='coerce')` to turn unparseable values into NaN so you can inspect them, and `pd.to_datetime` for dates. Clean text with the `.str` accessor: `.str.strip()`, `.str.lower()`, `.str.replace(r'\\s+', ' ', regex=True)`, `.str.contains()`, `.str.extract()`. Remove currency symbols or thousands separators before converting. Standardise categories with a mapping dictionary (`map` or `replace`) and check results with `value_counts()`, which quickly reveals spelling variants. Validate after cleaning with assertions or checks on ranges and allowed values.",
    detail: [
      "Use the nullable dtypes (`Int64`, `string`) to keep integers with missing values.",
      "Unicode normalisation helps with accented text.",
      "Keep the raw column and write cleaned values to a new one.",
    ],
    ex: "Turning '$1,200.50' strings into floats.",
    code: [
      [
        "Clean and convert",
        "python",
        `import pandas as pd\n\ns = pd.Series([" $1,200.50", "N/A", "300"])\nclean = s.str.strip().str.replace(r"[\\$,]", "", regex=True)\nprint(pd.to_numeric(clean, errors="coerce"))   # 1200.5, NaN, 300.0`,
        ["`coerce` marks bad values as NaN for review."],
      ],
    ],
    mistakes: [
      "astype on dirty data without handling errors.",
      "Not checking value_counts for variants.",
    ],
    follow: ["What does errors='coerce' do?"],
    points: [
      "astype and to_numeric(coerce)",
      "Use the .str accessor",
      "Map categories to canonical values",
      "Validate after cleaning",
    ],
    notes: ["Convert, clean, check."],
    src: [
      ["pandas: Working with text data", `${PD}/text.html`],
      ["pandas: to_numeric", `${PA}/pandas.to_numeric.html`],
    ],
  }),
  q({
    slug: "detecting-outliers-iqr-and-zscore",
    topic: "Data cleaning",
    d: "medium",
    title: "How do you detect outliers, and what do you do with them?",
    kw: ["outliers", "iqr rule", "z-score", "boxplot", "winsorize"],
    intent: "Checks basic outlier handling.",
    short:
      "An outlier is a value far from the rest of the data. Common checks: the IQR rule flags values below Q1 − 1.5×IQR or above Q3 + 1.5×IQR (computed with `quantile`), the z-score flags values far from the mean in standard deviations (`scipy.stats.zscore`), and plots such as box plots and histograms show them visually. The z-score is sensitive to the outliers themselves, so the IQR approach is more robust for skewed data. Investigate before acting: an outlier may be a data entry error (fix or remove), a genuine rare event (keep), or something to cap with winsorising or transform with a log.",
    detail: [
      "Domain knowledge decides whether a value is plausible.",
      "Remove outliers only with a stated reason, not to improve a metric.",
      "Check outliers in each group where distributions differ.",
    ],
    ex: "A salary of 10,000,000 in a table of monthly salaries is probably a data error.",
    code: [
      [
        "IQR rule",
        "python",
        `import pandas as pd\n\ns = pd.Series([10, 12, 11, 13, 95])\nq1, q3 = s.quantile([0.25, 0.75])\niqr = q3 - q1\nmask = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)\nprint(s[mask])   # 95`,
        ["Values beyond 1.5 IQR from the quartiles are flagged."],
      ],
    ],
    mistakes: [
      "Deleting outliers automatically.",
      "Using z-scores on very skewed data.",
    ],
    follow: ["Why is the IQR rule more robust than z-scores?"],
    points: [
      "IQR rule and z-score",
      "Visualise first",
      "Investigate: error or real",
      "Cap, transform or keep, and document",
    ],
    notes: ["Investigate before removing."],
    src: [
      ["pandas: DataFrame.quantile", `${PA}/pandas.DataFrame.quantile.html`],
      [
        "SciPy: scipy.stats.zscore",
        "https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.zscore.html",
      ],
    ],
  }),
  q({
    slug: "eda-checklist",
    topic: "EDA",
    d: "easy",
    title: "What steps do you follow in exploratory data analysis (EDA)?",
    kw: [
      "exploratory data analysis",
      "eda steps",
      "describe",
      "distributions",
      "data profiling",
    ],
    intent: "Checks a structured approach to a new dataset.",
    short:
      "EDA is looking at the data to understand it before modelling. Steps: check shape, column names and dtypes (`info`); look at samples (`head`, `sample`); summarise numeric columns (`describe`) and categorical ones (`value_counts`); count missing values and duplicates; examine distributions with histograms and box plots; check relationships with scatter plots and correlations; compare groups with `groupby`; look for outliers and impossible values; and check the target variable and class balance if modelling. Write down questions and findings and the cleaning decisions they lead to. Validate surprising results against the source or domain experts, because many apparent insights are data errors.",
    detail: [
      "Start with the question you want to answer.",
      "Keep the analysis reproducible in a notebook or script.",
      "Profiling tools can automate part of this but do not replace thinking.",
    ],
    ex: "Discovering that an 'age' column contains values like 999 as a missing marker.",
    mistakes: [
      "Modelling before understanding the data.",
      "Not recording findings.",
    ],
    follow: ["What would you check first in a new dataset?"],
    points: [
      "Shape, types, samples",
      "Summaries and missing values",
      "Distributions and relationships",
      "Record findings and decisions",
    ],
    notes: ["Look before you leap."],
    src: [
      ["pandas: 10 minutes to pandas", `${PD}/10min.html`],
      ["pandas: DataFrame.describe", `${PA}/pandas.DataFrame.describe.html`],
    ],
  }),
  q({
    slug: "describe-value-counts-and-summary-stats",
    topic: "EDA",
    d: "easy",
    title: "What do `describe` and `value_counts` tell you about a dataset?",
    kw: [
      "describe",
      "value_counts",
      "summary statistics",
      "percentiles",
      "categorical summary",
    ],
    intent: "Checks reading summary output.",
    short:
      "For numeric columns `describe()` shows count (non-null values), mean, standard deviation, minimum, quartiles (25%, 50% = median, 75%) and maximum. Compare mean with median to spot skew, min and max to find impossible values, and count to see missing data. For object or category columns `describe(include='object')` gives count, number of unique values, the most frequent value and its frequency. `value_counts()` lists each distinct value with its count (`normalize=True` for proportions, `dropna=False` to include NaN), which reveals spelling variants, rare categories and class imbalance. Always look at the distribution as well as the summary numbers.",
    detail: [
      "Different datasets can have the same summary but very different shapes.",
      "`df.nunique()` counts distinct values per column.",
      "`describe(percentiles=[...])` customises the quantiles.",
    ],
    ex: "`df['status'].value_counts(normalize=True)` showing that 97% of rows are 'active'.",
    mistakes: [
      "Trusting the mean for skewed data.",
      "Ignoring count differences between columns.",
    ],
    follow: ["What does a mean far above the median suggest?"],
    points: [
      "describe: count, mean, std, quartiles",
      "Mean vs median shows skew",
      "value_counts for categories",
      "Look at distributions too",
    ],
    notes: ["Numbers first, then plots."],
    src: [
      ["pandas: DataFrame.describe", `${PA}/pandas.DataFrame.describe.html`],
      ["pandas: Series.value_counts", `${PA}/pandas.Series.value_counts.html`],
    ],
  }),
  q({
    slug: "correlation-is-not-causation",
    topic: "EDA",
    d: "medium",
    title:
      "How do you compute correlations, and why is correlation not causation?",
    kw: [
      "correlation",
      "pearson spearman",
      "df.corr",
      "confounding",
      "causation",
    ],
    intent: "Checks careful interpretation.",
    short:
      "`df.corr()` computes pairwise correlation between numeric columns; by default Pearson, which measures linear association from -1 to 1. `method='spearman'` or `'kendall'` use ranks and capture monotonic relationships and are less sensitive to outliers. A correlation near zero does not mean no relationship, since a non-linear pattern can have low Pearson correlation, so plot the data. A strong correlation does not show that one variable causes the other: both may depend on a third factor (a confounder), the direction may be reversed, or it may be coincidence. Establishing causation needs experiments or careful causal analysis. Check the sample size and inspect scatter plots before drawing conclusions.",
    detail: [
      "Heatmaps help scan many correlations, but beware multiple comparisons.",
      "Correlation with categorical variables needs other measures.",
      "Outliers can create or hide correlations.",
    ],
    ex: "Ice-cream sales and drowning incidents both rise in summer; temperature is the confounder.",
    mistakes: [
      "Concluding cause from correlation.",
      "Using Pearson on clearly curved relationships.",
    ],
    follow: ["What does Spearman correlation measure?"],
    points: [
      "corr() gives pairwise coefficients",
      "Pearson linear, Spearman rank-based",
      "Always plot",
      "Confounders and reverse causation",
    ],
    notes: ["Association, not cause."],
    src: [
      ["pandas: DataFrame.corr", `${PA}/pandas.DataFrame.corr.html`],
      [
        "NumPy: numpy.corrcoef",
        `${NP}/reference/generated/numpy.corrcoef.html`,
      ],
    ],
  }),
  q({
    slug: "notebook-reproducibility-practices",
    topic: "Jupyter workflow",
    d: "medium",
    title: "How do you keep Jupyter notebooks reproducible?",
    kw: [
      "jupyter",
      "notebook reproducibility",
      "hidden state",
      "restart and run all",
      "dependencies",
    ],
    intent: "Checks good notebook habits.",
    short:
      "A notebook keeps variables in a running kernel, and cells can be run in any order, so results can depend on hidden state that is not in the saved file. Make notebooks reproducible by regularly restarting the kernel and running all cells top to bottom, keeping cells in a logical order, importing and configuring everything at the top, setting random seeds, and recording library versions in a requirements file or environment. Load data by relative paths or parameters instead of personal absolute paths. Move reusable code into modules and import it so it can be tested.",
    detail: [
      "The notebook file stores outputs, so stale results can mislead.",
      "Parameterise paths and dates in one cell near the top.",
      "Document the narrative: why each step is done.",
    ],
    ex: "A notebook that fails on a clean 'Restart and Run All' because a cell depended on a variable deleted earlier.",
    mistakes: [
      "Running cells out of order and sharing the result.",
      "Committing notebooks with secrets in outputs.",
    ],
    follow: ["How do you test that a notebook is reproducible?"],
    points: [
      "Hidden kernel state",
      "Restart and run all",
      "Pin versions and seeds",
      "Move reusable code to modules",
    ],
    notes: ["Top to bottom, fresh kernel."],
    src: [
      ["Project Jupyter documentation", `${JU}/`],
      [
        "Jupyter: Content architecture (notebook format)",
        `${JU}/projects/architecture/content-architecture.html`,
      ],
    ],
  }),
  q({
    slug: "notebooks-versus-scripts",
    topic: "Jupyter workflow",
    d: "easy",
    title: "When should you use a notebook and when a Python script or module?",
    kw: [
      "notebook vs script",
      "interactive exploration",
      "production code",
      "refactoring",
      "testing",
    ],
    intent: "Checks judgement about tools.",
    short:
      "Notebooks mix code, output, charts and explanatory text, which makes them excellent for exploration, prototyping, teaching and communicating results. They are weaker for production because of hidden state, difficulty testing and reviewing, and awkward integration with version control and automation. Once the logic is stable, move it into functions in `.py` modules with tests, and call them from scripts or pipelines, keeping the notebook as a thin layer for exploration and reporting. Scripts run predictably from the command line or schedulers, with arguments and logging.",
    detail: [
      "Use magics like `%matplotlib inline` only in notebooks, not in modules.",
      "Notebooks can be executed non-interactively for reports.",
      "Keep large data and secrets out of the repository.",
    ],
    ex: "A data-cleaning function developed in a notebook, then moved to `cleaning.py` with unit tests.",
    mistakes: [
      "Running business-critical jobs from a hand-run notebook.",
      "Copy-pasting cells between notebooks.",
    ],
    follow: ["How do you move code from a notebook into production?"],
    points: [
      "Notebooks: explore and explain",
      "Scripts: repeatable and testable",
      "Refactor stable logic into modules",
      "Notebook as a thin layer",
    ],
    notes: ["Explore in notebooks, ship from modules."],
    src: [
      ["Project Jupyter documentation", `${JU}/`],
      [
        "Python tutorial: Modules",
        "https://docs.python.org/3/tutorial/modules.html",
      ],
    ],
  }),
])
