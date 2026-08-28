const { saveDb } = require('./db_helper.js');

// 1. COMPUTER SCIENCE ADVANCED
const csEntries = [
  {
    id: 'cs-b-tree-b-plus-tree',
    keywords: ['b tree vs b+ tree', 'database indexing data structure', 'b tree search insert complexity', 'b+ tree range queries'],
    title: 'B-Trees and B+ Trees in Databases',
    category: 'Computer Science',
    answer: 'B-Trees are self-balancing search trees designed for block-based storage with order m where internal nodes store both keys and data records. B+ Trees store all actual record pointers strictly in leaf nodes connected as a doubly linked list, making sequential range scans O(k) and tree traversal faster with higher fanout.',
    highlights: ['Search, insert, delete time complexity: O(log_m N) where m is tree order (fanout)', 'B+ Trees have higher fanout because internal nodes only store keys, fitting more pointers per disk block', 'B+ Trees are standard indexing data structure in relational databases (PostgreSQL, MySQL InnoDB, SQLite)', 'LSM (Log-Structured Merge) Trees are used in write-heavy NoSQL databases (Cassandra, RocksDB)'],
    url: 'https://en.wikipedia.org/wiki/B%2B_tree'
  },
  {
    id: 'cs-cap-theorem',
    keywords: ['cap theorem explained', 'consistency availability partition tolerance', 'pacelc theorem distributed systems'],
    title: 'CAP Theorem in Distributed Systems',
    category: 'Computer Science',
    answer: 'Eric Brewer\'s CAP Theorem proves that any distributed data store can simultaneously provide at most two out of three guarantees: Consistency (every read receives most recent write), Availability (every non-failing node returns non-error response), and Partition Tolerance (system functions despite arbitrary network message loss).',
    highlights: ['Network partitions are inevitable in real distributed systems, so systems must choose between CP or AP', 'CP Systems (Consistent + Partition Tolerant): MongoDB, HBase, Redis, Spanner (sacrifices availability during partition)', 'AP Systems (Available + Partition Tolerant): Cassandra, CouchDB, DynamoDB (sacrifices strong consistency for eventual consistency)', 'PACELC Theorem extends CAP: If Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C)'],
    url: 'https://en.wikipedia.org/wiki/CAP_theorem'
  },
  {
    id: 'cs-tcp-vs-udp',
    keywords: ['tcp vs udp differences', 'transmission control protocol user datagram protocol', 'tcp 3-way handshake syn ack', 'udp connectionless transport'],
    title: 'TCP vs UDP — Transport Layer Protocols',
    category: 'Computer Science',
    answer: 'TCP (Transmission Control Protocol) is connection-oriented, reliable, byte-stream protocol guaranteeing ordered, error-checked packet delivery using 3-way handshake (SYN, SYN-ACK, ACK), flow control (sliding window), and congestion control (AIMD/CUBIC). UDP (User Datagram Protocol) is lightweight, connectionless, unreliable datagram protocol with minimal header overhead (8 bytes vs 20 bytes) optimized for real-time latency (video streaming, gaming, VoIP, DNS).',
    highlights: ['TCP 3-Way Handshake: Client sends SYN → Server replies SYN-ACK → Client sends ACK', 'TCP Teardown: 4-way handshake using FIN and ACK flags with TIME_WAIT state', 'TCP features: Sequence numbers, cumulative ACKs, retransmission timeout (RTO), Congestion Window (cwnd)', 'UDP: No connection setup, no retransmissions, no order guarantees; ideal for DNS, DHCP, WebRTC, QUIC/HTTP/3'],
    url: 'https://en.wikipedia.org/wiki/Transmission_Control_Protocol'
  },
  {
    id: 'cs-http-versions',
    keywords: ['http 1.1 vs http 2 vs http 3', 'http2 multiplexing binary framing', 'http3 quic udp protocol', 'head of line blocking http'],
    title: 'Evolution of HTTP (HTTP/1.1, HTTP/2, HTTP/3)',
    category: 'Computer Science',
    answer: 'HTTP/1.1 introduced persistent connections and chunked transfers but suffered from Head-of-Line (HoL) blocking at application layer. HTTP/2 introduced binary framing, full stream multiplexing over a single TCP connection, header compression (HPACK), and server push. HTTP/3 replaced TCP with QUIC (UDP-based) to completely eliminate transport-layer HoL blocking and enable zero-RTT connection resumption.',
    highlights: ['HTTP/1.1 (1997): Text-based, keep-alive connections, one request-response per socket at a time', 'HTTP/2 (2015): Binary format, multiplexed streams on single TCP socket, HPACK header compression', 'HTTP/3 (2022): Built on QUIC over UDP, built-in TLS 1.3 encryption, connection migration across IP changes', 'Eliminates TCP head-of-line blocking when packets drop on lossy mobile networks'],
    url: 'https://en.wikipedia.org/wiki/HTTP/3'
  },
  {
    id: 'cs-concurrency-primitives',
    keywords: ['mutex vs semaphore difference', 'concurrency primitives deadlock race condition', 'counting vs binary semaphore', 'spinlocks atomic operations'],
    title: 'Concurrency Primitives — Mutex, Semaphore, and Deadlock',
    category: 'Computer Science',
    answer: 'A Mutex (Mutual Exclusion) is a locking mechanism owned by a single thread at a time allowing access to a critical section. A Semaphore is a signaling mechanism with an integer counter (Counting Semaphore) allowing up to N concurrent threads. Deadlocks occur when 4 Coffman conditions hold: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.',
    highlights: ['Mutex has ownership: only the thread that locked the mutex can unlock it', 'Binary Semaphore (0 or 1) can be signaled/unlocked by any thread (signaling primitive)', 'Race condition: Undesired situation where program output depends on non-deterministic thread execution timing', 'Prevention of Deadlock: Impose strict resource hierarchy/ordering to break Circular Wait condition'],
    url: 'https://en.wikipedia.org/wiki/Mutual_exclusion'
  },
  {
    id: 'cs-virtual-memory-paging',
    keywords: ['virtual memory paging segmentation', 'page fault tlb translation lookaside buffer', 'lru page replacement algorithm', 'thrashing os memory'],
    title: 'Virtual Memory, Paging, and Page Faults',
    category: 'Computer Science',
    answer: 'Virtual Memory maps contiguous virtual address spaces to non-contiguous physical RAM frames using Page Tables and the CPU\'s Memory Management Unit (MMU). A Page Fault occurs when a referenced page is not in RAM (Present bit = 0), prompting the OS to fetch it from disk swap. The TLB (Translation Lookaside Buffer) caches virtual-to-physical address mappings for hardware-speed translation.',
    highlights: ['Standard page size: 4 KB (huge pages: 2 MB or 1 GB)', 'Multi-level page tables (e.g. 4-level paging in x86-64) avoid allocating millions of empty page table entries', 'Page replacement algorithms: Optimal (Bélády\'s), LRU (Least Recently Used), FIFO, Clock (Second Chance)', 'Thrashing: High paging activity causing CPU to spend more time swapping pages than executing instructions'],
    url: 'https://en.wikipedia.org/wiki/Virtual_memory'
  }
];

