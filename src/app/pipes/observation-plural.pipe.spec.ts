import { ObservationPluralPipe } from "./observation-plural.pipe";

describe('ObservationPluralPipe', () => {
  let pipe: ObservationPluralPipe;

  beforeEach(() => {
    pipe = new ObservationPluralPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns singular noun when count is 0', () => {
    expect(pipe.transform(0)).toBe('observation');
  });

  it('returns singular noun when count is 1', () => {
    expect(pipe.transform(1)).toBe('observation');
  });

  it('returns plural noun when count is > 1', () => {
    expect(pipe.transform(2)).toBe('observations');
  }); 
});
