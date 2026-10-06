// ─── STUDPAL USER UPLOADS & STUDY LIBRARY SERVICE ─────────────────────────────
// Manages all files, lecture slides, scanned notes, PDFs, and photos uploaded by the user.

export const INITIAL_USER_UPLOADS = [
  {
    id: 'upl-pdf-1',
    title: 'Physics 101 - Rotational Dynamics.pdf',
    type: 'document',
    format: 'PDF • 18 Pages',
    subject: 'Physics',
    subjectColor: '#10B981',
    size: '4.2 MB',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 3, // 3h ago
    isFavorite: true,
    description: 'Lecture slide deck for midterm exam review.',
    extractedSummary: 'Covers torque calculation (τ = r × F), moment of inertia (I = Σmr²), and rotational kinetic energy.',
    tags: ['Physics', 'Lecture Slides', 'Midterm'],
  },
  {
    id: 'upl-img-1',
    title: 'Organic Chemistry Problem Set 7.jpg',
    type: 'image',
    format: 'Photo • Scan',
    subject: 'Chemistry',
    subjectColor: '#F97316',
    size: '2.8 MB',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 20, // 20h ago
    isFavorite: true,
    description: 'Homework problem set 7 for AI mechanism breakdown.',
    extractedSummary: 'Aldol condensations, Claisen ester additions, and enolate resonance structures.',
    tags: ['Chemistry', 'Homework', 'Mechanisms'],
  },
  {
    id: 'upl-audio-1',
    title: 'Quantum Physics Office Hours Memo.mp3',
    type: 'audio',
    format: 'Audio • 8 min',
    subject: 'Physics',
    subjectColor: '#3B82F6',
    size: '4.8 MB',
    uploadedAt: Date.now() - 1000 * 60 * 60 * 48, // 2d ago
    isFavorite: false,
    description: 'Voice memo on Schrödinger equation probability density.',
    extractedSummary: 'Audio Transcript: Key intuition is that |Ψ(x)|² represents the probability of finding a particle in infinitesimal dx interval.',
    tags: ['Physics', 'Voice Memo', 'Office Hours'],
  },
];

class LibraryService {
  constructor() {
    this.uploads = [...INITIAL_USER_UPLOADS];
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.uploads);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.uploads));
  }

  getAll() {
    return this.uploads;
  }

  uploadFile(fileData) {
    const newUpload = {
      id: `upl-${Date.now()}`,
      uploadedAt: Date.now(),
      isFavorite: false,
      size: '1.5 MB',
      format: fileData.type === 'image' ? 'PNG • 1080p' : 'PDF • Document',
      extractedSummary: 'Processed by StudPal AI OCR engine. Ready for instant explanation and quiz generation.',
      tags: [fileData.subject || 'General', 'User Upload'],
      ...fileData,
    };
    this.uploads = [newUpload, ...this.uploads];
    this.notify();
    return newUpload;
  }

  toggleFavorite(id) {
    this.uploads = this.uploads.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    this.notify();
  }

  deleteFile(id) {
    this.uploads = this.uploads.filter((item) => item.id !== id);
    this.notify();
  }
}

export const libraryService = new LibraryService();
