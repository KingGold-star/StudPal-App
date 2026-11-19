// src/services/ai/aiRequestTelemetry.js

/**
 * StudPal AI Request Telemetry & Lifecycle Instrumentation
 * Tracks every stage of an AI request from user submit to final render.
 * Records request IDs, timestamps, intent decisions, tool calls, and latencies.
 */

export const TELEMETRY_EVENTS = {
  USER_MESSAGE_SUBMITTED: 'USER_MESSAGE_SUBMITTED',
  INTENT_ROUTING_COMPLETED: 'INTENT_ROUTING_COMPLETED',
  BACKEND_REQUEST_DISPATCHED: 'BACKEND_REQUEST_DISPATCHED',
  BACKEND_REQUEST_RECEIVED: 'BACKEND_REQUEST_RECEIVED',
  MODEL_REQUEST_INITIATED: 'MODEL_REQUEST_INITIATED',
  MODEL_FIRST_CHUNK_RECEIVED: 'MODEL_FIRST_CHUNK_RECEIVED',
  TOOL_INVOCATION: 'TOOL_INVOCATION',
  TOOL_RESULT: 'TOOL_RESULT',
  ASSISTANT_RESPONSE_GENERATED: 'ASSISTANT_RESPONSE_GENERATED',
  RESPONSE_RENDERED: 'RESPONSE_RENDERED',
  REQUEST_COMPLETED: 'REQUEST_COMPLETED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  REQUEST_CANCELLED: 'REQUEST_CANCELLED',
};

class AiRequestTelemetry {
  constructor() {
    this.traces = new Map();
    this.maxTraces = 50;
  }

  /**
   * Start a new request trace
   */
  startTrace(requestId, initialData = {}) {
    const trace = {
      requestId,
      startTime: Date.now(),
      promptPreview: (initialData.prompt || '').slice(0, 60),
      intent: null,
      toolsUsed: [],
      toolCount: 0,
      modelName: null,
      firstTokenLatencyMs: null,
      totalDurationMs: null,
      status: 'IN_FLIGHT',
      events: [],
      error: null,
    };

    this.traces.set(requestId, trace);
    this.logEvent(requestId, TELEMETRY_EVENTS.USER_MESSAGE_SUBMITTED, initialData);

    // Prune old traces
    if (this.traces.size > this.maxTraces) {
      const oldestKey = this.traces.keys().next().value;
      this.traces.delete(oldestKey);
    }

    return trace;
  }

  /**
   * Log an event in the request lifecycle
   */
  logEvent(requestId, eventName, eventData = {}) {
    const trace = this.traces.get(requestId);
    const now = Date.now();
    const elapsedMs = trace ? now - trace.startTime : 0;

    const eventEntry = {
      timestamp: new Date(now).toISOString(),
      elapsedMs,
      event: eventName,
      data: eventData,
    };

    if (trace) {
      trace.events.push(eventEntry);

      if (eventData.intent) trace.intent = eventData.intent;
      if (eventData.modelName) trace.modelName = eventData.modelName;

      if (eventName === TELEMETRY_EVENTS.TOOL_INVOCATION) {
        trace.toolCount++;
        if (eventData.toolName && !trace.toolsUsed.includes(eventData.toolName)) {
          trace.toolsUsed.push(eventData.toolName);
        }
      }

      if (eventName === TELEMETRY_EVENTS.MODEL_FIRST_CHUNK_RECEIVED && trace.firstTokenLatencyMs === null) {
        trace.firstTokenLatencyMs = elapsedMs;
      }

      if (eventName === TELEMETRY_EVENTS.REQUEST_COMPLETED) {
        trace.status = 'COMPLETED';
        trace.totalDurationMs = elapsedMs;
      } else if (eventName === TELEMETRY_EVENTS.REQUEST_FAILED) {
        trace.status = 'FAILED';
        trace.totalDurationMs = elapsedMs;
        trace.error = eventData.error || 'Unknown error';
      } else if (eventName === TELEMETRY_EVENTS.REQUEST_CANCELLED) {
        trace.status = 'CANCELLED';
        trace.totalDurationMs = elapsedMs;
      }
    }

    // Output clean diagnostic log (safe: no API keys or PII)
    const summary = `[AI Telemetry][${requestId}][+${elapsedMs}ms] ${eventName}${
      eventData.intent ? ` | intent=${eventData.intent}` : ''
    }${eventData.toolName ? ` | tool=${eventData.toolName}` : ''}${
      eventData.toolsUsed ? ` | tools=[${eventData.toolsUsed.join(',')}]` : ''
    }${eventData.error ? ` | error=${eventData.error}` : ''}`;

    console.log(summary);
    return eventEntry;
  }

  /**
   * Retrieve summary for a specific request
   */
  getTrace(requestId) {
    return this.traces.get(requestId) || null;
  }

  /**
   * Retrieve the most recent trace
   */
  getLatestTrace() {
    const keys = Array.from(this.traces.keys());
    if (keys.length === 0) return null;
    return this.traces.get(keys[keys.length - 1]);
  }
}

export const aiTelemetry = new AiRequestTelemetry();
export default aiTelemetry;
