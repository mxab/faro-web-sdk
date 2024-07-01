import { allLogLevels, BaseInstrumentation, LogLevel, VERSION } from '@grafana/faro-core';

import type { ConsoleInstrumentationOptions } from './types';

export class ConsoleInstrumentation extends BaseInstrumentation {
  readonly name = '@grafana/faro-web-sdk:instrumentation-console';
  readonly version = VERSION;

  static defaultDisabledLevels: LogLevel[] = [LogLevel.DEBUG, LogLevel.TRACE, LogLevel.LOG];

  constructor(private options: ConsoleInstrumentationOptions = {}) {
    super();
  }

  initialize() {
    this.logDebug('Initializing\n', this.options);

    allLogLevels
      .filter((level) => !(this.options.disabledLevels ?? ConsoleInstrumentation.defaultDisabledLevels).includes(level))
      .forEach((level) => {
        /* eslint-disable-next-line no-console */
        console[level] = (...args) => {
          try {
            this.api.pushLog(args, { level, spanContext: this.currentSpanContext() });
          } catch (err) {
            this.logError(err);
          } finally {
            this.unpatchedConsole[level](...args);
          }
        };
      });
  }
  private currentSpanContext(): { traceId: string; spanId: string } | undefined {
    const traceContext = this.api.getTraceContext();
    return traceContext ? { traceId: traceContext.trace_id, spanId: traceContext.span_id } : undefined;
  }
}
