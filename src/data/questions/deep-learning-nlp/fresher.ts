import { defineQuestions } from "../author"
import { g } from "../brief"

const PT = "https://docs.pytorch.org/docs/2.15/generated"
const PTT = "https://docs.pytorch.org/tutorials/beginner"
const HF = "https://huggingface.co/docs/transformers"
const SK = "https://scikit-learn.org/stable"

export default defineQuestions("deep-learning-nlp", "fresher", [
  g({
    slug: "neural-network-layers-module",
    topic: "Neural networks",
    d: "easy",
    title: "What is a neural network, and how do you define one in PyTorch?",
    kw: ["neural network", "layers", "nn.Module", "forward", "torch.nn"],
    intent:
      "Checks that you can describe a network as a stack of layers and build one in code.",
    short:
      "Neural networks comprise layers, or modules, that perform operations on data. In PyTorch the torch.nn namespace provides the building blocks, and every module subclasses nn.Module. A neural network is itself a module that contains other modules, which allows complex architectures to be nested and managed. You define a network by subclassing nn.Module, creating the layers in __init__, and writing the operations on the input in the forward method. Layers assigned as attributes are registered automatically, so their parameters can be found and trained by an optimiser.",
    detail: [
      "nn.Sequential chains modules in the order they are passed in, treating the whole container as one module.",
      "A network that outputs raw scores for each class returns logits.",
      "The model is moved to an accelerator such as a GPU with .to(device) when one is available.",
    ],
    ex: "A small classifier flattens an image, passes it through linear layers with ReLU between them and returns ten logits.",
    mistakes: [
      "Calling forward directly instead of calling the module.",
      "Creating layers inside forward, so their parameters are not tracked.",
    ],
    follow: ["What does a linear layer compute?"],
    points: [
      "Network = nested modules",
      "Subclass nn.Module",
      "Layers in __init__",
      "Computation in forward",
    ],
    notes: "Layers in __init__, wiring in forward.",
    src: [
      ["PyTorch: Build the Neural Network", `${PTT}/basics/buildmodel_tutorial.html`],
      ["PyTorch: torch.nn.Module", `${PT}/torch.nn.Module.html`],
      ["PyTorch: torch.nn.Sequential", `${PT}/torch.nn.Sequential.html`],
    ],
  }),
  g({
    slug: "linear-layer-affine",
    topic: "Neural networks",
    d: "easy",
    title: "What does a fully connected (linear) layer compute?",
    kw: ["nn.Linear", "affine transformation", "in_features", "out_features", "bias"],
    intent:
      "Checks that you know the basic building block and its two sizes.",
    short:
      "nn.Linear applies an affine linear transformation to the incoming data: y equals x times A transposed plus b, where A is a learned weight matrix and b a learned bias. It takes in_features, the size of each input sample, and out_features, the size of each output sample. Setting bias to False makes the layer learn no additive bias; the default is True. The layer acts on the last dimension of the input, so extra leading dimensions such as the batch size are preserved. Stacking such layers, with a non-linearity between them, gives a multilayer perceptron.",
    detail: [
      "The weights and bias are the parameters that training adjusts.",
      "Without a non-linear activation between them, stacked linear layers collapse into a single linear transformation.",
      "The input is shaped (*, H_in) and the output (*, H_out).",
    ],
    ex: "nn.Linear(784, 10) maps a flattened 28 by 28 image to ten class scores.",
    mistakes: [
      "Giving in_features a value that does not match the input's last dimension.",
      "Stacking linear layers with no activation and expecting a more powerful model.",
    ],
    follow: ["Why do we need activation functions?"],
    points: [
      "y = xA^T + b",
      "in_features and out_features",
      "Acts on the last dimension",
      "Needs activations between layers",
    ],
    notes: "Linear layer = weights times input plus bias.",
    src: [["PyTorch: torch.nn.Linear", `${PT}/torch.nn.Linear.html`]],
  }),
  g({
    slug: "activation-functions-relu-softmax",
    topic: "Neural networks",
    d: "easy",
    title: "What are activation functions such as ReLU and Softmax used for?",
    kw: ["activation function", "relu", "softmax", "non-linearity", "logits"],
    intent:
      "Checks that you know why networks need non-linear functions and what softmax outputs.",
    short:
      "An activation function is applied element-wise to the output of a layer so the network can learn non-linear relationships. ReLU, the rectified linear unit, applies max(0, x) element-wise. Softmax is used at the output for classification: it rescales an n-dimensional input so that the elements of the output lie in the range 0 to 1 and sum to 1, computed as exp(x_i) divided by the sum of exp(x_j). That makes the outputs usable as class probabilities. In PyTorch, CrossEntropyLoss expects raw logits, so you typically do not add softmax before it.",
    detail: [
      "ReLU keeps positive values and sets negative values to zero.",
      "Softmax takes a dim argument that chooses the dimension along which values are normalised.",
      "Other activations exist, such as sigmoid and tanh, with different output ranges.",
    ],
    ex: "A classifier uses ReLU between hidden layers and applies softmax to the final logits only when probabilities are needed.",
    mistakes: [
      "Applying softmax and then CrossEntropyLoss, which already handles logits.",
      "Forgetting the dim argument for softmax.",
    ],
    follow: ["Which loss do you pair with logits?"],
    points: [
      "Non-linearity between layers",
      "ReLU = max(0, x)",
      "Softmax outputs sum to 1",
      "Loss may expect logits",
    ],
    notes: "ReLU in the middle; softmax at the end for probabilities.",
    src: [
      ["PyTorch: torch.nn.ReLU", `${PT}/torch.nn.ReLU.html`],
      ["PyTorch: torch.nn.Softmax", `${PT}/torch.nn.Softmax.html`],
      ["PyTorch: torch.nn.CrossEntropyLoss", `${PT}/torch.nn.CrossEntropyLoss.html`],
    ],
  }),
  g({
    slug: "backpropagation-autograd",
    topic: "Neural networks",
    d: "medium",
    title: "What is backpropagation, and how does PyTorch autograd do it?",
    kw: ["backpropagation", "autograd", "gradient", "requires_grad", "backward"],
    intent:
      "Checks that you understand how gradients are produced for training.",
    short:
      "Back propagation is the algorithm most used when training neural networks: parameters, the model weights, are adjusted according to the gradient of the loss function with respect to each parameter. PyTorch computes those gradients with a built-in differentiation engine, torch.autograd, which supports automatic computation of gradients for any computational graph. Tensors you want to optimise have requires_grad set to True. Calling loss.backward() differentiates the graph using the chain rule and deposits the gradients in each parameter's .grad. Gradients accumulate in the leaves, so they must be reset between steps.",
    detail: [
      "Only leaf tensors with requires_grad=True get a .grad attribute.",
      "By default you can call backward once on a graph; retain_graph=True allows more calls.",
      "For a non-scalar output you must pass a gradient argument to backward.",
    ],
    ex: "After loss.backward(), model.parameters() each hold the gradient that the optimiser uses to update them.",
    mistakes: [
      "Forgetting that gradients add up between iterations.",
      "Calling backward on a tensor that does not require gradients.",
    ],
    follow: ["What are the steps of a training iteration?"],
    points: [
      "Gradient of loss with respect to parameters",
      "torch.autograd builds the graph",
      "loss.backward() fills .grad",
      "Gradients accumulate",
    ],
    notes: "forward builds the graph; backward fills gradients.",
    src: [
      ["PyTorch: Automatic Differentiation with torch.autograd", `${PTT}/basics/autogradqs_tutorial.html`],
      ["PyTorch: Tensor.backward", `${PT}/torch.Tensor.backward.html`],
    ],
  }),
  g({
    slug: "training-loop-steps",
    topic: "Training & optimization",
    d: "medium",
    title: "What are the steps in a PyTorch training iteration?",
    kw: ["training loop", "zero_grad", "backward", "optimizer.step", "loss"],
    intent:
      "Checks that you can write and explain the core loop.",
    short:
      "Training is an iterative process: in each iteration the model makes a guess about the output, the loss calculates the error, the derivatives of the error with respect to the parameters are collected, and the parameters are optimised with gradient descent. Inside the loop, optimisation happens in three steps. Call optimizer.zero_grad() to reset the gradients, because gradients add up by default. Call loss.backward() to backpropagate and deposit the gradients of the loss on each parameter. Call optimizer.step() to adjust the parameters using those gradients. Before this, compute the prediction and the loss for a batch.",
    detail: [
      "One pass over the full dataset is an epoch; each pass over a batch is an iteration.",
      "Hyperparameters such as epochs, batch size and learning rate are set by you.",
      "zero_grad(set_to_none=True) is the default and can lower memory use.",
    ],
    ex: "for X, y in loader: pred = model(X); loss = loss_fn(pred, y); optimizer.zero_grad(); loss.backward(); optimizer.step().",
    mistakes: [
      "Forgetting zero_grad so gradients pile up across batches.",
      "Calling optimizer.step() before backward.",
    ],
    follow: ["Which optimiser would you choose?"],
    points: [
      "Forward pass and loss",
      "zero_grad resets gradients",
      "backward computes gradients",
      "step updates parameters",
    ],
    notes: "predict, loss, zero_grad, backward, step.",
    code: [
      "One training epoch",
      `for X, y in train_loader:
    pred = model(X)
    loss = loss_fn(pred, y)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()`,
      [
        "The forward pass produces predictions and the loss measures the error.",
        "zero_grad clears gradients left from the previous batch.",
        "backward computes new gradients and step updates the weights.",
      ],
      "python",
    ],
    src: [
      ["PyTorch: Optimizing Model Parameters", `${PTT}/basics/optimization_tutorial.html`],
      ["PyTorch: Optimizer.zero_grad", `${PT}/torch.optim.Optimizer.zero_grad.html`],
    ],
  }),
  g({
    slug: "loss-functions-choice",
    topic: "Training & optimization",
    d: "medium",
    title: "How do you choose a loss function: CrossEntropyLoss, MSELoss or BCEWithLogitsLoss?",
    kw: ["CrossEntropyLoss", "MSELoss", "BCEWithLogitsLoss", "loss function", "logits"],
    intent:
      "Checks that you pair the loss with the task and the form of the output.",
    short:
      "Choose the loss by task. CrossEntropyLoss computes the cross entropy between input logits and the target and is useful for classification with C classes; the input is expected to contain unnormalised logits, which do not need to be positive or sum to 1, and an optional class weight tensor helps with unbalanced training sets. MSELoss measures the mean squared error between each element of the input and the target, which suits regression. BCEWithLogitsLoss combines a sigmoid layer and BCELoss in one class, which the documentation says is more numerically stable than a sigmoid followed by BCELoss, and suits binary labels.",
    detail: [
      "The reduction argument chooses between mean, sum and none.",
      "Pass logits to CrossEntropyLoss and BCEWithLogitsLoss, not probabilities.",
      "The weight argument assigns a weight to each class.",
    ],
    ex: "A ten-class image model uses CrossEntropyLoss on its ten logits, while a price predictor uses MSELoss.",
    mistakes: [
      "Applying softmax or sigmoid before a loss that already includes it.",
      "Using MSELoss for a classification target.",
    ],
    follow: ["How do you handle unbalanced classes?"],
    points: [
      "Classification: cross entropy",
      "Regression: mean squared error",
      "Binary: BCEWithLogitsLoss is stable",
      "Pass logits",
    ],
    notes: "Match the loss to the task, and give it logits.",
    src: [
      ["PyTorch: CrossEntropyLoss", `${PT}/torch.nn.CrossEntropyLoss.html`],
      ["PyTorch: MSELoss", `${PT}/torch.nn.MSELoss.html`],
      ["PyTorch: BCEWithLogitsLoss", `${PT}/torch.nn.BCEWithLogitsLoss.html`],
    ],
  }),
  g({
    slug: "optimizers-sgd-adam-adamw",
    topic: "Training & optimization",
    d: "medium",
    title: "What is the difference between SGD, Adam and AdamW?",
    kw: ["SGD", "Adam", "AdamW", "momentum", "weight decay"],
    intent:
      "Checks that you can name common optimisers and one real difference between them.",
    short:
      "torch.optim.SGD implements stochastic gradient descent, optionally with momentum, and takes a learning rate, plus options such as weight decay and Nesterov momentum. Adam implements the Adam algorithm, which keeps running estimates of the first and second moments of the gradients, controlled by betas, and uses them to scale each update. AdamW is Adam with weight decay applied separately, so the documentation says weight decay does not accumulate in the momentum nor the variance. The PyTorch tutorial notes that many optimisers are available, and that different ones work better for different kinds of models and data.",
    detail: [
      "You register the model's parameters with the optimiser and pass the learning rate.",
      "The learning rate is the most important hyperparameter to tune.",
      "The learning rate is passed together with the parameters to train.",
    ],
    ex: "optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01) is a typical setup for training a network from scratch.",
    mistakes: [
      "Using one learning rate for every optimiser without tuning.",
      "Mixing up weight decay in Adam with that in AdamW.",
    ],
    follow: ["What does a learning rate scheduler do?"],
    points: [
      "SGD: plain or momentum",
      "Adam: adaptive moment estimates",
      "AdamW: decoupled weight decay",
      "Learning rate is key",
    ],
    notes: "SGD for simplicity; Adam-family for adaptive steps.",
    src: [
      ["PyTorch: torch.optim.SGD", `${PT}/torch.optim.SGD.html`],
      ["PyTorch: torch.optim.Adam", `${PT}/torch.optim.Adam.html`],
      ["PyTorch: torch.optim.AdamW", `${PT}/torch.optim.AdamW.html`],
      ["PyTorch: Optimizing Model Parameters", `${PTT}/basics/optimization_tutorial.html`],
    ],
  }),
  g({
    slug: "learning-rate-scheduler",
    topic: "Training & optimization",
    d: "medium",
    title: "What is a learning rate scheduler?",
    kw: ["learning rate", "scheduler", "StepLR", "gamma", "decay"],
    intent:
      "Checks that you know the learning rate can change during training.",
    short:
      "A learning rate scheduler changes the learning rate during training. StepLR, for example, decays the learning rate of each parameter group by gamma every step_size epochs. With an initial learning rate of 0.05, step_size of 30 and the default gamma of 0.1, the rate is 0.05 for the first 30 epochs, 0.005 for the next 30, and so on. You wrap the optimiser in the scheduler and call the scheduler's step after each epoch. Other schedulers react to the validation loss.",
    detail: [
      "The scheduler's decay can happen alongside other changes to the learning rate made outside it.",
      "ReduceLROnPlateau lowers the rate when a metric stops improving.",
      "The learning rate is a hyperparameter that you tune.",
    ],
    ex: "StepLR(optimizer, step_size=30, gamma=0.1) divides the rate by ten every thirty epochs.",
    mistakes: [
      "Forgetting to call scheduler.step().",
      "Decaying too fast, so the model stops learning early.",
    ],
    follow: ["How do you detect that training has stalled?"],
    points: [
      "Adjusts the learning rate over time",
      "StepLR multiplies by gamma",
      "Called each epoch",
      "Some depend on validation metrics",
    ],
    notes: "Large steps early, small steps later.",
    src: [["PyTorch: StepLR", `${PT}/torch.optim.lr_scheduler.StepLR.html`]],
  }),
  g({
    slug: "dataset-and-dataloader",
    topic: "Training & optimization",
    d: "easy",
    title: "What are Dataset and DataLoader in PyTorch?",
    kw: ["Dataset", "DataLoader", "batch", "shuffle", "data pipeline"],
    intent:
      "Checks that you separate data handling from model code and know what batching does.",
    short:
      "PyTorch provides two data primitives, torch.utils.data.Dataset and torch.utils.data.DataLoader. A Dataset stores the samples and their corresponding labels, and a DataLoader wraps an iterable around the Dataset so you can access batches of samples easily. The tutorial's goal is to keep dataset code decoupled from model training code for readability and modularity. You can use pre-loaded datasets from the domain libraries, which subclass Dataset, or write your own subclass. In training you loop over the DataLoader to get a batch of inputs and labels at a time, often with a batch size you choose.",
    detail: [
      "Domain libraries provide image, text and audio datasets for prototyping and benchmarking.",
      "A custom Dataset implements how to get the number of samples and how to get one sample.",
      "The batch size is a hyperparameter.",
    ],
    ex: "DataLoader(training_data, batch_size=64) yields batches of sixty-four samples.",
    mistakes: [
      "Loading the whole dataset into one batch.",
      "Mixing data-loading logic into the model class.",
    ],
    follow: ["How do you handle sequences of different lengths in a batch?"],
    points: [
      "Dataset holds samples and labels",
      "DataLoader gives batches",
      "Keeps data code separate from model code",
      "Batch size is a hyperparameter",
    ],
    notes: "Dataset = what; DataLoader = how in batches.",
    src: [["PyTorch: Datasets & DataLoaders", `${PTT}/basics/data_tutorial.html`]],
  }),
  g({
    slug: "train-eval-mode-no-grad",
    topic: "Training & optimization",
    d: "medium",
    title: "What do model.eval() and torch.no_grad() do, and why use both for inference?",
    kw: ["model.eval", "torch.no_grad", "inference", "dropout", "batch norm"],
    intent:
      "Checks that you switch the model and autograd correctly when predicting.",
    short:
      "model.eval() sets the module to evaluation mode, which only affects certain modules such as Dropout and BatchNorm. It is equivalent to self.train(False). For example, Dropout randomly zeroes elements during training, but during evaluation it simply computes an identity function. torch.no_grad is a context manager that disables gradient calculation. It is useful for inference when you will not call backward, and it reduces memory consumption for computations that would otherwise have requires_grad=True. They do different jobs: eval changes layer behaviour, and no_grad stops gradient tracking, so you normally use both when validating or predicting.",
    detail: [
      "Gradient tracking is also described as unnecessary when you only apply a trained model to input data.",
      "Call model.train() to return to training mode.",
      "The result of every computation inside no_grad has requires_grad=False.",
    ],
    ex: "A validation loop calls model.eval() once and runs the forward pass inside a with torch.no_grad() block.",
    mistakes: [
      "Forgetting model.eval() and getting noisy predictions from dropout.",
      "Thinking no_grad changes how dropout behaves.",
    ],
    follow: ["What does dropout do?"],
    points: [
      "eval changes layer behaviour",
      "no_grad stops gradient tracking",
      "Use both for inference",
      "train() switches back",
    ],
    notes: "eval for layers, no_grad for autograd.",
    src: [
      ["PyTorch: torch.nn.Module", `${PT}/torch.nn.Module.html`],
      ["PyTorch: torch.no_grad", `${PT}/torch.no_grad.html`],
      ["PyTorch: Dropout", `${PT}/torch.nn.Dropout.html`],
    ],
  }),
  g({
    slug: "dropout-regularization",
    topic: "Regularization & overfitting",
    d: "easy",
    title: "What is dropout and how does it reduce overfitting?",
    kw: ["dropout", "regularization", "overfitting", "co-adaptation", "p"],
    intent:
      "Checks that you can explain a common regulariser and its train versus eval behaviour.",
    short:
      "During training, nn.Dropout randomly zeroes some elements of the input tensor with probability p, which defaults to 0.5. The zeroed elements are chosen independently for each forward call and sampled from a Bernoulli distribution. The documentation describes this as an effective regularisation technique that prevents co-adaptation of neurons. Outputs are scaled by a factor of 1 divided by (1 minus p) during training, so that during evaluation the module simply computes an identity function. That is why you must call model.eval() before validating or predicting. A higher p drops more units and regularises more strongly.",
    detail: [
      "Overfitting means the model fits training data too closely and does poorly on new data.",
      "Dropout takes the probability p as its main argument.",
      "The inplace argument can apply it in place.",
    ],
    ex: "A classifier adds nn.Dropout(0.3) between its hidden layers to reduce overfitting on a small dataset.",
    mistakes: [
      "Leaving dropout active during validation.",
      "Using a very high p that stops the network from learning.",
    ],
    follow: ["What other regularisers exist?"],
    points: [
      "Randomly zeroes elements in training",
      "Probability p, default 0.5",
      "Identity in evaluation mode",
      "Reduces co-adaptation",
    ],
    notes: "Dropout only acts in training mode.",
    src: [["PyTorch: torch.nn.Dropout", `${PT}/torch.nn.Dropout.html`]],
  }),
  g({
    slug: "batch-norm-vs-layer-norm",
    topic: "Regularization & overfitting",
    d: "hard",
    title: "What is the difference between batch normalisation and layer normalisation?",
    kw: ["batch normalization", "layer normalization", "BatchNorm2d", "LayerNorm", "normalization"],
    intent:
      "Checks that you know what each one averages over.",
    short:
      "Both normalise activations by subtracting a mean and dividing by a standard deviation, then apply a learnable scale and shift. Batch normalisation, such as BatchNorm2d over a 4D input, calculates the mean and standard deviation per dimension over the mini-batch, so it depends on the batch. It also keeps running statistics for use during evaluation, which is why train and eval modes behave differently. Layer normalisation calculates the mean and standard deviation over the last D dimensions of each sample, where D is the dimension of normalized_shape, so it does not depend on the batch size.",
    detail: [
      "BatchNorm2d takes num_features and has eps and momentum parameters.",
      "LayerNorm takes normalized_shape, such as the feature dimension.",
      "Both help training stay stable, but they do it along different axes.",
    ],
    ex: "A convolutional network places BatchNorm2d after each convolution, while a transformer layer uses LayerNorm.",
    mistakes: [
      "Forgetting model.eval() so batch statistics are used at inference.",
      "Using batch norm with a tiny batch size.",
    ],
    follow: ["Where is layer normalisation used?"],
    points: [
      "Batch norm: statistics over the mini-batch",
      "Layer norm: statistics per sample",
      "Both have learnable scale and shift",
      "Batch norm differs in train and eval",
    ],
    notes: "Batch norm averages across samples; layer norm across features.",
    src: [
      ["PyTorch: BatchNorm2d", `${PT}/torch.nn.BatchNorm2d.html`],
      ["PyTorch: LayerNorm", `${PT}/torch.nn.LayerNorm.html`],
    ],
  }),
  g({
    slug: "gradient-clipping",
    topic: "Training & optimization",
    d: "medium",
    title: "What is gradient clipping and when is it used?",
    kw: ["gradient clipping", "clip_grad_norm_", "max_norm", "exploding gradients", "rnn"],
    intent:
      "Checks that you know a standard fix for unstable training.",
    short:
      "Gradient clipping limits the size of gradients before the optimiser step. torch.nn.utils.clip_grad_norm_ clips the gradient norm of an iterable of parameters. The norm is computed over the norms of the individual gradients of all parameters, as if they were concatenated into a single vector, and the gradients are modified in place. You give the parameters, max_norm, the maximum allowed norm, and optionally norm_type. Call it after loss.backward() and before optimizer.step(). It is a common remedy when training becomes unstable.",
    detail: [
      "norm_type can be 'inf' for the infinity norm.",
      "The function can also use the infinity norm.",
      "It clips the total norm of all the parameters' gradients together.",
    ],
    ex: "torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0) is called between backward and step.",
    mistakes: [
      "Calling it before backward, when gradients do not exist yet.",
      "Using it to hide a learning rate that is far too high.",
    ],
    follow: ["Which models suffer from exploding gradients?"],
    points: [
      "Limits the total gradient norm",
      "Between backward and step",
      "Modifies gradients in place",
      "Helps when training is unstable",
    ],
    notes: "backward, clip, then step.",
    src: [["PyTorch: clip_grad_norm_", `${PT}/torch.nn.utils.clip_grad_norm_.html`]],
  }),
  g({
    slug: "saving-loading-state-dict",
    topic: "Training & optimization",
    d: "easy",
    title: "How do you save and load a trained model in PyTorch?",
    kw: ["state_dict", "torch.save", "load_state_dict", "weights_only", "checkpoint"],
    intent:
      "Checks that you persist weights safely and rebuild the model to load them.",
    short:
      "PyTorch models store their learned parameters in an internal state dictionary called state_dict. You persist it with torch.save(model.state_dict(), 'model_weights.pth'). To load, you first create an instance of the same model class and then call load_state_dict with torch.load. The tutorial sets weights_only=True to limit the functions executed during unpickling to those necessary for loading weights, and it calls this a best practice. After loading, call model.eval() before inference so dropout and batch normalisation behave correctly.",
    detail: [
      "You need the model definition in code, because the state_dict holds only parameters and buffers.",
      "The tutorial also covers saving the whole model, which carries more risk.",
      "Save checkpoints during training so you can resume or keep the best model.",
    ],
    ex: "After training, torch.save(model.state_dict(), 'best.pth'); later, model.load_state_dict(torch.load('best.pth', weights_only=True)).",
    mistakes: [
      "Loading weights into a model with a different architecture.",
      "Loading untrusted files without weights_only=True.",
    ],
    follow: ["Why call model.eval() after loading?"],
    points: [
      "state_dict holds parameters",
      "torch.save writes it",
      "load_state_dict needs the same architecture",
      "Use weights_only=True",
    ],
    notes: "Save the state_dict, rebuild the model, load it.",
    src: [
      ["PyTorch: Save and Load the Model", `${PTT}/basics/saveloadrun_tutorial.html`],
      ["PyTorch: torch.save", `${PT}/torch.save.html`],
    ],
  }),
  g({
    slug: "cnn-convolution-pooling",
    topic: "CNN/RNN",
    d: "medium",
    title: "How do convolutional layers and pooling work in a CNN?",
    kw: ["convolution", "Conv2d", "max pooling", "kernel", "feature map"],
    intent:
      "Checks that you can explain the main layers of a convolutional network.",
    short:
      "nn.Conv2d applies a 2D convolution over an input signal composed of several input planes. For an input of shape (N, C_in, H, W) it produces (N, C_out, H_out, W_out): N is the batch, C the channels, and H and W the height and width. Each output channel is computed by sliding a learned kernel over the input and adding a bias. nn.MaxPool2d applies 2D max pooling, taking the maximum over each window of the input, which reduces the spatial size. A typical CNN alternates convolution, activation and pooling layers and ends with linear layers for classification.",
    detail: [
      "Key Conv2d arguments are in_channels, out_channels and kernel_size, plus stride and padding.",
      "Padding, stride and kernel size are further Conv2d arguments.",
      "Image inputs use a channels-first layout in PyTorch.",
    ],
    ex: "An image classifier stacks two Conv2d and MaxPool2d blocks, then flattens the result for a linear layer.",
    mistakes: [
      "Passing a tensor with channels last.",
      "Mismatching in_channels with the actual number of channels.",
    ],
    follow: ["What is transfer learning for images?"],
    points: [
      "Conv2d slides learned kernels",
      "Input shape (N, C, H, W)",
      "MaxPool2d takes window maxima",
      "Often followed by linear layers",
    ],
    notes: "Convolution extracts features; pooling shrinks them.",
    src: [
      ["PyTorch: Conv2d", `${PT}/torch.nn.Conv2d.html`],
      ["PyTorch: MaxPool2d", `${PT}/torch.nn.MaxPool2d.html`],
    ],
  }),
  g({
    slug: "transfer-learning-finetune-vs-freeze",
    topic: "Fine-tuning & transfer learning",
    d: "medium",
    title: "What is transfer learning, and what is the difference between fine-tuning and a fixed feature extractor?",
    kw: ["transfer learning", "fine-tuning", "feature extractor", "pretrained", "freeze"],
    intent:
      "Checks that you can reuse a pretrained network instead of training from scratch.",
    short:
      "In transfer learning you start from a network pretrained on a large dataset instead of random weights, because it is relatively rare to have a dataset large enough to train a whole network from scratch. The PyTorch tutorial describes two scenarios. In fine-tuning, you initialise the network with the pretrained weights and the rest of training looks as usual. In the fixed feature extractor scenario, you freeze the weights of all of the network except the final fully connected layer, replace that last layer with a new one with random weights, and train only that layer.",
    detail: [
      "Freezing means those parameters do not receive gradient updates.",
      "A fixed feature extractor needs less training time and data.",
      "Fine-tuning can adapt more but needs more care with the learning rate.",
    ],
    ex: "A pretrained image network gets a new final layer with two outputs to classify two kinds of product photos.",
    mistakes: [
      "Training every layer with a large learning rate and destroying useful pretrained weights.",
      "Forgetting to replace the final layer to match the new number of classes.",
    ],
    follow: ["How is fine-tuning done for language models?"],
    points: [
      "Start from pretrained weights",
      "Fine-tune: continue training",
      "Feature extractor: freeze, train the last layer",
      "Replace the final layer",
    ],
    notes: "Reuse pretrained weights, then adapt them.",
    src: [["PyTorch: Transfer Learning for Computer Vision Tutorial", `${PTT}/transfer_learning_tutorial.html`]],
  }),
  g({
    slug: "rnn-lstm-gru-sequences",
    topic: "CNN/RNN",
    d: "medium",
    title: "What are RNN, LSTM and GRU layers used for?",
    kw: ["RNN", "LSTM", "GRU", "sequence", "hidden state"],
    intent:
      "Checks that you know the recurrent layers for sequence data and how they differ.",
    short:
      "Recurrent layers process a sequence one element at a time, carrying a hidden state forward. nn.RNN applies a multi-layer Elman RNN with a tanh or ReLU non-linearity: the hidden state h_t is computed from the input x_t and the previous hidden state h_(t-1). nn.LSTM applies a multi-layer long short-term memory network, which adds input, forget and output gates and a cell state to control what is kept. nn.GRU applies a gated recurrent unit, a gated variant with a simpler structure. The layers take input_size, hidden_size and num_layers, and options such as batch_first and bidirectional.",
    detail: [
      "For each element in the input sequence, each layer computes the documented update function.",
      "batch_first=True puts the batch dimension first in the input and output.",
      "bidirectional=True also processes the sequence in reverse.",
    ],
    ex: "An LSTM reads the embeddings of a sentence word by word, and its final hidden state feeds a classifier.",
    mistakes: [
      "Mixing up the (batch, sequence) order without setting batch_first.",
      "Using a plain RNN for long sequences without considering gated variants.",
    ],
    follow: ["How do you batch sequences of different lengths?"],
    points: [
      "Hidden state carried across steps",
      "LSTM adds gates and a cell state",
      "GRU is a simpler gated unit",
      "batch_first and bidirectional options",
    ],
    notes: "RNN: basic; LSTM and GRU: gated.",
    src: [
      ["PyTorch: RNN", `${PT}/torch.nn.RNN.html`],
      ["PyTorch: LSTM", `${PT}/torch.nn.LSTM.html`],
      ["PyTorch: GRU", `${PT}/torch.nn.GRU.html`],
    ],
  }),
  g({
    slug: "padding-variable-length-sequences",
    topic: "Text preprocessing & embeddings",
    d: "medium",
    title: "How do you batch text sequences of different lengths?",
    kw: ["padding", "pad_sequence", "attention mask", "truncation", "variable length"],
    intent:
      "Checks that you know batches need equal lengths and how padding and masks are used.",
    short:
      "Tensors in a batch must have the same length, so shorter sequences are padded. In PyTorch, torch.nn.utils.rnn.pad_sequence stacks a list of variable-length tensors along a new dimension and pads them to equal length with padding_value; the output is T x B x * or B x T x * with batch_first=True, where T is the longest length. In the Hugging Face workflow the tokenizer creates input_ids and attention_mask, with truncation and max_length to cut longer inputs. A data collator pads each batch dynamically to its longest sequence, which saves compute and memory over padding the whole dataset.",
    detail: [
      "The attention mask marks which positions are real tokens and which are padding.",
      "nn.Embedding has a padding_idx so padded positions do not contribute to the gradient.",
      "Truncation drops tokens beyond max_length, so choose it with the data in mind.",
    ],
    ex: "A batch of three sentences of 25, 22 and 15 tokens is padded to 25 tokens.",
    mistakes: [
      "Letting padding tokens influence the loss or attention.",
      "Truncating so much that the label can no longer be inferred.",
    ],
    follow: ["What does an embedding layer do?"],
    points: [
      "Pad to the longest sequence in the batch",
      "pad_sequence in PyTorch",
      "Attention mask marks padding",
      "Dynamic padding saves compute",
    ],
    notes: "Pad per batch and mask the padding.",
    src: [
      ["PyTorch: pad_sequence", `${PT}/torch.nn.utils.rnn.pad_sequence.html`],
      ["PyTorch: Embedding", `${PT}/torch.nn.Embedding.html`],
      ["Hugging Face: Fine-tuning", `${HF}/training`],
    ],
  }),
  g({
    slug: "word-embeddings-vs-one-hot",
    topic: "Text preprocessing & embeddings",
    d: "medium",
    title: "What are word embeddings, and why are they better than one-hot encoding?",
    kw: ["word embeddings", "nn.Embedding", "one-hot", "dense vectors", "similarity"],
    intent:
      "Checks that you can explain how words become useful numeric inputs.",
    short:
      "Word embeddings are dense vectors of real numbers, one per word in your vocabulary. A one-hot encoding represents a word by a vector with a single 1 at a location unique to that word and 0 elsewhere. The PyTorch tutorial points out its drawbacks: it is huge, and it treats all words as independent entities with no relation to each other, while we want a notion of similarity between words. In PyTorch, nn.Embedding is a simple lookup table that stores embeddings of a fixed dictionary and size: its input is a list of indices and its output is the corresponding embedding vectors, which are learned during training.",
    detail: [
      "num_embeddings is the vocabulary size and embedding_dim the size of each vector.",
      "padding_idx marks an index whose entry does not contribute to the gradient.",
      "Embeddings let a model generalise between words with similar roles.",
    ],
    ex: "Words seen in similar contexts end up with nearby vectors, so a model can handle a sentence with an unseen combination of known words.",
    mistakes: [
      "Using one-hot vectors for a large vocabulary.",
      "Passing words instead of integer indices to nn.Embedding.",
    ],
    follow: ["How are texts turned into indices?"],
    points: [
      "Dense vectors per word",
      "One-hot is large and unrelated",
      "nn.Embedding is a lookup table",
      "Learned during training",
    ],
    notes: "Embedding = learned dense vector for each token index.",
    src: [
      ["PyTorch: Word Embeddings tutorial", `${PTT}/nlp/word_embeddings_tutorial.html`],
      ["PyTorch: Embedding", `${PT}/torch.nn.Embedding.html`],
    ],
  }),
  g({
    slug: "bag-of-words-tfidf",
    topic: "Text preprocessing & embeddings",
    d: "easy",
    title: "What are bag of words and TF-IDF, and how do you build them with scikit-learn?",
    kw: ["bag of words", "CountVectorizer", "TfidfVectorizer", "tf-idf", "vocabulary"],
    intent:
      "Checks that you know the classic way to turn text into numeric features.",
    short:
      "Raw text cannot be fed directly to most algorithms, which expect numerical feature vectors of fixed size. The bag of words representation counts the words in each document. CountVectorizer converts a collection of text documents to a matrix of token counts, as a sparse representation, and the number of features equals the vocabulary size found in the data. TF-IDF weighting handles the fact that some words, like 'the', are very frequent and carry little meaning; TfidfVectorizer converts raw documents to a matrix of TF-IDF features and is equivalent to CountVectorizer followed by TfidfTransformer.",
    detail: [
      "Word order is lost in a bag of words, although n-grams such as bigrams keep some local order.",
      "Stop words are words like 'and' and 'the' that are presumed uninformative and may be removed.",
      "Fit the vectoriser on training text only.",
    ],
    ex: "Support tickets are converted with TfidfVectorizer and then classified with a linear model.",
    mistakes: [
      "Fitting the vocabulary on the test set.",
      "Using a bag of words when word order matters to the task.",
    ],
    follow: ["How do embeddings improve on this?"],
    points: [
      "Counts of tokens per document",
      "TF-IDF down-weights frequent words",
      "Sparse matrix output",
      "Word order is lost",
    ],
    notes: "CountVectorizer then TF-IDF weighting.",
    src: [
      ["scikit-learn: Feature extraction", `${SK}/modules/feature_extraction.html`],
      ["scikit-learn: CountVectorizer", `${SK}/modules/generated/sklearn.feature_extraction.text.CountVectorizer.html`],
      ["scikit-learn: TfidfVectorizer", `${SK}/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html`],
    ],
  }),
  g({
    slug: "subword-tokenization",
    topic: "Text preprocessing & embeddings",
    d: "medium",
    title: "What is subword tokenisation, and why do language models use it?",
    kw: ["tokenization", "subword", "byte pair encoding", "wordpiece", "unigram"],
    intent:
      "Checks that you know how text is split into model inputs and how unseen words are handled.",
    short:
      "Transformers support three subword tokenisation algorithms: byte pair encoding (BPE), Unigram and WordPiece. They split text into units between words and characters, keeping the vocabulary compact while still capturing meaningful pieces. Common words stay intact as single tokens, and rare or unknown words decompose into subwords; for instance, 'annoyingly' might be split into 'annoying' and 'ly'. Subword splitting lets the model represent unseen words from known subwords. The tokenizer turns text into integer ids, the model's input_ids, and an attention mask.",
    detail: [
      "BPE is described as the most popular tokenisation algorithm in the Transformers library.",
      "Subword tokenisation is especially useful for languages with long, complex words.",
      "A tokenizer turns text into the model inputs input_ids and attention_mask.",
    ],
    ex: "A rare word the model has never seen is split into several known subwords instead of being replaced by an unknown token.",
    mistakes: [
      "Using a different tokenizer from the one the model was trained with.",
      "Assuming one word is always one token.",
    ],
    follow: ["How do padding and truncation work?"],
    points: [
      "BPE, Unigram, WordPiece",
      "Common words whole, rare words split",
      "Compact vocabulary",
      "Match the model's tokenizer",
    ],
    notes: "Subwords handle unseen words with a small vocabulary.",
    src: [
      ["Hugging Face: Tokenization algorithms", `${HF}/tokenizer_summary`],
      ["Hugging Face: Tokenizers", `${HF}/fast_tokenizers`],
    ],
  }),
  g({
    slug: "attention-and-multihead",
    topic: "Transformers",
    d: "hard",
    title: "What is attention, and what does multi-head attention add?",
    kw: ["attention", "multi-head attention", "self-attention", "MultiheadAttention", "query key value"],
    intent:
      "Checks that you can explain the core mechanism behind transformers without drowning in formulas.",
    short:
      "Attention lets each position in a sequence look at other positions and weigh how relevant each is when building its new representation. In PyTorch, nn.MultiheadAttention allows the model to jointly attend to information from different representation subspaces, meaning several attention heads each focus on different relationships in parallel. It implements the original architecture described in the paper 'Attention Is All You Need', and the documentation says it is a reference implementation for foundational understanding with limited features. The inputs are queries, keys and values; with self-attention all three come from the same sequence.",
    detail: [
      "The module takes embed_dim and num_heads.",
      "The documentation recommends other building blocks for efficient production layers.",
      "A mask can stop a position from attending to padding or future tokens.",
    ],
    ex: "In the sentence 'The animal did not cross because it was tired', attention lets 'it' draw on the representation of 'animal'.",
    mistakes: [
      "Treating attention weights as a full explanation of the model.",
      "Forgetting masks for padding.",
    ],
    follow: ["What is a transformer encoder layer?"],
    points: [
      "Weighs other positions",
      "Several heads in parallel",
      "Different representation subspaces",
      "Self-attention uses one sequence",
    ],
    notes: "Heads attend in parallel to different relationships.",
    src: [["PyTorch: MultiheadAttention", `${PT}/torch.nn.MultiheadAttention.html`]],
  }),
  g({
    slug: "transformer-encoder-layer",
    topic: "Transformers",
    d: "hard",
    title: "What is a transformer encoder layer made of?",
    kw: ["transformer", "encoder layer", "self-attention", "feedforward", "layer norm"],
    intent:
      "Checks that you can name the parts of the standard transformer block.",
    short:
      "A TransformerEncoderLayer is made up of a self-attention block and a feedforward network. The documentation says it implements the original architecture from the paper 'Attention Is All You Need' and is meant as a reference implementation for foundational understanding. In the layer, self-attention lets every position look at the others, and the feedforward network then processes each position; layer normalisation and residual connections surround the sub-blocks. Several such layers stacked form the encoder, available as nn.TransformerEncoder.",
    detail: [
      "Key arguments are d_model, nhead and dim_feedforward.",
      "The documentation notes that the field moves fast and suggests other building blocks for efficient layers.",
      "Key arguments include the model dimension and the number of attention heads.",
    ],
    ex: "A text classifier embeds tokens, adds positions, passes them through a few encoder layers and pools the result.",
    mistakes: [
      "Treating the layer as a complete model instead of one block.",
      "Assuming the reference layer is the most efficient choice for production.",
    ],
    follow: ["How are transformers fine-tuned for a task?"],
    points: [
      "Self-attention plus feedforward",
      "Original architecture",
      "Stacked to form an encoder",
      "Reference implementation",
    ],
    notes: "Attention mixes positions; the feedforward network transforms each one.",
    src: [["PyTorch: TransformerEncoderLayer", `${PT}/torch.nn.TransformerEncoderLayer.html`]],
  }),
  g({
    slug: "pretraining-vs-finetuning",
    topic: "Fine-tuning & transfer learning",
    d: "medium",
    title: "What is the difference between pretraining and fine-tuning a language model?",
    kw: ["fine-tuning", "pretraining", "pretrained model", "Trainer", "task-specific"],
    intent:
      "Checks that you know why most projects start from a pretrained model.",
    short:
      "Fine-tuning continues training a large pretrained model on a smaller dataset specific to a task or domain. The Hugging Face documentation says fine-tuning is identical to pretraining except that you do not start with random weights, and that it requires far less compute, data and time. In the Transformers workflow you load a dataset, tokenise it with the tokenizer, which creates input_ids and attention_mask, truncate to a maximum length, build batches with a data collator, load the pretrained checkpoint and train with the Trainer. Afterwards you evaluate on a held-out split.",
    detail: [
      "Parameter-efficient fine-tuning updates only a small number of extra parameters called adapters.",
      "A held-out test split is created, for example with train_test_split, to evaluate the result.",
      "Fine-tuned models can be pushed to the Hugging Face Hub.",
    ],
    ex: "A support team fine-tunes a pretrained text model on its own labelled tickets to classify them.",
    mistakes: [
      "Training from scratch on a small dataset.",
      "Evaluating on data that was used for fine-tuning.",
    ],
    follow: ["What are adapters?"],
    points: [
      "Pretraining: random start, large data",
      "Fine-tuning: start from pretrained weights",
      "Less compute, data and time",
      "Tokenise, collate, train, evaluate",
    ],
    notes: "Fine-tuning = continued training from pretrained weights.",
    src: [["Hugging Face: Fine-tuning", `${HF}/training`]],
  }),
  g({
    slug: "parameter-efficient-fine-tuning",
    topic: "Fine-tuning & transfer learning",
    d: "hard",
    title: "What is parameter-efficient fine-tuning (PEFT), and what are adapters?",
    kw: ["PEFT", "adapters", "LoRA", "parameter-efficient", "memory"],
    intent:
      "Checks that you know how large models are adapted without updating all weights.",
    short:
      "Parameter-efficient fine-tuning methods fine-tune only a small number of extra model parameters, called adapters, on top of a pretrained model. Because only the adapter parameters are updated, the optimiser tracks far fewer gradients and states, which reduces memory usage significantly. Adapters are lightweight, so they are convenient to share, store and load. Transformers integrates with the PEFT library: you create a PEFT config, for example LoraConfig, and attach it to a model with add_adapter, and you can load, add, train, switch and delete adapters. Methods such as LoRA, IA3 and AdaLoRA are supported.",
    detail: [
      "You can fully fine-tune specific layers alongside the adapter using modules_to_save.",
      "Prompt-based methods such as prompt tuning require using the PEFT library directly.",
      "The integration requires the peft package to be installed.",
    ],
    ex: "A team trains a small adapter for each customer instead of storing a full copy of the model for each.",
    mistakes: [
      "Assuming adapters change all of the model's weights.",
      "Forgetting to include layers that must be fully trained, such as a new output head.",
    ],
    follow: ["How does this differ from full fine-tuning?"],
    points: [
      "Train a few extra parameters",
      "Optimiser needs less memory",
      "Adapters are easy to share",
      "LoRA is one supported method",
    ],
    notes: "Freeze the base model and train small adapters.",
    src: [["Hugging Face: Parameter-efficient fine-tuning", `${HF}/peft`]],
  }),
  g({
    slug: "pipeline-for-nlp-tasks",
    topic: "NLP tasks",
    d: "easy",
    title: "What is the Hugging Face Pipeline, and what NLP tasks can it run?",
    kw: ["pipeline", "inference", "task identifier", "text classification", "pretrained model"],
    intent:
      "Checks that you can use a pretrained model for a task with minimal code.",
    short:
      "The Pipeline is a simple but powerful inference API available for many machine learning tasks with models from the Hugging Face Hub. You load a pipeline by setting the task identifier in the task parameter, for example text-generation, and each task is configured with a default pretrained model and preprocessor, which you can override with the model parameter. Tasks include text generation and others such as text classification, summarisation, translation and question answering, which each have their own guide. Pipelines support GPUs and half-precision weights to accelerate inference, and when you have several inputs you pass them as a list.",
    detail: [
      "There is a generic Pipeline class and many task-specific pipeline classes.",
      "The pipeline handles tokenisation, the model call and post-processing for you.",
      "For custom training you move from pipelines to the model, tokenizer and Trainer.",
    ],
    ex: "pipeline(task='text-classification') classifies a list of customer reviews with one call.",
    mistakes: [
      "Relying on the default model without checking it suits the language or domain.",
      "Evaluating quality from a couple of examples.",
    ],
    follow: ["How would you fine-tune a model for your own labels?"],
    points: [
      "Task identifier picks the pipeline",
      "Default model and preprocessor",
      "Override with model=",
      "Accepts a list of inputs",
    ],
    notes: "pipeline(task=...) is the quickest way to try a task.",
    src: [["Hugging Face: Pipeline", `${HF}/pipeline_tutorial`]],
  }),
  g({
    slug: "text-classification-task",
    topic: "NLP tasks",
    d: "easy",
    title: "What is text classification, and what is sentiment analysis?",
    kw: ["text classification", "sentiment analysis", "label", "nlp task", "sequence classification"],
    intent:
      "Checks that you can define a common NLP task and its inputs and outputs.",
    short:
      "Text classification is a common NLP task that assigns a label or class to text. One of the most popular forms is sentiment analysis, which assigns a label such as positive, negative or neutral to a sequence of text. The Hugging Face guide for the task shows how to fine-tune a pretrained model on a labelled review dataset to decide whether a review is positive or negative, and then use it for inference. The workflow is to load the data, tokenise the text, fine-tune with the Trainer, evaluate on held-out data and then predict labels for new text.",
    detail: [
      "The input is a text sequence and the output is one label from a fixed set.",
      "Other tasks in the guides include token classification, summarisation, translation and question answering.",
      "Classic alternatives use TF-IDF features and a linear classifier.",
    ],
    ex: "Mapping each product review to positive or negative.",
    mistakes: [
      "Ignoring class imbalance in the labels.",
      "Judging quality only by accuracy on a skewed dataset.",
    ],
    follow: ["How do you evaluate a classifier?"],
    points: [
      "Assign a label to text",
      "Sentiment analysis is one form",
      "Tokenise, fine-tune, evaluate",
      "Classic alternative: TF-IDF plus linear model",
    ],
    notes: "Text in, label out.",
    src: [["Hugging Face: Text classification", `${HF}/tasks/sequence_classification`]],
  }),
  g({
    slug: "nlp-task-types-overview",
    topic: "NLP tasks",
    d: "easy",
    title: "What are common NLP task types such as token classification, summarisation and translation?",
    kw: ["token classification", "summarization", "translation", "question answering", "language modeling"],
    intent:
      "Checks that you can match a business need to a standard task definition.",
    short:
      "The Hugging Face task guides cover several standard NLP task types. Text classification assigns a label to a whole text. Token classification assigns a label to each token, for example to find names in a sentence. Summarisation produces a shorter version of a document. Translation converts text from one language to another. Question answering finds or generates an answer to a question given a context. Language modelling predicts the next token or fills in masked tokens. Each task has an appropriate model head and an evaluation metric, and each guide shows how to fine-tune a model and run inference.",
    detail: [
      "Choosing the task type first narrows the model and metric choices.",
      "Translation and summarisation produce text, so they are generation tasks.",
      "Classification and token classification produce labels.",
    ],
    ex: "Extracting people and places from news text is token classification; condensing the article is summarisation.",
    mistakes: [
      "Treating entity extraction as whole-document classification.",
      "Using accuracy to judge a generation task.",
    ],
    follow: ["How would you evaluate a summariser?"],
    points: [
      "Classification: one label per text",
      "Token classification: one label per token",
      "Summarisation and translation generate text",
      "Question answering uses context",
    ],
    notes: "Name the task first, then pick the model and metric.",
    src: [
      ["Hugging Face: Token classification", `${HF}/tasks/token_classification`],
      ["Hugging Face: Summarization", `${HF}/tasks/summarization`],
      ["Hugging Face: Translation", `${HF}/tasks/translation`],
      ["Hugging Face: Question answering", `${HF}/tasks/question_answering`],
      ["Hugging Face: Language modeling", `${HF}/tasks/language_modeling`],
    ],
  }),
])
