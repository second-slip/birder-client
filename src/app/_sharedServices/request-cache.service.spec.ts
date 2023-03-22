import { TestBed } from '@angular/core/testing';

import { RequestCache, RequestCacheWithMap } from './request-cache.service';



// describe('RequestCacheService', () => {
//     let fakeLoadingController = jasmine.createSpyObj<RequestCacheWithMap>('LoadingController', ['get', 'put']);

//     let x = jasmine.createSpyObj<RequestCache>('X', ['get', 'put']);


//     beforeEach(() => TestBed.configureTestingModule({
//         providers: [{ provide: RequestCacheWithMap, useValue: fakeLoadingController }]
//     }));

//     it('should be created', () => {
//         const service: RequestCache = TestBed.inject(RequestCache);
//         expect(service).toBeTruthy();
//     });
// });

// describe('RequestCacheService', () => {

//   let service: RequestCacheWithMap;

//   let fakeLoadingController = jasmine.createSpyObj<RequestCache>('LoadingController', ['get', 'put'])
//   // beforeEach(() => new RequestCacheWithMap()

//   // );
//   //TestBed.configureTestingModule({}));

//   beforeEach(() => {
//     service = new RequestCacheWithMap();
//   });

//   it('should be created', () => {
//     //const service: RequestCache = TestBed.inject(RequestCache);
//     expect(service).toBeTruthy();
//   });
// });