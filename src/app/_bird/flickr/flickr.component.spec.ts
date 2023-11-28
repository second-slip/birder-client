import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { expectText } from 'src/app/testing/element.spec-helper';
import { photoUrlsArray } from 'src/app/testing/flickr-recordings-api-tests-helper';
import { FlickrComponent } from './flickr.component';
import { FlickrService } from './flickr.service';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';

describe('FlickrComponent', () => {
  let component: FlickrComponent;
  let fixture: ComponentFixture<FlickrComponent>;

  let fakeFlickrService: jasmine.SpyObj<FlickrService>;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<FlickrService>) => {

    fakeFlickrService = jasmine.createSpyObj<FlickrService>(
      'FlickrService',
      {
        getData: undefined
      },
      {
        images: of(photoUrlsArray),
        isError: of(false),
        ...fakePropertyValues
      }
    );

    await TestBed.configureTestingModule({
      imports: [FlickrComponent, NgbCarousel, NgbSlide]
    })
      .overrideComponent(FlickrComponent,
        {
          set: {
            providers: [{ provide: FlickrService, useValue: fakeFlickrService }]
          }
        })
      .compileComponents();

    fixture = TestBed.createComponent(FlickrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should be created', fakeAsync(async () => {
    await setup(
      {
        images: of(null),
        isError: of(false),
      }
    );

    expect(component).toBeTruthy();
    const { debugElement } = fixture;
    const loading = debugElement.query(By.css('app-loading'));
    expect(loading).toBeTruthy();
  }));

  describe('when images are fetched', () => {
    it('calls data fetch', fakeAsync(async () => {
      await setup();
      expect(fakeFlickrService.getData).toHaveBeenCalledTimes(1);
      discardPeriodicTasks(); 
    }));

    it('shows the images', fakeAsync(async () => {
      await setup();
      const carousel = fixture.nativeElement as HTMLElement;
      expect(carousel.querySelector('[data-testid="images"]')?.textContent).toBeDefined();
      discardPeriodicTasks(); 
    }));

    it('does not show error section', fakeAsync(async () => {
      await setup();
      const w = fixture.nativeElement as HTMLElement;
      expect(w.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
      discardPeriodicTasks(); 
    }));

    it('does not show the loading section', fakeAsync(async () => {
      await setup();

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
      discardPeriodicTasks(); 
    }));
  });


  describe('when fetched zero images', () => {
    it('calls data fetch', fakeAsync(async () => {
      await setup({
        images: of([])
      });
      expect(fakeFlickrService.getData).toHaveBeenCalledTimes(1);
    }));

    it('shows no images section', fakeAsync(async () => {
      await setup({
        images: of([])
      });
      const noRecords = fixture.nativeElement as HTMLElement;
      expect(noRecords.querySelector('[data-testid="no-images"]')?.textContent).toBeDefined();
    }));

    it('does not show error section', fakeAsync(async () => {
      await setup({
        images: of([])
      });
      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeUndefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup({
        images: of([])
      });
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));
  });

  describe('on error', () => {
    it('calls data fetch', fakeAsync(async () => {
      await setup({
        images: of(null),
        isError: of(true)
      });
      expect(fakeFlickrService.getData).toHaveBeenCalledTimes(1);
    }));

    it('does not show no images section', fakeAsync(async () => {
      await setup({
        images: of(null),
        isError: of(true)
      });
      const records = fixture.nativeElement as HTMLElement;
      expect(records.querySelector('[data-testid="no-images"]')?.textContent).toBeUndefined();
      const noRecords = fixture.nativeElement as HTMLElement;
      expect(noRecords.querySelector('[data-testid="no-images"]')?.textContent).toBeUndefined();
    }));

    it('shows error section', fakeAsync(async () => {
      await setup({
        images: of(null),
        isError: of(true)
      });
      expectText(fixture, 'error', 'Whoops! An error occurred. Please try again. ');
      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')?.textContent).toBeDefined();
    }));

    it('does not show loading section', fakeAsync(async () => {
      await setup({
        images: of(null),
        isError: of(true)
      });
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeNull();
    }));
  });
});