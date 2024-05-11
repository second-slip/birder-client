import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollComponent } from './infinite-scroll.component';
import { ElementRef } from '@angular/core';

export class MockElementRef extends ElementRef { nativeElement = {}; }

describe('InfiniteScrollComponent', () => {
    let component: InfiniteScrollComponent;
    let fixture: ComponentFixture<InfiniteScrollComponent>;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InfiniteScrollComponent],
            providers: [
                //more providers
                { provide: ElementRef, useClass: MockElementRef }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InfiniteScrollComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
