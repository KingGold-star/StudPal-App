// ─── STUDPAL AI RESOURCES SERVICE ──────────────────────────────────────────────
// Manages all AI-generated assets: images, diagrams, documents, cheat sheets, flashcards, and code.

export const INITIAL_AI_RESOURCES = [
  {
    id: 'res-img-1',
    title: 'Photosynthesis Reactions Diagram',
    type: 'image',
    subject: 'Biology',
    subjectColor: '#3B82F6',
    format: 'PNG • 1440x960',
    size: '1.2 MB',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2h ago
    isFavorite: true,
    chatTitle: 'Branco Biology Tutoring',
    prompt: 'Diagram of Electron Transport Chain, Photosystem II, and ATP Synthase in the thylakoid.',
    previewContent: `☀️ Photosystem II (P680) ──> Electron Transport ──> Cytochrome b6f ──> Photosystem I (P700) ──> NADP+ Reductase ──> NADPH
💧 H2O ──> 2H+ + 1/2 O2 + 2e-
⚡ Proton gradient powers ATP Synthase rotor ──> Generates ATP for Calvin Cycle`,
    tags: ['Biology', 'Diagram', 'Active Recall'],
  },
  {
    id: 'res-doc-1',
    title: 'Thermodynamics Master Study Guide',
    type: 'document',
    subject: 'Physics',
    subjectColor: '#10B981',
    format: 'PDF • 6 Pages',
    size: '245 KB',
    createdAt: Date.now() - 1000 * 60 * 60 * 18, // 18h ago
    isFavorite: true,
    chatTitle: 'Thermodynamics Problem Solving',
    prompt: 'Comprehensive study guide on First & Second Laws of Thermodynamics, Carnot efficiency, and PV diagrams.',
    previewContent: `# First Law of Thermodynamics: ΔU = Q - W
- Isobaric Process (Constant P): W = P·ΔV, Q = n·Cp·ΔT
- Isochoric Process (Constant V): W = 0, Q = ΔU = n·Cv·ΔT
- Isothermal Process (Constant T): ΔU = 0, Q = W = n·R·T·ln(Vf/Vi)

## Carnot Efficiency
η_carnot = 1 - (T_cold / T_hot)`,
    tags: ['Physics', 'PDF Guide', 'Thermodynamics'],
  },
  {
    id: 'res-fc-1',
    title: 'Cellular Biology Flashcard Deck',
    type: 'flashcards',
    subject: 'Biology',
    subjectColor: '#3B82F6',
    format: 'Deck • 28 Cards',
    size: '28 SRS Cards',
    createdAt: Date.now() - 1000 * 60 * 60 * 36, // 1.5d ago
    isFavorite: false,
    chatTitle: 'Cell Biology Quick Quiz',
    prompt: 'Active recall SRS flashcard deck on mitochondria, lysosomes, golgi apparatus, and ER.',
    previewContent: `Card 1: What is the primary function of the Mitochondria cristae?
-> Increases surface area for ATP synthase enzymes during oxidative phosphorylation.

Card 2: Function of Rough ER vs Smooth ER?
-> Rough ER has ribosomes for protein synthesis; Smooth ER synthesizes lipids.`,
    tags: ['Flashcards', 'Biology', 'SRS'],
  },
];

class ResourcesService {
  constructor() {
    this.resources = [...INITIAL_AI_RESOURCES];
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.resources);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.resources));
  }

  getAll() {
    return this.resources;
  }

  addResource(newResource) {
    const resource = {
      id: `res-${Date.now()}`,
      createdAt: Date.now(),
      isFavorite: false,
      ...newResource,
    };
    this.resources = [resource, ...this.resources];
    this.notify();
    return resource;
  }

  toggleFavorite(id) {
    this.resources = this.resources.map((res) =>
      res.id === id ? { ...res, isFavorite: !res.isFavorite } : res
    );
    this.notify();
  }

  deleteResource(id) {
    this.resources = this.resources.filter((res) => res.id !== id);
    this.notify();
  }
}

export const resourcesService = new ResourcesService();
