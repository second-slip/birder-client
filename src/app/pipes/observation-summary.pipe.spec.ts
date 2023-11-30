import { ObservationSummaryPipe } from './observation-summary.pipe';

describe('ObservationSummaryPipe', () => {
  let pipe: ObservationSummaryPipe;

  beforeEach(() => {
    pipe = new ObservationSummaryPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns correct sentance and uses singular noun when observations count is 0', () => {
    let species = 1;
    let observations = 0;
    expect(pipe.transform(species, observations)).toBe(`1 species in 0 observation.`);
  });

  it('returns correct sentance and uses singular noun when observations count is 1', () => {
    let species = 1;
    let observations = 1;
    expect(pipe.transform(species, observations)).toBe(`1 species in 1 observation.`);
  });

  it('returns correct sentance and uses plural noun when observations count is > 1', () => {
    let species = 1;
    let observations = 2;
    expect(pipe.transform(species, observations)).toBe(`1 species in 2 observations.`);
  }); 
});
