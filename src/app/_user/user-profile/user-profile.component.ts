import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservationCountService } from 'src/app/_analysis/observation-count/observation-count.service';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [UserProfileService],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit {
  private _username: string | null;

  constructor(readonly _service: UserProfileService
    , readonly _analysisService: ObservationCountService
    , private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(pmap => {
      this._username = pmap.get('username');
      this._getData();
    });
  }

  private _getData(): void {
    this._service.getData(this._username);
  }

  public reload(): void {
    this._getData();
  }
}