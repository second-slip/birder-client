import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { photoUrlsArray } from 'src/app/testing/flickr-recordings-api-tests-helper';
import { FlickrComponent } from './flickr.component';
import { FlickrService } from './flickr.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  MatGridListHarness,
  MatGridTileHarness,
} from '@angular/material/grid-list/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('FlickrComponent', () => {
  let component: FlickrComponent;
  let fixture: ComponentFixture<FlickrComponent>;
  let loader: HarnessLoader;

  let fakeFlickrService: jasmine.SpyObj<FlickrService>;

  const setup = async (
    fakePropertyValues?: jasmine.SpyObjPropertyNames<FlickrService>
  ) => {
    fakeFlickrService = jasmine.createSpyObj<FlickrService>(
      'FlickrService',
      {
        getData: undefined,
      },
      {
        images: of(null),
        isError: of(false),
        ...fakePropertyValues,
      }
    );

    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [FlickrComponent],
    })
      .overrideComponent(FlickrComponent, {
        set: {
          providers: [{ provide: FlickrService, useValue: fakeFlickrService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FlickrComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  };

  describe('on initialisation', () => {
    it('should be created', async () => {
      await setup();
      expect(component).toBeTruthy();
    });

    it('should show loading placeholder', async () => {
      await setup();

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeTruthy();
    });

    it('should not show images content', async () => {
      await setup();

      const harnesses = await loader.getAllHarnesses(MatGridListHarness);
      expect(harnesses.length).toBe(0);
    });
  });

  describe('when images are fetched', () => {
    it('calls data fetch', async () => {
      await setup({
        images: of(photoUrlsArray),
      });

      expect(fakeFlickrService.getData).toHaveBeenCalledTimes(1);
    });

    it('shows the images grid', async () => {
      await setup({
        images: of(photoUrlsArray),
      });

      const harnesses = await loader.getAllHarnesses(MatGridListHarness);
      expect(harnesses.length).toBe(1);
    });

    it('should show tiles in grid', async () => {
      await setup({
        images: of(photoUrlsArray),
      });

      const harnesses = await loader.getAllHarnesses(MatGridTileHarness);
      expect(harnesses.length).toBe(photoUrlsArray.length);
    });

    it('does not show the loading section', async () => {
      await setup({
        images: of(photoUrlsArray),
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });
  });

  describe('when fetched zero images', () => {
    it('calls data fetch', async () => {
      await setup({
        images: of([]),
      });

      expect(fakeFlickrService.getData).toHaveBeenCalledTimes(1);
    });

    it('shows no images section', async () => {
      await setup({
        images: of([]),
      });

      const noRecords = fixture.nativeElement as HTMLElement;
      expect(
        noRecords.querySelector('[data-testid="no-images"]')?.textContent
      ).toBeTruthy();
    });

    it('does not show error section', async () => {
      await setup({
        images: of([]),
      });

      const error = fixture.nativeElement as HTMLElement;
      expect(
        error.querySelector('[data-testid="error"]')?.textContent
      ).toBeFalsy();
    });

    it('does not show loading section', async () => {
      await setup({
        images: of([]),
      });

      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });
  });

  describe('on error', () => {
    it('calls data fetch', async () => {
      await setup({
        images: of(null),
        isError: of(true),
      });
      expect(fakeFlickrService.getData).toHaveBeenCalledTimes(1);
    });

    it('does not show no images section', async () => {
      await setup({
        images: of(null),
        isError: of(true),
      });

      const harnesses = await loader.getAllHarnesses(MatGridListHarness);
      expect(harnesses.length).toBe(0);
    });

    it('shows error section', async () => {
      await setup({
        images: of(null),
        isError: of(true),
      });

      const error = fixture.nativeElement as HTMLElement;
      expect(error.querySelector('[data-testid="error"]')).toBeTruthy();
      expect(
        error.querySelector('[data-testid="error"]')?.textContent
      ).toContain('Whoops! There was an error retrieving the data');
    });

    it('does not show loading section', async () => {
      await setup({
        images: of(null),
        isError: of(true),
      });
      const { debugElement } = fixture;
      const loading = debugElement.query(By.css('app-loading'));
      expect(loading).toBeFalsy();
    });

    it('should load button', async () => {
      await setup({
        images: of(null),
        isError: of(true),
      });

      const buttons = await loader.getAllHarnesses(MatButtonHarness);
      expect(buttons.length).toBe(1);
    });

    it('should load button with exact text', async () => {
      await setup({
        images: of(null),
        isError: of(true),
      });

      const buttons = await loader.getAllHarnesses(
        MatButtonHarness.with({ text: 'Try Again' })
      );
      expect(buttons.length).toBe(1);
      expect(await buttons[0].getText()).toBe('Try Again');
    });

    it('Retry button should call data service method', async () => {
      await setup({
        images: of(null),
        isError: of(true),
      });

      expect(fakeFlickrService.getData).toHaveBeenCalledTimes(1);

      const btn = await loader.getHarness(
        MatButtonHarness.with({ text: 'Try Again' })
      );
      await btn.click();

      expect(fakeFlickrService.getData).toHaveBeenCalledTimes(2);
    });
  });
});