// 2. MATHEMATICS ADVANCED
const mathEntries = [
  {
    id: 'math-vector-calculus-theorems',
    keywords: ['greens theorem stokes theorem divergence theorem', 'vector calculus theorems formulas', 'gradient divergence curl', 'line surface volume integral'],
    title: 'Fundamental Theorems of Vector Calculus',
    category: 'Mathematics',
    answer: 'Vector calculus unites field integrals: (1) Green\'s Theorem: ∮ (L dx + M dy) = ∬ (∂M/∂x - ∂L/∂y) dA, (2) Stokes\' Theorem: ∮ F · dr = ∬ (∇ × F) · dS (relates line integral around boundary to surface integral of curl), (3) Divergence Theorem (Gauss): ∬ F · dS = ∭ (∇ · F) dV (relates flux through closed surface to volume integral of divergence).',
    highlights: ['Gradient (∇f): Vector of partial derivatives pointing in direction of maximum rate of increase', 'Divergence (∇ · F): Scalar measure of field source/sink density (zero for incompressible/solenoidal fields)', 'Curl (∇ × F): Vector measure of field rotation (zero for conservative/irrotational fields where F = ∇f)', 'Forms mathematical backbone of Maxwell\'s equations and fluid mechanics (Navier-Stokes)'],
    url: 'https://en.wikipedia.org/wiki/Stokes%27_theorem'
  },
  {
    id: 'math-fourier-series-transform',
    keywords: ['fourier series formula', 'fourier transform equation', 'frequency domain time domain', 'fast fourier transform fft complexity'],
    title: 'Fourier Series and Continuous Fourier Transform',
    category: 'Mathematics',
    answer: 'Fourier Series decomposes any periodic function f(t) of period T into an infinite sum of sines and cosines: f(t) = a₀/2 + Σ [a_n cos(nω₀t) + b_n sin(nω₀t)]. The continuous Fourier Transform converts non-periodic signals from time to frequency domain: F(ω) = ∫ f(t) e^(-iωt) dt. Fast Fourier Transform (FFT, Cooley-Tukey) computes Discrete FT in O(N log N) instead of O(N²).',
    highlights: ['Orthogonality of sinusoidal basis functions enables exact coefficient extraction', 'Inverse Fourier Transform: f(t) = (1/2π) ∫ F(ω) e^(iωt) dω', 'Parseval\'s Theorem: Total energy in time domain equals total energy in frequency domain: ∫ |f(t)|² dt = (1/2π) ∫ |F(ω)|² dω', 'Ubiquitous in signal processing, image compression (JPEG DCT), quantum wave mechanics, and audio synthesis'],
    url: 'https://en.wikipedia.org/wiki/Fourier_transform'
  },
  {
    id: 'math-linear-algebra-eigenvalues',
    keywords: ['eigenvalues and eigenvectors formula', 'characteristic equation det A - lambda I = 0', 'diagonalization matrix', 'spectral theorem linear algebra'],
    title: 'Eigenvalues, Eigenvectors, and Matrix Diagonalization',
    category: 'Mathematics',
    answer: 'For a square matrix A, a non-zero vector v is an eigenvector and λ is its corresponding eigenvalue if Av = λv. Eigenvalues are the roots of the characteristic polynomial det(A - λI) = 0. A matrix is diagonalizable as A = PDP⁻¹ where D is the diagonal matrix of eigenvalues and P is the matrix of eigenvectors.',
    highlights: ['Trace of A equals sum of all eigenvalues: Tr(A) = Σ λ_i', 'Determinant of A equals product of all eigenvalues: det(A) = Π λ_i', 'Symmetric real matrices (A = Aᵀ) always have real eigenvalues and orthogonal eigenvectors (Spectral Theorem)', 'Foundational in Principal Component Analysis (PCA), Google PageRank, Quantum state operators, and vibration modes'],
    url: 'https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors'
  }
];

