// src/services/ai/brancoBrainService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { networkService } from '../networkService';
import { authService } from '../supabase/authService';

const BRAIN_STORAGE_KEY = '@branco_brain_memories_v1';
const MAX_LOCAL_MEMORIES = 500;

class BrancoBrainService {
  constructor() {
    this.memories = [];
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Initialize Branco's Brain by loading local memory cache and syncing with stored chats
   */
  async init() {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        let rawData = null;
        if (typeof window !== 'undefined' && window.localStorage) {
          rawData = window.localStorage.getItem(BRAIN_STORAGE_KEY);
        }
        if (!rawData) {
          rawData = await AsyncStorage.getItem(BRAIN_STORAGE_KEY);
        }

        if (rawData) {
          const parsed = JSON.parse(rawData);
          if (Array.isArray(parsed)) {
            this.memories = parsed;
          }
        }
      } catch (err) {
        console.warn('[BrancoBrainService] Error loading brain cache:', err);
      } finally {
        this.isInitialized = true;
      }
    })();

    return this.initPromise;
  }

  /**
   * Persist memories locally and optionally sync to Supabase
   */
  async _persist() {
    try {
      const dataStr = JSON.stringify(this.memories.slice(0, MAX_LOCAL_MEMORIES));
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(BRAIN_STORAGE_KEY, dataStr);
      }
      await AsyncStorage.setItem(BRAIN_STORAGE_KEY, dataStr);
    } catch (e) {
      console.warn('[BrancoBrainService] Error saving local memory:', e);
    }
  }

  /**
   * Index full conversations list into Branco's Brain (e.g. on app startup)
   */
  async indexAllConversations(conversations = []) {
    await this.init();
    if (!Array.isArray(conversations)) return;

    let addedCount = 0;
    for (const conv of conversations) {
      if (!conv || !Array.isArray(conv.messages) || conv.messages.length === 0) continue;

      const msgs = conv.messages;
      for (let i = 0; i < msgs.length; i++) {
        const msg = msgs[i];
        if (msg.sender === 'user' && msgs[i + 1] && msgs[i + 1].sender === 'ai') {
          const aiMsg = msgs[i + 1];
          const existing = this.memories.find(m => m.userQuery === msg.text);
          if (!existing) {
            const memoryItem = this._createMemoryItem({
              conversationId: conv.id,
              conversationTitle: conv.title,
              userText: msg.text,
              aiText: aiMsg.text,
              mode: msg.mode || aiMsg.mode || 'general',
              persona: aiMsg.persona || 'all_round',
              timestamp: msg.timestamp || conv.createdAt || Date.now(),
            });
            this.memories.unshift(memoryItem);
            addedCount++;
          }
        }
      }
    }

    if (addedCount > 0) {
      this.memories = this._deduplicate(this.memories);
      await this._persist();
    }
  }

  /**
   * Record a single conversation turn into Branco's Brain
   */
  async recordTurn({
    conversationId = 'default',
    conversationTitle = 'Study Discussion',
    userText = '',
    aiText = '',
    mode = 'general',
    persona = 'all_round',
    type = 'text',
  }) {
    if (!userText || !aiText) return;
    await this.init();

    const memoryItem = this._createMemoryItem({
      conversationId,
      conversationTitle,
      userText,
      aiText,
      mode,
      persona,
      type,
      timestamp: Date.now(),
    });

    // Prepend to top of memory
    this.memories.unshift(memoryItem);
    this.memories = this._deduplicate(this.memories).slice(0, MAX_LOCAL_MEMORIES);
    await this._persist();

    // Async sync to Supabase if logged in
    this._syncMemoryToCloud(memoryItem).catch(() => {});
  }

  /**
   * Synchronously query Branco's Brain from in-memory cache (zero async delay)
   */
  queryBrainSync(userQuery, { currentConversationId = null, maxMemories = 4 } = {}) {
    if (!userQuery || typeof userQuery !== 'string' || !this.memories || this.memories.length === 0) {
      return { hasRelevantContext: false, brainContext: '', memories: [] };
    }

    const queryLower = userQuery.toLowerCase().trim();

    // Check for explicit memory trigger keywords
    const isExplicitRecall =
      queryLower.includes('remember') ||
      queryLower.includes('recall') ||
      queryLower.includes('last time') ||
      queryLower.includes('earlier') ||
      queryLower.includes('previous') ||
      queryLower.includes('before') ||
      queryLower.includes('yesterday') ||
      queryLower.includes('we talked about') ||
      queryLower.includes('we discussed') ||
      queryLower.includes('what did i') ||
      queryLower.includes('what did we') ||
      queryLower.includes('what was my') ||
      queryLower.includes('what was the') ||
      queryLower.includes('what were we') ||
      queryLower.includes('what did you say') ||
      queryLower.includes('repeat that') ||
      queryLower.includes('what have we') ||
      queryLower.includes('so far') ||
      queryLower.includes('summarize our') ||
      queryLower.includes('my topic') ||
      queryLower.includes('my question') ||
      queryLower.includes('continue') ||
      queryLower.includes('last question') ||
      queryLower.includes('past chat') ||
      queryLower.includes('do you know me');

    // Extract significant query keywords
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'can', 'you', 'me', 'i', 'my',
      'how', 'what', 'why', 'who', 'when', 'where', 'do', 'does', 'did', 'to', 'in', 'for', 'of',
      'about', 'like', 'with', 'by', 'from', 'this', 'that', 'these', 'those', 'it', 'its', 'tell',
      'explain', 'give', 'help', 'branco', 'please', 'hello', 'hey'
    ]);

    const queryTokens = queryLower
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2 && !stopWords.has(t));

    // Score all memories
    const scored = this.memories.map(mem => {
      let score = 0;
      const memText = (mem.topic + ' ' + mem.summary + ' ' + (mem.keyConcepts || []).join(' ') + ' ' + mem.userQuery).toLowerCase();

      // Token matches
      for (const token of queryTokens) {
        if (memText.includes(token)) {
          score += 2;
          if (mem.topic.toLowerCase().includes(token)) score += 3;
          if (mem.keyConcepts && mem.keyConcepts.some(c => c.toLowerCase().includes(token))) score += 4;
        }
      }

      // If explicit recall is triggered, give boost to recent memories or matching topics
      if (isExplicitRecall) {
        score += 2;
        // Prioritize previous conversations
        if (currentConversationId && mem.conversationId !== currentConversationId) {
          score += 2;
        }
      }

      // Freshness bonus (within 7 days)
      const ageHours = (Date.now() - (mem.timestamp || 0)) / (1000 * 60 * 60);
      if (ageHours < 24) score += 2.0;
      else if (ageHours < 72) score += 1.0;

      return { mem, score };
    });

    const relevant = scored
      .filter(s => (isExplicitRecall ? s.score >= 0 : s.score >= 2))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(maxMemories, isExplicitRecall ? 6 : 4))
      .map(s => s.mem);

    if (relevant.length === 0 && isExplicitRecall && this.memories.length > 0) {
      // Fallback for explicit recall: provide the 4 most recent conversation memories
      relevant.push(...this.memories.slice(0, 4));
    }

    if (relevant.length === 0) {
      return { hasRelevantContext: false, brainContext: '', memories: [] };
    }

    // Format into natural brain recall context
    let formattedContext = `[BRANCO'S BRAIN RECALL: ${relevant.length} relevant past discussions found]\n`;
    relevant.forEach((m, idx) => {
      const timeStr = this._formatRelativeTime(m.timestamp);
      formattedContext += `${idx + 1}. [${timeStr}] Topic: ${m.topic || 'General Study'}\n`;
      formattedContext += `   - Student asked: "${m.userQuery.slice(0, 150)}"\n`;
      formattedContext += `   - Key takeaway: ${m.summary}\n`;
      if (m.keyConcepts && m.keyConcepts.length > 0) {
        formattedContext += `   - Concepts: ${m.keyConcepts.join(', ')}\n`;
      }
    });

    return {
      hasRelevantContext: true,
      brainContext: formattedContext.trim(),
      memories: relevant,
    };
  }

  /**
   * Query Branco's Brain for memories relevant to the incoming user prompt
   */
  async queryBrain(userQuery, options = {}) {
    await this.init();
    return this.queryBrainSync(userQuery, options);
  }

  /**
   * Get stats on Branco's brain memories
   */
  getBrainStats() {
    return {
      totalMemories: this.memories.length,
      recentTopics: [...new Set(this.memories.map(m => m.topic).filter(Boolean))].slice(0, 8),
      lastUpdated: this.memories[0]?.timestamp || null,
    };
  }

  /**
   * Get list of most recent memories synchronously from in-memory cache
   */
  getRecentMemories(count = 6) {
    return (this.memories || []).slice(0, count);
  }

  /**
   * Clear Branco's brain (privacy reset)
   */
  async clearBrain() {
    this.memories = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(BRAIN_STORAGE_KEY);
    }
    await AsyncStorage.removeItem(BRAIN_STORAGE_KEY);
  }

  // ── Internal Helpers ─────────────────────────────────────────────────────────

  _createMemoryItem({
    conversationId,
    conversationTitle,
    userText,
    aiText,
    mode,
    persona,
    type = 'text',
    timestamp,
  }) {
    const cleanAiText = (aiText || '')
      .replace(/```(?:xml|svg|html)?\s*[\s\S]*?```/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[*#_`$]/g, '')
      .trim();

    const topic = this._extractTopic(userText, conversationTitle);
    const keyConcepts = this._extractKeyConcepts(userText + ' ' + cleanAiText);
    const summary = this._generateSummary(cleanAiText);

    return {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      conversationId,
      conversationTitle,
      userQuery: userText.trim(),
      aiSnippet: cleanAiText.slice(0, 250).trim(),
      summary,
      topic,
      keyConcepts,
      mode,
      persona,
      type,
      timestamp: typeof timestamp === 'number' ? timestamp : Date.now(),
    };
  }

  _extractTopic(userText, conversationTitle) {
    if (conversationTitle && conversationTitle !== 'New Chat' && conversationTitle !== 'Study Discussion') {
      return conversationTitle;
    }

    const t = userText.toLowerCase();
    if (t.includes('newton') || t.includes('force') || t.includes('momentum') || t.includes('gravity') || t.includes('physics')) {
      return "Newton's Laws & Mechanics";
    }
    if (t.includes('hash') || t.includes('algorithm') || t.includes('tree') || t.includes('complexity') || t.includes('data structure')) {
      return 'Data Structures & Algorithms';
    }
    if (t.includes('integral') || t.includes('derivative') || t.includes('calculus') || t.includes('liate')) {
      return 'Calculus & Integration';
    }
    if (t.includes('dna') || t.includes('cell') || t.includes('biology') || t.includes('mitosis') || t.includes('protein')) {
      return 'Cell Biology & Genetics';
    }
    if (t.includes('chemistry') || t.includes('reaction') || t.includes('organic') || t.includes('acid') || t.includes('base')) {
      return 'Chemistry';
    }
    if (t.includes('history') || t.includes('war') || t.includes('revolution') || t.includes('empire')) {
      return 'History';
    }
    if (t.includes('economy') || t.includes('market') || t.includes('inflation') || t.includes('demand')) {
      return 'Economics';
    }

    // Fallback: extract first capitalized phrases or first few words
    const words = userText.trim().split(/\s+/).slice(0, 5).join(' ');
    return words.length > 3 ? words : 'Academic Topic';
  }

  _extractKeyConcepts(text) {
    const matches = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
    if (!matches) return [];
    const ignored = new Set(['The', 'This', 'Here', 'Question', 'Option', 'Answer', 'Branco', 'Hello', 'Please', 'Score', 'When']);
    return [...new Set(matches.filter(m => !ignored.has(m) && m.length > 3))].slice(0, 4);
  }

  _generateSummary(aiText) {
    // Take the first 1-2 clean sentences from AI response
    const clean = aiText.replace(/[*#_`$]/g, '').trim();
    const sentences = clean.split(/(?<=[.?!])\s+/);
    return sentences.slice(0, 2).join(' ').slice(0, 200);
  }

  _formatRelativeTime(timestamp) {
    if (!timestamp) return 'earlier';
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 5) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  _deduplicate(memories) {
    const seen = new Set();
    return memories.filter(m => {
      const key = `${m.userQuery}_${m.topic}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async _syncMemoryToCloud(memoryItem) {
    if (!isSupabaseConfigured() || !networkService.isOnline()) return;
    try {
      const user = await authService.getCurrentUser();
      if (!user?.id) return;

      await supabase.from('branco_brain_memories').upsert({
        id: memoryItem.id,
        user_id: user.id,
        conversation_id: memoryItem.conversationId,
        topic: memoryItem.topic,
        summary: memoryItem.summary,
        key_concepts: memoryItem.keyConcepts || [],
        user_query: memoryItem.userQuery,
        ai_response_snippet: memoryItem.aiSnippet,
        mode: memoryItem.mode || 'general',
        timestamp: new Date(memoryItem.timestamp).toISOString(),
        metadata: {
          persona: memoryItem.persona,
          type: memoryItem.type,
        },
      });
    } catch (err) {
      // Non-blocking background sync
    }
  }
}

export const brancoBrainService = new BrancoBrainService();
export default brancoBrainService;
