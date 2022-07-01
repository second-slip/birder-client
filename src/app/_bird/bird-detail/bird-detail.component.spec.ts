import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { BirdDetailComponent } from './bird-detail.component';
import { BirdDetailService } from './bird-detail.service';

describe('BirdDetailComponent', () => {
    let component: BirdDetailComponent;
    let fixture: ComponentFixture<BirdDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbNavModule],
            declarations: [BirdDetailComponent],
            providers: [BirdDetailService],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BirdDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