// 3. ADVANCED CHEMISTRY
const chemEntries = [
  {
    id: 'chem-periodic-table-trends',
    keywords: ['periodic table trends atomic radius ionization energy', 'electronegativity electron affinity trend', 'pauling electronegativity scale', 'lanthanide contraction'],
    title: 'Periodic Table Trends — Radius, IE, and Electronegativity',
    category: 'Chemistry',
    answer: 'Across a Period (left to right): Atomic radius decreases (effective nuclear charge Z_eff increases), Ionization Energy increases, Electronegativity increases (Fluorine is most electronegative at 4.0 on Pauling scale). Down a Group (top to bottom): Atomic radius increases (new shells added), Ionization Energy decreases, Electronegativity decreases (Francium/Cesium are least electronegative).',
    highlights: ['Most electronegative element: Fluorine (F, 4.0) > Oxygen (O, 3.5) > Nitrogen (N, 3.0) ≈ Chlorine (Cl, 3.0)', 'Highest electron gain enthalpy (electron affinity): Chlorine (Cl, -349 kJ/mol, higher than F due to less inter-electronic repulsion)', 'Highest first ionization energy: Helium (He, 2372 kJ/mol)', 'Lanthanide Contraction: Steady decrease in ionic radii across lanthanides due to poor shielding by 4f electrons, making 4d and 5d transition series (e.g. Zr/Hf) nearly identical in size'],
    url: 'https://en.wikipedia.org/wiki/Periodic_trends'
  },
  {
    id: 'chem-hybridization-vsepr',
    keywords: ['vsepr theory molecular geometry', 'hybridization sp sp2 sp3 sp3d sp3d2', 'bond angles shapes molecules', 'methane water ammonia shape'],
    title: 'VSEPR Theory and Orbital Hybridization',
    category: 'Chemistry',
    answer: 'VSEPR (Valence Shell Electron Pair Repulsion) theory predicts 3D molecular geometry based on minimizing electrostatic repulsion between electron pairs: Lone Pair-Lone Pair > Lone Pair-Bond Pair > Bond Pair-Bond Pair. Hybridization combines atomic orbitals into equivalent hybrid orbitals: sp (linear, 180°), sp² (trigonal planar, 120°), sp³ (tetrahedral, 109.5°), sp³d (trigonal bipyramidal), sp³d² (octahedral, 90°).',
    highlights: ['CH₄ (Methane): sp³ hybridized, 0 lone pairs → Perfect Tetrahedral, 109.5° bond angle', 'NH₃ (Ammonia): sp³ hybridized, 1 lone pair → Trigonal Pyramidal, 107° bond angle (repulsion compresses angle)', 'H₂O (Water): sp³ hybridized, 2 lone pairs → Bent / V-shaped, 104.5° bond angle', 'PCl₅: sp³d hybridized → Trigonal Bipyramidal with axial bonds longer than equatorial bonds; SF₆: sp³d² → Octahedral (all bonds 90°)'],
    url: 'https://en.wikipedia.org/wiki/VSEPR_theory'
  }
];

