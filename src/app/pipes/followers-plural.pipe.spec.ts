import { FollowersPluralPipe } from './followers-plural.pipe';

describe('FollowersPluralPipe', () => {
  let pipe: FollowersPluralPipe;

  beforeEach(() => {
    pipe = new FollowersPluralPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns singular noun when count is 0', () => {
    expect(pipe.transform(0)).toBe('follower');
  });

  it('returns singular noun when count is 1', () => {
    expect(pipe.transform(1)).toBe('follower');
  });

  it('returns plural noun when count is > 1', () => {
    expect(pipe.transform(2)).toBe('followers');
  }); 
});
