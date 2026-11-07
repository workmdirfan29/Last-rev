import { mod } from "./factory"

export const DATA_SCIENCE_MODULES = [
  mod(
    "python-data-science",
    "Python for Data Science",
    "data-science",
    "data-science",
    "intermediate",
    "NumPy, Pandas, data loading, cleaning and exploratory analysis.",
    [
      ["NumPy", 90],
      ["Pandas", 120],
      ["Data loading (CSV, JSON, SQL)", 45],
      ["Data cleaning", 75],
      ["EDA", 70],
      ["Jupyter workflow", 30],
    ],
    { prerequisites: ["python-fundamentals"] }
  ),
  mod(
    "data-visualization",
    "Data Visualization",
    "data-science",
    "data-science",
    "beginner",
    "Matplotlib, Seaborn and communicating insights visually.",
    [
      ["Matplotlib", 60],
      ["Seaborn", 45],
      ["Chart choice", 30],
      ["Storytelling", 40],
    ],
    { prerequisites: ["python-data-science"] }
  ),
  mod(
    "statistics",
    "Statistics & Probability",
    "data-science",
    "data-science",
    "intermediate",
    "Descriptive stats, probability, distributions and hypothesis testing.",
    [
      ["Descriptive stats", 60],
      ["Probability", 90],
      ["Distributions", 70],
      ["Hypothesis testing", 90],
      ["Linear algebra", 90],
      ["Confidence intervals", 60],
      ["Correlation & regression basics", 60],
    ]
  ),
  mod(
    "machine-learning",
    "Machine Learning",
    "data-science",
    "data-science",
    "advanced",
    "Supervised and unsupervised learning, feature engineering and model evaluation with scikit-learn.",
    [
      ["Regression", 150],
      ["Classification", 150],
      ["Clustering", 100],
      ["Feature engineering", 120],
      ["Model evaluation", 120],
      ["Overfitting & validation", 90],
      ["scikit-learn workflow", 120],
      ["Supervised vs unsupervised", 45],
    ],
    { prerequisites: ["statistics", "python-data-science"] }
  ),
  mod(
    "deep-learning-nlp",
    "Deep Learning & NLP",
    "data-science",
    "data-science",
    "advanced",
    "Neural networks, transformers and modern NLP.",
    [
      ["Neural networks", 150],
      ["CNN/RNN", 150],
      ["Transformers", 120],
      ["NLP tasks", 120],
      ["Training & optimization", 120],
      ["Regularization & overfitting", 60],
      ["Text preprocessing & embeddings", 90],
      ["Fine-tuning & transfer learning", 90],
    ],
    { prerequisites: ["machine-learning"] }
  ),
  mod(
    "etl",
    "ETL Fundamentals",
    "data-science",
    "data-science",
    "intermediate",
    "Extracting, transforming and loading data, and keeping pipelines reliable.",
    [
      ["Extract from sources", 45],
      ["Transform & clean", 60],
      ["Load & warehousing basics", 60],
      ["Pipelines & scheduling", 60],
      ["Data quality checks", 45],
    ],
    { prerequisites: ["sql"] }
  ),
]