// 4. AI & TECHNOLOGY
const aiEntries = [
  {
    id: 'ai-transformer-architecture',
    keywords: ['transformer architecture attention is all you need', 'multi head self attention mechanism', 'transformer encoder decoder', 'vaswani 2017 transformer'],
    title: 'Transformer Neural Network Architecture (2017)',
    category: 'Artificial Intelligence',
    answer: 'The Transformer architecture (introduced by Vaswani et al. in "Attention Is All You Need", 2017) discarded recurrent and convolutional networks in favor of Multi-Head Self-Attention. Attention formula: Attention(Q,K,V) = softmax((Q K^T) / √d_k) V. It forms the computational foundation of modern LLMs including GPT, Claude, Gemini, BERT, and Llama.',
    highlights: ['Self-Attention scales computation across all tokens simultaneously in O(N²) sequence complexity via parallel matrix multiplications', 'Positional Encoding (sinusoidal or RoPE - Rotary Position Embedding) injects sequence order information', 'Encoder-Decoder (original Vaswani, T5); Decoder-Only (GPT-4, Claude, Gemini, Llama); Encoder-Only (BERT)', 'Multi-Head Attention allows model to jointly attend to information from different representation subspaces at different positions'],
    url: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)'
  },
  {
    id: 'ai-llm-fine-tuning-lora-rlhf',
    keywords: ['lora low rank adaptation llm', 'rlhf reinforcement learning from human feedback', 'dpo direct preference optimization', 'quantization gguf awq'],
    title: 'LLM Fine-Tuning — LoRA, QLoRA, RLHF, and DPO',
    category: 'Artificial Intelligence',
    answer: 'Modern LLM training consists of Pre-training (predicting next token on trillions of words), Supervised Fine-Tuning (SFT on instruction pairs), and Alignment via RLHF (Reinforcement Learning from Human Feedback using PPO) or DPO (Direct Preference Optimization). LoRA (Low-Rank Adaptation) freezes base weights W₀ and trains low-rank decomposition matrices ΔW = B · A (rank r ≪ d), reducing trainable parameters by 99%+. QLoRA quantizes base model to 4-bit NormalFloat (NF4).',
    highlights: ['Pre-training: Self-supervised causal language modeling minimizing cross-entropy loss', 'LoRA: W = W₀ + (α/r) · BA where B ∈ R^(d×r) and A ∈ R^(r×k) — requires <1% GPU VRAM for fine-tuning', 'RLHF: Trains reward model on human comparisons, then uses PPO (Proximal Policy Optimization) with KL-divergence penalty', 'DPO: Directly optimizes policy on preference pairs (chosen vs rejected) using closed-form implicit reward, eliminating separate reward model'],
    url: 'https://en.wikipedia.org/wiki/Large_language_model'
  }
];

saveDb('computer_science_advanced.json', csEntries);
saveDb('mathematics_advanced.json', mathEntries);
saveDb('chemistry_advanced.json', chemEntries);
saveDb('ai.json', aiEntries);