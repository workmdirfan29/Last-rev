import { defineQuestions } from "../author"
import { g } from "../brief"

const SK = "https://scikit-learn.org/stable"
const G = `${SK}/modules/generated/sklearn`

export default defineQuestions("machine-learning", "fresher", [
  g({
    slug: "supervised-vs-unsupervised-learning",
    topic: "Supervised vs unsupervised",
    d: "easy",
    title: "What is the difference between supervised and unsupervised learning?",
    kw: ["supervised learning", "unsupervised learning", "target", "labels", "features"],
    intent:
      "Checks that you can tell tasks with a target apart from tasks without one.",
    short:
      "In supervised learning the data has input samples X and known target values y, and the model learns to predict y for new samples. The scikit-learn documentation says the targets are real numbers for regression tasks and integers, or any other discrete set of values, for classification. In unsupervised learning there is no target: y does not need to be specified, and the model looks for structure in X, for example groups of similar samples with clustering or a lower-dimensional representation with decomposition. Both kinds of estimator use the same fit method.",
    detail: [
      "scikit-learn's user guide has separate chapters for supervised and unsupervised learning.",
      "X is usually shaped (n_samples, n_features), with samples as rows and features as columns.",
      "After fitting, supervised models use predict on new data without being retrained.",
    ],
    ex: "Predicting house prices from past sales is supervised regression; grouping customers by behaviour without predefined labels is unsupervised clustering.",
    mistakes: [
      "Calling clustering supervised because labels were added later.",
      "Passing y to an unsupervised method and expecting it to be used.",
    ],
    follow: ["What is the difference between regression and classification?"],
    points: [
      "Supervised: features plus targets",
      "Unsupervised: features only",
      "Regression targets are real numbers",
      "Classification targets are discrete",
    ],
    notes: "Targets present = supervised; targets absent = unsupervised.",
    src: [
      ["scikit-learn: Getting Started", `${SK}/getting_started.html`],
      ["scikit-learn: Supervised learning", `${SK}/supervised_learning.html`],
      ["scikit-learn: Unsupervised learning", `${SK}/unsupervised_learning.html`],
    ],
  }),
  g({
    slug: "estimator-fit-predict-transform",
    topic: "scikit-learn workflow",
    d: "easy",
    title: "What are estimators, fit, predict and transform in scikit-learn?",
    kw: ["estimator", "fit", "predict", "transform", "api"],
    intent:
      "Checks that you understand the common interface used by almost every scikit-learn object.",
    short:
      "scikit-learn provides built-in machine learning algorithms and models, called estimators. Each estimator is fitted to data with its fit method, which takes the samples matrix X and, for supervised tasks, the targets y. Once fitted, the estimator can predict target values of new data without retraining. Pre-processors and transformers follow the same API, because they inherit from the same BaseEstimator class, but they have a transform method instead of predict, which outputs a newly transformed sample matrix. For example, StandardScaler().fit(X).transform(X) scales a dataset using values computed from X.",
    detail: [
      "X and y are usually numpy arrays or equivalent array-like types.",
      "fit_transform fits and transforms in one call.",
      "Because the API is shared, you can swap one model for another with little code change.",
    ],
    ex: "clf.fit(X_train, y_train) learns from the training data, and clf.predict(X_new) returns classes for new samples.",
    mistakes: [
      "Calling predict before fit.",
      "Fitting a transformer again on new data instead of just transforming it.",
    ],
    follow: ["How do you chain preprocessing and a model?"],
    points: [
      "Estimators learn with fit",
      "predict applies a fitted model",
      "Transformers use transform",
      "Same base class and API",
    ],
    notes: "fit learns, predict predicts, transform transforms.",
    src: [["scikit-learn: Getting Started", `${SK}/getting_started.html`]],
  }),
  g({
    slug: "train-test-split",
    topic: "Overfitting & validation",
    d: "easy",
    title: "Why do you split data into training and test sets, and how do you do it?",
    kw: ["train_test_split", "test set", "overfitting", "random_state", "stratify"],
    intent:
      "Checks that you evaluate on data the model has not seen.",
    short:
      "The scikit-learn documentation calls it a methodological mistake to learn the parameters of a prediction function and test it on the same data. A model that just repeated the labels of the samples it had seen would score perfectly but fail on unseen data, which is called overfitting. So you hold out part of the data as a test set. train_test_split splits arrays into random train and test subsets: test_size gives the proportion or number of test samples, shuffle is on by default, random_state makes the split reproducible, and stratify keeps class proportions the same in both parts.",
    detail: [
      "Use the test set for the final evaluation only, not for making choices about the model.",
      "A validation set, or cross-validation, is used for tuning.",
      "The function can split several arrays at once, such as X and y, consistently.",
    ],
    ex: "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42).",
    mistakes: [
      "Evaluating the model on the data it was trained on.",
      "Splitting without a fixed random_state and getting results that cannot be repeated.",
    ],
    follow: ["What is cross-validation?"],
    points: [
      "Hold out data to test generalisation",
      "Overfitting means failing on unseen data",
      "random_state for reproducibility",
      "stratify keeps class balance",
    ],
    notes: "Never evaluate on the training data.",
    code: [
      "Splitting data",
      `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)`,
      [
        "test_size=0.2 keeps twenty percent of samples for testing.",
        "stratify=y preserves the class proportions in both parts.",
        "random_state makes the split the same on every run.",
      ],
      "python",
    ],
    src: [
      ["scikit-learn: train_test_split", `${G}.model_selection.train_test_split.html`],
      ["scikit-learn: Cross-validation", `${SK}/modules/cross_validation.html`],
    ],
  }),
  g({
    slug: "cross-validation-kfold",
    topic: "Overfitting & validation",
    d: "medium",
    title: "What is k-fold cross-validation and why use it?",
    kw: ["cross-validation", "k-fold", "cross_val_score", "folds", "validation"],
    intent:
      "Checks that you can get a more reliable estimate of performance than one split gives.",
    short:
      "KFold divides all the samples into k groups, called folds, of equal size where possible. The model is learned using k minus 1 folds and the fold left out is used for testing, and each fold is used once as the test set. cross_val_score evaluates a score by cross-validation: with an integer cv it uses KFold, or StratifiedKFold if the estimator is a classifier. The scores from the folds are averaged to estimate performance. Compared with a single split, this uses the data more fully and shows how much the score varies. KFold does not shuffle by default, and n_splits defaults to 5.",
    detail: [
      "If the data has a time order or groups, the documentation says to use time-series or group-wise cross-validation instead.",
      "A separate test set is still kept for the final evaluation.",
      "You can pass a scoring argument such as 'f1_macro'.",
    ],
    ex: "cross_val_score(clf, X, y, cv=5) returns five scores, one per fold.",
    mistakes: [
      "Using ordinary folds on time-ordered data.",
      "Tuning on the same folds you then report as the final result.",
    ],
    follow: ["When do you need stratified folds?"],
    points: [
      "Each fold is a test set once",
      "Train on k - 1 folds",
      "Average the fold scores",
      "Use group or time-aware splits when needed",
    ],
    notes: "cross_val_score(model, X, y, cv=5).",
    src: [
      ["scikit-learn: Cross-validation", `${SK}/modules/cross_validation.html`],
      ["scikit-learn: KFold", `${G}.model_selection.KFold.html`],
      ["scikit-learn: cross_val_score", `${G}.model_selection.cross_val_score.html`],
    ],
  }),
  g({
    slug: "stratified-kfold-imbalance",
    topic: "Overfitting & validation",
    d: "medium",
    title: "What is StratifiedKFold and when do you use it?",
    kw: ["StratifiedKFold", "stratification", "class proportions", "imbalanced", "folds"],
    intent:
      "Checks that you keep class proportions consistent when classes are uneven.",
    short:
      "StratifiedKFold is a variation of KFold that returns stratified folds. The folds are made by preserving the percentage of samples for each class in y in a binary or multiclass classification setting. That matters when classes are uneven, because a random fold might contain too few examples of a rare class. When you give cross_val_score an integer cv for a classifier, scikit-learn uses StratifiedKFold by default. The documentation adds a note that stratification on the class label solves an engineering problem rather than a statistical one.",
    detail: [
      "train_test_split has a stratify argument with the same purpose.",
      "The documentation says stratification on the class label solves an engineering problem rather than a statistical one.",
      "For grouped data, the cross-validation guide recommends group-wise splitting.",
    ],
    ex: "With 5 percent positive cases, each fold keeps about 5 percent positives.",
    mistakes: [
      "Using plain KFold on a very imbalanced dataset.",
      "Assuming stratification fixes imbalance in the model itself.",
    ],
    follow: ["Which metric should you use for imbalanced classes?"],
    points: [
      "Preserves class percentages in folds",
      "Default for classifiers in cross_val_score",
      "Useful for rare classes",
      "Does not rebalance the model",
    ],
    notes: "Stratify so each fold looks like the whole dataset.",
    src: [
      ["scikit-learn: StratifiedKFold", `${G}.model_selection.StratifiedKFold.html`],
      ["scikit-learn: Cross-validation", `${SK}/modules/cross_validation.html`],
    ],
  }),
  g({
    slug: "data-leakage",
    topic: "Overfitting & validation",
    d: "hard",
    title: "What is data leakage and how do you prevent it?",
    kw: ["data leakage", "pipeline", "fit on test data", "preprocessing", "optimistic"],
    intent:
      "Checks that you can spot mistakes that make a model's score look better than it is.",
    short:
      "Data leakage occurs when information that would not be available at prediction time is used when building the model. The result is overly optimistic performance estimates, for example from cross-validation, and poorer performance on genuinely new data. A common cause is not keeping train and test data separate. The general rule in the scikit-learn documentation is to never call fit on the test data. Preprocessing such as normalisation must be learned only from the training data and then applied to both. Using a Pipeline helps, because it applies the transformations consistently and avoids leaking the test data into training.",
    detail: [
      "Test data should never be used to make choices about the model.",
      "Inconsistent preprocessing is a related pitfall: if you scale the training set, you must scale the test data the same way.",
      "Putting preprocessing inside the pipeline passed to cross-validation means it is refit within each fold.",
    ],
    ex: "Scaling the whole dataset before splitting leaks the test set's mean and variance into training.",
    mistakes: [
      "Fitting a scaler or imputer on all the data before splitting.",
      "Selecting features using the whole dataset's labels before cross-validation.",
    ],
    follow: ["How does a Pipeline help?"],
    points: [
      "Information from the future or test set",
      "Leads to optimistic scores",
      "Never fit on test data",
      "Pipelines refit per fold",
    ],
    notes: "Fit on training data only, then transform both.",
    src: [["scikit-learn: Common pitfalls and recommended practices", `${SK}/common_pitfalls.html`]],
  }),
  g({
    slug: "bias-variance-underfit-overfit",
    topic: "Overfitting & validation",
    d: "medium",
    title: "What are bias and variance, and how do they relate to underfitting and overfitting?",
    kw: ["bias", "variance", "underfitting", "overfitting", "generalisation error"],
    intent:
      "Checks that you can explain why a model that is too simple or too flexible fails.",
    short:
      "An estimator's generalisation error can be decomposed into bias, variance and noise. The bias of an estimator is its average error for different training sets, and the variance indicates how sensitive it is to varying training sets. Noise is a property of the data. In the scikit-learn example, a degree-1 polynomial model gives only a poor fit because it is too simple, which is high bias. A degree-15 model fits the training data perfectly but not the true function, because it is very sensitive to varying training data, which is high variance. A middle degree approximates the function almost perfectly.",
    detail: [
      "High bias is underfitting and high variance is overfitting.",
      "Bias and variance are inherent properties of estimators.",
      "The user guide says we usually select algorithms and hyperparameters so that both are as low as possible.",
    ],
    ex: "A straight line through curved data underfits, while a very wiggly curve through the same data overfits.",
    mistakes: [
      "Judging a model by its training score alone.",
      "Adding complexity without checking validation performance.",
    ],
    follow: ["How do validation curves show this?"],
    points: [
      "Error = bias + variance + noise",
      "High bias: too simple",
      "High variance: too sensitive",
      "Balance with validation",
    ],
    notes: "Underfit = high bias; overfit = high variance.",
    src: [["scikit-learn: Validation curves", `${SK}/modules/learning_curve.html`]],
  }),
  g({
    slug: "learning-and-validation-curves",
    topic: "Overfitting & validation",
    d: "hard",
    title: "What do validation curves and learning curves show?",
    kw: ["validation_curve", "learning_curve", "training score", "hyperparameter", "training set size"],
    intent:
      "Checks that you can diagnose a model with plots of scores, not only a single number.",
    short:
      "A validation curve determines training and test scores for varying values of one parameter. sklearn.model_selection.validation_curve is similar to a grid search with one parameter, but it also computes training scores and is merely a utility for plotting the results. A learning curve, learning_curve, determines cross-validated training and test scores for different training set sizes: subsets of the training set with varying sizes train the estimator, and the scores are averaged over the cross-validation runs. Comparing training and test scores shows whether the model is overfitting, underfitting or would benefit from more data.",
    detail: [
      "If the training score is high and the validation score is low, the estimator is overfitting.",
      "A learning curve shows how much you would benefit from adding more training data.",
      "Both functions use cross-validation internally.",
    ],
    ex: "Plotting scores against tree depth shows where extra depth starts to hurt the test score.",
    mistakes: [
      "Reading only the training curve.",
      "Using the curves instead of a held-out test set for the final estimate.",
    ],
    follow: ["How do you tune hyperparameters systematically?"],
    points: [
      "Validation curve varies a parameter",
      "Learning curve varies training size",
      "Both give train and test scores",
      "Diagnose over- and underfitting",
    ],
    notes: "Compare training and validation scores.",
    src: [
      ["scikit-learn: validation_curve", `${G}.model_selection.validation_curve.html`],
      ["scikit-learn: learning_curve", `${G}.model_selection.learning_curve.html`],
    ],
  }),
  g({
    slug: "hyperparameter-tuning-gridsearch",
    topic: "scikit-learn workflow",
    d: "medium",
    title: "How do you tune hyperparameters with GridSearchCV and RandomizedSearchCV?",
    kw: ["GridSearchCV", "RandomizedSearchCV", "param_grid", "n_iter", "hyperparameters"],
    intent:
      "Checks that you can search parameter settings without touching the test set.",
    short:
      "GridSearchCV does an exhaustive search over specified parameter values for an estimator, optimising the parameters by cross-validated grid search over a parameter grid. You pass the estimator and a param_grid, and it fits every combination with cross-validation. RandomizedSearchCV does not try every value; it samples a fixed number of parameter settings from the specified distributions, and n_iter sets how many are tried, which can be cheaper when the space is large. With refit=True, the default, the best estimator is refitted on the whole training data. Keep the test set for the final evaluation.",
    detail: [
      "scoring selects the metric used to rank the settings.",
      "Both classes provide fit, predict and score.",
      "Putting a pipeline inside the search tunes preprocessing together with the model.",
    ],
    ex: "GridSearchCV(SVC(), {'C': [0.1, 1, 10]}, cv=5) tries three values of C with five-fold validation.",
    mistakes: [
      "Choosing hyperparameters using the test set.",
      "Searching an enormous grid exhaustively when random search would do.",
    ],
    follow: ["What does refit do?"],
    points: [
      "Grid search is exhaustive",
      "Randomised search samples n_iter settings",
      "Cross-validated scores rank settings",
      "refit trains the best model",
    ],
    notes: "Tune with CV; evaluate once on the test set.",
    src: [
      ["scikit-learn: GridSearchCV", `${G}.model_selection.GridSearchCV.html`],
      ["scikit-learn: RandomizedSearchCV", `${G}.model_selection.RandomizedSearchCV.html`],
    ],
  }),
  g({
    slug: "pipelines-and-column-transformer",
    topic: "scikit-learn workflow",
    d: "medium",
    title: "What are Pipeline and ColumnTransformer in scikit-learn?",
    kw: ["Pipeline", "ColumnTransformer", "make_pipeline", "preprocessing", "leakage"],
    intent:
      "Checks that you can chain preprocessing and a model into one object.",
    short:
      "A Pipeline is a sequence of data transformers with an optional final predictor. Intermediate steps must be transformers with fit and transform, and the final estimator only needs fit. It offers the same API as a regular estimator, so you can call fit and predict, and its steps can be cross-validated together while setting different parameters. A pipeline also helps prevent data leakage. ColumnTransformer applies different transformers to different columns of an array or pandas DataFrame and concatenates the resulting features, which is useful for data with both numeric and categorical columns.",
    detail: [
      "make_pipeline builds a pipeline without naming each step.",
      "A ColumnTransformer takes a list of (name, transformer, columns) tuples.",
      "A common design is a ColumnTransformer for preprocessing followed by a model, inside one pipeline.",
    ],
    ex: "A pipeline scales numeric columns, one-hot encodes categorical columns, then fits a classifier.",
    mistakes: [
      "Preprocessing outside the pipeline and forgetting to repeat it at prediction time.",
      "Applying a numeric scaler to categorical columns.",
    ],
    follow: ["How does a pipeline avoid leakage?"],
    points: [
      "Transformers then a final estimator",
      "Same fit and predict API",
      "ColumnTransformer handles mixed columns",
      "Cross-validate the whole pipeline",
    ],
    notes: "One pipeline = preprocessing + model.",
    src: [
      ["scikit-learn: Pipeline", `${G}.pipeline.Pipeline.html`],
      ["scikit-learn: ColumnTransformer", `${G}.compose.ColumnTransformer.html`],
      ["scikit-learn: Getting Started", `${SK}/getting_started.html`],
    ],
  }),
  g({
    slug: "feature-scaling-standard-minmax",
    topic: "Feature engineering",
    d: "easy",
    title: "What is feature scaling, and what is the difference between StandardScaler and MinMaxScaler?",
    kw: ["feature scaling", "StandardScaler", "MinMaxScaler", "standardisation", "normalisation"],
    intent:
      "Checks that you know why features are scaled and how the two common scalers differ.",
    short:
      "StandardScaler standardises features by removing the mean and scaling to unit variance: z equals (x minus u) divided by s, where u is the mean and s the standard deviation of the training samples. Centering and scaling happen independently on each feature, and the values from the training set are stored and used on later data. MinMaxScaler scales each feature to a given range, such as 0 to 1, using the minimum and maximum. The documentation says standardisation is a common requirement for many estimators, and that a feature with a variance orders of magnitude larger than others might dominate the objective. StandardScaler is sensitive to outliers.",
    detail: [
      "MinMaxScaler does not reduce the effect of outliers but linearly scales them into a fixed range.",
      "Fit scalers on the training data only, then transform the test data.",
      "Many objective functions, such as the RBF kernel of SVMs or l1 and l2 regularisers, assume features are centred around zero or have similar variance.",
    ],
    ex: "Age in years and income in rupees are scaled before a nearest-neighbour model so income does not dominate the distances.",
    mistakes: [
      "Fitting the scaler on the whole dataset before splitting.",
      "Ignoring outliers when choosing StandardScaler.",
    ],
    follow: ["Which algorithms need scaling?"],
    points: [
      "StandardScaler: mean 0, unit variance",
      "MinMaxScaler: fixed range",
      "Learn parameters on training data",
      "Outliers affect both",
    ],
    notes: "Standardise or min-max scale; fit on train only.",
    src: [
      ["scikit-learn: StandardScaler", `${G}.preprocessing.StandardScaler.html`],
      ["scikit-learn: MinMaxScaler", `${G}.preprocessing.MinMaxScaler.html`],
      ["scikit-learn: Preprocessing data", `${SK}/modules/preprocessing.html`],
    ],
  }),
  g({
    slug: "encoding-categorical-features",
    topic: "Feature engineering",
    d: "medium",
    title: "How do you encode categorical features: OneHotEncoder, OrdinalEncoder and LabelEncoder?",
    kw: ["OneHotEncoder", "OrdinalEncoder", "LabelEncoder", "categorical", "encoding"],
    intent:
      "Checks that you pick the right encoder for features and for targets.",
    short:
      "OneHotEncoder encodes categorical features as a one-hot numeric array, creating a binary column for each category. By default it derives the categories from the unique values in each feature, and it can return a sparse matrix or a dense array. OrdinalEncoder converts the features to ordinal integers, giving a single column of integers from 0 to n_categories minus 1 per feature. LabelEncoder is for encoding target labels with values between 0 and n_classes minus 1; the documentation says it should be used to encode the target y, not the input X.",
    detail: [
      "OneHotEncoder returns a sparse matrix or a dense array, depending on the sparse_output parameter.",
      "You can also specify the categories manually instead of deriving them from the data.",
      "Fit encoders on the training data so categories are consistent at prediction time.",
    ],
    ex: "A colour column with red, green and blue becomes three binary columns with OneHotEncoder.",
    mistakes: [
      "Using LabelEncoder on feature columns.",
      "Forgetting that an ordinal encoding produces one integer column per feature.",
    ],
    follow: ["How do you apply different encoders to different columns?"],
    points: [
      "One-hot: one binary column per category",
      "Ordinal: integers per feature",
      "LabelEncoder is for y",
      "Fit on training data",
    ],
    notes: "OneHot for unordered features; LabelEncoder only for targets.",
    src: [
      ["scikit-learn: OneHotEncoder", `${G}.preprocessing.OneHotEncoder.html`],
      ["scikit-learn: OrdinalEncoder", `${G}.preprocessing.OrdinalEncoder.html`],
      ["scikit-learn: LabelEncoder", `${G}.preprocessing.LabelEncoder.html`],
    ],
  }),
  g({
    slug: "handling-missing-values-simpleimputer",
    topic: "Feature engineering",
    d: "easy",
    title: "How do you handle missing values with SimpleImputer?",
    kw: ["SimpleImputer", "missing values", "mean", "median", "most_frequent"],
    intent:
      "Checks that you can fill gaps without leaking information.",
    short:
      "SimpleImputer is a univariate imputer for completing missing values with simple strategies. It replaces missing values using a descriptive statistic, such as the mean, median or most frequent value, computed along each column, or using a constant value. The missing_values argument sets the placeholder, np.nan by default. Because it learns the statistic during fit, you fit it on the training data and then transform both training and test data, ideally inside a pipeline so that the same values are used at prediction time and nothing leaks from the test set.",
    detail: [
      "Different columns can use different strategies through a ColumnTransformer.",
      "missing_values can be np.nan, None, pandas.NA, or a number or string placeholder.",
      "Some tree-based estimators, such as random forests, have native support for missing values.",
    ],
    ex: "Missing ages are replaced by the training median age before fitting a classifier.",
    mistakes: [
      "Computing the fill value from the full dataset before splitting.",
      "Using the mean for a skewed column without considering the median.",
    ],
    follow: ["How does a pipeline help here?"],
    points: [
      "Mean, median, most frequent or constant",
      "Learned from training data",
      "Same fill values reused at prediction",
      "Use inside a pipeline",
    ],
    notes: "Fit the imputer on training data only.",
    src: [["scikit-learn: SimpleImputer", `${G}.impute.SimpleImputer.html`]],
  }),
  g({
    slug: "polynomial-features-and-selection",
    topic: "Feature engineering",
    d: "medium",
    title: "How can you create and select features in scikit-learn?",
    kw: ["PolynomialFeatures", "SelectKBest", "feature selection", "interaction", "feature engineering"],
    intent:
      "Checks that you know basic tools for creating and trimming features.",
    short:
      "PolynomialFeatures generates polynomial and interaction features: for a two-dimensional sample [a, b] and degree 2 it gives [1, a, b, a squared, ab, b squared]. It lets a linear model fit curved relationships. SelectKBest selects features according to the k highest scores from a scoring function; its default scoring function f_classif works only for classification tasks. It exposes scores_ and pvalues_ for each feature. Any selection should be learned from training data only, ideally inside a pipeline, to avoid leakage.",
    detail: [
      "The degree argument of PolynomialFeatures sets the highest degree.",
      "The k=\"all\" option of SelectKBest bypasses selection, which is useful during a parameter search.",
      "scores_ and pvalues_ are available after fitting.",
    ],
    ex: "Adding squared terms lets a linear regression fit a U-shaped relationship.",
    mistakes: [
      "Selecting features on the whole dataset before cross-validation.",
      "Using a classification score function on a regression target.",
    ],
    follow: ["What does regularisation do to useless features?"],
    points: [
      "Polynomial and interaction features",
      "SelectKBest keeps the top k scores",
      "Default score is for classification",
      "Select inside a pipeline",
    ],
    notes: "Create features, then select on training data only.",
    src: [
      ["scikit-learn: PolynomialFeatures", `${G}.preprocessing.PolynomialFeatures.html`],
      ["scikit-learn: SelectKBest", `${G}.feature_selection.SelectKBest.html`],
    ],
  }),
  g({
    slug: "linear-regression-ols",
    topic: "Regression",
    d: "easy",
    title: "How does ordinary least squares linear regression work?",
    kw: ["linear regression", "ordinary least squares", "residual sum of squares", "coefficients", "intercept"],
    intent:
      "Checks that you know what the simplest regression model optimises.",
    short:
      "LinearRegression is ordinary least squares: it fits a linear model with coefficients w to minimise the residual sum of squares between the observed targets in the dataset and the targets predicted by the linear approximation. After fitting, the coefficients are in coef_ and the intercept in intercept_. The fit_intercept argument, True by default, controls whether an intercept is calculated; with False the data is expected to be centred. The model assumes a linear relationship between features and target, and you evaluate it on held-out data with metrics such as mean squared error and R squared.",
    detail: [
      "Each coefficient is the expected change in the target for a one-unit change in that feature, holding others fixed.",
      "With polynomial features it can model curves while remaining linear in the coefficients.",
      "Regularised variants such as Ridge and Lasso add a penalty.",
    ],
    ex: "Predicting house price from area, rooms and age with LinearRegression gives one coefficient per feature.",
    mistakes: [
      "Interpreting coefficients as causal effects.",
      "Judging fit on the training set only.",
    ],
    follow: ["How do Ridge and Lasso differ?"],
    points: [
      "Minimises residual sum of squares",
      "Linear in coefficients",
      "fit_intercept default True",
      "Evaluate on held-out data",
    ],
    notes: "OLS = least squared error line or plane.",
    src: [["scikit-learn: LinearRegression", `${G}.linear_model.LinearRegression.html`]],
  }),
  g({
    slug: "ridge-vs-lasso",
    topic: "Regression",
    d: "medium",
    title: "What is the difference between Ridge and Lasso regression?",
    kw: ["ridge", "lasso", "regularisation", "alpha", "l1 l2"],
    intent:
      "Checks that you can explain regularisation and the effect of each penalty.",
    short:
      "Both add a penalty to ordinary least squares to control overfitting, and alpha controls the strength. Ridge is linear least squares with l2 regularisation: it minimises the squared error plus alpha times the squared l2 norm of the coefficients, which is also called Tikhonov regularisation. Lasso is trained with an l1 penalty: alpha times the l1 norm of the coefficients. alpha must be a non-negative float; with alpha equal to 0 the objective is equivalent to ordinary least squares, and for Lasso the documentation advises using LinearRegression instead for numerical reasons. The user guide says Lasso estimates sparse coefficients, setting some exactly to zero.",
    detail: [
      "Elastic-Net combines L1 and L2 penalties, and Lasso is Elastic-Net with l1_ratio equal to 1.",
      "Both models have fit_intercept, True by default.",
      "The user guide notes that l1 and l2 regularisers assume features are centred or have similar variance, so scale the features.",
    ],
    ex: "With many correlated features, Ridge shrinks coefficients; with many irrelevant features, Lasso can remove some.",
    mistakes: [
      "Using regularised models without scaling the inputs.",
      "Setting alpha by looking at the test set.",
    ],
    follow: ["How do you choose alpha?"],
    points: [
      "Ridge uses an l2 penalty",
      "Lasso uses an l1 penalty",
      "alpha sets the strength",
      "alpha = 0 is plain least squares",
    ],
    notes: "L2 shrinks; L1 can zero out coefficients.",
    src: [
      ["scikit-learn: Ridge", `${G}.linear_model.Ridge.html`],
      ["scikit-learn: Lasso", `${G}.linear_model.Lasso.html`],
      ["scikit-learn: Preprocessing data", `${SK}/modules/preprocessing.html`],
    ],
  }),
  g({
    slug: "logistic-regression-classification",
    topic: "Classification",
    d: "easy",
    title: "What is logistic regression and is it regression or classification?",
    kw: ["logistic regression", "classification", "regularization", "solver", "predict_proba"],
    intent:
      "Checks that you know the name is misleading and that regularisation is applied by default.",
    short:
      "LogisticRegression, also known as logit or MaxEnt, is a classifier despite its name. The scikit-learn class implements regularised logistic regression using a set of available solvers, and the documentation notes that regularisation is applied by default. The lbfgs, newton-cg, newton-cholesky and sag solvers support only L2 regularisation or none, liblinear supports L1 or L2, and the saga solver supports elastic-net. It handles dense and sparse input. In addition to predicting classes, it can give class probabilities with predict_proba, which you can threshold to trade off errors.",
    detail: [
      "The strength of regularisation is controlled by the parameter C, where smaller values mean stronger regularisation.",
      "It is a common baseline classifier.",
      "Scale features for solvers that converge faster on standardised data.",
    ],
    ex: "Predicting whether a customer will churn, with probabilities used to rank customers by risk.",
    mistakes: [
      "Calling it a regression model for continuous targets.",
      "Forgetting that regularisation is on by default when comparing coefficients.",
    ],
    follow: ["How do you evaluate a classifier?"],
    points: [
      "A classifier",
      "Regularised by default",
      "Several solvers with different penalties",
      "Gives probabilities",
    ],
    notes: "Logistic regression classifies; it does not regress.",
    src: [["scikit-learn: LogisticRegression", `${G}.linear_model.LogisticRegression.html`]],
  }),
  g({
    slug: "decision-trees-criteria-depth",
    topic: "Classification",
    d: "medium",
    title: "How does a decision tree classifier work, and which parameters limit its size?",
    kw: ["decision tree", "gini impurity", "entropy", "max_depth", "min_samples_split"],
    intent:
      "Checks that you understand splits and how to keep a tree from overfitting.",
    short:
      "A decision tree classifier splits the data repeatedly. The criterion parameter measures the quality of a split: gini, the default, uses Gini impurity, while entropy and log_loss both use the Shannon information gain. The splitter chooses the best split or the best random split at each node. By default max_depth is None, so nodes expand until all leaves are pure or contain fewer than min_samples_split samples, which can overfit. To limit that, set max_depth, min_samples_split and similar parameters, and choose them with cross-validation. The user guide lists simple interpretation, visualisation and little data preparation as advantages.",
    detail: [
      "A fully grown tree can memorise the training set.",
      "The user guide says the deeper the tree, the more complex the decision rules and the fitter the model.",
      "It also notes that small changes in the data can produce a completely different tree.",
    ],
    ex: "A loan model limited to a few levels of splits stays readable and generalises better than a deep one.",
    mistakes: [
      "Leaving the depth unlimited and trusting the training score.",
      "Interpreting a very deep tree as if it were simple.",
    ],
    follow: ["How does a random forest improve on one tree?"],
    points: [
      "Splits chosen by an impurity criterion",
      "Default criterion is gini",
      "Unlimited depth can overfit",
      "Tune depth with cross-validation",
    ],
    notes: "Limit depth to avoid memorising the training data.",
    src: [
      ["scikit-learn: DecisionTreeClassifier", `${G}.tree.DecisionTreeClassifier.html`],
      ["scikit-learn: Decision Trees", `${SK}/modules/tree.html`],
    ],
  }),
  g({
    slug: "random-forest-vs-gradient-boosting",
    topic: "Classification",
    d: "medium",
    title: "What is the difference between a random forest and gradient boosting?",
    kw: ["random forest", "gradient boosting", "ensemble", "bagging", "boosting"],
    intent:
      "Checks that you can contrast two common tree ensembles.",
    short:
      "A random forest is a meta estimator that fits a number of decision tree classifiers on various sub-samples of the dataset and uses averaging to improve predictive accuracy and control over-fitting. When bootstrap is on, the default, each tree is built on a sub-sample, with the size set by max_samples. Gradient boosting builds an additive model in a forward stage-wise fashion: at each stage regression trees are fit on the negative gradient of the loss function, so each new tree corrects the errors of the earlier ones. Forests train trees independently, while boosting trains them in sequence.",
    detail: [
      "The scikit-learn documentation notes that HistGradientBoostingClassifier is a much faster variant for intermediate and large datasets.",
      "The RandomForestClassifier documentation notes native support for missing values.",
      "Both can report feature importances, which should be interpreted with care.",
    ],
    ex: "A random forest is a strong default for tabular data, while boosting is tuned carefully for the best accuracy.",
    mistakes: [
      "Saying that boosting trains trees independently.",
      "Not tuning the number of boosting stages and learning rate.",
    ],
    follow: ["How can you measure feature importance?"],
    points: [
      "Forest averages independent trees",
      "Boosting fits trees in sequence",
      "Boosting follows the loss gradient",
      "Histogram variant is faster on big data",
    ],
    notes: "Bagging averages; boosting corrects errors stage by stage.",
    src: [
      ["scikit-learn: RandomForestClassifier", `${G}.ensemble.RandomForestClassifier.html`],
      ["scikit-learn: GradientBoostingClassifier", `${G}.ensemble.GradientBoostingClassifier.html`],
    ],
  }),
  g({
    slug: "k-nearest-neighbours",
    topic: "Classification",
    d: "easy",
    title: "How does the k-nearest neighbours classifier work?",
    kw: ["k-nearest neighbors", "KNeighborsClassifier", "n_neighbors", "distance", "weights"],
    intent:
      "Checks that you understand a simple, instance-based classifier and its key parameter.",
    short:
      "KNeighborsClassifier implements the k-nearest neighbours vote. To classify a new sample it finds the n_neighbors closest training samples, which is 5 by default, and the class is decided by a vote among them. The weights parameter chooses how neighbours count: uniform gives every neighbour in the neighbourhood equal weight, while distance weights points by the inverse of their distance so closer neighbours have more influence. Because it relies on distances, features should be on comparable scales, so scale them first.",
    detail: [
      "The distance metric is configurable, and the fitted object records the effective metric.",
      "A callable can supply custom weights from the distances.",
      "Choose k with cross-validation.",
    ],
    ex: "A new fruit is classified by the majority label among its five most similar known fruits.",
    mistakes: [
      "Using it without scaling features of different units.",
      "Choosing k from the test score.",
    ],
    follow: ["Why does scaling matter here?"],
    points: [
      "Vote among k nearest samples",
      "n_neighbors default 5",
      "weights: uniform or distance",
      "Scale the features",
    ],
    notes: "Predict by the closest labelled examples.",
    src: [["scikit-learn: KNeighborsClassifier", `${G}.neighbors.KNeighborsClassifier.html`]],
  }),
  g({
    slug: "support-vector-classifier",
    topic: "Classification",
    d: "hard",
    title: "What is a support vector classifier (SVC) and what do C and the kernel control?",
    kw: ["SVC", "support vector machine", "kernel", "C", "rbf"],
    intent:
      "Checks that you know the main parameters and the scaling limits of SVC.",
    short:
      "SVC is C-Support Vector Classification, based on libsvm. Its parameters include C, the regularisation parameter, the kernel, which defaults to rbf, and gamma. The documentation warns that the fit time scales at least quadratically with the number of samples and may be impractical beyond tens of thousands of samples; for large datasets it suggests LinearSVC or SGDClassifier, possibly after a kernel approximation such as a Nystroem transformer. Multiclass support is handled with a one-vs-one scheme. Tune C, kernel and gamma with cross-validation, and standardise the features first.",
    detail: [
      "The user guide describes the kernel functions and how gamma, coef0 and degree interact.",
      "An example in the documentation shows tuning hyperparameters with nested cross-validation.",
      "Kernels let it separate classes that are not linearly separable.",
    ],
    ex: "A small text-classification dataset is classified with an SVC after TF-IDF features and scaling.",
    mistakes: [
      "Using SVC on hundreds of thousands of samples without checking training time.",
      "Skipping feature scaling.",
    ],
    follow: ["When would you prefer a linear model?"],
    points: [
      "libsvm-based classifier",
      "C, kernel, gamma matter",
      "Fit time grows at least quadratically",
      "One-vs-one multiclass",
    ],
    notes: "Great for small to medium data; scale features.",
    src: [["scikit-learn: SVC", `${G}.svm.SVC.html`]],
  }),
  g({
    slug: "naive-bayes-classifier",
    topic: "Classification",
    d: "medium",
    title: "What is a Gaussian Naive Bayes classifier?",
    kw: ["naive bayes", "GaussianNB", "priors", "var_smoothing", "partial_fit"],
    intent:
      "Checks that you can describe a simple probabilistic classifier and its useful features.",
    short:
      "GaussianNB is Gaussian Naive Bayes. Naive Bayes methods apply Bayes' theorem with the naive assumption of conditional independence between every pair of features given the class value; the Gaussian version suits continuous features. You can specify priors, the class probabilities; if you do, they are not adjusted according to the data. var_smoothing adds a portion of the largest feature variance to all variances for calculation stability. The fitted attributes include class_count_ and class_prior_. It supports online updates with partial_fit, so data can arrive in batches.",
    detail: [
      "The user guide describes it as a set of supervised learning algorithms.",
      "The predicted class probabilities from predict_proba should not be taken too seriously.",
      "var_smoothing and priors are its two constructor parameters.",
    ],
    ex: "Naive Bayes is used as a quick baseline for classifying measurements into species.",
    mistakes: [
      "Taking its predict_proba values too seriously: the documentation calls naive Bayes a decent classifier but a bad estimator.",
      "Using the Gaussian form for count data.",
    ],
    follow: ["What is a baseline model?"],
    points: [
      "Bayes' rule with independence assumption",
      "Gaussian model for continuous features",
      "priors can be set",
      "partial_fit for online updates",
    ],
    notes: "Fast probabilistic baseline.",
    src: [
      ["scikit-learn: GaussianNB", `${G}.naive_bayes.GaussianNB.html`],
      ["scikit-learn: Naive Bayes", `${SK}/modules/naive_bayes.html`],
    ],
  }),
  g({
    slug: "baseline-dummy-classifier",
    topic: "Model evaluation",
    d: "easy",
    title: "Why compare a model with a baseline such as DummyClassifier?",
    kw: ["DummyClassifier", "baseline", "most_frequent", "strategy", "accuracy"],
    intent:
      "Checks that you judge a model against something simple rather than a score in isolation.",
    short:
      "DummyClassifier makes predictions that ignore the input features, and it serves as a simple baseline to compare against more complex classifiers. The strategy parameter selects its behaviour: most_frequent, prior, stratified, uniform or constant. The predictions depend only on values observed in y during fit. The stratified and uniform strategies are non-deterministic unless you set random_state. If your model barely beats the baseline, or does worse on a metric such as accuracy with imbalanced classes, it has learned little, however good its raw score looks.",
    detail: [
      "A model that always predicts the majority class can score high accuracy on imbalanced data.",
      "There is a matching dummy estimator for regression.",
      "Report the baseline next to the model's score.",
    ],
    ex: "With 95 percent of samples in one class, the most_frequent baseline gets 95 percent accuracy, so a model must beat that.",
    mistakes: [
      "Celebrating a high accuracy without a baseline.",
      "Forgetting random_state for stochastic strategies.",
    ],
    follow: ["Which metrics suit imbalanced classes?"],
    points: [
      "Ignores input features",
      "Strategies: most_frequent, prior, stratified, uniform, constant",
      "Sets the score to beat",
      "Set random_state if random",
    ],
    notes: "Always know what a trivial model scores.",
    src: [["scikit-learn: DummyClassifier", `${G}.dummy.DummyClassifier.html`]],
  }),
  g({
    slug: "classification-metrics-precision-recall-f1",
    topic: "Model evaluation",
    d: "medium",
    title: "What are accuracy, precision, recall and F1?",
    kw: ["accuracy", "precision", "recall", "f1 score", "true positives"],
    intent:
      "Checks that you can define each metric and choose between them.",
    short:
      "Accuracy is the share of correct predictions. Precision is tp divided by (tp plus fp), where tp is the number of true positives and fp the false positives; it is the ability of the classifier not to label as positive a sample that is negative. Recall is tp divided by (tp plus fn), where fn is false negatives; it is the ability to find all the positive samples. The F1 score is the harmonic mean of precision and recall, 2 tp over (2 tp plus fp plus fn), with equal contribution from each. All run from 0 to 1, with 1 best.",
    detail: [
      "Which metric matters depends on the cost of each error type.",
      "For binary data average='binary' reports the positive class.",
      "classification_report prints precision, recall and F1 for each class.",
    ],
    ex: "A medical screen with costly misses is judged mainly by recall, while a spam filter that must not lose real mail is judged by precision.",
    mistakes: [
      "Using accuracy alone on imbalanced data.",
      "Mixing up precision and recall.",
    ],
    follow: ["What does a confusion matrix show?"],
    points: [
      "Precision = tp / (tp + fp)",
      "Recall = tp / (tp + fn)",
      "F1 is the harmonic mean",
      "Choose by error cost",
    ],
    notes: "Precision: how clean the positives are. Recall: how many positives found.",
    src: [
      ["scikit-learn: precision_score", `${G}.metrics.precision_score.html`],
      ["scikit-learn: recall_score", `${G}.metrics.recall_score.html`],
      ["scikit-learn: f1_score", `${G}.metrics.f1_score.html`],
      ["scikit-learn: accuracy_score", `${G}.metrics.accuracy_score.html`],
    ],
  }),
  g({
    slug: "confusion-matrix",
    topic: "Model evaluation",
    d: "easy",
    title: "What is a confusion matrix and how do you read it?",
    kw: ["confusion matrix", "true positives", "false positives", "false negatives", "true negatives"],
    intent:
      "Checks that you can read the table that most classification metrics come from.",
    short:
      "A confusion matrix C is defined so that C[i, j] is the number of observations known to be in group i and predicted to be in group j. In binary classification the count of true negatives is C[0, 0], false negatives is C[1, 0], true positives is C[1, 1] and false positives is C[0, 1]. Rows are the actual classes and columns are the predictions. From it you can compute accuracy, precision and recall. It shows not only how many errors a model makes but which kind, and for multiclass problems which classes are confused with each other.",
    detail: [
      "sklearn.metrics.confusion_matrix(y_true, y_pred) computes it.",
      "The labels argument fixes the order of the classes.",
      "Normalising the rows shows the share of each class predicted correctly.",
    ],
    ex: "In a fraud model the matrix shows how many fraudulent cases were missed, which a single accuracy number hides.",
    mistakes: [
      "Mixing up rows and columns.",
      "Reading counts without noticing class imbalance.",
    ],
    follow: ["How do precision and recall come from it?"],
    points: [
      "C[i, j]: true class i, predicted class j",
      "Binary layout: TN, FP, FN, TP",
      "Shows the type of errors",
      "Basis for other metrics",
    ],
    notes: "Rows = actual, columns = predicted.",
    src: [["scikit-learn: confusion_matrix", `${G}.metrics.confusion_matrix.html`]],
  }),
  g({
    slug: "roc-curve-and-auc",
    topic: "Model evaluation",
    d: "hard",
    title: "What are the ROC curve and ROC AUC?",
    kw: ["roc curve", "roc auc", "roc_auc_score", "threshold", "y_score"],
    intent:
      "Checks that you know how to evaluate a classifier across all decision thresholds.",
    short:
      "The receiver operating characteristic, ROC, curve is computed with roc_curve from true binary labels and scores. The scores can be probability estimates of the positive class or non-thresholded decision values from decision_function. roc_auc_score computes the area under the ROC curve from prediction scores, summarising performance across thresholds in one number. It can be used for binary, multiclass and multilabel classification, with some restrictions on the parameters. Because it takes scores and not hard class labels, you pass probabilities or decision values, not the output of predict.",
    detail: [
      "roc_curve supports binary classification only; multiclass uses one-vs-rest or one-vs-one in roc_auc_score.",
      "If labels are not {0, 1} or {-1, 1}, pos_label must be given.",
      "Pick an operating threshold from the curve according to your costs.",
    ],
    ex: "Two fraud models are compared across all thresholds with roc_auc_score on held-out data.",
    mistakes: [
      "Passing predicted labels instead of scores.",
      "Treating the area as the only measure when error costs differ.",
    ],
    follow: ["How do you choose a decision threshold?"],
    points: [
      "Uses scores, not labels",
      "Curve over all thresholds",
      "AUC summarises it",
      "Binary curve; multiclass via scores",
    ],
    notes: "roc_auc_score(y_true, y_score).",
    src: [
      ["scikit-learn: roc_curve", `${G}.metrics.roc_curve.html`],
      ["scikit-learn: roc_auc_score", `${G}.metrics.roc_auc_score.html`],
    ],
  }),
  g({
    slug: "regression-metrics",
    topic: "Model evaluation",
    d: "medium",
    title: "What are MAE, MSE and R squared for regression?",
    kw: ["mean absolute error", "mean squared error", "r2 score", "coefficient of determination", "regression metrics"],
    intent:
      "Checks that you can pick and read error metrics for numeric predictions.",
    short:
      "Mean absolute error is the average absolute difference between predicted and actual values; it is non-negative and the best value is 0. Mean squared error averages the squared differences, so it penalises large errors more, and is also non-negative. R squared, the coefficient of determination, has a best possible score of 1.0 and it can be negative because the model can be arbitrarily worse. A constant model that always predicts the mean of y, ignoring the features, would get an R squared of 0. Always compute them on held-out data.",
    detail: [
      "MAE is in the units of the target, so it is easy to explain.",
      "Squared errors weight outliers heavily.",
      "multioutput controls how scores for multiple targets are combined.",
    ],
    ex: "A price model with an MAE of 5,000 is wrong by about 5,000 on average.",
    mistakes: [
      "Treating R squared as always between 0 and 1.",
      "Reporting only a training-set error.",
    ],
    follow: ["Why compare against a mean-predicting baseline?"],
    points: [
      "MAE: average absolute error",
      "MSE: average squared error",
      "R squared best at 1; can be negative",
      "Predicting the mean gives 0",
    ],
    notes: "Low MAE/MSE good; R squared near 1 good.",
    src: [
      ["scikit-learn: mean_absolute_error", `${G}.metrics.mean_absolute_error.html`],
      ["scikit-learn: mean_squared_error", `${G}.metrics.mean_squared_error.html`],
      ["scikit-learn: r2_score", `${G}.metrics.r2_score.html`],
    ],
  }),
  g({
    slug: "kmeans-clustering",
    topic: "Clustering",
    d: "easy",
    title: "How does k-means clustering work, and what are n_clusters and init?",
    kw: ["k-means", "KMeans", "n_clusters", "k-means++", "centroids"],
    intent:
      "Checks that you can describe the most common clustering method and its main choices.",
    short:
      "KMeans groups samples into clusters, with n_clusters being both the number of clusters to form and the number of centroids to generate; the default is 8. The init parameter chooses the starting centroids: k-means++, the default, selects initial centroids by sampling from an empirical probability distribution of points' contribution to overall inertia, which speeds convergence, and random chooses observations at random. K-means is described as general-purpose, suited to even cluster size and flat geometry with not too many clusters, using distances between points. You must choose the number of clusters yourself, for example with silhouette analysis.",
    detail: [
      "Clustering is unsupervised, so there are no target labels to score against.",
      "Scale features first, because distances drive the result.",
      "Different initialisations can give different results; fix random_state for repeatability.",
    ],
    ex: "Customers are grouped into five segments by purchase behaviour, then the segments are profiled.",
    mistakes: [
      "Using it on unscaled features.",
      "Assuming clusters are meaningful just because the algorithm returns them.",
    ],
    follow: ["How do you choose the number of clusters?"],
    points: [
      "Choose n_clusters",
      "k-means++ initialisation by default",
      "Distance-based; scale features",
      "Unsupervised",
    ],
    notes: "Pick k, assign points to nearest centroids, update, repeat.",
    src: [
      ["scikit-learn: KMeans", `${G}.cluster.KMeans.html`],
      ["scikit-learn: Clustering", `${SK}/modules/clustering.html`],
    ],
  }),
  g({
    slug: "silhouette-score-choosing-k",
    topic: "Clustering",
    d: "hard",
    title: "How does the silhouette score help evaluate clusters?",
    kw: ["silhouette score", "silhouette coefficient", "intra-cluster distance", "nearest-cluster distance", "choosing k"],
    intent:
      "Checks that you can judge cluster quality without labels.",
    short:
      "The Silhouette Coefficient for a sample is (b minus a) divided by the maximum of a and b, where a is the mean intra-cluster distance and b is the mean distance to the nearest cluster the sample is not part of. silhouette_score returns the mean over all samples; silhouette_samples gives each sample's value. The best value is 1 and the worst is -1. The coefficient is only defined if the number of labels is between 2 and n_samples minus 1. You can compute the mean for several values of n_clusters and prefer the value that scores well, using it alongside domain knowledge.",
    detail: [
      "Values near 0 indicate overlapping clusters.",
      "Negative values suggest samples may have been assigned to the wrong cluster.",
      "The scikit-learn documentation has an example on selecting the number of clusters with silhouette analysis.",
    ],
    ex: "The analyst tries k from 2 to 8 on scaled data and compares the mean silhouette for each.",
    mistakes: [
      "Choosing k from the score alone without checking whether clusters make sense.",
      "Computing it with a single cluster.",
    ],
    follow: ["What other clustering methods exist?"],
    points: [
      "(b - a) / max(a, b)",
      "Range -1 to 1",
      "Needs 2 to n-1 clusters",
      "Mean over samples via silhouette_score",
    ],
    notes: "Higher silhouette = tighter, better separated clusters.",
    src: [["scikit-learn: silhouette_score", `${G}.metrics.silhouette_score.html`]],
  }),
  g({
    slug: "dbscan-density-clustering",
    topic: "Clustering",
    d: "medium",
    title: "How does DBSCAN differ from k-means?",
    kw: ["DBSCAN", "density-based", "eps", "min_samples", "noise points"],
    intent:
      "Checks that you know when density-based clustering is a better fit.",
    short:
      "DBSCAN, Density-Based Spatial Clustering of Applications with Noise, finds core samples of high density and expands clusters from them. The scikit-learn documentation says it is particularly good for data that contains clusters of similar density and can find clusters of arbitrary shape. Unlike k-means, it does not require you to specify the number of clusters in advance, and it can identify outliers as noise points. Its main parameter eps is the maximum distance between two samples for one to be considered in the neighbourhood of the other, and min_samples sets how many neighbours make a core point.",
    detail: [
      "Points that belong to no cluster are labelled as noise.",
      "The documentation notes that worst-case memory use can be quadratic when eps is large and min_samples is low.",
      "Scale features before using distance-based clustering.",
    ],
    ex: "Spatial points forming irregular blobs are grouped by DBSCAN, which also flags isolated points as noise.",
    mistakes: [
      "Using one eps for clusters of very different densities.",
      "Leaving features unscaled.",
    ],
    follow: ["When is k-means more suitable?"],
    points: [
      "Density-based",
      "No need to choose cluster count",
      "Finds noise points",
      "Tune eps and min_samples",
    ],
    notes: "DBSCAN: arbitrary shapes and outliers; k-means: round clusters.",
    src: [["scikit-learn: DBSCAN", `${G}.cluster.DBSCAN.html`]],
  }),
  g({
    slug: "pca-dimensionality-reduction",
    topic: "Supervised vs unsupervised",
    d: "medium",
    title: "What is PCA and what does it do to your features?",
    kw: ["PCA", "principal component analysis", "dimensionality reduction", "components", "variance"],
    intent:
      "Checks that you understand how PCA reduces dimensions and what it needs from the data.",
    short:
      "Principal component analysis decomposes a multivariate dataset into a set of successive orthogonal components that explain a maximum amount of the variance. In scikit-learn, PCA is a transformer that learns the components in its fit method and projects data to a lower-dimensional space using singular value decomposition. The documentation notes that the input data is centred but not scaled for each feature before applying SVD, so you usually standardise features first. You choose the number of components, and the explained variance ratio tells how much information each keeps. The explained variance ratio of each component shows how much of the variance it keeps.",
    detail: [
      "TruncatedSVD is an alternative for sparse data where the data is not centred.",
      "PCA components are combinations of the original features, so they are harder to interpret.",
      "Fit PCA on training data only.",
    ],
    ex: "Fifty correlated measurements are reduced to ten components before a classifier is trained.",
    mistakes: [
      "Applying PCA to unscaled features of different units.",
      "Fitting PCA on all the data before splitting.",
    ],
    follow: ["How do you pick the number of components?"],
    points: [
      "Orthogonal components maximise variance",
      "Uses SVD",
      "Centred, not scaled",
      "A transformer: fit then transform",
    ],
    notes: "Standardise, then PCA; fit on training data.",
    src: [
      ["scikit-learn: PCA", `${G}.decomposition.PCA.html`],
      ["scikit-learn: Decomposing signals in components", `${SK}/modules/decomposition.html`],
    ],
  }),
  g({
    slug: "permutation-feature-importance",
    topic: "Model evaluation",
    d: "hard",
    title: "How does permutation importance measure which features matter?",
    kw: ["permutation importance", "feature importance", "hold-out", "baseline metric", "inspection"],
    intent:
      "Checks that you can explain a model-agnostic way to see which inputs drive predictions.",
    short:
      "Permutation importance, from sklearn.inspection.permutation_importance, works on an already fitted estimator. First a baseline metric, defined by scoring, is evaluated on a dataset. Then one feature column is permuted, shuffled, and the metric is evaluated again. The permutation importance of that feature is the difference between the baseline metric and the metric after permuting the column. A large drop means the model relied on that feature. The data can be the training set or a hold-out set, and using a hold-out set shows what matters for generalisation. It works with any fitted estimator.",
    detail: [
      "It is repeated several times, so you get a mean and a spread.",
      "The result gives the mean and spread over several shuffles.",
      "It describes how the fitted model uses features, not whether they cause the target.",
    ],
    ex: "Shuffling the 'age' column drops the score a lot, while shuffling 'id' barely changes it.",
    mistakes: [
      "Reading importance as causal effect.",
      "Computing it only on the training data when you care about generalisation.",
    ],
    follow: ["Why can correlated features mislead?"],
    points: [
      "Needs a fitted estimator",
      "Shuffle one column and re-score",
      "Importance = drop in the metric",
      "Use a hold-out set",
    ],
    notes: "Shuffle a feature and see how much the score falls.",
    src: [["scikit-learn: permutation_importance", `${G}.inspection.permutation_importance.html`]],
  }),
])
