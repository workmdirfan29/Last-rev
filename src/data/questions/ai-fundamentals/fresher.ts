import { defineQuestions } from "../author"
import { q } from "../compact"

const SK = "https://scikit-learn.org/stable"
const GL = "https://docs.anthropic.com/en/docs/about-claude/glossary"
const OAI = "https://platform.openai.com/docs/guides"
const PT = "https://pytorch.org/tutorials/beginner/basics"
const HF = "https://huggingface.co/docs/transformers"
const PD = "https://pandas.pydata.org/docs/user_guide"

export default defineQuestions("ai-fundamentals", "fresher", [
  q({
    slug: "ai-versus-machine-learning-versus-deep-learning",
    topic: "AI vs ML vs deep learning",
    d: "easy",
    title:
      "What is the difference between AI, machine learning and deep learning?",
    kw: [
      "artificial intelligence",
      "machine learning",
      "deep learning",
      "neural networks",
      "nested fields",
    ],
    intent: "A basic vocabulary question that interviewers use as a warm-up.",
    short:
      "Artificial intelligence is the broad goal of making software perform tasks that normally need human intelligence. Machine learning is one approach to it: instead of writing rules by hand, you give an algorithm data and it learns patterns that it applies to new data, for example the supervised and unsupervised methods in scikit-learn. Deep learning is a branch of machine learning that uses neural networks with many layers, built with libraries like PyTorch, and is behind most modern image, speech and language systems. So deep learning sits inside machine learning, which sits inside AI.",
    detail: [
      "Not all AI is machine learning: rule-based expert systems and search algorithms are AI too.",
      "Classic machine learning, such as linear models and decision trees, often works well on small tabular data.",
      "Deep learning usually needs more data and compute but can learn features automatically.",
    ],
    ex: "A spam filter built with logistic regression is machine learning; a neural network that classifies photos is deep learning.",
    mistakes: [
      "Using the three terms as synonyms.",
      "Assuming deep learning is always the best choice.",
    ],
    follow: ["Give an example of AI that is not machine learning."],
    points: [
      "AI is the broad goal",
      "ML learns patterns from data",
      "Deep learning uses multi-layer neural networks",
      "DL is a subset of ML",
    ],
    notes: ["Nested: AI contains ML contains deep learning."],
    src: [
      ["scikit-learn: Supervised learning", `${SK}/supervised_learning.html`],
      ["PyTorch tutorials: Learn the basics", `${PT}/intro.html`],
    ],
  }),
  q({
    slug: "supervised-versus-unsupervised-learning",
    topic: "Machine learning basics",
    d: "easy",
    title:
      "What is the difference between supervised and unsupervised learning?",
    kw: [
      "supervised learning",
      "unsupervised learning",
      "labels",
      "clustering",
      "classification",
    ],
    intent: "Checks the main categories of machine-learning problems.",
    short:
      "In supervised learning each training example comes with a label or target, and the model learns to predict it for new inputs. Classification predicts a category (spam or not spam) and regression predicts a number (a house price). In unsupervised learning there are no labels: the algorithm looks for structure in the data itself, for instance clustering similar customers or reducing the number of features with dimensionality reduction. The scikit-learn user guide organises its algorithms in exactly these two groups. Supervised learning needs labelled data, which can be expensive to collect.",
    detail: [
      "Evaluation is easier in supervised learning because you can compare predictions with known labels.",
      "Semi-supervised and self-supervised approaches combine the two ideas.",
      "Choose by whether you have a target to predict.",
    ],
    ex: "Predicting loan default from past loans is supervised; grouping website visitors by behaviour is unsupervised.",
    mistakes: [
      "Calling clustering a classification task.",
      "Forgetting that supervised learning needs labels.",
    ],
    follow: ["Which kind is k-means?"],
    points: [
      "Supervised: labelled targets",
      "Classification and regression",
      "Unsupervised: no labels, find structure",
      "Clustering and dimensionality reduction",
    ],
    notes: ["Labels or no labels."],
    src: [
      ["scikit-learn: Supervised learning", `${SK}/supervised_learning.html`],
      [
        "scikit-learn: Unsupervised learning",
        `${SK}/unsupervised_learning.html`,
      ],
    ],
  }),
  q({
    slug: "classification-versus-regression",
    topic: "Machine learning basics",
    d: "easy",
    title: "What is the difference between classification and regression?",
    kw: [
      "classification",
      "regression",
      "target variable",
      "continuous value",
      "categories",
    ],
    intent: "Checks that you can match a problem to a model type.",
    short:
      "Both are supervised learning. Classification predicts a discrete class label, such as whether an email is spam, which digit an image shows, or which of several categories a ticket belongs to. Regression predicts a continuous numeric value, such as a price, a temperature or a demand forecast. The choice depends on the target variable, not on the algorithm: some methods, like decision trees, random forests and linear models, exist in both forms. Metrics differ too: accuracy, precision and recall for classification; mean squared error or mean absolute error for regression.",
    detail: [
      "Logistic regression is a classification algorithm despite its name.",
      "Turning a numeric target into bins converts regression into classification, but loses information.",
      "Class imbalance matters for classification; outliers matter for regression.",
    ],
    ex: "Predicting 'will the customer churn: yes/no' is classification; predicting next month's revenue is regression.",
    mistakes: [
      "Thinking logistic regression is a regression model.",
      "Using accuracy to judge a regression model.",
    ],
    follow: ["Which metrics would you use for each?"],
    points: [
      "Classification: discrete labels",
      "Regression: continuous values",
      "Decided by the target",
      "Different evaluation metrics",
    ],
    notes: ["Category versus number."],
    src: [
      ["scikit-learn: Supervised learning", `${SK}/supervised_learning.html`],
      [
        "scikit-learn: Metrics and scoring",
        `${SK}/modules/model_evaluation.html`,
      ],
    ],
  }),
  q({
    slug: "features-labels-and-training-data",
    topic: "Machine learning basics",
    d: "easy",
    title: "What are features, labels and a training set?",
    kw: ["features", "labels", "training set", "X and y", "samples"],
    intent: "Checks core data vocabulary for ML.",
    short:
      "A sample is one example, such as a customer or an image. Features are the input variables that describe it (age, number of purchases, pixel values), arranged in scikit-learn as a two-dimensional array `X` with one row per sample and one column per feature. The label or target is what you want to predict, held in `y`. The training set is the part of the data used to fit the model, while a separate test set is kept aside to estimate how it performs on unseen data. Good features often matter more than the choice of algorithm.",
    detail: [
      "Estimators in scikit-learn follow `fit(X, y)` and `predict(X)`.",
      "Features can be numeric or categorical and must be encoded to numbers for most models.",
      "Unsupervised learning has features but no `y`.",
    ],
    ex: "For house prices, X has columns like area and rooms, and y is the sale price.",
    code: [
      [
        "X and y in scikit-learn",
        "python",
        `from sklearn.linear_model import LinearRegression\n\nX = [[50, 1], [80, 2], [120, 3]]   # area, bedrooms\ny = [30, 50, 80]                    # price in lakhs\nmodel = LinearRegression().fit(X, y)\nprint(model.predict([[100, 2]]))`,
        ["Each row of `X` is a sample.", "`y` holds the target for each row."],
      ],
    ],
    mistakes: [
      "Including the target as a feature.",
      "Mixing up the row and column meaning of X.",
    ],
    follow: ["Why keep a separate test set?"],
    points: [
      "Sample = one example",
      "Features = inputs (X)",
      "Label = target (y)",
      "Training set fits the model",
    ],
    notes: ["X in, y out."],
    src: [
      ["scikit-learn: Getting started", `${SK}/getting_started.html`],
      ["scikit-learn: Supervised learning", `${SK}/supervised_learning.html`],
    ],
  }),
  q({
    slug: "train-test-split-and-generalization",
    topic: "Machine learning basics",
    d: "easy",
    title: "Why do we split data into training and test sets?",
    kw: [
      "train test split",
      "generalization",
      "held-out data",
      "validation set",
      "unseen data",
    ],
    intent: "Checks the central idea of evaluating on unseen data.",
    short:
      "A model can memorise its training data, so measuring performance on the same data gives an overly optimistic score. The scikit-learn documentation calls testing a model on the data it was trained on a methodological mistake. Instead you hold out part of the data as a test set that the model never sees during training, and evaluate on that to estimate how it will perform on new data (generalisation). `train_test_split` does the split, and a validation set or cross-validation is used for tuning so the test set stays untouched until the end. Use a fixed `random_state` for reproducible splits.",
    detail: [
      "Stratified splits keep class proportions similar in each part.",
      "For time series, split by time, never randomly.",
      "Do not tune hyperparameters on the test set.",
    ],
    ex: "Training on 80% of the customers and reporting accuracy on the other 20%.",
    code: [
      [
        "train_test_split",
        "python",
        `from sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)`,
        ["The test portion is never used for fitting."],
      ],
    ],
    mistakes: [
      "Reporting training accuracy as the result.",
      "Tuning on the test set.",
    ],
    follow: ["What does cross-validation add?"],
    points: [
      "Training score is optimistic",
      "Hold out unseen data",
      "Validation for tuning",
      "Fixed random_state",
    ],
    notes: ["Judge on data the model hasn't seen."],
    src: [
      ["scikit-learn: Cross-validation", `${SK}/modules/cross_validation.html`],
      [
        "scikit-learn: train_test_split",
        `${SK}/modules/generated/sklearn.model_selection.train_test_split.html`,
      ],
    ],
  }),
  q({
    slug: "overfitting-and-underfitting",
    topic: "Machine learning basics",
    d: "medium",
    title: "What are overfitting and underfitting, and how do you detect them?",
    kw: [
      "overfitting",
      "underfitting",
      "validation curve",
      "learning curve",
      "generalization gap",
    ],
    intent: "A core question on model quality.",
    short:
      "Overfitting is when a model learns noise and details of the training data so well that it performs much worse on new data: high training score, low validation score. Underfitting is when the model is too simple to capture the pattern, so it does poorly on both. Detect them by comparing training and validation scores, and with learning curves (score versus training set size) and validation curves (score versus a hyperparameter), which scikit-learn can plot. Remedies for overfitting: more data, a simpler model, regularisation, fewer features or early stopping. For underfitting: a more expressive model or better features.",
    detail: [
      "Complex models like deep trees overfit easily without limits such as `max_depth`.",
      "Cross-validation gives a more reliable estimate than a single split.",
      "The gap between training and validation scores is the warning sign.",
    ],
    ex: "A decision tree with unlimited depth gets 100% training accuracy but much lower test accuracy.",
    mistakes: [
      "Judging only by training score.",
      "Adding complexity to fix overfitting.",
    ],
    follow: ["Which curves help you diagnose it?"],
    points: [
      "Overfit: great train, poor validation",
      "Underfit: poor on both",
      "Learning and validation curves",
      "Regularise or simplify to fix overfitting",
    ],
    notes: ["Compare train and validation."],
    src: [
      [
        "scikit-learn: Validation curves and learning curves",
        `${SK}/modules/learning_curve.html`,
      ],
      ["scikit-learn: Cross-validation", `${SK}/modules/cross_validation.html`],
    ],
  }),
  q({
    slug: "data-leakage",
    topic: "Machine learning basics",
    d: "medium",
    title: "What is data leakage, and how do you avoid it?",
    kw: [
      "data leakage",
      "preprocessing leakage",
      "pipeline",
      "test set contamination",
      "target leakage",
    ],
    intent: "Checks awareness of a subtle but serious evaluation mistake.",
    short:
      "Data leakage means information from outside the training data, typically from the test set or from the future, influences the model, so the evaluation looks better than real performance. Common forms: fitting a scaler or imputer on the whole dataset before splitting, so test statistics leak into training; a feature that is derived from the target (target leakage); and duplicates shared between train and test. The scikit-learn common-pitfalls guide recommends putting preprocessing and the model in a `Pipeline`, so that all steps are fitted only on the training fold during cross-validation. Always split first, then fit transformations on the training data only.",
    detail: [
      "For time-based data, never train on information from after the prediction time.",
      "Suspiciously perfect scores often indicate leakage.",
      "Feature selection must also happen inside the cross-validation loop.",
    ],
    ex: "Scaling the full dataset with `StandardScaler().fit(X)` before `train_test_split` leaks test statistics.",
    code: [
      [
        "Leak-free pipeline",
        "python",
        `from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nmodel = make_pipeline(StandardScaler(), LogisticRegression())\nmodel.fit(X_train, y_train)          # scaler fitted on train only\nprint(model.score(X_test, y_test))`,
        ["The pipeline fits the scaler only on training data."],
      ],
    ],
    mistakes: [
      "Preprocessing before splitting.",
      "Keeping features computed from the target.",
    ],
    follow: ["How does a Pipeline help?"],
    points: [
      "Test or future info leaks into training",
      "Split first, then fit transforms",
      "Use Pipeline",
      "Too-good scores are a warning",
    ],
    notes: ["Fit on train only."],
    src: [
      [
        "scikit-learn: Common pitfalls and recommended practices",
        `${SK}/common_pitfalls.html`,
      ],
      [
        "scikit-learn: Pipeline",
        `${SK}/modules/generated/sklearn.pipeline.Pipeline.html`,
      ],
    ],
  }),
  q({
    slug: "accuracy-precision-recall-basics",
    topic: "Machine learning basics",
    d: "medium",
    title:
      "What are accuracy, precision and recall, and when is accuracy misleading?",
    kw: ["accuracy", "precision", "recall", "f1 score", "class imbalance"],
    intent: "Checks classification metrics.",
    short:
      "Accuracy is the share of all predictions that are correct. Precision is the share of predicted positives that really are positive (how trustworthy a positive prediction is), and recall is the share of actual positives that were found (how many you caught). The F1 score combines precision and recall. Accuracy is misleading with imbalanced classes: if 99% of transactions are legitimate, a model that always predicts 'legitimate' is 99% accurate but useless for finding fraud. Choose metrics by the cost of errors: favour recall when missing a positive is costly, precision when false alarms are costly. The confusion matrix shows all four outcomes.",
    detail: [
      "scikit-learn provides these in `sklearn.metrics`, including `classification_report`.",
      "ROC AUC summarises ranking quality across thresholds.",
      "Changing the decision threshold trades precision against recall.",
    ],
    ex: "In disease screening, high recall is preferred so few real cases are missed.",
    mistakes: [
      "Reporting accuracy alone on imbalanced data.",
      "Mixing up precision and recall.",
    ],
    follow: ["How does a confusion matrix help?"],
    points: [
      "Accuracy = correct / all",
      "Precision = TP / predicted positives",
      "Recall = TP / actual positives",
      "Accuracy fails on imbalance",
    ],
    notes: ["Choose the metric by the cost of mistakes."],
    src: [
      [
        "scikit-learn: Metrics and scoring",
        `${SK}/modules/model_evaluation.html`,
      ],
      [
        "scikit-learn: classification_report",
        `${SK}/modules/generated/sklearn.metrics.classification_report.html`,
      ],
    ],
  }),
  q({
    slug: "machine-learning-workflow",
    topic: "Machine learning basics",
    d: "easy",
    title: "What are the typical steps of a machine-learning project?",
    kw: [
      "ml workflow",
      "data preparation",
      "model selection",
      "evaluation",
      "deployment",
    ],
    intent: "Checks understanding of the end-to-end process.",
    short:
      "Start by defining the problem and a success measure. Then collect and understand the data (exploration), clean it and handle missing values, and engineer features. Split into training and test sets, build a baseline, train and compare models using cross-validation, tune hyperparameters, and evaluate the chosen model once on the held-out test set. Next comes deployment as a service or batch job, and monitoring for drift and quality because data changes over time. In scikit-learn the preprocessing and the estimator are chained in a `Pipeline` so the same steps run in training and production.",
    detail: [
      "Most of the effort is usually data work rather than modelling.",
      "A simple baseline tells you whether complexity is worth it.",
      "Document data sources and versions for reproducibility.",
    ],
    ex: "A churn project: define churn, gather customer history, build features, train, evaluate, deploy a weekly scoring job.",
    mistakes: [
      "Skipping the baseline.",
      "Ignoring monitoring after deployment.",
    ],
    follow: ["Why use a pipeline for production?"],
    points: [
      "Define the problem and metric",
      "Prepare data, split",
      "Train, tune, evaluate",
      "Deploy and monitor",
    ],
    notes: ["Data first, model second."],
    src: [
      ["scikit-learn: Getting started", `${SK}/getting_started.html`],
      [
        "scikit-learn: Pipelines and composite estimators",
        `${SK}/modules/compose.html`,
      ],
    ],
  }),
  q({
    slug: "what-is-a-neural-network",
    topic: "AI vs ML vs deep learning",
    d: "easy",
    title: "What is a neural network at a high level?",
    kw: [
      "neural network",
      "layers",
      "weights",
      "activation function",
      "forward pass",
    ],
    intent: "Checks the basic picture of deep learning.",
    short:
      "A neural network is a function made of layers. Each layer takes numbers in, multiplies them by learnable weights, adds biases and applies a non-linear activation function such as ReLU, then passes the result to the next layer. Stacking many layers lets the network represent complex patterns. Running input through the layers to get an output is the forward pass. The weights are the model's parameters and are adjusted during training to reduce a loss function. In PyTorch you define the layers in an `nn.Module` and implement `forward`. Without non-linear activations, many layers would collapse into a single linear transformation.",
    detail: [
      "Hidden layers sit between input and output layers.",
      "The number of parameters can range from thousands to billions.",
      "Different architectures (CNNs, RNNs, transformers) arrange layers differently.",
    ],
    ex: "A small network that takes 784 pixel values and outputs 10 class scores.",
    code: [
      [
        "A tiny network in PyTorch",
        "python",
        `import torch\nfrom torch import nn\n\nmodel = nn.Sequential(\n    nn.Linear(4, 8),\n    nn.ReLU(),\n    nn.Linear(8, 3),\n)\nprint(model(torch.randn(2, 4)).shape)   # torch.Size([2, 3])`,
        ["Linear layers hold weights.", "`ReLU` adds non-linearity."],
      ],
    ],
    mistakes: [
      "Forgetting the activation function.",
      "Thinking more layers always means better results.",
    ],
    follow: ["Why is a non-linear activation needed?"],
    points: [
      "Layers of weights and activations",
      "Forward pass produces output",
      "Weights are learned",
      "Non-linearity is essential",
    ],
    notes: ["Stacked weighted layers."],
    src: [
      [
        "PyTorch tutorials: Build the neural network",
        `${PT}/buildmodel_tutorial.html`,
      ],
      [
        "PyTorch docs: torch.nn.Linear",
        "https://pytorch.org/docs/stable/generated/torch.nn.Linear.html",
      ],
    ],
  }),
  q({
    slug: "training-with-loss-and-gradient-descent",
    topic: "AI vs ML vs deep learning",
    d: "medium",
    title:
      "How does a neural network learn: loss, gradients and gradient descent?",
    kw: [
      "loss function",
      "gradient descent",
      "backpropagation",
      "optimizer",
      "learning rate",
    ],
    intent: "Checks understanding of training.",
    short:
      "Training repeats a loop. The model makes predictions on a batch of data (forward pass); a loss function measures how wrong they are; backpropagation computes the gradient of the loss with respect to every parameter, which tells how each parameter should change to reduce the loss; and an optimizer such as SGD or Adam updates the parameters a small step in that direction. The step size is the learning rate: too high and training diverges, too low and it is slow. One pass over the whole dataset is an epoch. In PyTorch the loop is `optimizer.zero_grad()`, `loss.backward()`, `optimizer.step()`.",
    detail: [
      "Autograd records operations to compute gradients automatically.",
      "Training data is processed in mini-batches rather than all at once.",
      "Monitor validation loss to detect overfitting.",
    ],
    ex: "Training an image classifier for several epochs while watching validation loss.",
    code: [
      [
        "PyTorch training step",
        "python",
        `loss = loss_fn(model(x), y)\noptimizer.zero_grad()   # clear old gradients\nloss.backward()         # compute gradients\noptimizer.step()        # update weights`,
        ["Gradients are accumulated unless cleared first."],
      ],
    ],
    mistakes: [
      "Forgetting zero_grad().",
      "Setting the learning rate without testing.",
    ],
    follow: ["What is an epoch?"],
    points: [
      "Forward pass, loss, backward pass, update",
      "Gradient shows how to reduce loss",
      "Learning rate controls step size",
      "Mini-batches and epochs",
    ],
    notes: ["Predict, measure, adjust, repeat."],
    src: [
      [
        "PyTorch tutorials: Optimizing model parameters",
        `${PT}/optimization_tutorial.html`,
      ],
      [
        "PyTorch tutorials: Automatic differentiation",
        `${PT}/autogradqs_tutorial.html`,
      ],
    ],
  }),
  q({
    slug: "what-is-a-large-language-model",
    topic: "How LLMs work (high level)",
    d: "easy",
    title: "What is a large language model (LLM)?",
    kw: [
      "llm",
      "large language model",
      "pretraining",
      "next token prediction",
      "language model",
    ],
    intent: "Checks a clear, accurate high-level definition.",
    short:
      "A large language model is a language model with a very large number of parameters, trained on vast amounts of text. Pretraining teaches an autoregressive model to predict the next token given the preceding text, and this simple objective makes it learn grammar, facts and patterns of reasoning. A pretrained model is then usually refined with fine-tuning and reinforcement learning from human feedback (RLHF) so that it follows instructions and behaves like an assistant. It generates text one token at a time, each token conditioned on the prompt and the tokens produced so far.",
    detail: [
      "The model works on tokens, not words or characters.",
      "Its knowledge comes from training data and is fixed at training time unless you supply context.",
      "Outputs are probabilistic, so identical prompts can differ.",
    ],
    ex: "A chat assistant summarising an email thread.",
    mistakes: [
      "Treating the model as a database of facts.",
      "Assuming it understands text like a human.",
    ],
    follow: ["What training objective is used in pretraining?"],
    points: [
      "Very large neural language model",
      "Pretrained to predict the next token",
      "Refined with fine-tuning and RLHF",
      "Generates token by token",
    ],
    notes: ["Next-token predictor at scale."],
    src: [
      ["Anthropic docs: Glossary (LLM, pretraining, RLHF)", GL],
      ["Hugging Face Transformers: Glossary", `${HF}/glossary`],
    ],
  }),
  q({
    slug: "tokens-and-tokenization",
    topic: "How LLMs work (high level)",
    d: "easy",
    title: "What are tokens and tokenization in language models?",
    kw: ["tokens", "tokenizer", "subword", "vocabulary", "token count"],
    intent: "Checks a concept that affects cost, limits and behaviour.",
    short:
      "Language models do not read raw characters or whole words; a tokenizer splits text into tokens, which can be words, parts of words (subwords), characters or even bytes, and maps each to an integer id from a fixed vocabulary. Common words may be a single token while rare words or other languages split into several. Context limits, input size and API usage are counted in tokens, not in words, and the number of tokens for the same text depends on the model's tokenizer, so use the provider's token counting rather than guessing. Subword schemes let a model handle words it has never seen.",
    detail: [
      "Tokenization explains quirks like difficulty counting letters in a word.",
      "Different models use different tokenizers and vocabularies.",
      "Hugging Face documents common subword algorithms.",
    ],
    ex: "A long sentence in one language may use more tokens than the same meaning in another.",
    mistakes: [
      "Estimating costs or limits from word counts.",
      "Assuming tokenizers are interchangeable between models.",
    ],
    follow: ["Why do models use subword tokens?"],
    points: [
      "Text split into tokens",
      "Tokens map to vocabulary ids",
      "Limits and usage counted in tokens",
      "Use the provider's counter",
    ],
    notes: ["Tokens, not words."],
    src: [
      [
        "Hugging Face Transformers: Tokenization algorithms",
        `${HF}/tokenizer_summary`,
      ],
      ["Anthropic docs: Glossary (tokens)", GL],
    ],
  }),
  q({
    slug: "context-window-explained",
    topic: "How LLMs work (high level)",
    d: "easy",
    title: "What is a context window?",
    kw: [
      "context window",
      "working memory",
      "token limit",
      "conversation history",
      "context rot",
    ],
    intent: "Checks understanding of a key practical limit.",
    short:
      "The context window is the amount of text, measured in tokens, that a model can consider when generating a response. It acts as the model's working memory and includes everything in the request: the system prompt, the conversation history, any documents or tool results, and also the response being generated. Anything outside the window is simply not seen. A larger window lets you include more material, but Anthropic's documentation notes that more context is not automatically better: as the token count grows, accuracy and recall can degrade ('context rot'), so curate what you put in. Long chats need trimming, summarising or retrieval.",
    detail: [
      "Different models have different window sizes; check the provider's documentation.",
      "Input and output together must fit in the window.",
      "Token counting endpoints let you check a request before sending it.",
    ],
    ex: "A support bot summarises older turns so the conversation still fits.",
    mistakes: [
      "Stuffing everything into the prompt.",
      "Forgetting that the output also uses the window.",
    ],
    follow: ["What can you do when a conversation outgrows the window?"],
    points: [
      "Working memory in tokens",
      "Includes prompt, history and output",
      "Larger is not automatically better",
      "Trim, summarise or retrieve",
    ],
    notes: ["Only what fits is seen."],
    src: [
      [
        "Anthropic docs: Context windows",
        "https://docs.anthropic.com/en/docs/build-with-claude/context-windows",
      ],
      ["Anthropic docs: Glossary (context window)", GL],
    ],
  }),
  q({
    slug: "temperature-and-sampling",
    topic: "How LLMs work (high level)",
    d: "easy",
    title: "What does temperature control in text generation?",
    kw: ["temperature", "sampling", "top-p", "randomness", "determinism"],
    intent: "Checks understanding of generation parameters.",
    short:
      "A model assigns probabilities to possible next tokens, and a sampling step picks one. Temperature controls the randomness of that choice: lower values make the output more conservative and deterministic by favouring the most likely tokens, while higher values produce more varied, creative output. Related settings such as top-p (nucleus sampling) and top-k restrict the candidate tokens considered. Use low temperature for factual extraction or code and higher for brainstorming. Even at temperature 0 the Anthropic documentation warns that results are not fully deterministic, so identical inputs may still give different outputs across calls.",
    detail: [
      "Changing both temperature and top-p at once makes behaviour harder to reason about.",
      "Hugging Face's generation docs describe sampling options such as `do_sample`.",
      "Evaluate settings against your own test cases.",
    ],
    ex: "Using a low temperature for classification and a higher one for naming ideas.",
    mistakes: [
      "Assuming temperature 0 guarantees identical outputs.",
      "Raising temperature to fix wrong facts.",
    ],
    follow: ["What does top-p do?"],
    points: [
      "Controls randomness of token choice",
      "Low = conservative, high = varied",
      "top-p and top-k limit candidates",
      "Zero is not fully deterministic",
    ],
    notes: ["Dial between safe and creative."],
    src: [
      ["Anthropic docs: Glossary (temperature)", GL],
      ["Hugging Face Transformers: Text generation", `${HF}/llm_tutorial`],
    ],
  }),
  q({
    slug: "pretraining-fine-tuning-and-rlhf",
    topic: "How LLMs work (high level)",
    d: "medium",
    title: "What is the difference between pretraining, fine-tuning and RLHF?",
    kw: [
      "pretraining",
      "fine-tuning",
      "rlhf",
      "instruction tuning",
      "alignment",
    ],
    intent: "Checks understanding of how assistants are built.",
    short:
      "Pretraining is the first, very large stage: the model learns to predict the next token on a huge unlabelled text corpus, which gives broad language ability but not reliable instruction following. Fine-tuning continues training a pretrained model on additional, usually smaller and more specific data to adapt it to a domain, task or style. RLHF (reinforcement learning from human feedback) trains the model to prefer outputs that humans rank higher, helping it follow instructions and behave helpfully and safely. Together these steps turn a base model into an assistant.",
    detail: [
      "Not every provider offers fine-tuning; the Anthropic glossary states it is not currently offered for the Claude API.",
      "Parameter-efficient methods such as LoRA adapt a model by training few extra parameters.",
      "Fine-tuning can change model behaviour in unintended ways, so evaluate it.",
    ],
    ex: "A company adapts a model to its support tone by fine-tuning, or simply prompts it with style examples.",
    mistakes: [
      "Fine-tuning when prompting or retrieval would be enough.",
      "Expecting fine-tuning to add fresh facts reliably.",
    ],
    follow: ["When would you fine-tune instead of prompt?"],
    points: [
      "Pretraining: next-token on huge data",
      "Fine-tuning: adapt to specific data",
      "RLHF: learn from human preferences",
      "Developers usually prompt or retrieve",
    ],
    notes: ["Learn language, specialise, align."],
    src: [
      ["Anthropic docs: Glossary (pretraining, fine-tuning, RLHF)", GL],
      [
        "Hugging Face Transformers: Fine-tune a pretrained model",
        `${HF}/training`,
      ],
    ],
  }),
  q({
    slug: "attention-and-transformers-overview",
    topic: "How LLMs work (high level)",
    d: "medium",
    title:
      "What is the transformer architecture, and why is attention important?",
    kw: [
      "transformer",
      "self-attention",
      "attention mechanism",
      "parallel processing",
      "architecture",
    ],
    intent: "Checks high-level knowledge of the model behind modern LLMs.",
    short:
      "The transformer is the neural network architecture behind most modern language models. Its key component is attention: for each token, the model computes how much to weigh every other token in the sequence, so it can use relevant context from anywhere in the input, such as linking a pronoun to the noun it refers to. Multi-head attention does this in several 'subspaces' in parallel. Unlike recurrent networks, transformers process all positions of a sequence in parallel during training, which scales well on modern hardware. Stacks of attention and feed-forward layers, with positional information added, form the model. Cost grows with sequence length.",
    detail: [
      "Encoder-only, decoder-only and encoder-decoder variants exist for different tasks.",
      "Decoder-only transformers generate text token by token.",
      "PyTorch provides building blocks such as `nn.MultiheadAttention`.",
    ],
    ex: "In 'The trophy didn't fit in the suitcase because it was too big', attention helps decide that 'it' means the trophy.",
    mistakes: [
      "Thinking attention means the model 'focuses' like a human.",
      "Ignoring the cost of long sequences.",
    ],
    follow: ["Why can transformers be trained in parallel?"],
    points: [
      "Attention weighs other tokens",
      "Multi-head attention in parallel",
      "Parallel training over positions",
      "Basis of modern LLMs",
    ],
    notes: ["Every token looks at the others."],
    src: [
      [
        "PyTorch docs: torch.nn.MultiheadAttention",
        "https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html",
      ],
      ["Hugging Face Transformers: Documentation", `${HF}/index`],
    ],
  }),
  q({
    slug: "why-llms-hallucinate",
    topic: "How LLMs work (high level)",
    d: "medium",
    title: "What are hallucinations in LLMs, and how can you reduce them?",
    kw: [
      "hallucination",
      "grounding",
      "citations",
      "uncertainty",
      "verification",
    ],
    intent: "Checks awareness of a central reliability issue.",
    short:
      "A hallucination is output that sounds plausible but is factually wrong or unsupported by the given context. It happens because the model generates likely-sounding text token by token, not by looking facts up. Anthropic's guidance for reducing it includes: allow the model to say it does not know; for long documents, have it extract word-for-word quotes first and base its answer on them; ask it to cite sources for claims and retract those it cannot support; restrict it to the provided documents; and compare several outputs to spot inconsistencies. These techniques reduce but do not eliminate the problem, so validate important outputs, especially in high-stakes uses.",
    detail: [
      "Retrieval-augmented generation grounds answers in your documents.",
      "Human review is essential where errors are costly.",
      "Evaluate hallucination rates on your own data.",
    ],
    ex: "A legal summary tool must quote the clause it relies on so a reviewer can check it.",
    mistakes: [
      "Trusting fluent output without verification.",
      "Believing prompts alone remove hallucinations.",
    ],
    follow: ["How does retrieval help?"],
    points: [
      "Plausible but unsupported output",
      "Allow 'I don't know'",
      "Quote and cite sources",
      "Verify, don't assume",
    ],
    notes: ["Fluent is not the same as true."],
    src: [
      [
        "Anthropic docs: Reduce hallucinations",
        "https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations",
      ],
      ["OpenAI docs: Safety best practices", `${OAI}/safety-best-practices`],
    ],
  }),
  q({
    slug: "embeddings-explained",
    topic: "How LLMs work (high level)",
    d: "easy",
    title: "What is an embedding?",
    kw: [
      "embeddings",
      "vector",
      "semantic similarity",
      "cosine similarity",
      "text representation",
    ],
    intent: "Checks the idea that underlies semantic search.",
    short:
      "An embedding is a vector, a list of floating-point numbers, that represents a piece of text (or an image or other data) so that the distance between two vectors measures how related they are. Small distances suggest similar meaning, large distances suggest unrelated content. The OpenAI documentation lists uses such as search, clustering, recommendations, anomaly detection and classification, and recommends cosine similarity as the distance function. Embeddings let you find relevant documents by meaning instead of exact keywords, and they are the foundation of vector search and retrieval-augmented generation. Embeddings from different models are not comparable with each other.",
    detail: [
      "Embedding requests are billed by input tokens.",
      "Store embeddings in a vector index to search them quickly.",
      "Re-embed your data if you change the embedding model.",
    ],
    ex: "A search for 'refund policy' also finds a page titled 'Returning your order'.",
    mistakes: [
      "Mixing vectors from different embedding models.",
      "Relying on keyword matching only.",
    ],
    follow: ["Which distance function is recommended?"],
    points: [
      "Vector of numbers for text",
      "Distance measures relatedness",
      "Cosine similarity is a good default",
      "Foundation of semantic search",
    ],
    notes: ["Meaning as coordinates."],
    src: [
      ["OpenAI docs: Vector embeddings", `${OAI}/embeddings`],
      [
        "Anthropic docs: Embeddings",
        "https://docs.anthropic.com/en/docs/build-with-claude/embeddings",
      ],
    ],
  }),
  q({
    slug: "prompting-versus-rag-versus-fine-tuning",
    topic: "How LLMs work (high level)",
    d: "medium",
    title: "When do you use prompting, retrieval (RAG) or fine-tuning?",
    kw: [
      "prompt engineering",
      "rag",
      "fine-tuning",
      "adaptation choice",
      "model customization",
    ],
    intent: "Checks judgement in choosing how to adapt an LLM.",
    short:
      "Start with prompting: clear instructions, examples and structure are the cheapest and fastest way to steer a model, and Anthropic's guidance says to first define success criteria and tests. Use retrieval-augmented generation when answers must rely on your own or up-to-date documents: you retrieve relevant passages at runtime and place them in the prompt, which grounds the answer and allows citations. Consider fine-tuning when you need a consistent style, format or specialised behaviour that prompting cannot achieve, and where the provider supports it. These can be combined. Measure each step with an evaluation set and choose the simplest approach that meets your criteria.",
    detail: [
      "Retrieval changes what the model knows now; fine-tuning changes how it behaves.",
      "Fine-tuning needs good-quality examples and maintenance.",
      "Not every failing criterion is best solved by prompt engineering; sometimes a different model helps more.",
    ],
    ex: "A company help bot uses RAG over its manuals and a prompt that sets tone.",
    mistakes: [
      "Fine-tuning to inject changing facts.",
      "Skipping evaluation before choosing.",
    ],
    follow: ["What would make you move from prompting to fine-tuning?"],
    points: [
      "Prompting first",
      "RAG for your or fresh data",
      "Fine-tuning for behaviour and style",
      "Evaluate and combine",
    ],
    notes: ["Simplest approach that passes the tests."],
    src: [
      [
        "Anthropic docs: Prompt engineering overview",
        "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
      ],
      ["Anthropic docs: Glossary (RAG, fine-tuning)", GL],
    ],
  }),
  q({
    slug: "llm-output-non-determinism",
    topic: "How LLMs work (high level)",
    d: "medium",
    title:
      "Why can an LLM give different answers to the same prompt, and how do you build around that?",
    kw: [
      "non-determinism",
      "sampling randomness",
      "reproducibility",
      "evaluation variance",
      "temperature zero",
    ],
    intent: "Checks practical understanding of variability.",
    short:
      "Generation samples tokens from a probability distribution, so repeated runs can differ, and OpenAI's documentation describes model output as non-deterministic. Lowering temperature reduces variation, but Anthropic's glossary notes that even at temperature 0 results are not fully deterministic, including across calls to the same service. So design for variation: validate structured output with a schema, evaluate with test sets rather than single examples, run important checks several times, avoid depending on exact wording, and pin model versions to limit change from upgrades. For regression tests, assert on properties of the output (contains the required fields, passes a grader) rather than exact strings.",
    detail: [
      "Different model snapshots can behave differently for the same prompt.",
      "Log inputs, outputs and parameters to investigate issues.",
      "Retries with validation handle occasional malformed outputs.",
    ],
    ex: "A test asserts that the answer mentions the order id, not that it equals one exact sentence.",
    mistakes: [
      "Exact-string assertions on LLM output.",
      "Assuming temperature 0 gives reproducibility.",
    ],
    follow: ["How do you test non-deterministic output?"],
    points: [
      "Sampling makes outputs vary",
      "Temperature 0 is not guaranteed deterministic",
      "Validate and evaluate with test sets",
      "Pin versions",
    ],
    notes: ["Test properties, not exact text."],
    src: [
      ["Anthropic docs: Glossary (temperature and non-determinism)", GL],
      ["OpenAI docs: Prompt engineering", `${OAI}/prompt-engineering`],
    ],
  }),
  q({
    slug: "numpy-array-versus-python-list",
    topic: "Data handling with Python",
    d: "easy",
    title: "Why use NumPy arrays instead of Python lists for numerical data?",
    kw: [
      "numpy",
      "ndarray",
      "vectorization",
      "broadcasting",
      "homogeneous dtype",
    ],
    intent: "Checks the foundation of numerical Python.",
    short:
      "A NumPy `ndarray` stores elements of one data type in a contiguous block of memory and supports vectorised operations: `a * 2` or `a + b` applies to every element in compiled code, without a Python loop. This makes it much faster and more memory-efficient than a list of Python objects for numeric work, and arrays can have many dimensions with shapes and slicing. Broadcasting lets arrays of different shapes combine in arithmetic according to rules. Lists are more flexible (mixed types, easy appends) but do not support element-wise arithmetic: `[1, 2] * 2` repeats the list. Pandas and scikit-learn are built on NumPy arrays.",
    detail: [
      "Check `array.shape` and `array.dtype` when debugging.",
      "Slices of arrays are views, not copies, so changes can affect the original.",
      "Use vectorised functions rather than loops over elements.",
    ],
    ex: "Converting temperatures for a million readings with one expression.",
    code: [
      [
        "Vectorised arithmetic",
        "python",
        `import numpy as np\n\na = np.array([1, 2, 3])\nprint(a * 2)        # [2 4 6]\nprint([1, 2, 3] * 2)  # [1, 2, 3, 1, 2, 3]\nprint(a.shape, a.dtype)`,
        ["The array multiplies element-wise.", "The list repeats itself."],
      ],
    ],
    mistakes: [
      "Looping over arrays in Python.",
      "Forgetting that slices share memory.",
    ],
    follow: ["What is broadcasting?"],
    points: [
      "Homogeneous typed arrays",
      "Vectorised operations",
      "Broadcasting rules",
      "Foundation of pandas and scikit-learn",
    ],
    notes: ["Whole-array arithmetic."],
    src: [
      [
        "NumPy: The absolute basics for beginners",
        "https://numpy.org/doc/stable/user/absolute_beginners.html",
      ],
      [
        "NumPy: Broadcasting",
        "https://numpy.org/doc/stable/user/basics.broadcasting.html",
      ],
    ],
  }),
  q({
    slug: "pandas-dataframe-basics",
    topic: "Data handling with Python",
    d: "easy",
    title:
      "What are a pandas Series and DataFrame, and how do you inspect one?",
    kw: ["pandas", "DataFrame", "Series", "head info describe", "tabular data"],
    intent: "Checks basic data handling.",
    short:
      "A pandas `Series` is a one-dimensional labelled array and a `DataFrame` is a two-dimensional table of columns, each a Series, with a row index and column labels, and columns can have different types. You create one with `pd.DataFrame(...)` or by reading a file with `pd.read_csv`. To inspect it, use `df.head()` for the first rows, `df.shape` for dimensions, `df.info()` for column types and non-null counts, `df.describe()` for summary statistics and `df.dtypes`. Select columns with `df['col']` and rows with `.loc` (labels) or `.iloc` (positions). Check these first on any new dataset.",
    detail: [
      "Missing values are shown as NaN.",
      "Selecting several columns uses a list: `df[['a', 'b']]`.",
      "The index aligns data in operations between DataFrames.",
    ],
    ex: "Loading a CSV of orders and checking `df.info()` for columns with missing values.",
    code: [
      [
        "First look at data",
        "python",
        `import pandas as pd\n\ndf = pd.DataFrame({"name": ["Asha", "Ravi"], "age": [30, None]})\nprint(df.shape)\ndf.info()\nprint(df.describe())`,
        ["`info()` shows the null counts and dtypes."],
      ],
    ],
    mistakes: ["Skipping the initial inspection.", "Confusing loc and iloc."],
    follow: ["Which method shows missing values per column?"],
    points: [
      "Series = 1-D, DataFrame = 2-D",
      "head, info, describe, shape",
      "loc by label, iloc by position",
      "NaN marks missing values",
    ],
    notes: ["Look before you model."],
    src: [
      ["pandas: 10 minutes to pandas", `${PD}/10min.html`],
      ["pandas: Intro to data structures", `${PD}/dsintro.html`],
    ],
  }),
  q({
    slug: "handling-missing-data",
    topic: "Data handling with Python",
    d: "medium",
    title: "How do you handle missing values in a dataset?",
    kw: ["missing values", "dropna", "fillna", "imputation", "SimpleImputer"],
    intent: "Checks a standard data-cleaning decision.",
    short:
      "First find out how many values are missing and why. Options: drop rows or columns with `dropna()` when little data is lost; fill with a constant or a statistic using `fillna()` (mean, median or most frequent value); or use model-based imputation. For machine learning, scikit-learn's `SimpleImputer` should be fitted on the training data inside a pipeline so test data does not leak. Keep an indicator column if 'missing' is itself informative. The right method depends on whether the data are missing at random and on the model: some tree-based models can handle missing values directly. Document your choice, since it affects results.",
    detail: [
      "Median is more robust than mean when the data has outliers.",
      "Filling a time series often uses forward fill or interpolation.",
      "Check for placeholders such as -1 or 'N/A' that are not recognised as missing.",
    ],
    ex: "Filling missing ages with the training-set median and adding an 'age_missing' flag.",
    code: [
      [
        "Detect, drop, fill",
        "python",
        `import pandas as pd\n\ndf = pd.DataFrame({"age": [30, None, 25], "city": ["Pune", "Delhi", None]})\nprint(df.isna().sum())\nprint(df.dropna())\nprint(df.fillna({"age": df["age"].median(), "city": "unknown"}))`,
        ["`isna().sum()` counts missing values per column."],
      ],
    ],
    mistakes: [
      "Imputing with statistics from the full dataset before splitting.",
      "Dropping data without checking how much is lost.",
    ],
    follow: ["Why fit the imputer on training data only?"],
    points: [
      "Measure missingness first",
      "dropna, fillna, imputers",
      "Fit imputers on training data",
      "Missingness can be informative",
    ],
    notes: ["Understand why it's missing."],
    src: [
      ["pandas: Working with missing data", `${PD}/missing_data.html`],
      [
        "scikit-learn: Imputation of missing values",
        `${SK}/modules/impute.html`,
      ],
    ],
  }),
  q({
    slug: "loading-data-csv-json-sql",
    topic: "Data handling with Python",
    d: "easy",
    title: "How do you load data from CSV, JSON and SQL into pandas?",
    kw: [
      "read_csv",
      "read_json",
      "read_sql",
      "data loading",
      "parsing options",
    ],
    intent: "Checks practical data ingestion.",
    short:
      "Pandas provides readers for common formats: `pd.read_csv(path)` for delimited text, `pd.read_json` for JSON, `pd.read_sql(query, connection)` for database queries, and others such as `read_excel` and `read_parquet`. Useful options: `sep`, `usecols` and `dtype` to control columns and types, `parse_dates` for date columns, `na_values` for custom missing markers, and `chunksize` to process large files in pieces. Always check the result with `info()` and `head()` because type inference can guess wrongly, for example leading zeros in ids. Use parameterised queries when reading from SQL and write results back with `to_csv` or `to_sql`.",
    detail: [
      "Specify `encoding` if text decoding fails.",
      "Reading only the columns you need saves memory.",
      "Never build SQL strings from user input.",
    ],
    ex: "Reading a large CSV in chunks and aggregating each chunk.",
    code: [
      [
        "Common readers",
        "python",
        `import pandas as pd\n\ndf = pd.read_csv("orders.csv", parse_dates=["date"], dtype={"zip": "string"})\nprint(df.dtypes)\n\nfor chunk in pd.read_csv("big.csv", chunksize=100_000):\n    print(len(chunk))`,
        ["`dtype` keeps ids as strings.", "`chunksize` limits memory use."],
      ],
    ],
    mistakes: [
      "Letting pandas turn ids into integers.",
      "Loading entire huge files into memory.",
    ],
    follow: ["How do you read a large file without loading it all?"],
    points: [
      "read_csv, read_json, read_sql",
      "dtype, parse_dates, usecols",
      "chunksize for big data",
      "Inspect after loading",
    ],
    notes: ["Control types on the way in."],
    src: [
      ["pandas: IO tools", `${PD}/io.html`],
      [
        "pandas: read_csv",
        "https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html",
      ],
    ],
  }),
  q({
    slug: "feature-scaling-and-categorical-encoding",
    topic: "Data handling with Python",
    d: "medium",
    title:
      "Why and how do you scale numeric features and encode categorical ones?",
    kw: [
      "StandardScaler",
      "OneHotEncoder",
      "feature scaling",
      "categorical encoding",
      "ColumnTransformer",
    ],
    intent: "Checks standard preprocessing.",
    short:
      "Many algorithms work with numbers on comparable scales: models based on distances (k-nearest neighbours, k-means, SVMs) or gradient descent are sensitive to feature scale, so features are standardised (zero mean, unit variance with `StandardScaler`) or rescaled to a range (`MinMaxScaler`). Tree-based models are not sensitive to scale. Categorical columns must be turned into numbers: `OneHotEncoder` creates one binary column per category, avoiding a false ordering, while ordinal encoding suits truly ordered categories. `ColumnTransformer` applies the right transformer to each column group, and a `Pipeline` chains it with the model so everything is fitted on training data only.",
    detail: [
      "Handle unseen categories at prediction time with `handle_unknown='ignore'`.",
      "High-cardinality categories can create very wide data.",
      "Save the fitted pipeline for production use.",
    ],
    ex: "Scaling income and age, one-hot encoding city, then fitting a logistic regression.",
    code: [
      [
        "Preprocessing pipeline",
        "python",
        `from sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nprep = ColumnTransformer([\n    ("num", StandardScaler(), ["age", "income"]),\n    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),\n])\nmodel = make_pipeline(prep, LogisticRegression())`,
        ["Each column group gets its own transformer."],
      ],
    ],
    mistakes: [
      "Label-encoding nominal categories for linear models.",
      "Fitting the scaler on all data.",
    ],
    follow: ["Which models need scaling?"],
    points: [
      "Scale for distance and gradient methods",
      "One-hot encode nominal categories",
      "ColumnTransformer per column group",
      "Fit on training only",
    ],
    notes: ["Numbers in comparable ranges."],
    src: [
      ["scikit-learn: Preprocessing data", `${SK}/modules/preprocessing.html`],
      [
        "scikit-learn: ColumnTransformer",
        `${SK}/modules/generated/sklearn.compose.ColumnTransformer.html`,
      ],
    ],
  }),
  q({
    slug: "randomness-and-reproducibility",
    topic: "Data handling with Python",
    d: "medium",
    title: "How do you make machine-learning experiments reproducible?",
    kw: [
      "random_state",
      "seed",
      "numpy random generator",
      "reproducibility",
      "experiment tracking",
    ],
    intent: "Checks scientific discipline in experiments.",
    short:
      "Many steps are random: shuffling and splitting data, weight initialisation, sampling, and some algorithms. To get repeatable results set seeds explicitly. In scikit-learn pass `random_state` to splitters and estimators; in NumPy create a generator with `np.random.default_rng(seed)` rather than relying on global state; deep learning libraries have their own seeds. The scikit-learn pitfalls guide advises controlling randomness and notes that using a fixed seed for the final evaluation can hide variance, so test with several seeds to see how stable results are. Also record library versions, data versions and parameters, since results depend on them as well.",
    detail: [
      "Parallel and GPU computations can introduce non-determinism even with seeds.",
      "Report mean and spread across several runs or folds, not one lucky run.",
      "Use experiment-tracking tools or at least a log file.",
    ],
    ex: "Comparing two models over five seeds instead of one.",
    mistakes: [
      "Picking the seed that gives the best score.",
      "Not recording library versions.",
    ],
    follow: ["Why report results across several seeds?"],
    points: [
      "Set random_state and generators",
      "Seeds do not remove all variance",
      "Record versions and parameters",
      "Report spread, not one run",
    ],
    notes: ["Seed it, log it, repeat it."],
    src: [
      [
        "scikit-learn: Common pitfalls (controlling randomness)",
        `${SK}/common_pitfalls.html`,
      ],
      [
        "NumPy: Random sampling",
        "https://numpy.org/doc/stable/reference/random/index.html",
      ],
    ],
  }),
  q({
    slug: "responsible-ai-limits-and-bias",
    topic: "AI vs ML vs deep learning",
    d: "medium",
    title:
      "What are the main risks and limits to communicate when building with AI?",
    kw: [
      "responsible ai",
      "bias",
      "limitations",
      "human in the loop",
      "red teaming",
    ],
    intent: "Checks professional judgement about AI risks.",
    short:
      "AI systems can be wrong, biased, offensive or misused, so treat them as fallible. OpenAI's safety guidance recommends understanding and communicating limitations (hallucinated facts, bias, offensive outputs), testing with adversarial inputs (red-teaming), keeping a human in the loop for high-stakes decisions and code, constraining user input and limiting output length, and giving users a way to report problems. Training data can reflect social biases, so evaluate performance across user groups, not just on average. Protect personal data, tell users when they are interacting with AI and decide who is accountable for decisions. Matching expectations to what the system can really do is part of the design.",
    detail: [
      "Moderation tools can filter harmful content.",
      "Document intended use, known failure modes and evaluation results.",
      "Regulations and policies may apply to your domain.",
    ],
    ex: "A résumé screening tool is evaluated across groups and every rejection can be reviewed by a person.",
    mistakes: [
      "Deploying without adversarial testing.",
      "Evaluating only average accuracy.",
    ],
    follow: ["Why keep a human in the loop?"],
    points: [
      "Models can be wrong or biased",
      "Red-team and test broadly",
      "Human review for high-stakes use",
      "Communicate limitations",
    ],
    notes: ["Fallible by design, so design for it."],
    src: [
      ["OpenAI docs: Safety best practices", `${OAI}/safety-best-practices`],
      ["Anthropic docs: Glossary (HHH)", GL],
    ],
  }),
])
