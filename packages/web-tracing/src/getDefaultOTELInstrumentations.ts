import type { InstrumentationOption } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';

import type { MatchUrlDefinitions } from './types';

type DefaultInstrumentationsOptions = {
  ignoreUrls?: MatchUrlDefinitions;
  propagateTraceHeaderCorsUrls?: MatchUrlDefinitions;
};

const initialIntrumentationsOptions = {
  ignoreUrls: [],
  propagateTraceHeaderCorsUrls: [],
};

export function getDefaultOTELInstrumentations(
  options: DefaultInstrumentationsOptions = initialIntrumentationsOptions
): InstrumentationOption[] {
  return [new FetchInstrumentation(options), new XMLHttpRequestInstrumentation(options)];
}
