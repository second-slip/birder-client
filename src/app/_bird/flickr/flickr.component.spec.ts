import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { expectText } from 'src/app/testing/element.spec-helper';
import { photoUrlsArray, species } from 'src/app/testing/flickrApi-tests-helper';
import { FlickrComponent } from './flickr.component';
import { FlickrService } from './flickr.service';

describe('FlickrComponent', () => {
  let component: FlickrComponent;
  let fixture: ComponentFixture<FlickrComponent>;

  let fakeFlickrService: jasmine.SpyObj<FlickrService>;

  const setup = async (
    fakeFlickrReturnValues?: jasmine.SpyObjMethodNames<FlickrService>) => {

    fakeFlickrService = jasmine.createSpyObj<FlickrService>(
      'FlickrService',
      {
        getSearchResults: undefined,
        ...fakeFlickrReturnValues
      }
    );

    await TestBed.configureTestingModule({
      declarations: [
        FlickrComponent
      ],
      providers: [
        { provide: FlickrService, useValue: fakeFlickrService }]
    }).compileComponents();

    fixture = TestBed.createComponent(FlickrComponent);
    component = fixture.componentInstance;
    component.species = species;
    // fixture.detectChanges();
  };

  it('should be created', fakeAsync(async () => {
    await setup(
      {
        getSearchResults: of(photoUrlsArray)
      }
    );
    expect(component).toBeTruthy();
  }));


  it('should render the photos', fakeAsync(async () => {
    await setup(
      {
        getSearchResults: of(photoUrlsArray)
      }
    );

    const carousel = fixture.nativeElement as HTMLElement;
    expect(carousel.querySelector('[data-testid="carousel"]')?.textContent).toBeUndefined();
    const error = fixture.nativeElement as HTMLElement;
    expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

    fixture.detectChanges();

    expect(fakeFlickrService.getSearchResults).toHaveBeenCalledWith(species, undefined, undefined);
    expect(carousel.querySelector('[data-testid="carousel"]')?.textContent).toBeDefined();
    expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
  }));


  it('should react to errors', fakeAsync(async () => {
    await setup(
      {
        getSearchResults: throwError(() => new Error('test'))
      }
    );

    const carousel = fixture.nativeElement as HTMLElement;
    expect(carousel.querySelector('[data-testid="carousel"]')?.textContent).toBeUndefined();

    const error = fixture.nativeElement as HTMLElement;
    expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();

    fixture.detectChanges();

    expect(fakeFlickrService.getSearchResults).toHaveBeenCalledWith(species, undefined, undefined);
    expect(carousel.querySelector('[data-testid="carousel"]')?.textContent).toBeUndefined();
    expectText(fixture, 'error', 'Whoops! An error occurred. Please try again. ');
  }));
});