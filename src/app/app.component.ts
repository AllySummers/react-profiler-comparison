import { Component } from '@angular/core';
import { map } from 'rxjs';
import { profile, profilerForm, result } from './profile.form';
import { sort, sortKey } from './utils/sort-nums.util';
import { sum } from './utils/sum.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form = profilerForm();

  renders$ = this.form.valueChanges.pipe(
    map(data => 
      (data.profiles ?? [])
        .map(({ title = '', results = [] }, index) => ({
          totalTime: sum(results),
          title,
          index
        }))
        .sort((a, b) => a.totalTime - b.totalTime)
    )
  )

  fastestRender$ = this.renders$.pipe(
    map(([ first ]) => first)
  );

  ngOnInit() {
    console.log(this.form)
  }

  get profiles() {
    return this.form.controls.profiles;
  }

  profileCtrls() {
    return this.profiles.controls;
  }

  addProfile() {
    this.profiles.push(profile())
  }

  removeProfile(index: number) {
    this.profiles.removeAt(index);
  }

  addResultToProfile(profileIndex: number) {
    this.profiles.at(profileIndex).controls.results.push(result());
  }

  removeResultFromProfile(profileIndex: number, resultIndex: number) {
    this.profiles.at(profileIndex).controls.results.removeAt(resultIndex);
  }
}
