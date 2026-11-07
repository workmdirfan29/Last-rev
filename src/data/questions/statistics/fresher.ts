import { defineQuestions } from "../author"
import { g } from "../brief"

const SP = "https://docs.scipy.org/doc/scipy/reference/generated"
const NP = "https://numpy.org/doc/stable/reference/generated"
const PD = "https://pandas.pydata.org/docs/reference/api"

export default defineQuestions("statistics", "fresher", [
  g({
    slug: "mean-median-mode-trimmed",
    topic: "Descriptive stats",
    d: "easy",
    title: "What are the mean, median and mode, and how do you compute them in Python?",
    kw: ["mean", "median", "mode", "trimmed mean", "central tendency"],
    intent:
      "Checks that you know the common measures of the centre of a dataset and the tools for each.",
    short:
      "The mean is the arithmetic average, computed with numpy.mean. The median is the middle value of the sorted data, computed with numpy.median. The mode is the most common value, and scipy.stats.mode returns the modal value; if there is more than one, only one is returned. A trimmed mean, scipy.stats.trim_mean, removes a specified fraction of the most positive and most negative elements from each end of the sorted data and then averages the rest. By default numpy computes over the flattened array, and the axis argument chooses rows or columns.",
    detail: [
      "A mean uses every value, so a few extreme values move it; a trimmed mean reduces that effect.",
      "pandas provides the same ideas as Series and DataFrame methods.",
      "Report the measure that fits the shape of the data and say which one you used.",
    ],
    ex: "For delivery times with a few very long delays, the median describes a typical delivery better than the plain mean.",
    mistakes: [
      "Quoting the mean of a heavily skewed variable without the median.",
      "Forgetting the axis argument and averaging a whole table into one number.",
    ],
    follow: ["How does standard deviation describe spread?"],
    points: [
      "Mean = arithmetic average",
      "Median = middle value",
      "Mode = most common value",
      "Trimmed mean drops the extremes",
    ],
    notes: "Mean, median, mode, trimmed mean each answer 'what is typical?' differently.",
    src: [
      ["NumPy: numpy.mean", `${NP}/numpy.mean.html`],
      ["NumPy: numpy.median", `${NP}/numpy.median.html`],
      ["SciPy: scipy.stats.mode", `${SP}/scipy.stats.mode.html`],
      ["SciPy: scipy.stats.trim_mean", `${SP}/scipy.stats.trim_mean.html`],
    ],
  }),
  g({
    slug: "variance-standard-deviation-ddof",
    topic: "Descriptive stats",
    d: "medium",
    title: "What is the difference between population and sample variance, and what does ddof do?",
    kw: ["variance", "standard deviation", "ddof", "sample", "population"],
    intent:
      "Checks that you know why the divisor differs and which library defaults to which.",
    short:
      "Variance and standard deviation measure the spread of a distribution. The ddof argument, delta degrees of freedom, sets the divisor to N minus ddof, where N is the number of elements. NumPy's std and var use ddof=0 by default, which is the population formula. pandas' std is normalised by N minus 1 by default, the sample standard deviation. scipy.stats.describe reports the unbiased variance, with a denominator of the number of observations minus one. Use ddof=1 when your data is a sample from a larger population, and always state which one you used.",
    detail: [
      "The same numbers give different results in NumPy and pandas unless you set ddof explicitly.",
      "scipy.stats.zscore also has ddof, with a default of 0.",
      "The coefficient of variation divides the standard deviation by the mean.",
    ],
    ex: "Calling np.std(x, ddof=1) matches the result of pandas' Series.std() on the same data.",
    mistakes: [
      "Comparing a NumPy result with a pandas result and assuming they are wrong because they differ.",
      "Using the population formula on a small sample without saying so.",
    ],
    follow: ["What is the standard error of the mean?"],
    points: [
      "Divisor is N - ddof",
      "NumPy default ddof is 0",
      "pandas default uses N - 1",
      "State your choice",
    ],
    notes: "np.std(x, ddof=1) = pandas std.",
    src: [
      ["NumPy: numpy.std", `${NP}/numpy.std.html`],
      ["NumPy: numpy.var", `${NP}/numpy.var.html`],
      ["pandas: DataFrame.std", `${PD}/pandas.DataFrame.std.html`],
      ["SciPy: scipy.stats.describe", `${SP}/scipy.stats.describe.html`],
    ],
  }),
  g({
    slug: "percentiles-quartiles-iqr",
    topic: "Descriptive stats",
    d: "easy",
    title: "What are percentiles, quartiles and the interquartile range?",
    kw: ["percentile", "quantile", "quartile", "iqr", "dispersion"],
    intent:
      "Checks that you can describe spread in a way that does not depend on extreme values.",
    short:
      "A percentile is a value below which a given percentage of the data falls. numpy.percentile takes q between 0 and 100, while numpy.quantile takes probabilities between 0 and 1. The quartiles are the 25th, 50th and 75th percentiles. The interquartile range, IQR, is the difference between the 75th and 25th percentiles. The SciPy documentation describes it as a measure of dispersion similar to standard deviation or variance, but much more robust against outliers. pandas describe returns the 25th, 50th and 75th percentiles by default.",
    detail: [
      "scipy.stats.iqr has an rng argument for other percentile ranges.",
      "The IQR of an empty array is NaN.",
      "pandas' quantile also takes values between 0 and 1.",
    ],
    ex: "Salary data with a few executives is summarised with the median and IQR rather than the mean and standard deviation.",
    mistakes: [
      "Passing 0.25 to numpy.percentile when 25 is needed.",
      "Reporting only the range, which depends on the two most extreme points.",
    ],
    follow: ["How are outliers shown on a box plot?"],
    points: [
      "percentile uses 0 to 100",
      "quantile uses 0 to 1",
      "IQR = 75th minus 25th",
      "IQR is robust to outliers",
    ],
    notes: "np.percentile(x, [25, 75]) and scipy.stats.iqr(x).",
    src: [
      ["NumPy: numpy.percentile", `${NP}/numpy.percentile.html`],
      ["NumPy: numpy.quantile", `${NP}/numpy.quantile.html`],
      ["SciPy: scipy.stats.iqr", `${SP}/scipy.stats.iqr.html`],
    ],
  }),
  g({
    slug: "summary-statistics-describe",
    topic: "Descriptive stats",
    d: "easy",
    title: "How do you get summary statistics quickly with pandas describe?",
    kw: ["describe", "summary statistics", "pandas", "percentiles", "scipy.stats.describe"],
    intent:
      "Checks that you start analysis with a summary and know what it contains.",
    short:
      "DataFrame.describe generates descriptive statistics that summarise the central tendency, dispersion and shape of each column's distribution, excluding NaN values. By default only numeric columns are analysed; pass include to analyse non-numeric columns too, or exclude to omit columns by dtype. The percentiles argument takes values between 0 and 1, and by default it returns the 25th, 50th and 75th percentiles. scipy.stats.describe returns the number of observations, minimum and maximum, mean, unbiased variance, skewness and kurtosis for an array.",
    detail: [
      "It is a first look and does not replace plotting the data.",
      "scipy.stats.describe has a nan_policy argument with propagate, raise and omit options.",
      "Check counts first, because missing values reduce them.",
    ],
    ex: "df.describe() shows the count, mean, standard deviation, minimum, quartiles and maximum for every numeric column.",
    mistakes: [
      "Assuming non-numeric columns appear in the default output.",
      "Reading the mean and standard deviation without looking at the count.",
    ],
    follow: ["How would you check a column's skewness?"],
    points: [
      "Summarises each numeric column",
      "NaN values are excluded",
      "include chooses dtypes",
      "Default percentiles 25, 50, 75",
    ],
    notes: "df.describe() is the first call in exploratory analysis.",
    src: [
      ["pandas: DataFrame.describe", `${PD}/pandas.DataFrame.describe.html`],
      ["SciPy: scipy.stats.describe", `${SP}/scipy.stats.describe.html`],
    ],
  }),
  g({
    slug: "skewness-and-kurtosis",
    topic: "Descriptive stats",
    d: "medium",
    title: "What do skewness and kurtosis tell you about a distribution?",
    kw: ["skewness", "kurtosis", "fisher", "tail", "distribution shape"],
    intent:
      "Checks that you can describe the shape of data beyond centre and spread.",
    short:
      "Skewness measures asymmetry. For normally distributed data the skewness should be about zero, and for a unimodal continuous distribution a value above zero means there is more weight in the right tail. Kurtosis is the fourth central moment divided by the square of the variance. Under Fisher's definition 3.0 is subtracted, so a normal distribution gives 0.0; under Pearson's definition it does not. In scipy.stats, skew and kurtosis compute these, skewtest and kurtosistest can check whether the values are close enough to normal, and the bias argument can correct for statistical bias.",
    detail: [
      "The fisher argument of kurtosis chooses between the two definitions and defaults to Fisher's.",
      "Skewness and kurtosis are summaries, so plot the data as well.",
      "A heavy right tail often appears in quantities such as income.",
    ],
    ex: "A column of order values has positive skewness, which agrees with a histogram that has a long right tail.",
    mistakes: [
      "Comparing a Fisher kurtosis with a Pearson one directly.",
      "Treating a value near zero as proof of normality.",
    ],
    follow: ["How can you test normality?"],
    points: [
      "Skewness measures asymmetry",
      "About zero for normal data",
      "Kurtosis relates to tail weight",
      "Fisher definition gives 0 for normal",
    ],
    notes: "Positive skew = longer right tail; Fisher kurtosis of normal = 0.",
    src: [
      ["SciPy: scipy.stats.skew", `${SP}/scipy.stats.skew.html`],
      ["SciPy: scipy.stats.kurtosis", `${SP}/scipy.stats.kurtosis.html`],
    ],
  }),
  g({
    slug: "z-score-standardisation",
    topic: "Descriptive stats",
    d: "easy",
    title: "What is a z-score and how do you compute it?",
    kw: ["z-score", "standardisation", "standard deviation", "scipy.stats.zscore", "outlier"],
    intent:
      "Checks that you can put values from different scales on a common footing.",
    short:
      "A z-score tells you how many standard deviations a value is from the mean. scipy.stats.zscore computes the z-score of each value in the sample, relative to the sample mean and standard deviation. Its ddof argument, the degrees of freedom correction used in the standard deviation, defaults to 0, and nan_policy controls how missing values are handled. Z-scores let you compare values measured on different scales and spot values far from the mean. After standardising, the data has a mean of zero and a standard deviation of one.",
    detail: [
      "It uses the sample's own mean and standard deviation, so extreme values affect the scores.",
      "The axis argument computes z-scores column by column when needed.",
      "Many machine-learning methods work better with standardised features.",
    ],
    ex: "A student scoring 80 in a test with mean 70 and standard deviation 5 has a z-score of 2.",
    mistakes: [
      "Computing the z-score with the standard deviation of a different sample.",
      "Applying it blindly to heavily skewed data.",
    ],
    follow: ["What does the standard normal distribution represent?"],
    points: [
      "(value - mean) / standard deviation",
      "scipy.stats.zscore",
      "ddof defaults to 0",
      "Allows comparison across scales",
    ],
    notes: "z = (x - mean) / sd.",
    src: [["SciPy: scipy.stats.zscore", `${SP}/scipy.stats.zscore.html`]],
  }),
  g({
    slug: "standard-error-of-the-mean",
    topic: "Descriptive stats",
    d: "medium",
    title: "What is the standard error of the mean, and how does it differ from standard deviation?",
    kw: ["standard error", "sem", "scipy.stats.sem", "sample mean", "ddof"],
    intent:
      "Checks that you separate the spread of data from the uncertainty of an estimate.",
    short:
      "The standard error of the mean, which scipy.stats.sem computes, measures how precisely the sample mean estimates the population mean. It is also called the standard error of measurement. The function needs at least two observations and uses ddof=1 by default, which adjusts for bias in limited samples. Standard deviation describes how spread out the individual values are; the standard error describes the variability of the mean itself, and the t-statistic in a one-sample t-test is calculated as the sample mean minus the population mean, divided by the standard error.",
    detail: [
      "The standard error is smaller for larger samples, while the standard deviation does not shrink in the same way.",
      "Confidence intervals for a mean are built from the standard error.",
      "Use error bars deliberately and label which one a chart shows.",
    ],
    ex: "Two surveys have the same spread of answers, but the larger one has a smaller standard error and a tighter estimate.",
    mistakes: [
      "Using the standard error as if it described the spread of the data.",
      "Not saying which of the two a plot's error bars show.",
    ],
    follow: ["How is a confidence interval for a mean built?"],
    points: [
      "Measures precision of the mean",
      "Needs two or more observations",
      "ddof defaults to 1",
      "Basis of t-statistics and intervals",
    ],
    notes: "SD describes the data; SE describes the estimate.",
    src: [
      ["SciPy: scipy.stats.sem", `${SP}/scipy.stats.sem.html`],
      ["SciPy: scipy.stats.ttest_1samp", `${SP}/scipy.stats.ttest_1samp.html`],
    ],
  }),
  g({
    slug: "covariance-and-correlation-matrix",
    topic: "Correlation & regression basics",
    d: "medium",
    title: "What is the difference between covariance and correlation?",
    kw: ["covariance", "correlation", "numpy.cov", "numpy.corrcoef", "covariance matrix"],
    intent:
      "Checks that you know correlation is covariance on a standard scale.",
    short:
      "Covariance indicates the level to which two variables vary together. numpy.cov estimates a covariance matrix in which element C[i, j] is the covariance of variables i and j, and the diagonal element C[i, i] is the variance of variable i. numpy.corrcoef returns the Pearson product-moment correlation coefficients from the covariance matrix with R[i, j] = C[i, j] divided by the square root of C[i, i] times C[j, j]. Correlation values are between -1 and 1, so unlike covariance they do not depend on the units of the variables.",
    detail: [
      "In numpy each row of the input is a variable and each column an observation, by default.",
      "pandas DataFrame.corr returns a correlation matrix across columns.",
      "A heatmap is a common way to view a correlation matrix.",
    ],
    ex: "The covariance of height in centimetres and weight in kilograms depends on those units, while their correlation does not.",
    mistakes: [
      "Comparing covariances of variables measured in different units.",
      "Forgetting numpy's variables-in-rows convention.",
    ],
    follow: ["When would you prefer Spearman over Pearson?"],
    points: [
      "Covariance shows joint variation",
      "Diagonal holds variances",
      "Correlation is standardised",
      "Values lie between -1 and 1",
    ],
    notes: "correlation = covariance / (sd_x * sd_y).",
    src: [
      ["NumPy: numpy.cov", `${NP}/numpy.cov.html`],
      ["NumPy: numpy.corrcoef", `${NP}/numpy.corrcoef.html`],
      ["pandas: DataFrame.corr", `${PD}/pandas.DataFrame.corr.html`],
    ],
  }),
  g({
    slug: "pearson-correlation",
    topic: "Correlation & regression basics",
    d: "easy",
    title: "What does the Pearson correlation coefficient measure?",
    kw: ["pearson", "correlation coefficient", "linear relationship", "pearsonr", "p-value"],
    intent:
      "Checks that you read a correlation correctly, including what it cannot show.",
    short:
      "The Pearson correlation coefficient measures the linear relationship between two datasets. It varies between -1 and +1 with 0 implying no correlation. Correlations of -1 or +1 imply an exact linear relationship, positive values mean y increases as x increases, and negative values mean y decreases. scipy.stats.pearsonr also returns a p-value for a test of the null hypothesis that the distributions underlying the samples are uncorrelated and normally distributed. The p-value roughly indicates the probability of an uncorrelated system producing datasets with a correlation at least as extreme as the one computed.",
    detail: [
      "The result object also has a confidence_interval method for the coefficient.",
      "A coefficient near zero says there is no linear relationship, but a curved one can still exist.",
      "Plot the data, because very different shapes can give similar coefficients.",
    ],
    ex: "Hours studied and exam marks give a correlation of 0.8, a strong positive linear relationship in that sample.",
    mistakes: [
      "Treating a strong correlation as proof of cause.",
      "Using it for a clearly curved relationship.",
    ],
    follow: ["How does Spearman's coefficient differ?"],
    points: [
      "Measures linear association",
      "Between -1 and +1",
      "Zero means no correlation",
      "pearsonr gives coefficient and p-value",
    ],
    notes: "Pearson = strength of a straight-line relationship.",
    src: [
      ["SciPy: scipy.stats.pearsonr", `${SP}/scipy.stats.pearsonr.html`],
      ["NumPy: numpy.corrcoef", `${NP}/numpy.corrcoef.html`],
    ],
  }),
  g({
    slug: "spearman-vs-pearson",
    topic: "Correlation & regression basics",
    d: "medium",
    title: "When would you use Spearman correlation instead of Pearson?",
    kw: ["spearman", "rank correlation", "monotonic", "kendall", "nonparametric"],
    intent:
      "Checks that you can choose a correlation measure that matches the relationship.",
    short:
      "Spearman's rank-order correlation coefficient is a nonparametric measure of the monotonicity of the relationship between two datasets, while Pearson measures a linear relationship. Both vary between -1 and +1, and with Spearman a value of -1 or +1 implies an exact monotonic relationship. Use it when the relationship rises or falls steadily but not along a straight line, or when you want a rank-based measure. The documentation notes that the p-value does not make strong assumptions about the underlying distributions but is only accurate for very large samples, more than 500 observations. pandas' corr supports pearson, kendall and spearman methods.",
    detail: [
      "Kendall's tau is another rank correlation, available as scipy.stats.kendalltau.",
      "In pandas you choose with method='spearman'.",
      "Ranks reduce the influence of how far apart extreme values are.",
    ],
    ex: "A satisfaction score and years of use rise together but not linearly, so Spearman gives a clearer picture than Pearson.",
    mistakes: [
      "Using Pearson on a curved but monotonic relationship.",
      "Trusting the Spearman p-value from a very small sample without checking.",
    ],
    follow: ["How does Pearson's coefficient behave for a curve?"],
    points: [
      "Monotonic, rank-based",
      "Pearson is linear",
      "Same -1 to +1 range",
      "pandas method= selects the type",
    ],
    notes: "Spearman = Pearson on ranks; handles monotonic curves.",
    src: [
      ["SciPy: scipy.stats.spearmanr", `${SP}/scipy.stats.spearmanr.html`],
      ["pandas: Series.corr", `${PD}/pandas.Series.corr.html`],
    ],
  }),
  g({
    slug: "simple-linear-regression-linregress",
    topic: "Correlation & regression basics",
    d: "easy",
    title: "What does simple linear regression estimate, and how do you fit one with scipy?",
    kw: ["linear regression", "linregress", "slope", "intercept", "r-squared"],
    intent:
      "Checks that you can fit and read a straight-line model of one variable on another.",
    short:
      "Simple linear regression fits a straight line to two sets of measurements by least squares. scipy.stats.linregress(x, y) returns an object with the slope and intercept of the regression line, rvalue, which is the Pearson correlation coefficient, and a p-value for a hypothesis test whose null hypothesis is that the slope is zero. The square of rvalue is equal to the coefficient of determination. The slope says how much y changes, on average, for a one-unit increase in x, and the intercept is the fitted value at x equal to zero.",
    detail: [
      "The alternative argument chooses a two-sided or one-sided test of the slope.",
      "Standard errors of the slope and intercept are also returned.",
      "A high r-squared does not show the model is appropriate; check the residuals.",
    ],
    ex: "Fitting house price on floor area gives a slope that estimates the price change for each extra square metre.",
    mistakes: [
      "Extrapolating far beyond the range of the data.",
      "Treating the slope as a cause rather than an association.",
    ],
    follow: ["What does the p-value for the slope test?"],
    points: [
      "Least-squares straight line",
      "Slope and intercept returned",
      "rvalue squared is r-squared",
      "p-value tests slope equal to zero",
    ],
    notes: "linregress(x, y) gives slope, intercept, rvalue, pvalue.",
    code: [
      "Fitting a line",
      `from scipy import stats

result = stats.linregress(area, price)
print(result.slope, result.intercept)
print(result.rvalue ** 2)`,
      [
        "linregress takes the predictor x and the response y.",
        "slope and intercept describe the fitted line.",
        "rvalue squared is the coefficient of determination.",
      ],
      "python",
    ],
    src: [["SciPy: scipy.stats.linregress", `${SP}/scipy.stats.linregress.html`]],
  }),
  g({
    slug: "normal-distribution-loc-scale",
    topic: "Distributions",
    d: "easy",
    title: "What are the parameters of the normal distribution in scipy.stats?",
    kw: ["normal distribution", "norm", "loc", "scale", "standard normal"],
    intent:
      "Checks that you can use the most common continuous distribution correctly.",
    short:
      "scipy.stats.norm is a normal continuous random variable. Its loc keyword specifies the mean and its scale keyword specifies the standard deviation. In standard form loc is 0 and scale is 1, so the standard normal distribution has mean 0 and standard deviation 1. The probability density function in standard form is exp(-x squared over 2) divided by the square root of 2 pi. The object provides methods such as pdf, cdf, ppf, rvs, mean, var, std and interval. Any normal value can be converted to a z-score by subtracting loc and dividing by scale.",
    detail: [
      "All continuous distributions have location and scale parameters, plus any shape parameters they need.",
      "rvs draws random values, with size and random_state arguments.",
      "stats.norm(loc=50, scale=10) freezes the distribution with fixed parameters.",
    ],
    ex: "Exam scores modelled as norm(loc=60, scale=10) have mean 60 and standard deviation 10.",
    mistakes: [
      "Passing the variance as scale instead of the standard deviation.",
      "Assuming real data is exactly normal without checking.",
    ],
    follow: ["What do pdf, cdf and ppf return?"],
    points: [
      "loc = mean",
      "scale = standard deviation",
      "Standard form is 0 and 1",
      "Methods pdf, cdf, ppf, rvs",
    ],
    notes: "norm(loc=mean, scale=sd).",
    src: [
      ["SciPy: scipy.stats.norm", `${SP}/scipy.stats.norm.html`],
      ["SciPy: Continuous statistical distributions", "https://docs.scipy.org/doc/scipy/tutorial/stats/continuous.html"],
    ],
  }),
  g({
    slug: "pdf-cdf-ppf-methods",
    topic: "Distributions",
    d: "medium",
    title: "What do the pdf, cdf, ppf and sf methods of a distribution return?",
    kw: ["pdf", "cdf", "ppf", "survival function", "pmf"],
    intent:
      "Checks that you can move between values and probabilities.",
    short:
      "For a continuous distribution in scipy.stats, pdf is the probability density function, the derivative of the cumulative distribution function. cdf is the cumulative distribution function F(x), the probability of a value up to x. ppf is the percent point function, the inverse of the cdf, so it turns a probability into a value. sf is the survival function, equal to 1 minus the cdf, though sf is sometimes more accurate. For a discrete distribution the density is replaced by pmf, the probability mass function. The method rvs draws random variates.",
    detail: [
      "isf is the inverse survival function.",
      "interval gives the confidence interval with equal areas around the median.",
      "A density value is not itself a probability; probabilities come from areas under it.",
    ],
    ex: "norm.cdf(1.96) gives the probability of a standard normal value being at most 1.96, and norm.ppf(0.975) gives back about 1.96.",
    mistakes: [
      "Reading a pdf value as a probability.",
      "Using pdf when the cumulative probability is needed.",
    ],
    follow: ["What does the pmf describe?"],
    points: [
      "pdf is the density",
      "cdf accumulates probability",
      "ppf is the inverse of cdf",
      "sf = 1 - cdf",
    ],
    notes: "cdf: value to probability. ppf: probability to value.",
    src: [
      ["SciPy: Continuous statistical distributions", "https://docs.scipy.org/doc/scipy/tutorial/stats/continuous.html"],
      ["SciPy: scipy.stats.norm", `${SP}/scipy.stats.norm.html`],
    ],
  }),
  g({
    slug: "binomial-distribution",
    topic: "Distributions",
    d: "medium",
    title: "What is the binomial distribution and when do you use it?",
    kw: ["binomial", "binom", "pmf", "success probability", "discrete"],
    intent:
      "Checks that you can model counts of successes in repeated trials.",
    short:
      "The binomial distribution is a discrete distribution for the number of successes. In scipy.stats, binom takes n and p as shape parameters, where p is the probability of a single success and 1 minus p is the probability of a single failure. The probability mass function is f(k) equals n choose k times p to the power k times (1-p) to the power n minus k, for k from 0 to n. Use binom.pmf(k, n, p) for the probability of exactly k successes, and binom.cdf(k, n, p) for at most k.",
    detail: [
      "It suits counts such as clicks out of n views, when each trial has the same success probability.",
      "The object also has mean, var, std and interval methods.",
      "rvs generates random counts for simulation.",
    ],
    ex: "The chance of exactly 3 defective items in a batch of 10 is binom.pmf(3, 10, 0.1).",
    mistakes: [
      "Using it when the success probability changes between trials.",
      "Confusing pmf, the probability of exactly k, with cdf, the probability of at most k.",
    ],
    follow: ["What distribution models events in a fixed interval?"],
    points: [
      "Counts successes in n trials",
      "Parameters n and p",
      "pmf for exactly k",
      "cdf for at most k",
    ],
    notes: "binom(n, p): number of successes in n trials.",
    src: [["SciPy: scipy.stats.binom", `${SP}/scipy.stats.binom.html`]],
  }),
  g({
    slug: "poisson-distribution",
    topic: "Distributions",
    d: "medium",
    title: "What is the Poisson distribution and what does its parameter mean?",
    kw: ["poisson", "mu", "count of events", "pmf", "discrete"],
    intent:
      "Checks that you can model counts of events without a fixed number of trials.",
    short:
      "The Poisson distribution is a discrete distribution for non-negative counts. In scipy.stats, poisson takes mu, which is at least 0, as its shape parameter. Its probability mass function is f(k) equals exp(-mu) times mu to the power k divided by k factorial, for k at least 0. The mean and variance of a Poisson distribution are both mu. You use poisson.pmf(k, mu) for the probability of exactly k events, and poisson.cdf(k, mu) for at most k. It is a standard model for event counts in a fixed period, such as arrivals or requests.",
    detail: [
      "When mu is 0, the pmf returns 1.0 at k equal to 0.",
      "The distribution suits events that occur independently at a steady average rate.",
      "Compare observed counts with the model before relying on it.",
    ],
    ex: "If a help desk receives 4 calls an hour on average, poisson.pmf(0, 4) is the chance of an hour with no calls.",
    mistakes: [
      "Using Poisson when the rate changes strongly during the period.",
      "Using it for continuous measurements.",
    ],
    follow: ["How does binomial differ?"],
    points: [
      "Counts of events",
      "Parameter mu is the average rate",
      "Mean equals variance",
      "pmf for exactly k",
    ],
    notes: "poisson(mu): events per interval.",
    src: [["SciPy: scipy.stats.poisson", `${SP}/scipy.stats.poisson.html`]],
  }),
  g({
    slug: "uniform-and-exponential",
    topic: "Distributions",
    d: "easy",
    title: "What are the uniform and exponential distributions in scipy.stats?",
    kw: ["uniform", "exponential", "loc", "scale", "continuous"],
    intent:
      "Checks that you know two simple continuous distributions and how loc and scale shift them.",
    short:
      "The uniform distribution in scipy.stats is, in standard form, uniform on [0, 1], with density 1 inside that range and 0 outside. Using loc and scale you get the uniform distribution on [loc, loc + scale]. The exponential distribution has the standard density exp(-x) for x at least 0, and you shift and scale it with loc and scale; expon.pdf(x, loc, scale) is equal to expon.pdf(y) divided by scale with y equal to (x - loc) divided by scale. Uniform means all values in the range are equally likely, and the exponential is non-negative and decays.",
    detail: [
      "Both are continuous, so you use pdf, cdf and ppf.",
      "uniform.rvs is commonly used to generate random numbers in a range.",
      "Always check what scale means for the specific distribution in the documentation.",
    ],
    ex: "uniform(loc=10, scale=5) models a value equally likely anywhere between 10 and 15.",
    mistakes: [
      "Passing the upper bound as scale for the uniform distribution.",
      "Assuming loc and scale mean mean and standard deviation for every distribution.",
    ],
    follow: ["What is the normal distribution's scale?"],
    points: [
      "Uniform on [loc, loc + scale]",
      "Exponential density exp(-x) for x >= 0",
      "loc shifts, scale stretches",
      "Both are continuous",
    ],
    notes: "uniform(loc, scale) covers [loc, loc + scale].",
    src: [
      ["SciPy: scipy.stats.uniform", `${SP}/scipy.stats.uniform.html`],
      ["SciPy: scipy.stats.expon", `${SP}/scipy.stats.expon.html`],
    ],
  }),
  g({
    slug: "students-t-distribution",
    topic: "Distributions",
    d: "medium",
    title: "What is Student's t distribution, and what are its degrees of freedom?",
    kw: ["student t", "degrees of freedom", "df", "t distribution", "scipy.stats.t"],
    intent:
      "Checks that you know the distribution behind t-tests and small-sample intervals.",
    short:
      "Student's t distribution is a continuous distribution that scipy.stats provides as t. Its shape parameter is the degrees of freedom, df, which must be greater than zero. As with other continuous distributions it has loc and scale and methods such as pdf, cdf, ppf, rvs and interval. It is the reference distribution for the t-statistic in t-tests, which is why the t-test results report the degrees of freedom used in the calculation. Its ppf gives the critical value for a chosen probability, which is used in confidence intervals for a mean when the population standard deviation is unknown.",
    detail: [
      "For ttest_ind the degrees of freedom depend on the samples and on whether equal variances are assumed.",
      "The t-test results in scipy also expose df as an attribute.",
      "interval(confidence, df) returns an interval with equal areas around the median.",
    ],
    ex: "t.ppf(0.975, df=19) gives the critical value for a 95 percent two-sided interval from 20 observations.",
    mistakes: [
      "Forgetting that df is required.",
      "Using normal critical values for a very small sample.",
    ],
    follow: ["How do you test whether a sample mean equals a given value?"],
    points: [
      "Shape parameter df",
      "Reference for t-tests",
      "Used for intervals when sigma is unknown",
      "ppf gives critical values",
    ],
    notes: "t(df): more spread than normal at small df.",
    src: [
      ["SciPy: scipy.stats.t", `${SP}/scipy.stats.t.html`],
      ["SciPy: scipy.stats.ttest_ind", `${SP}/scipy.stats.ttest_ind.html`],
    ],
  }),
  g({
    slug: "null-hypothesis-and-p-value",
    topic: "Hypothesis testing",
    d: "easy",
    title: "What are the null hypothesis and the p-value in a hypothesis test?",
    kw: ["null hypothesis", "p-value", "alternative hypothesis", "significance", "test statistic"],
    intent:
      "Checks that you can describe what a test result means without overclaiming.",
    short:
      "A hypothesis test starts with a null hypothesis, a default statement such as 'the two group means are equal', and an alternative. SciPy's tests return a test statistic and a p-value 'associated with the given alternative'. The SciPy documentation describes the p-value as roughly the probability of a system consistent with the null hypothesis producing data at least as extreme as the data observed. A small p-value is evidence against the null hypothesis; it is not the probability that the null is true. Decide on the significance level before looking at the data.",
    detail: [
      "The alternative argument selects two-sided, less or greater.",
      "A statistically significant result does not tell you the effect is large or important.",
      "Report the effect size and a confidence interval along with the p-value.",
    ],
    ex: "ttest_ind on two groups returns a p-value; if it is below the chosen level, the analyst rejects equal means.",
    mistakes: [
      "Reading the p-value as the probability that the null hypothesis is true.",
      "Changing the significance level after seeing the result.",
    ],
    follow: ["What is the difference between one-sided and two-sided tests?"],
    points: [
      "Null is the default claim",
      "p-value measures how extreme the data is under the null",
      "Small p-value is evidence against the null",
      "Choose the level in advance",
    ],
    notes: "p-value: how surprising the data is if the null were true.",
    src: [
      ["SciPy: scipy.stats.pearsonr", `${SP}/scipy.stats.pearsonr.html`],
      ["SciPy: scipy.stats.ttest_ind", `${SP}/scipy.stats.ttest_ind.html`],
    ],
  }),
  g({
    slug: "one-sample-t-test",
    topic: "Hypothesis testing",
    d: "easy",
    title: "When do you use a one-sample t-test?",
    kw: ["one-sample t-test", "ttest_1samp", "popmean", "mean", "null hypothesis"],
    intent:
      "Checks that you can test a sample mean against a known or claimed value.",
    short:
      "A one-sample t-test checks whether the mean of one group differs from a given population mean. scipy.stats.ttest_1samp(a, popmean) tests the null hypothesis that the expected value of a sample of independent observations equals popmean. The statistic is calculated as the sample mean minus popmean, divided by the standard error, so it is positive when the sample mean is above popmean. The result includes the statistic, p-value and degrees of freedom, and a confidence_interval method gives an interval around the population mean at the chosen confidence level, 0.95 by default.",
    detail: [
      "The alternative argument can be two-sided, less or greater.",
      "nan_policy can omit missing values.",
      "The test assumes independent observations.",
    ],
    ex: "A factory checks whether the mean fill of a sample of bottles differs from the labelled 500 ml.",
    mistakes: [
      "Using it to compare two groups.",
      "Ignoring that observations must be independent.",
    ],
    follow: ["How do you compare two independent groups?"],
    points: [
      "One sample against a value",
      "popmean is the null value",
      "Statistic uses the standard error",
      "Result gives a confidence interval",
    ],
    notes: "ttest_1samp(a, popmean).",
    src: [["SciPy: scipy.stats.ttest_1samp", `${SP}/scipy.stats.ttest_1samp.html`]],
  }),
  g({
    slug: "two-sample-t-test-welch",
    topic: "Hypothesis testing",
    d: "medium",
    title: "How do you compare the means of two independent groups, and what is Welch's t-test?",
    kw: ["two-sample t-test", "ttest_ind", "equal_var", "welch", "independent samples"],
    intent:
      "Checks that you know the equal-variance assumption and its alternative.",
    short:
      "scipy.stats.ttest_ind calculates the t-test for the means of two independent samples. It tests the null hypothesis that the two independent samples have identical average values. By default it assumes the populations have identical variances, equal_var=True. With equal_var=False it performs Welch's t-test, which does not assume equal population variance. The result has the statistic, p-value and degrees of freedom, and a confidence_interval method gives an interval around the difference in population means for a given confidence level.",
    detail: [
      "The two arrays must have the same shape except along the tested axis, so group sizes can differ along that axis.",
      "alternative selects two-sided, less or greater.",
      "Use the paired test when the two samples are related.",
    ],
    ex: "Comparing page load times of two server versions measured on separate machines uses ttest_ind.",
    mistakes: [
      "Using the independent test for before-and-after data on the same subjects.",
      "Assuming equal variances without checking when group spreads differ clearly.",
    ],
    follow: ["When would you use a paired test?"],
    points: [
      "Two independent groups",
      "Equal variances assumed by default",
      "equal_var=False gives Welch's test",
      "Interval for the mean difference",
    ],
    notes: "ttest_ind(a, b, equal_var=False) is a safe default.",
    code: [
      "Welch's t-test",
      `from scipy import stats

res = stats.ttest_ind(group_a, group_b, equal_var=False)
print(res.statistic, res.pvalue)
print(res.confidence_interval(confidence_level=0.95))`,
      [
        "equal_var=False selects Welch's test.",
        "The result has the statistic and the p-value.",
        "confidence_interval gives bounds for the difference in means.",
      ],
      "python",
    ],
    src: [["SciPy: scipy.stats.ttest_ind", `${SP}/scipy.stats.ttest_ind.html`]],
  }),
  g({
    slug: "paired-t-test",
    topic: "Hypothesis testing",
    d: "medium",
    title: "When do you use a paired t-test?",
    kw: ["paired t-test", "ttest_rel", "related samples", "before and after", "repeated measures"],
    intent:
      "Checks that you pick a test that matches how the data was collected.",
    short:
      "scipy.stats.ttest_rel calculates the t-test on two related samples of scores. It tests the null hypothesis that two related or repeated samples have identical average values. Use it when each value in one sample is matched to a value in the other, for example the same people measured before and after a change, or measurements on matched pairs. The two arrays must have the same shape. Like the other t-tests, it has an alternative argument that selects two-sided, less or greater, and it returns the statistic, p-value and degrees of freedom.",
    detail: [
      "Using related data lets the test focus on the differences within each pair.",
      "nan_policy decides how missing values are handled.",
      "Treating paired data as independent usually loses information.",
    ],
    ex: "The same twenty students take a test before and after a course, and ttest_rel compares the two sets of scores.",
    mistakes: [
      "Using the paired test on groups that are not matched.",
      "Passing arrays of different lengths.",
    ],
    follow: ["How does it differ from the independent test?"],
    points: [
      "Related or repeated samples",
      "Same shape arrays",
      "Null: identical average values",
      "ttest_rel",
    ],
    notes: "Matched pairs -> ttest_rel; separate groups -> ttest_ind.",
    src: [["SciPy: scipy.stats.ttest_rel", `${SP}/scipy.stats.ttest_rel.html`]],
  }),
  g({
    slug: "one-sided-vs-two-sided-alternative",
    topic: "Hypothesis testing",
    d: "medium",
    title: "What is the difference between a one-sided and a two-sided test?",
    kw: ["alternative hypothesis", "two-sided", "less", "greater", "one-sided"],
    intent:
      "Checks that you decide the direction of the test before looking at the data.",
    short:
      "Most SciPy tests have an alternative argument that defines the alternative hypothesis, with the options two-sided, less and greater, and the default is two-sided. For a two-sample t-test, two-sided means the means of the distributions are unequal, less means the mean of the first is less than the mean of the second, and greater means it is greater. For pearsonr, two-sided means the correlation is nonzero, less negative, and greater positive. Choose a one-sided alternative only when a difference in the other direction would not matter, and decide it before collecting or looking at the data.",
    detail: [
      "The p-value reported is the one associated with the chosen alternative.",
      "linregress uses the same idea for the slope: nonzero, less than zero or greater than zero.",
      "Switching to one-sided after seeing the direction is not honest practice.",
    ],
    ex: "To test whether a new design is faster, the team states 'less' on load time before running the experiment.",
    mistakes: [
      "Choosing one-sided only to get a smaller p-value.",
      "Not stating the alternative in the report.",
    ],
    follow: ["How can you reduce false positives across many tests?"],
    points: [
      "alternative argument sets the direction",
      "Default is two-sided",
      "Choose before seeing results",
      "p-value depends on the alternative",
    ],
    notes: "State the alternative first, then run the test.",
    src: [
      ["SciPy: scipy.stats.ttest_rel", `${SP}/scipy.stats.ttest_rel.html`],
      ["SciPy: scipy.stats.pearsonr", `${SP}/scipy.stats.pearsonr.html`],
      ["SciPy: scipy.stats.linregress", `${SP}/scipy.stats.linregress.html`],
    ],
  }),
  g({
    slug: "chi-square-test-of-independence",
    topic: "Hypothesis testing",
    d: "medium",
    title: "What does the chi-square test of independence test?",
    kw: ["chi-square", "chi2_contingency", "contingency table", "independence", "expected frequencies"],
    intent:
      "Checks that you can test association between two categorical variables.",
    short:
      "scipy.stats.chi2_contingency performs a chi-square test of independence of variables in a contingency table. You pass a table of observed frequencies, with one count per category combination. It computes the chi-square statistic and p-value for the null hypothesis that the variables are independent. The expected frequencies are computed from the marginal sums of the table under the assumption of independence, and the degrees of freedom depend on the table shape. When the degrees of freedom is 1, Yates' correction for continuity can be applied, controlled by the correction argument.",
    detail: [
      "The table is often described as an R x C table.",
      "The result includes the expected frequencies so you can compare with the observed ones.",
      "Counts must be frequencies, not percentages.",
    ],
    ex: "A table of device type by whether users subscribed is tested to see whether subscription depends on device.",
    mistakes: [
      "Passing percentages instead of counts.",
      "Using it for numeric measurements rather than categories.",
    ],
    follow: ["How does a goodness-of-fit test differ?"],
    points: [
      "Contingency table of counts",
      "Null: variables are independent",
      "Expected counts from marginal sums",
      "Yates' correction when dof is 1",
    ],
    notes: "Observed vs expected counts under independence.",
    src: [["SciPy: scipy.stats.chi2_contingency", `${SP}/scipy.stats.chi2_contingency.html`]],
  }),
  g({
    slug: "chi-square-goodness-of-fit",
    topic: "Hypothesis testing",
    d: "medium",
    title: "What does a chi-square goodness-of-fit test check?",
    kw: ["goodness of fit", "chisquare", "observed frequencies", "expected frequencies", "categorical"],
    intent:
      "Checks that you can test whether category counts match an expected pattern.",
    short:
      "scipy.stats.chisquare performs Pearson's chi-squared test, a goodness-of-fit test for a multinomial distribution with given probabilities. It assesses the null hypothesis that the observed frequencies are obtained by independent sampling of N observations from a categorical distribution with given expected frequencies. You pass f_obs, the observed frequencies in each category, and optionally f_exp, the expected frequencies; by default the categories are assumed equally likely. A small p-value suggests the observed counts do not match the expected pattern.",
    detail: [
      "It compares one categorical variable with an expected distribution, unlike the independence test, which compares two variables.",
      "The ddof argument adjusts the degrees of freedom.",
      "Expected counts should be given as counts, with the same total as the observed counts.",
    ],
    ex: "A die rolled 600 times is checked against equal expected counts of 100 per face.",
    mistakes: [
      "Giving expected proportions when counts are required.",
      "Using it on continuous values without binning them.",
    ],
    follow: ["What does the independence test check?"],
    points: [
      "One categorical variable",
      "Observed vs expected frequencies",
      "Equal expected counts by default",
      "Small p-value means a poor fit",
    ],
    notes: "chisquare(f_obs, f_exp).",
    src: [["SciPy: scipy.stats.chisquare", `${SP}/scipy.stats.chisquare.html`]],
  }),
  g({
    slug: "testing-normality",
    topic: "Hypothesis testing",
    d: "medium",
    title: "How do you test whether data is normally distributed?",
    kw: ["shapiro-wilk", "normaltest", "normality", "skewtest", "kurtosistest"],
    intent:
      "Checks that you know formal normality tests and that you also look at plots.",
    short:
      "scipy.stats.shapiro performs the Shapiro-Wilk test for normality, with the null hypothesis that the data was drawn from a normal distribution; it needs at least three observations. scipy.stats.normaltest tests the null hypothesis that a sample comes from a normal distribution, using D'Agostino and Pearson's omnibus test that combines skew and kurtosis, and it needs at least eight observations. A small p-value is evidence against normality. Also look at a histogram and at skewness and kurtosis, because a single test does not tell the whole story.",
    detail: [
      "scipy.stats.ks_2samp is a different kind of test, comparing the distributions of two samples.",
      "Normality matters most for tests that assume it, such as the t-test with small samples.",
      "Failing to reject normality does not prove the data is normal.",
    ],
    ex: "Before a t-test on a small sample, the analyst runs shapiro and also inspects a histogram.",
    mistakes: [
      "Treating a large p-value as proof of normality.",
      "Running only a test and never plotting the data.",
    ],
    follow: ["What test would you use if the data is not normal?"],
    points: [
      "Shapiro-Wilk: null is normal",
      "normaltest uses skew and kurtosis",
      "Minimum sample sizes apply",
      "Combine tests with plots",
    ],
    notes: "shapiro or normaltest, plus a plot.",
    src: [
      ["SciPy: scipy.stats.shapiro", `${SP}/scipy.stats.shapiro.html`],
      ["SciPy: scipy.stats.normaltest", `${SP}/scipy.stats.normaltest.html`],
    ],
  }),
  g({
    slug: "mann-whitney-u-test",
    topic: "Hypothesis testing",
    d: "hard",
    title: "When would you use the Mann-Whitney U test instead of a t-test?",
    kw: ["mann-whitney", "nonparametric", "rank test", "two independent samples", "mannwhitneyu"],
    intent:
      "Checks that you have a fallback when assumptions of the t-test are doubtful.",
    short:
      "scipy.stats.mannwhitneyu performs the Mann-Whitney U rank test on two independent samples. It is a nonparametric test of the null hypothesis that the distribution underlying sample x is the same as the distribution underlying sample y. The documentation says it is often used as a test of difference in location between distributions. Because it works with ranks it does not require the data to be normally distributed, so it is a common alternative to the independent t-test when the normal assumption is doubtful. It has an alternative argument and a use_continuity option for the continuity correction.",
    detail: [
      "It compares distributions, not only means, so state what difference you are testing.",
      "The method argument chooses how the p-value is computed.",
      "For related samples a different test is needed.",
    ],
    ex: "Two small groups of satisfaction ratings on a 1-to-5 scale are compared with mannwhitneyu.",
    mistakes: [
      "Describing the result as a test of means.",
      "Using it on paired data.",
    ],
    follow: ["How do you test for normality first?"],
    points: [
      "Rank-based, nonparametric",
      "Two independent samples",
      "Null: same distribution",
      "Alternative to the t-test",
    ],
    notes: "Rank test for two independent groups.",
    src: [["SciPy: scipy.stats.mannwhitneyu", `${SP}/scipy.stats.mannwhitneyu.html`]],
  }),
  g({
    slug: "one-way-anova",
    topic: "Hypothesis testing",
    d: "medium",
    title: "What does one-way ANOVA test, and why not use several t-tests?",
    kw: ["anova", "f_oneway", "groups", "population mean", "welch anova"],
    intent:
      "Checks that you can compare more than two group means.",
    short:
      "One-way ANOVA tests the null hypothesis that two or more groups have the same population mean. In scipy.stats, f_oneway takes the sample measurements for each group as separate arguments; there must be at least two, and the groups can have different sizes. By default it assumes equal population variances, and equal_var=False performs Welch's ANOVA instead, which does not assume equal variances. It returns an F statistic and a p-value. A small p-value says at least one group mean differs, not which one, so follow up with pairwise comparisons that correct for multiple testing.",
    detail: [
      "Running many pairwise t-tests increases the chance of a false positive.",
      "scipy.stats.false_discovery_control can adjust p-values from many tests.",
      "ANOVA tells you that a difference exists, not where it is.",
    ],
    ex: "Test scores from three teaching methods are compared with f_oneway(a, b, c).",
    mistakes: [
      "Concluding which group is different from the ANOVA alone.",
      "Running many pairwise tests without correction.",
    ],
    follow: ["How do you control the false discovery rate?"],
    points: [
      "Three or more groups",
      "Null: same population mean",
      "Equal variance assumed by default",
      "Follow up with corrected comparisons",
    ],
    notes: "f_oneway(*groups) gives F and p.",
    src: [["SciPy: scipy.stats.f_oneway", `${SP}/scipy.stats.f_oneway.html`]],
  }),
  g({
    slug: "permutation-test-idea",
    topic: "Hypothesis testing",
    d: "hard",
    title: "What is a permutation test?",
    kw: ["permutation test", "resampling", "null distribution", "statistic", "permutation_test"],
    intent:
      "Checks that you understand a test that does not rely on a named distribution.",
    short:
      "scipy.stats.permutation_test performs a permutation test of a statistic you supply on the provided data. For independent samples, the null hypothesis is that the data are randomly sampled from the same distribution. You pass the samples and a callable that accepts the samples as separate arguments and returns the statistic. The function relabels the data under the null hypothesis many times, recomputes the statistic each time and compares the observed value with that distribution to produce a p-value. For paired samples, you can test that the data are paired at random or that the data are assigned to samples at random.",
    detail: [
      "It makes few assumptions about the shape of the data.",
      "Any statistic can be used, such as the difference in medians.",
      "More resamples give a more precise p-value.",
    ],
    ex: "To compare the medians of two small groups, the analyst passes a function that returns the median difference.",
    mistakes: [
      "Using a statistic that does not match the question.",
      "Using too few resamples for a precise p-value.",
    ],
    follow: ["How does bootstrapping differ?"],
    points: [
      "Statistic is supplied by you",
      "Null: same distribution",
      "Relabelling builds the null distribution",
      "Few distribution assumptions",
    ],
    notes: "Shuffle labels, recompute, compare.",
    src: [["SciPy: scipy.stats.permutation_test", `${SP}/scipy.stats.permutation_test.html`]],
  }),
  g({
    slug: "multiple-testing-false-discovery-rate",
    topic: "Hypothesis testing",
    d: "hard",
    title: "What is the false discovery rate, and why adjust p-values when running many tests?",
    kw: ["false discovery rate", "multiple testing", "benjamini-hochberg", "adjusted p-values", "false_discovery_control"],
    intent:
      "Checks that you know running many tests produces false positives.",
    short:
      "The false discovery rate, FDR, is the expected proportion of rejected null hypotheses that are actually true. scipy.stats.false_discovery_control adjusts a set of p-values to control it: if you reject the null hypothesis when the adjusted p-value falls below a specified level, the false discovery rate is controlled at that level. The method argument selects the procedure, 'bh' for Benjamini-Hochberg or 'by' for Benjamini-Yekutieli. When you run many tests, some will look significant by chance, so adjusting prevents you from reporting findings that are probably noise.",
    detail: [
      "The p-values must be real numbers between 0 and 1.",
      "The adjustment is applied independently along the chosen axis.",
      "Decide the level and the procedure before looking at the results.",
    ],
    ex: "A team tests 200 features against a target and adjusts the 200 p-values before listing significant ones.",
    mistakes: [
      "Reporting unadjusted p-values after testing many hypotheses.",
      "Choosing the adjustment method after seeing which one gives more results.",
    ],
    follow: ["Why does ANOVA need follow-up comparisons?"],
    points: [
      "FDR = expected share of false rejections",
      "Adjust p-values, then threshold",
      "bh and by procedures",
      "Many tests create chance findings",
    ],
    notes: "Adjust p-values when you test many hypotheses.",
    src: [["SciPy: scipy.stats.false_discovery_control", `${SP}/scipy.stats.false_discovery_control.html`]],
  }),
  g({
    slug: "confidence-interval-for-a-mean",
    topic: "Confidence intervals",
    d: "medium",
    title: "What is a confidence interval, and how do you compute one for a mean in Python?",
    kw: ["confidence interval", "confidence level", "t interval", "interval", "standard error"],
    intent:
      "Checks that you can report an estimate with its uncertainty.",
    short:
      "A confidence interval gives a range of plausible values for a population quantity at a chosen confidence level, such as 95 percent. In SciPy the t-test results have a confidence_interval method: ttest_1samp gives an interval around the population mean and ttest_ind gives one around the difference in population means, with a default confidence level of 0.95, returned as a namedtuple with low and high fields. You can also build an interval from the sample mean, the standard error from scipy.stats.sem and a critical value from the t distribution's interval or ppf method.",
    detail: [
      "A wider interval means more uncertainty, which comes from a small sample or a variable measurement.",
      "The interval is about the procedure: 95 percent of intervals built this way would contain the true value in repeated sampling.",
      "Report intervals alongside p-values.",
    ],
    ex: "An A/B test reports a difference in conversion with a 95 percent interval, not only a p-value.",
    mistakes: [
      "Saying there is a 95 percent probability that the true value is inside one computed interval.",
      "Confusing a confidence interval with the range of the data.",
    ],
    follow: ["How does bootstrapping give an interval?"],
    points: [
      "Range of plausible values",
      "Chosen confidence level",
      "confidence_interval method in SciPy tests",
      "Built from standard error and t quantiles",
    ],
    notes: "Estimate +/- critical value x standard error.",
    src: [
      ["SciPy: scipy.stats.ttest_1samp", `${SP}/scipy.stats.ttest_1samp.html`],
      ["SciPy: scipy.stats.ttest_ind", `${SP}/scipy.stats.ttest_ind.html`],
      ["SciPy: scipy.stats.t", `${SP}/scipy.stats.t.html`],
    ],
  }),
  g({
    slug: "bootstrap-confidence-interval",
    topic: "Confidence intervals",
    d: "hard",
    title: "How does a bootstrap confidence interval work?",
    kw: ["bootstrap", "resampling", "percentile method", "BCa", "scipy.stats.bootstrap"],
    intent:
      "Checks that you can get an interval for any statistic without a formula.",
    short:
      "scipy.stats.bootstrap computes a bootstrap confidence interval of a statistic. For the percentile method, it resamples the data by taking, for each of n_resamples, a random sample of the original sample with replacement and of the same size. It then computes the statistic for each resample to get the bootstrap distribution, and finds the interval of that distribution that is symmetric about the median and contains the requested confidence_level of the values. The documentation says the percentile method is the most intuitive but rarely used in practice; the 'basic' and 'BCa' (bias-corrected and accelerated) methods are more common.",
    detail: [
      "It works for statistics without a simple formula, such as the median.",
      "More resamples give a more stable interval.",
      "It still depends on the sample being representative.",
    ],
    ex: "An analyst gets a 95 percent interval for the median delivery time by bootstrapping 1,000 resamples.",
    mistakes: [
      "Bootstrapping a tiny, unrepresentative sample and trusting the interval.",
      "Using too few resamples.",
    ],
    follow: ["How does a permutation test differ?"],
    points: [
      "Resample with replacement",
      "Compute the statistic each time",
      "Interval from the bootstrap distribution",
      "Methods: percentile, basic, BCa",
    ],
    notes: "Resample, recompute, take the interval.",
    src: [["SciPy: scipy.stats.bootstrap", `${SP}/scipy.stats.bootstrap.html`]],
  }),
  g({
    slug: "matrix-multiplication-matmul-dot",
    topic: "Linear algebra",
    d: "easy",
    title: "How do you multiply matrices in NumPy: matmul, dot and the @ operator?",
    kw: ["matrix multiplication", "matmul", "dot", "@ operator", "shape"],
    intent:
      "Checks that you know matrix multiplication differs from element-wise multiplication.",
    short:
      "numpy.matmul returns the matrix product of two arrays, and the @ operator does the same. Scalars are not allowed, and the last dimension of the first array must match the second-to-last dimension of the second; for (n, k) and (k, m) inputs the result has shape (n, m). The result is a scalar only when both inputs are one-dimensional vectors. numpy.dot with two 2-D arrays is also matrix multiplication, but the documentation says matmul or the @ operator is preferred, and for a scalar operand it says to use multiply or the * operator instead.",
    detail: [
      "The * operator multiplies element by element, which is a different operation.",
      "A shape mismatch raises a ValueError.",
      "Matrix multiplication is not commutative: A @ B is generally not B @ A.",
    ],
    ex: "A (3, 2) matrix times a (2, 4) matrix gives a (3, 4) matrix with a @ b.",
    mistakes: [
      "Using * and expecting a matrix product.",
      "Multiplying shapes whose inner dimensions differ.",
    ],
    follow: ["What is a matrix transpose?"],
    points: [
      "(n, k) @ (k, m) gives (n, m)",
      "@ is the same as matmul",
      "dot works but matmul is preferred",
      "* is element-wise",
    ],
    notes: "Use @ for matrix products.",
    src: [
      ["NumPy: numpy.matmul", `${NP}/numpy.matmul.html`],
      ["NumPy: numpy.dot", `${NP}/numpy.dot.html`],
    ],
  }),
  g({
    slug: "matrix-inverse-and-determinant",
    topic: "Linear algebra",
    d: "medium",
    title: "What are the inverse and determinant of a matrix?",
    kw: ["inverse", "determinant", "numpy.linalg.inv", "numpy.linalg.det", "singular matrix"],
    intent:
      "Checks that you know when an inverse exists and how to compute it.",
    short:
      "The inverse of a square matrix a is the matrix ainv for which a @ ainv equals ainv @ a equals the identity matrix. numpy.linalg.inv computes it and raises LinAlgError if a is not square or inversion fails, for example for a singular matrix. numpy.linalg.det computes the determinant, using LU factorisation. For large matrices the documentation points to slogdet when underflow or overflow may occur. The documentation also mentions numpy.linalg.cond for the condition number. A determinant of zero means the matrix has no inverse.",
    detail: [
      "Both functions accept stacks of matrices with shape (..., M, M) using broadcasting.",
      "To solve a system, numpy.linalg.solve is usually better than computing the inverse.",
      "Check the condition number when results seem unstable.",
    ],
    ex: "np.linalg.inv(A) @ A returns the identity matrix up to rounding for an invertible 3 by 3 matrix A.",
    mistakes: [
      "Inverting a singular matrix.",
      "Computing an inverse to solve a system instead of using solve.",
    ],
    follow: ["How do you solve a linear system?"],
    points: [
      "Inverse needs a square matrix",
      "a @ ainv is the identity",
      "inv raises LinAlgError if it fails",
      "det via LU factorisation",
    ],
    notes: "np.linalg.inv and np.linalg.det work on square matrices.",
    src: [
      ["NumPy: numpy.linalg.inv", `${NP}/numpy.linalg.inv.html`],
      ["NumPy: numpy.linalg.det", `${NP}/numpy.linalg.det.html`],
    ],
  }),
  g({
    slug: "solve-linear-system",
    topic: "Linear algebra",
    d: "easy",
    title: "How do you solve a system of linear equations in NumPy?",
    kw: ["linalg.solve", "linear system", "ax = b", "coefficient matrix", "singular"],
    intent:
      "Checks that you can express equations as matrices and solve them.",
    short:
      "Write the system as a x = b, where a is the coefficient matrix and b holds the values on the right-hand side, then call numpy.linalg.solve(a, b). It computes the exact solution x of a well-determined, meaning full-rank, linear matrix equation. If b has shape (M,), x has shape (M,), and if b has shape (M, K), x has shape (M, K). It raises a LinAlgError if a is singular or not square.",
    detail: [
      "Use solve rather than multiplying by the inverse.",
      "Coefficients, rows and columns must be arranged consistently.",
      "The solution has the same shape as b.",
    ],
    ex: "For 2x + y = 5 and x + 3y = 10, a = [[2, 1], [1, 3]] and b = [5, 10], and solve returns x = [1, 3].",
    mistakes: [
      "Passing a non-square coefficient matrix.",
      "Mixing up the order of the unknowns in the columns.",
    ],
    follow: ["What if the matrix is singular?"],
    points: [
      "Form a @ x = b",
      "numpy.linalg.solve(a, b)",
      "Needs a square, full-rank a",
      "LinAlgError if singular",
    ],
    notes: "x = np.linalg.solve(a, b).",
    src: [["NumPy: numpy.linalg.solve", `${NP}/numpy.linalg.solve.html`]],
  }),
  g({
    slug: "eigenvalues-and-eigenvectors",
    topic: "Linear algebra",
    d: "medium",
    title: "What are eigenvalues and eigenvectors, and how do you compute them?",
    kw: ["eigenvalues", "eigenvectors", "numpy.linalg.eig", "square matrix", "namedtuple"],
    intent:
      "Checks that you know what numpy returns and the properties of its result.",
    short:
      "An eigenvector of a square matrix is a vector whose direction is unchanged when the matrix multiplies it, only scaled by the corresponding eigenvalue. numpy.linalg.eig computes the eigenvalues and right eigenvectors of a square array and returns a namedtuple with attributes eigenvalues and eigenvectors. Each eigenvalue is repeated according to its multiplicity, and the eigenvalues are not necessarily ordered. The result is of complex type unless the imaginary part is zero, in which case it is cast to a real type. For a real matrix with real results, the eigenvalues are real. Eigen-decomposition is used in methods such as principal component analysis.",
    detail: [
      "The eigenvectors are returned as columns, so the i-th column matches the i-th eigenvalue.",
      "Input must be square, with shape (..., M, M).",
      "For symmetric matrices there are specialised functions.",
    ],
    ex: "Computing eig on a covariance matrix gives directions of greatest variance and their sizes.",
    mistakes: [
      "Assuming the eigenvalues come sorted.",
      "Reading eigenvectors as rows when numpy returns them as columns.",
    ],
    follow: ["How does singular value decomposition differ?"],
    points: [
      "Square matrices only",
      "Returns eigenvalues and eigenvectors",
      "Not necessarily ordered",
      "May be complex",
    ],
    notes: "eig returns values and column eigenvectors.",
    src: [["NumPy: numpy.linalg.eig", `${NP}/numpy.linalg.eig.html`]],
  }),
  g({
    slug: "svd-and-matrix-rank",
    topic: "Linear algebra",
    d: "hard",
    title: "What is singular value decomposition, and how is matrix rank defined with it?",
    kw: ["svd", "singular values", "matrix rank", "numpy.linalg.svd", "orthonormal"],
    intent:
      "Checks that you know SVD works for any matrix and what rank means in practice.",
    short:
      "Singular value decomposition factorises a matrix a into u @ diag(s) @ vh, where u and vh have orthonormal columns and rows and s is a 1-D array of singular values. numpy.linalg.svd computes it; with full_matrices=False the shapes are the compact ones. Unlike eigendecomposition it is not limited to square matrices. numpy.linalg.matrix_rank returns the rank using the SVD method: the rank is the number of singular values greater than a tolerance tol. If tol is not given it is set to the largest singular value times max(M, N) times the machine epsilon.",
    detail: [
      "Rank tells how many independent directions a matrix has.",
      "A rank lower than the number of columns means the columns are linearly dependent.",
      "SVD is used for dimensionality reduction and in solving least-squares problems.",
    ],
    ex: "np.linalg.matrix_rank(X) shows that a feature matrix has dependent columns, so one feature can be dropped.",
    mistakes: [
      "Treating tiny non-zero singular values as meaningful without a tolerance.",
      "Assuming SVD needs a square matrix.",
    ],
    follow: ["How are eigenvalues different from singular values?"],
    points: [
      "a = u @ diag(s) @ vh",
      "Works for any shape",
      "Rank = singular values above a tolerance",
      "Default tolerance uses machine epsilon",
    ],
    notes: "svd gives singular values; rank counts the non-negligible ones.",
    src: [
      ["NumPy: numpy.linalg.svd", `${NP}/numpy.linalg.svd.html`],
      ["NumPy: numpy.linalg.matrix_rank", `${NP}/numpy.linalg.matrix_rank.html`],
    ],
  }),
  g({
    slug: "vector-and-matrix-norms",
    topic: "Linear algebra",
    d: "easy",
    title: "What is a norm, and how do you compute vector and matrix norms in NumPy?",
    kw: ["norm", "numpy.linalg.norm", "ord", "euclidean", "frobenius"],
    intent:
      "Checks that you can measure the size of a vector or matrix.",
    short:
      "A norm measures the size or length of a vector or matrix. numpy.linalg.norm can return one of eight different matrix norms or one of an infinite number of vector norms, depending on the ord parameter. If both axis and ord are None, the 2-norm of x.ravel is returned, which for a vector is the Euclidean length. ord values include inf, -inf, 'fro' for the Frobenius norm, and 'nuc' for the nuclear norm. If axis is None, x must be 1-D or 2-D unless ord is None. Norms are used to measure distances and errors, and in regularisation.",
    detail: [
      "The distance between two points is the norm of their difference.",
      "The axis argument computes norms along rows or columns.",
      "Different ord values answer different questions, so state which you used.",
    ],
    ex: "np.linalg.norm(a - b) is the Euclidean distance between two feature vectors a and b.",
    mistakes: [
      "Leaving ord at its default when another norm is needed.",
      "Passing a 3-D array without choosing an axis.",
    ],
    follow: ["How are norms used in regularisation?"],
    points: [
      "Measures the size of a vector or matrix",
      "ord chooses the norm",
      "Default is the 2-norm",
      "Distance = norm of the difference",
    ],
    notes: "norm(x) is the Euclidean length by default.",
    src: [["NumPy: numpy.linalg.norm", `${NP}/numpy.linalg.norm.html`]],
  }),
])
