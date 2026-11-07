import { defineQuestions } from "../author"
import { q } from "../compact"

const AN = "https://docs.anthropic.com/en"
const OAI = "https://platform.openai.com/docs/guides"
const LC = "https://docs.langchain.com/oss/python"
const GL = `${AN}/docs/about-claude/glossary`

export default defineQuestions("rag-agents", "fresher", [
  q({
    slug: "embeddings-for-semantic-search",
    topic: "Embeddings",
    d: "easy",
    title: "How are embeddings used for semantic search?",
    kw: [
      "embeddings",
      "semantic search",
      "vector similarity",
      "keyword search",
      "query embedding",
    ],
    intent: "Checks the core idea behind retrieval.",
    short:
      "An embedding model turns text into a vector so that texts with similar meaning end up close together. For semantic search you embed every document chunk once and store the vectors; at query time you embed the question with the same model and return the chunks whose vectors are nearest to the query vector. OpenAI's retrieval guide points out that this surfaces relevant results even with few or no shared keywords, which classical keyword search can miss: a query about 'moon landing' can find a sentence about 'lunar landing'.",
    detail: [
      "Documents are embedded in advance; only the query is embedded at search time.",
      "Distance between vectors measures relatedness, often with cosine similarity.",
      "Exact terms such as product codes may still need keyword matching.",
    ],
    ex: "A help-centre search that finds 'Returning your order' for the query 'refund policy'.",
    mistakes: [
      "Embedding documents and queries with different models.",
      "Expecting semantic search to match exact identifiers well.",
    ],
    follow: ["Why must the same model embed documents and queries?"],
    points: [
      "Text mapped to vectors",
      "Nearest vectors = most similar",
      "Works with few shared keywords",
      "Same model for docs and queries",
    ],
    notes: ["Search by meaning."],
    src: [
      ["OpenAI docs: Retrieval (semantic search)", `${OAI}/retrieval`],
      ["OpenAI docs: Vector embeddings", `${OAI}/embeddings`],
    ],
  }),
  q({
    slug: "cosine-similarity-and-distance-metrics",
    topic: "Embeddings",
    d: "medium",
    title: "How do you measure similarity between embeddings?",
    kw: [
      "cosine similarity",
      "euclidean distance",
      "dot product",
      "normalized vectors",
      "similarity metric",
    ],
    intent: "Checks understanding of vector comparison.",
    short:
      "Common measures are cosine similarity (the angle between vectors, ignoring their length), dot product, and Euclidean distance. OpenAI's embeddings documentation recommends cosine similarity and says the choice of distance function typically does not matter much; because its embeddings are normalised to length one, cosine similarity reduces to a dot product and cosine and Euclidean distance give the same ranking. Check whether your embedding model returns normalised vectors and use the metric your vector store index is configured for. Similarity scores are only meaningful relative to each other for the same model, so do not compare raw numbers across models.",
    detail: [
      "Higher cosine similarity means more similar, lower Euclidean distance means more similar.",
      "Choose a threshold from evaluation data, not from guesswork.",
      "Mixing normalised and non-normalised vectors can distort results.",
    ],
    ex: "Ranking 1,000 chunks by dot product with a normalised query vector.",
    mistakes: [
      "Comparing scores across different models.",
      "Setting a similarity cut-off without testing.",
    ],
    follow: ["Why can normalised vectors use a dot product?"],
    points: [
      "Cosine, dot product, Euclidean",
      "Cosine is a good default",
      "Normalised vectors give equal rankings",
      "Scores are model-specific",
    ],
    notes: ["Rank, don't over-read the number."],
    src: [
      [
        "OpenAI docs: Vector embeddings (distance function FAQ)",
        `${OAI}/embeddings`,
      ],
      ["Anthropic docs: Embeddings", `${AN}/docs/build-with-claude/embeddings`],
    ],
  }),
  q({
    slug: "embedding-model-choice-and-consistency",
    topic: "Embeddings",
    d: "medium",
    title:
      "How do you choose an embedding model, and what happens if you change it?",
    kw: [
      "embedding model selection",
      "re-embedding",
      "domain specific",
      "embedding dimension",
      "consistency",
    ],
    intent: "Checks practical embedding decisions.",
    short:
      "Consider the language and domain of your text, retrieval quality on your own data, latency and cost at your scale, vector size (which affects storage and speed) and whether you can customise or host it. Anthropic's embeddings guide lists dataset size and domain specificity, inference performance and customisation as factors, and notes that Anthropic does not offer its own embedding model, so you pick a separate provider. Evaluate candidates on a labelled set of real queries rather than relying on general claims. Vectors from different models are not comparable, so changing the model means re-embedding the entire corpus and rebuilding the index, with a plan for a switch-over.",
    detail: [
      "Store the model name and version with each vector.",
      "Smaller vectors lower storage and search cost, with possible quality loss.",
      "Embedding calls are billed by tokens, so batch the ingestion job.",
    ],
    ex: "Comparing two models by checking how often the correct page appears in the top five results for 100 real questions.",
    mistakes: [
      "Choosing by reputation without testing on your data.",
      "Mixing old and new vectors in one index.",
    ],
    follow: ["What do you do when you upgrade the embedding model?"],
    points: [
      "Test on your own queries",
      "Weigh domain, cost, latency, size",
      "Vectors are model-specific",
      "Changing models means re-embedding",
    ],
    notes: ["Evaluate, then commit."],
    src: [
      [
        "Anthropic docs: Embeddings (before implementing)",
        `${AN}/docs/build-with-claude/embeddings`,
      ],
      ["OpenAI docs: Vector embeddings", `${OAI}/embeddings`],
    ],
  }),
  q({
    slug: "what-is-a-vector-database",
    topic: "Vector databases",
    d: "easy",
    title: "What is a vector database (vector store), and why use one?",
    kw: [
      "vector database",
      "vector store",
      "similarity search",
      "index",
      "metadata",
    ],
    intent: "Checks understanding of the storage layer for retrieval.",
    short:
      "A vector store holds embeddings together with the original text and metadata and answers 'find the k vectors most similar to this one' quickly. Comparing a query with every stored vector works for small collections, but as data grows you need an index, and the OpenAI embeddings FAQ recommends a vector database for retrieving nearest neighbours quickly. Besides similarity search, stores typically support inserting, updating and deleting items, filtering by metadata, and persistence. Options include dedicated vector databases, search engines with vector support, and vector extensions to relational databases; frameworks such as LangChain offer a common interface to many of them.",
    detail: [
      "A retriever wraps a store so the application can ask for relevant documents for a query.",
      "Keep the original source id so you can show citations.",
      "Backups and access control apply just as for any database.",
    ],
    ex: "A store with 200,000 chunks queried for the top five matches in milliseconds.",
    mistakes: [
      "Storing vectors without metadata.",
      "Treating the store as the only copy of the source documents.",
    ],
    follow: ["What does a retriever do?"],
    points: [
      "Stores vectors plus text and metadata",
      "Fast nearest-neighbour search",
      "Supports updates and filters",
      "Common interface via frameworks",
    ],
    notes: ["A database for similarity."],
    src: [
      [
        "OpenAI docs: Vector embeddings (FAQ: retrieving nearest vectors)",
        `${OAI}/embeddings`,
      ],
      [
        "LangChain docs: Vector store integrations",
        `${LC}/integrations/vectorstores`,
      ],
    ],
  }),
  q({
    slug: "exact-versus-approximate-nearest-neighbour",
    topic: "Vector databases",
    d: "hard",
    title:
      "What is the difference between exact and approximate nearest-neighbour search?",
    kw: [
      "approximate nearest neighbor",
      "ann index",
      "exact search",
      "recall tradeoff",
      "index parameters",
    ],
    intent: "Checks awareness of accuracy-speed trade-offs in vector search.",
    short:
      "Exact (brute-force) search compares the query with every vector, so it returns the true nearest neighbours but its cost grows linearly with the collection size. Approximate nearest-neighbour (ANN) indexes organise vectors, for example as graphs or clusters, so the search examines only a small part of the data; it is much faster at scale, but may miss some true neighbours. This is a trade-off between speed, memory and recall that you tune with index parameters. For small datasets exact search is simple and fast enough; for large ones use ANN and measure recall against exact results on a sample. The approach is the same whichever store you pick.",
    detail: [
      "Higher accuracy settings generally cost more latency and memory.",
      "Filters can interact with the index and change results, so test them.",
      "Rebuilding or tuning an index may be needed as data grows.",
    ],
    ex: "Comparing ANN results with brute force on 1,000 queries to measure how many true neighbours were found.",
    mistakes: [
      "Assuming ANN always returns the exact top results.",
      "Not measuring recall after changing index settings.",
    ],
    follow: ["How would you measure the recall of an ANN index?"],
    points: [
      "Exact scans everything",
      "ANN examines a subset",
      "Speed vs recall trade-off",
      "Measure against exact results",
    ],
    notes: ["Faster, with some misses."],
    src: [
      ["OpenAI docs: Vector embeddings (FAQ)", `${OAI}/embeddings`],
      [
        "LangChain docs: Vector store integrations",
        `${LC}/integrations/vectorstores`,
      ],
    ],
  }),
  q({
    slug: "metadata-filtering-in-retrieval",
    topic: "Vector databases",
    d: "medium",
    title: "Why attach metadata to chunks and filter on it during retrieval?",
    kw: [
      "metadata filtering",
      "attribute filter",
      "access control",
      "document source",
      "scoped search",
    ],
    intent: "Checks practical retrieval design beyond pure similarity.",
    short:
      "Metadata such as source document, section, date, language, product, customer or permission group travels with each chunk. Filtering on it narrows the search before or during ranking, so users only get relevant, allowed content: only documents for a product version, only items updated after a date, only data the user may see. OpenAI's retrieval guide describes attribute filtering for this. Metadata also allows citations back to the source and cleanup when a document is deleted. Enforce access control in the retrieval layer, as part of the query, not by asking the model to ignore restricted content after it has already been retrieved.",
    detail: [
      "Design metadata fields up front; adding them later means re-indexing.",
      "Filtered searches can be slower or less accurate on some indexes; test them.",
      "Keep sensitive metadata out of the prompt unless needed.",
    ],
    ex: "A support bot that only retrieves articles tagged with the customer's plan.",
    mistakes: [
      "Relying on the prompt to hide unauthorised documents.",
      "Forgetting to store the source for citations.",
    ],
    follow: ["Where should access control be enforced?"],
    points: [
      "Metadata stored with chunks",
      "Filters narrow results",
      "Enables citations and cleanup",
      "Enforce permissions at retrieval",
    ],
    notes: ["Filter before the model sees it."],
    src: [
      ["OpenAI docs: Retrieval (attribute filtering)", `${OAI}/retrieval`],
      [
        "LangChain docs: Semantic search tutorial",
        `${LC}/langchain/knowledge-base`,
      ],
    ],
  }),
  q({
    slug: "why-chunk-documents",
    topic: "Chunking",
    d: "easy",
    title: "Why do we split documents into chunks before indexing?",
    kw: [
      "chunking",
      "text splitting",
      "chunk size",
      "retrieval granularity",
      "context limits",
    ],
    intent: "Checks the reason behind a core RAG step.",
    short:
      "Documents are usually too long to embed or place in a prompt as a whole, and a single vector for a long document blurs its many topics. Splitting into chunks gives each vector a focused meaning, lets the search return the specific passage that answers the question instead of a whole file, and keeps the retrieved context small enough for the model's context window. Each chunk keeps metadata linking it to its source. LangChain's tutorial loads a PDF, splits it and indexes the chunks; OpenAI's vector stores split files automatically using a chunking strategy you can adjust.",
    detail: [
      "Too large chunks add noise; too small chunks lose context.",
      "Overlap between neighbouring chunks avoids cutting facts in half.",
      "Splitting by structure (headings, paragraphs) usually beats splitting at arbitrary positions.",
    ],
    ex: "A 100-page manual becomes a few hundred chunks, each about a section or a few paragraphs.",
    mistakes: [
      "Embedding whole documents.",
      "Splitting in the middle of sentences or tables.",
    ],
    follow: ["Why add overlap?"],
    points: [
      "Documents too long for one vector or prompt",
      "Focused vectors improve retrieval",
      "Smaller context for the model",
      "Keep source metadata",
    ],
    notes: ["Index passages, not books."],
    src: [
      ["OpenAI docs: Retrieval (chunking)", `${OAI}/retrieval`],
      [
        "LangChain docs: Semantic search tutorial",
        `${LC}/langchain/knowledge-base`,
      ],
    ],
  }),
  q({
    slug: "chunk-size-and-overlap-tradeoffs",
    topic: "Chunking",
    d: "medium",
    title: "How do you choose chunk size and overlap?",
    kw: [
      "chunk size",
      "chunk overlap",
      "token limits",
      "retrieval precision",
      "tuning chunking",
    ],
    intent: "Checks reasoning about a tuning decision.",
    short:
      "Small chunks give precise matches and keep the prompt short, but may lack the surrounding context needed to answer; large chunks carry more context but dilute the vector with several topics and use more of the context window. Overlap repeats the end of one chunk at the start of the next, so a sentence or fact near a boundary appears whole in at least one chunk, at the cost of more storage and duplicate results. Measure chunk size in tokens, not characters, to match model limits.",
    detail: [
      "Vary chunk size by content type: code, tables and prose differ.",
      "Return neighbouring chunks or the parent section for extra context.",
      "Re-chunking means re-embedding, so test on a sample first.",
    ],
    ex: "Comparing 200, 500 and 1000-token chunks by how often the right passage appears in the top five.",
    mistakes: [
      "Copying a size from a tutorial without testing.",
      "Counting characters instead of tokens.",
    ],
    follow: ["How would you pick between candidate settings?"],
    points: [
      "Small = precise, large = more context",
      "Overlap protects boundaries",
      "Measure in tokens",
      "Decide with evaluations",
    ],
    notes: ["Tune against your questions."],
    src: [
      ["OpenAI docs: Retrieval (chunking strategy)", `${OAI}/retrieval`],
      [
        "LangChain docs: Semantic search tutorial",
        `${LC}/langchain/knowledge-base`,
      ],
    ],
  }),
  q({
    slug: "chunking-strategies-structure-aware",
    topic: "Chunking",
    d: "medium",
    title: "What chunking strategies exist beyond fixed-size splitting?",
    kw: [
      "recursive splitting",
      "structure-aware chunking",
      "semantic chunking",
      "markdown headers",
      "parent document",
    ],
    intent: "Checks knowledge of better splitting approaches.",
    short:
      "Fixed-size splitting cuts text every N tokens regardless of meaning. Recursive splitting tries separators in order (sections, paragraphs, sentences, words) so chunks end at natural boundaries and stay under a size limit. Structure-aware splitting follows the document: Markdown or HTML headings, code functions, table rows or slide pages, and stores the heading path as metadata. Semantic splitting starts a new chunk where the topic changes, detected with embeddings. A parent-document approach indexes small chunks for precise matching but returns the larger surrounding section to the model. Choose by document type and check results by reading actual chunks.",
    detail: [
      "Tables and code need special handling or they break.",
      "Adding a short context header (document title, section) to each chunk helps retrieval.",
      "Inspect samples of chunks before indexing everything.",
    ],
    ex: "Splitting a documentation site by headings and keeping the page title in each chunk's metadata.",
    mistakes: [
      "Never looking at the produced chunks.",
      "Cutting tables or code blocks in half.",
    ],
    follow: ["What is the parent-document approach?"],
    points: [
      "Fixed-size is simplest",
      "Recursive follows separators",
      "Structure-aware uses headings",
      "Parent-document returns larger context",
    ],
    notes: ["Split where the meaning splits."],
    src: [
      [
        "LangChain docs: Semantic search tutorial (text splitters)",
        `${LC}/langchain/knowledge-base`,
      ],
      ["OpenAI docs: Retrieval (chunking)", `${OAI}/retrieval`],
    ],
  }),
  q({
    slug: "keyword-versus-semantic-versus-hybrid-search",
    topic: "Retrieval",
    d: "medium",
    title:
      "When do you use keyword search, semantic search or a hybrid of both?",
    kw: [
      "keyword search",
      "semantic search",
      "hybrid search",
      "bm25",
      "exact match",
    ],
    intent: "Checks judgement about retrieval methods.",
    short:
      "Keyword (lexical) search matches the actual words: it excels at exact terms such as error codes, product names, ids and rare vocabulary, and is predictable and cheap. Semantic search uses embeddings to match meaning, so paraphrases and related wording are found even with no shared words, as OpenAI's retrieval guide demonstrates, but it can miss exact identifiers and return loosely related text. Hybrid search runs both and merges the rankings, getting the strengths of each; a reranking step can then order the combined candidates. Evaluate on your real queries: technical documentation with codes often benefits from hybrid, conversational questions from semantic.",
    detail: [
      "Many search engines and vector stores support both modes.",
      "Merging scores needs care because they are on different scales; rank-based fusion is common.",
      "Keep keyword search as a fallback for exact lookups.",
    ],
    ex: "Searching 'error E1234' needs keywords; 'why does checkout fail?' benefits from semantics.",
    mistakes: [
      "Dropping keyword search entirely.",
      "Averaging raw scores from different scales.",
    ],
    follow: ["How can you combine the two result lists?"],
    points: [
      "Keyword: exact terms",
      "Semantic: meaning and paraphrase",
      "Hybrid merges both",
      "Choose by evaluation",
    ],
    notes: ["Words and meaning together."],
    src: [
      ["OpenAI docs: Retrieval (semantic search)", `${OAI}/retrieval`],
      [
        "LangChain docs: Semantic search tutorial",
        `${LC}/langchain/knowledge-base`,
      ],
    ],
  }),
  q({
    slug: "query-rewriting-for-retrieval",
    topic: "Retrieval",
    d: "medium",
    title: "What is query rewriting, and why can it improve retrieval?",
    kw: [
      "query rewriting",
      "query expansion",
      "conversational retrieval",
      "standalone question",
      "multi-query",
    ],
    intent: "Checks techniques that improve what is searched for.",
    short:
      "User questions are often short, ambiguous or depend on the conversation ('and how much does it cost?'), which makes poor search queries. Query rewriting transforms the input into a better query, usually with a model: resolving pronouns using chat history into a standalone question, removing chatty wording, adding key terms, or splitting a complex question into several searches whose results are merged. OpenAI's retrieval guide includes an option to rewrite queries automatically and returns the rewritten query so you can see it.",
    detail: [
      "Hypothetical-answer generation is another expansion technique.",
      "Rewriting is most valuable in multi-turn chat.",
      "Log both the original and rewritten queries for debugging.",
    ],
    ex: "Turning 'what about the premium plan?' into 'What does the premium plan include?' using the previous turn.",
    mistakes: [
      "Rewriting every query without checking value.",
      "Not logging the rewritten text.",
    ],
    follow: ["What is the downside of rewriting?"],
    points: [
      "Better queries find better chunks",
      "Resolve context from chat history",
      "Can split into several queries",
      "Costs a call and may drift",
    ],
    notes: ["Fix the question before searching."],
    src: [
      ["OpenAI docs: Retrieval (query rewriting)", `${OAI}/retrieval`],
      [
        "LangChain docs: Semantic search tutorial",
        `${LC}/langchain/knowledge-base`,
      ],
    ],
  }),
  q({
    slug: "top-k-and-reranking",
    topic: "Retrieval",
    d: "medium",
    title: "How many results should you retrieve, and what does reranking add?",
    kw: [
      "top-k",
      "reranking",
      "cross-encoder",
      "context budget",
      "relevance threshold",
    ],
    intent: "Checks the retrieval-to-prompt trade-off.",
    short:
      "Retrieve enough candidates that the answer is likely among them, but pass the model only what it needs: too few results risk missing the answer (low recall), too many fill the context window with noise, raise cost and latency, and can distract the model. A common pattern is to fetch a larger candidate set (say tens of chunks) cheaply by vector search and then rerank them with a more accurate model that scores each query-chunk pair, keeping the best handful. OpenAI's retrieval guide covers ranking options and result limits.",
    detail: [
      "Rerankers are slower than vector search, so apply them to a small candidate set.",
      "Deduplicate near-identical chunks before building the prompt.",
      "Order chunks sensibly, since position can influence what the model uses.",
    ],
    ex: "Retrieving 30 candidates, reranking and sending the five highest-scoring chunks to the model.",
    mistakes: [
      "Stuffing the prompt with everything retrieved.",
      "Fixing k once and never evaluating it.",
    ],
    follow: ["Why not always send many chunks?"],
    points: [
      "Balance recall and noise",
      "Retrieve broad, rerank narrow",
      "Threshold for irrelevant results",
      "Tune k by evaluation",
    ],
    notes: ["Cast a wide net, keep the best."],
    src: [
      ["OpenAI docs: Retrieval (ranking)", `${OAI}/retrieval`],
      [
        "Anthropic docs: Context windows",
        `${AN}/docs/build-with-claude/context-windows`,
      ],
    ],
  }),
  q({
    slug: "evaluating-retrieval-quality",
    topic: "Retrieval",
    d: "hard",
    title: "How do you measure whether retrieval is working?",
    kw: [
      "retrieval evaluation",
      "recall at k",
      "precision at k",
      "mrr",
      "labelled queries",
    ],
    intent:
      "Checks evaluation of the retrieval stage separately from generation.",
    short:
      "Evaluate retrieval on its own, before blaming the language model. Build a set of realistic questions, each labelled with the chunks or documents that contain the answer. For each question run retrieval and compute metrics: recall@k (was a relevant chunk in the top k?), precision@k (what fraction of the top k were relevant?) and mean reciprocal rank (how high was the first relevant result). Inspect failures by hand: wrong chunking, vocabulary mismatch, missing documents or poor filters are different problems with different fixes.",
    detail: [
      "Start with a few dozen real questions rather than none.",
      "Add failures from production to the set.",
      "Keep retrieval metrics next to end-to-end answer quality.",
    ],
    ex: "Finding that recall@5 is low because tables were split badly, and fixing chunking.",
    mistakes: [
      "Only checking final answers.",
      "Evaluating with questions copied from the documents themselves.",
    ],
    follow: ["What does recall@k mean?"],
    points: [
      "Labelled question set",
      "recall@k, precision@k, MRR",
      "Inspect failures by cause",
      "Rerun after every change",
    ],
    notes: ["Test the retriever first."],
    src: [
      ["OpenAI docs: Working with evals", `${OAI}/evals`],
      [
        "Anthropic docs: Define success criteria and build evaluations",
        `${AN}/docs/test-and-evaluate/develop-tests`,
      ],
    ],
  }),
  q({
    slug: "what-is-rag",
    topic: "RAG pipelines",
    d: "easy",
    title: "What is retrieval-augmented generation (RAG), and why use it?",
    kw: [
      "rag",
      "retrieval augmented generation",
      "grounding",
      "external knowledge",
      "up-to-date information",
    ],
    intent: "The core RAG question.",
    short:
      "Retrieval-augmented generation combines information retrieval with language-model generation. When a question arrives, the system retrieves relevant passages from an external knowledge base at runtime and passes them to the model together with the question, so the model answers using that evidence. Anthropic's glossary says this helps ground the response, lets the model use information beyond its training data, reduces reliance on memorisation and supports citing sources, and is useful for up-to-date or domain-specific knowledge. The glossary also cautions that effectiveness depends on the quality and relevance of the knowledge base and of what is retrieved. It adds sources but does not guarantee correctness.",
    detail: [
      "The model does not itself search unless you give it a retrieval tool.",
      "Updating knowledge means updating the index, not retraining the model.",
      "Combine with citations so users can verify.",
    ],
    ex: "A company assistant answering from internal policy documents with links to the source pages.",
    mistakes: [
      "Assuming RAG removes all hallucinations.",
      "Ignoring the quality of the knowledge base.",
    ],
    follow: ["What limits RAG quality?"],
    points: [
      "Retrieve first, then generate",
      "Grounds answers in documents",
      "Knowledge updated via the index",
      "Quality depends on retrieval",
    ],
    notes: ["Look it up, then answer."],
    src: [
      ["Anthropic docs: Glossary (RAG)", GL],
      ["OpenAI docs: Retrieval", `${OAI}/retrieval`],
    ],
  }),
  q({
    slug: "rag-pipeline-ingestion-and-query-steps",
    topic: "RAG pipelines",
    d: "medium",
    title: "What are the stages of a RAG pipeline?",
    kw: [
      "rag pipeline",
      "ingestion",
      "indexing",
      "retrieval step",
      "generation step",
    ],
    intent: "Checks understanding of the end-to-end flow.",
    short:
      "There are two phases. Ingestion (offline): load documents, clean and parse them, split them into chunks, attach metadata, create embeddings and write chunks and vectors to a vector store; this repeats when documents change. Query (online): take the user's question, optionally rewrite it, embed it, search the store with filters, rerank, assemble a prompt containing the instructions, the retrieved passages and the question, call the model, and return the answer with citations. Each stage can fail separately, so log what was retrieved and what was sent. LangChain's semantic search tutorial walks through loading a PDF, splitting, embedding, indexing and wrapping the store as a retriever.",
    detail: [
      "Ingestion quality (parsing, cleaning) often limits results most.",
      "Cache embeddings and answers where appropriate.",
      "Handle empty retrieval explicitly.",
    ],
    ex: "Nightly ingestion of updated wiki pages and an online endpoint answering employee questions.",
    mistakes: ["Skipping document cleaning.", "Not logging retrieved chunks."],
    follow: ["Which stages run offline?"],
    points: [
      "Ingest: load, split, embed, index",
      "Query: retrieve, assemble prompt, generate",
      "Citations in the answer",
      "Log each stage",
    ],
    notes: ["Index offline, answer online."],
    src: [
      [
        "LangChain docs: Semantic search tutorial",
        `${LC}/langchain/knowledge-base`,
      ],
      ["OpenAI docs: Retrieval", `${OAI}/retrieval`],
    ],
  }),
  q({
    slug: "grounding-answers-and-citations",
    topic: "RAG pipelines",
    d: "medium",
    title: "How do you make RAG answers grounded and verifiable?",
    kw: [
      "grounding",
      "citations",
      "quote extraction",
      "source attribution",
      "answer verification",
    ],
    intent: "Checks designing for trust.",
    short:
      "Instruct the model to answer only from the provided passages and to say when they do not contain the answer. Anthropic's guidance on reducing hallucinations suggests allowing the model to say it does not know, extracting word-for-word quotes first for long documents and basing the answer on them, and having it cite a supporting quote for each claim and retract claims it cannot support. Label each passage with an id and source so the answer can reference it, and show links so users can check the original. Verify that cited ids exist in the retrieved set and that quotes appear in the text.",
    detail: [
      "Programmatic checks catch fabricated citations.",
      "Prefer short quotes with links over long paraphrases.",
      "High-stakes domains need human review.",
    ],
    ex: "An answer with numbered sources [1] and [2] that link to the policy pages.",
    mistakes: [
      "Trusting citations without checking them.",
      "Letting the model use outside knowledge silently.",
    ],
    follow: ["How do you detect a fabricated citation?"],
    points: [
      "Answer only from passages",
      "Allow 'I don't know'",
      "Quote and cite",
      "Check citations in code",
    ],
    notes: ["Show your evidence."],
    src: [
      [
        "Anthropic docs: Reduce hallucinations",
        `${AN}/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations`,
      ],
      ["Anthropic docs: Glossary (RAG)", GL],
    ],
  }),
  q({
    slug: "rag-when-nothing-relevant-is-found",
    topic: "RAG pipelines",
    d: "medium",
    title: "What should a RAG system do when it finds nothing relevant?",
    kw: [
      "no relevant results",
      "fallback behavior",
      "relevance threshold",
      "i don't know",
      "out of scope",
    ],
    intent: "Checks handling of the failure case.",
    short:
      "Vector search always returns the nearest items, even when none are relevant, so a system that blindly passes them to the model invites made-up answers. Detect weak retrieval with a relevance threshold or reranker score, and when nothing passes, respond honestly: say the information was not found, ask a clarifying question, offer related topics, or hand over to a human. Also instruct the model that it may answer 'I don't have enough information' when the passages lack the answer, as Anthropic's guidance on reducing hallucinations recommends. Log such queries: they show gaps in your documents or retrieval and become new evaluation cases.",
    detail: [
      "Separate out-of-scope questions with a classifier or routing prompt.",
      "Do not fall back to the model's general knowledge unless that is intended.",
      "Review 'not found' logs regularly.",
    ],
    ex: "A policy bot answering 'I couldn't find that in the HR handbook' with a link to contact HR.",
    mistakes: [
      "Always answering from the top results.",
      "Never reviewing unanswered queries.",
    ],
    follow: ["How can you detect weak retrieval?"],
    points: [
      "Search always returns something",
      "Use thresholds or rerank scores",
      "Say 'not found' or escalate",
      "Log gaps for improvement",
    ],
    notes: ["Know when to say 'I don't know'."],
    src: [
      [
        "Anthropic docs: Reduce hallucinations",
        `${AN}/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations`,
      ],
      ["OpenAI docs: Retrieval", `${OAI}/retrieval`],
    ],
  }),
  q({
    slug: "rag-versus-long-context",
    topic: "RAG pipelines",
    d: "hard",
    title:
      "When is RAG better than putting all documents in the context window?",
    kw: [
      "rag vs long context",
      "context rot",
      "cost latency",
      "large corpora",
      "context engineering",
    ],
    intent: "Checks reasoning about architectural trade-offs.",
    short:
      "Large context windows make it possible to include whole documents directly, which is simple and works well for a small, stable set of material. But more context is not automatically better: Anthropic's documentation notes that as the number of tokens grows, accuracy and recall can degrade ('context rot'), and every request pays in latency and tokens for the entire context. RAG scales to corpora far bigger than any window, keeps each prompt small and focused, supports filtering by permissions and freshness, and makes sources traceable.",
    detail: [
      "Prompt caching can lower the repeated cost of a fixed long context.",
      "The approaches combine: retrieve candidate documents, then include whole documents.",
      "Evaluate recall of facts in long contexts instead of assuming it.",
    ],
    ex: "A 30-page handbook fits in context; a company wiki with thousands of pages needs retrieval.",
    mistakes: [
      "Assuming a larger window removes the need for retrieval.",
      "Not measuring accuracy on long inputs.",
    ],
    follow: ["What is context rot?"],
    points: [
      "Long context is simple for small material",
      "More tokens can degrade accuracy",
      "RAG scales and filters",
      "Decide with measurements",
    ],
    notes: ["Fit what's needed, not everything."],
    src: [
      [
        "Anthropic docs: Context windows",
        `${AN}/docs/build-with-claude/context-windows`,
      ],
      ["Anthropic docs: Glossary (RAG, context window)", GL],
    ],
  }),
  q({
    slug: "assembling-the-rag-prompt",
    topic: "RAG pipelines",
    d: "medium",
    title: "How do you assemble the prompt for a RAG request?",
    kw: [
      "rag prompt",
      "document tags",
      "context placement",
      "instructions",
      "source ids",
    ],
    intent: "Checks prompt construction for retrieval.",
    short:
      "Put stable instructions first (role, rules for using sources, how to cite, what to do if the answer is missing, output format), then the retrieved passages, each wrapped with clear delimiters and an id and source, then the user's question. OpenAI's prompt guidance suggests placing variable context near the end of the prompt and using Markdown or XML tags to separate instructions from data. Keep only the chunks that passed relevance filtering, dedupe them, and respect a token budget. Tell the model to treat the passages as reference data, not instructions, which helps against injected text. Version the template as code and test changes on your evaluation set.",
    detail: [
      "Put the most important instructions where the model will not miss them.",
      "Add the date or document version when freshness matters.",
      "Log the final prompt (without secrets) for debugging.",
    ],
    ex: 'A template with a rules section, `<doc id="3" source="hr-policy.pdf">...</doc>` blocks and the question.',
    mistakes: [
      "Mixing passages and instructions without delimiters.",
      "Overfilling the context with marginal chunks.",
    ],
    follow: ["Why label each passage with an id?"],
    points: [
      "Instructions, then passages, then question",
      "Delimit and label sources",
      "Respect a token budget",
      "Treat passages as data",
    ],
    notes: ["Rules, evidence, question."],
    src: [
      [
        "OpenAI docs: Prompt engineering (message formatting, context)",
        `${OAI}/prompt-engineering`,
      ],
      [
        "Anthropic docs: Prompt engineering overview",
        `${AN}/docs/build-with-claude/prompt-engineering/overview`,
      ],
    ],
  }),
  q({
    slug: "rag-security-access-control-and-injection",
    topic: "RAG pipelines",
    d: "hard",
    title: "What security issues does RAG introduce?",
    kw: [
      "rag security",
      "document permissions",
      "indirect prompt injection",
      "data leakage",
      "untrusted documents",
    ],
    intent: "Checks security awareness for retrieval systems.",
    short:
      "Two main risks. First, data exposure: if the index mixes documents of different users or teams, retrieval can surface content the asker is not allowed to see. Enforce permissions in the retrieval query with metadata filters (or separate indexes), never by asking the model to hide things. Second, indirect prompt injection: retrieved documents, web pages or emails may contain text that tries to give the model instructions. Treat retrieved content as untrusted data, as Anthropic's guidance on prompt injection advises; screen inputs, harden the system prompt, avoid giving the model powerful tools, and require approval for sensitive actions.",
    detail: [
      "Check source trust: who can add documents to the index?",
      "Redact personal data before indexing where possible.",
      "Test with adversarial documents.",
    ],
    ex: "A shared index where a user's question retrieves a confidential HR document unless permissions are filtered in the query.",
    mistakes: [
      "Filtering by permission after the model has seen the content.",
      "Trusting instructions inside retrieved text.",
    ],
    follow: ["Where do you enforce document permissions?"],
    points: [
      "Enforce permissions in retrieval",
      "Indirect prompt injection in documents",
      "Treat content as untrusted data",
      "Limit tool power, audit retrievals",
    ],
    notes: ["Retrieved text is not trusted."],
    src: [
      [
        "Anthropic docs: Mitigate jailbreaks and prompt injections",
        `${AN}/docs/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks`,
      ],
      ["OpenAI docs: Safety best practices", `${OAI}/safety-best-practices`],
    ],
  }),
  q({
    slug: "keeping-the-index-fresh",
    topic: "RAG pipelines",
    d: "medium",
    title: "How do you keep a RAG index up to date?",
    kw: [
      "index freshness",
      "incremental updates",
      "document deletion",
      "content hashing",
      "re-embedding",
    ],
    intent: "Checks operations of a retrieval system.",
    short:
      "Documents change, so ingestion must be incremental and repeatable. Track each source document with an id and a content hash or modified date; when it changes, delete its old chunks and insert new ones, and when a document is removed, delete its chunks so stale answers disappear. Schedule or trigger ingestion (on upload, by webhook or nightly), make it idempotent so reruns do not create duplicates, and record the embedding model and chunking version so a change can trigger a controlled full re-index. Some managed vector stores offer file operations and expiration policies for this.",
    detail: [
      "Store the source id on every chunk to find them again.",
      "Build the new index alongside the old one and switch over when ready.",
      "Remember backups and retention rules for deleted personal data.",
    ],
    ex: "A policy update triggers re-chunking of just that file, replacing its old vectors.",
    mistakes: [
      "Appending new versions without removing old ones.",
      "No way to find all chunks of a document.",
    ],
    follow: ["How do you avoid duplicates on re-runs?"],
    points: [
      "Track id and hash per document",
      "Replace chunks on change, delete on removal",
      "Idempotent scheduled ingestion",
      "Version embedding and chunking settings",
    ],
    notes: ["Update the index like a database."],
    src: [
      [
        "OpenAI docs: Retrieval (vector store operations, expiration)",
        `${OAI}/retrieval`,
      ],
      [
        "LangChain docs: Semantic search tutorial",
        `${LC}/langchain/knowledge-base`,
      ],
    ],
  }),
  q({
    slug: "evaluating-end-to-end-rag-quality",
    topic: "RAG pipelines",
    d: "hard",
    title: "How do you evaluate a whole RAG system?",
    kw: [
      "rag evaluation",
      "faithfulness",
      "answer relevance",
      "end-to-end eval",
      "failure analysis",
    ],
    intent: "Checks structured quality measurement.",
    short:
      "Evaluate in layers on a labelled set of realistic questions. Retrieval: did the relevant passages appear in the top results? Generation: is the answer faithful to the retrieved passages (no unsupported claims), relevant to the question, complete and properly cited? Grade with the cheapest reliable method, as Anthropic's guidance suggests: code checks for format and citation ids, model-graded rubrics for faithfulness and helpfulness, and human review for a sample. Include unanswerable questions to test refusals, and adversarial ones for injection. When a score drops, classify the failure (retrieval miss, bad chunking, prompt, model) to fix the right component, and rerun the full set after every change.",
    detail: [
      "Track metrics over time on a dashboard.",
      "Use real user questions and feedback.",
      "Keep a frozen test set to compare versions fairly.",
    ],
    ex: "A weekly run of 150 questions reporting recall@5, faithfulness and the percentage of correct refusals.",
    mistakes: [
      "Only measuring user satisfaction.",
      "Having no unanswerable questions in the set.",
    ],
    follow: ["How do you tell a retrieval failure from a generation failure?"],
    points: [
      "Layered evaluation",
      "Faithfulness, relevance, citations",
      "Include unanswerable and adversarial cases",
      "Diagnose failures by component",
    ],
    notes: ["Measure each layer."],
    src: [
      [
        "Anthropic docs: Define success criteria and build evaluations",
        `${AN}/docs/test-and-evaluate/develop-tests`,
      ],
      ["OpenAI docs: Working with evals", `${OAI}/evals`],
    ],
  }),
  q({
    slug: "what-is-langchain",
    topic: "LangChain",
    d: "easy",
    title: "What is LangChain, and when would you use it?",
    kw: [
      "langchain",
      "llm framework",
      "abstractions",
      "agents",
      "model integrations",
    ],
    intent: "Checks understanding of the framework's role and trade-offs.",
    short:
      "LangChain is an open-source framework that provides building blocks for LLM applications: a common interface to many model providers, message and tool abstractions, document loaders, text splitters, embedding and vector-store integrations, retrievers, structured output and an agent harness. Its value is speed and portability: you can swap a model or vector store with little code change, and use ready integrations and tracing tools. The trade-offs are an extra dependency and abstraction layer, API changes between versions and the need to understand what runs underneath. For a simple single call, using the provider SDK directly may be clearer. Use the framework when you need several integrations or agent patterns.",
    detail: [
      "Pin versions and read the docs for the version you use.",
      "LangGraph is the lower-level library for custom agent workflows.",
      "You can mix framework components with your own code.",
    ],
    ex: "A RAG prototype using a loader, splitter, embeddings, vector store and a model from the same library.",
    mistakes: [
      "Adding the framework for a one-call task.",
      "Not knowing what the abstraction does underneath.",
    ],
    follow: ["What is the trade-off of using a framework?"],
    points: [
      "Building blocks for LLM apps",
      "Swappable models and stores",
      "Extra abstraction and versions",
      "Direct SDK is fine for simple needs",
    ],
    notes: ["Convenience versus control."],
    src: [
      ["LangChain docs: Overview", `${LC}/langchain/overview`],
      ["LangChain docs: LangGraph overview", `${LC}/langgraph/overview`],
    ],
  }),
  q({
    slug: "langchain-documents-splitters-retrievers",
    topic: "LangChain",
    d: "medium",
    title:
      "How do documents, text splitters, embeddings, vector stores and retrievers fit together in LangChain?",
    kw: [
      "langchain document",
      "text splitter",
      "vector store",
      "retriever",
      "knowledge base",
    ],
    intent: "Checks the data flow of a LangChain retrieval app.",
    short:
      "A `Document` represents a unit of text with `page_content`, a `metadata` dictionary (source, page and so on) and an optional id; a document loader produces them from files such as PDFs. A text splitter divides long documents into smaller chunk documents that keep their metadata. An embeddings model turns each chunk into a vector, and a vector store holds the vectors and supports similarity search. A retriever is a standard interface over a store (or another source) that takes a query string and returns relevant documents, so downstream code does not depend on the specific store.",
    detail: [
      "Metadata set at load time flows through splitting and into citations.",
      "Retrievers can also wrap hybrid or reranking logic.",
      "Swap stores by changing configuration instead of rewriting the rest.",
    ],
    ex: "Loading a PDF, splitting it, indexing the chunks and wrapping the store as a retriever for the agent.",
    mistakes: ["Losing metadata when preprocessing.", "Skipping the splitter."],
    follow: ["What does a retriever return?"],
    points: [
      "Document = content + metadata",
      "Splitter creates chunks",
      "Vector store searches by similarity",
      "Retriever is the query interface",
    ],
    notes: ["Load, split, embed, store, retrieve."],
    src: [
      [
        "LangChain docs: Build a semantic search engine",
        `${LC}/langchain/knowledge-base`,
      ],
      [
        "LangChain docs: Embedding model integrations",
        `${LC}/integrations/embeddings`,
      ],
    ],
  }),
  q({
    slug: "langchain-structured-output-and-tools",
    topic: "LangChain",
    d: "medium",
    title: "How does LangChain support structured output and tools?",
    kw: [
      "langchain tools",
      "structured output",
      "tool decorator",
      "schema",
      "model abstraction",
    ],
    intent: "Checks how frameworks wrap tool calling.",
    short:
      "LangChain lets you define a tool as a Python function with a name, a description (often from its docstring) and typed arguments, which it converts into the tool schema that the model provider expects. You give the tools to a model or agent; when the model requests a call, the framework runs the function and passes the result back. For structured output you supply a schema, such as a Pydantic model or typed dictionary, and the framework asks the provider to return data matching it and parses the result into an object. This hides provider differences so one definition works across models.",
    detail: [
      "Docstrings and type hints become the tool description the model reads, so write them carefully.",
      "Tools can be async, and can return errors the model can recover from.",
      "Check the current docs, as APIs evolve between releases.",
    ],
    ex: "A `search_orders(customer_id)` function exposed as a tool and a `TicketSummary` schema for the final answer.",
    mistakes: [
      "Poor tool descriptions.",
      "Assuming parsed output is always valid.",
    ],
    follow: ["Where do tool descriptions come from?"],
    points: [
      "Functions become tools with schemas",
      "Framework runs the call and returns results",
      "Schema-based structured output",
      "Still validate and test",
    ],
    notes: ["One definition, many providers."],
    src: [
      ["LangChain docs: Tools", `${LC}/langchain/tools`],
      [
        "LangChain docs: Structured output",
        `${LC}/langchain/structured-output`,
      ],
    ],
  }),
  q({
    slug: "what-is-an-ai-agent",
    topic: "Agents",
    d: "easy",
    title:
      "What is an AI agent, and how does it differ from a simple LLM call?",
    kw: ["ai agent", "agent loop", "tool use", "autonomy", "workflow vs agent"],
    intent: "Checks a clear definition of agents.",
    short:
      "A single LLM call turns an input into an output. An agent is a model that calls tools in a loop until a task is complete, as LangChain's documentation puts it: the model decides which tool to call, the application runs it, the result goes back to the model, and this repeats until the model gives a final answer. The surrounding harness provides the prompt, the tools and controls such as middleware. Agents suit open-ended tasks where the steps cannot be fixed in advance, like researching, debugging or multi-step lookups.",
    detail: [
      "Anthropic and OpenAI both describe tool calling as the mechanism behind agents.",
      "Limit steps and tools to keep behaviour bounded.",
      "Log every step for debugging.",
    ],
    ex: "A support agent that looks up an order, checks the policy and drafts a reply, choosing the steps itself.",
    mistakes: [
      "Using an agent where a fixed pipeline would do.",
      "Giving it unlimited steps and tools.",
    ],
    follow: ["When is a fixed workflow better?"],
    points: [
      "Model + tools in a loop",
      "Loop ends at a final answer",
      "For open-ended tasks",
      "More cost and unpredictability",
    ],
    notes: ["A model that acts in a loop."],
    src: [
      ["LangChain docs: Agents", `${LC}/langchain/agents`],
      ["OpenAI docs: Agents", `${OAI}/agents`],
    ],
  }),
  q({
    slug: "agent-loop-limits-and-error-handling",
    topic: "Agents",
    d: "medium",
    title: "How do you keep an agent loop under control?",
    kw: [
      "agent loop",
      "max iterations",
      "tool errors",
      "stopping conditions",
      "retries",
    ],
    intent: "Checks robust agent engineering.",
    short:
      "An unconstrained loop can run for a long time, repeat the same call or burn through budget. Set a maximum number of steps and a time and token budget, detect repeated identical tool calls, and stop with a clear message when limits are hit. Make tools return useful error messages so the model can correct arguments instead of failing silently, and apply retries with backoff for transient failures in your code. Validate arguments before executing, keep the tool list small and descriptions precise, and use deterministic code for steps that do not need a model.",
    detail: [
      "A planning step or checklist in the prompt helps long tasks stay on track.",
      "Summarise or trim history if the loop grows long.",
      "Return partial results when the task cannot be completed.",
    ],
    ex: "An agent capped at ten tool calls that reports what it found when the limit is reached.",
    mistakes: ["No step limit.", "Hiding tool errors from the model."],
    follow: ["What would you log for each step?"],
    points: [
      "Step, time and token limits",
      "Detect repeated calls",
      "Helpful tool errors",
      "Log every step",
    ],
    notes: ["Bound the loop."],
    src: [
      ["LangChain docs: Agents", `${LC}/langchain/agents`],
      ["Anthropic docs: Tool use", `${AN}/docs/build-with-claude/tool-use`],
    ],
  }),
  q({
    slug: "agent-memory-short-term-and-long-term",
    topic: "Agents",
    d: "medium",
    title: "How do agents handle short-term and long-term memory?",
    kw: [
      "agent memory",
      "short-term memory",
      "long-term memory",
      "conversation state",
      "persistent store",
    ],
    intent: "Checks state handling in agents.",
    short:
      "Short-term memory is the state of the current conversation or task: the messages and tool results kept in the context for the ongoing thread. It must be managed because it consumes the context window, so long threads are trimmed or summarised, and a checkpointer can persist the thread so it can resume. Long-term memory stores information across conversations, such as user preferences or facts learned earlier, in an external store; the agent writes to it and retrieves relevant items when needed, often with the same embedding search as RAG. LangChain's documentation separates these two kinds.",
    detail: [
      "Stale or wrong memories can mislead the agent; allow correction.",
      "Scope memory per user to avoid leaks.",
      "Summaries lose detail, so store key facts explicitly.",
    ],
    ex: "Remembering a customer's preferred language between sessions.",
    mistakes: [
      "Storing everything forever.",
      "Mixing memories of different users.",
    ],
    follow: ["Why can't the whole history always stay in context?"],
    points: [
      "Short-term = current thread state",
      "Long-term = persisted across sessions",
      "Trim or summarise long threads",
      "Scope, review and delete memories",
    ],
    notes: ["This conversation versus every conversation."],
    src: [
      [
        "LangChain docs: Short-term memory",
        `${LC}/langchain/short-term-memory`,
      ],
      ["LangChain docs: Long-term memory", `${LC}/langchain/long-term-memory`],
    ],
  }),
  q({
    slug: "agent-guardrails-and-human-in-the-loop",
    topic: "Agents",
    d: "hard",
    title:
      "How do guardrails and human-in-the-loop approval make agents safer?",
    kw: [
      "agent guardrails",
      "human in the loop",
      "approval step",
      "input output filtering",
      "risky actions",
    ],
    intent: "Checks safe design of autonomous features.",
    short:
      "Guardrails are checks around the model: validating and screening inputs (for off-topic or malicious content), filtering outputs (personal data, unsafe content, policy violations), limiting which tools are available and what arguments they accept, and enforcing budgets. They can be deterministic rules or model-based classifiers. Human-in-the-loop adds a pause before consequential actions such as sending a message, spending money or deleting data: the agent proposes, a person approves, edits or rejects, and then the run resumes. LangChain documents both patterns, and OpenAI's safety guidance recommends human review in high-stakes domains. Combine them with least-privilege credentials, audit logs and adversarial testing.",
    detail: [
      "Decide approval rules by risk, so low-risk actions stay fast.",
      "Show the reviewer exactly what will happen.",
      "Guardrails reduce risk but do not guarantee safety.",
    ],
    ex: "An email-sending agent that drafts messages but needs a person's click to send.",
    mistakes: [
      "Letting agents take irreversible actions automatically.",
      "Relying only on prompt instructions for safety.",
    ],
    follow: ["Which actions should require approval?"],
    points: [
      "Screen inputs and outputs",
      "Restrict tools and arguments",
      "Approval before risky actions",
      "Audit logs and least privilege",
    ],
    notes: ["Trust, but verify and approve."],
    src: [
      ["LangChain docs: Guardrails", `${LC}/langchain/guardrails`],
      [
        "LangChain docs: Human-in-the-loop",
        `${LC}/langchain/human-in-the-loop`,
      ],
    ],
  }),
  q({
    slug: "single-agent-versus-multi-agent",
    topic: "Agents",
    d: "hard",
    title: "When is a multi-agent design worth the extra complexity?",
    kw: [
      "multi-agent",
      "subagents",
      "orchestration",
      "context isolation",
      "specialization",
    ],
    intent: "Checks architectural judgement.",
    short:
      "A multi-agent system splits work among several agents, for example a coordinator that delegates to specialist subagents, each with its own prompt and tools. Reasons to do it: the toolset or instructions of one agent have grown too large for reliable tool selection; different tasks need different tools, models or permissions; subtasks can run in parallel; or you want to keep each agent's context small and focused. Costs: more model calls, latency and tokens, harder debugging, and failures that arise from agents miscommunicating. LangChain documents multi-agent patterns, but start with a single agent with good tools and add agents only when evaluation shows a clear gain.",
    detail: [
      "Define clear interfaces for what each subagent receives and returns.",
      "Trace the whole system so you can see where it went wrong.",
      "Often a deterministic workflow is simpler than agent-to-agent conversation.",
    ],
    ex: "A research coordinator delegating web search and data analysis to two specialist agents.",
    mistakes: ["Starting with many agents.", "Vague hand-offs between agents."],
    follow: ["How would you decide whether the split helped?"],
    points: [
      "Coordinator and specialists",
      "Justified by tool overload, parallelism or isolation",
      "More cost and complexity",
      "Start with one agent",
    ],
    notes: ["Split only when it pays."],
    src: [
      ["LangChain docs: Multi-agent", `${LC}/langchain/multi-agent`],
      ["LangChain docs: Agents", `${LC}/langchain/agents`],
    ],
  }),
  q({
    slug: "model-context-protocol-basics",
    topic: "Agents",
    d: "medium",
    title: "What is the Model Context Protocol (MCP)?",
    kw: [
      "mcp",
      "model context protocol",
      "tool servers",
      "standard integration",
      "context sources",
    ],
    intent: "Checks awareness of a common integration standard.",
    short:
      "The Model Context Protocol is an open protocol that standardises how applications provide context and tools to language models. Anthropic's glossary describes it as being like a USB-C port for AI applications: a single way to connect models to different data sources and tools. An MCP server exposes capabilities such as tools, resources and prompts; an MCP client inside the application or agent connects to servers and makes those capabilities available to the model. This avoids writing a custom integration for every pairing of application and service.",
    detail: [
      "Frameworks such as LangChain include adapters to use MCP tools.",
      "Servers can run locally or remotely.",
      "Authentication and permissions for servers are part of the setup.",
    ],
    ex: "Connecting an agent to a server that exposes a company's document search as a tool.",
    mistakes: [
      "Connecting untrusted servers.",
      "Granting a server more access than needed.",
    ],
    follow: ["What does an MCP server expose?"],
    points: [
      "Open protocol for context and tools",
      "Servers expose capabilities, clients connect",
      "Avoids custom per-service integrations",
      "Apply least privilege",
    ],
    notes: ["A standard plug for tools."],
    src: [
      ["Anthropic docs: Glossary (MCP)", GL],
      ["LangChain docs: Model Context Protocol (MCP)", `${LC}/langchain/mcp`],
    ],
  }),
  q({
    slug: "agent-observability-and-tracing",
    topic: "Agents",
    d: "medium",
    title:
      "Why is tracing essential for agents and RAG apps, and what should you capture?",
    kw: ["tracing", "observability", "langsmith", "debugging agents", "logs"],
    intent: "Checks operational practices for multi-step LLM systems.",
    short:
      "LLM applications run many steps (retrieval, model calls, tool calls) and the failure may be in any of them, so you need visibility into each. A trace records a run as a tree of steps with their inputs, outputs, latency, token usage, errors and the model and prompt versions. LangChain's documentation notes that as applications get more complex it becomes crucial to inspect exactly what is going on inside a chain or agent, and supports tracing through its observability tooling. Use traces to debug wrong answers, find slow steps, track cost per feature and turn real failures into evaluation cases.",
    detail: [
      "Correlate traces with user feedback such as thumbs up or down.",
      "Sample traces in high-volume production to control cost.",
      "Keep request ids to share with providers when raising issues.",
    ],
    ex: "Finding from a trace that the agent called the same search tool five times with identical arguments.",
    mistakes: [
      "Logging only the final answer.",
      "Storing sensitive data in traces without controls.",
    ],
    follow: ["What does a trace of an agent run contain?"],
    points: [
      "Trace each step of a run",
      "Capture inputs, outputs, latency, tokens",
      "Use for debugging, cost and evals",
      "Protect sensitive data",
    ],
    notes: ["You can't fix what you can't see."],
    src: [
      ["LangChain docs: Observability", `${LC}/langchain/observability`],
      [
        "LangChain docs: Semantic search tutorial (LangSmith tracing)",
        `${LC}/langchain/knowledge-base`,
      ],
    ],
  }),
  q({
    slug: "context-engineering-for-agents",
    topic: "Agents",
    d: "hard",
    title: "What is context engineering, and why does it matter for agents?",
    kw: [
      "context engineering",
      "context management",
      "tool results trimming",
      "dynamic context",
      "relevant information",
    ],
    intent: "Checks understanding of managing what the model sees.",
    short:
      "Context engineering is deciding what information goes into the model's context at each step: instructions, relevant retrieved facts, recent messages, memory and tool results, while leaving out noise. Agents accumulate context quickly through long tool outputs and many turns, and Anthropic's documentation warns that accuracy and recall can degrade as the token count grows. Good practice: keep tool outputs concise or summarise them, retrieve information when needed instead of preloading everything, compact or drop old turns, give subagents their own focused contexts, and keep stable instructions first for prompt caching.",
    detail: [
      "Measure token usage per step to find the heavy parts.",
      "Pass references (ids) instead of large payloads when possible.",
      "Test how the agent behaves with long histories.",
    ],
    ex: "Trimming a 50-row database result to the relevant 5 rows before returning it to the model.",
    mistakes: [
      "Returning huge raw tool outputs.",
      "Never compacting long conversations.",
    ],
    follow: ["How do you prevent tool outputs from flooding the context?"],
    points: [
      "Right information at the right time",
      "Context grows with tool results",
      "Summarise, trim, retrieve on demand",
      "Keep stable instructions first",
    ],
    notes: ["Curate the context."],
    src: [
      [
        "LangChain docs: Context engineering",
        `${LC}/langchain/context-engineering`,
      ],
      [
        "Anthropic docs: Context windows",
        `${AN}/docs/build-with-claude/context-windows`,
      ],
    ],
  }),
])
