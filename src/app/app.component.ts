import { Component } from '@angular/core';
import { map, startWith } from 'rxjs';
import { profile, ProfilerForm, profilerForm, result, resultSet } from './profile.form';
import { average } from './utils/average.util';
import { sum } from './utils/sum.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form = profilerForm();

  renders$ =  this.form.valueChanges.pipe(
    startWith({
      profiles: [
        {
          title: '',
          description: '',
          results: [
            [
              0
            ]
          ]
        }
      ]
    }),
    map(data => this.getRenders(data as any))
  )

  get renders() {
    return this.getRenders(this.form.getRawValue())
  }

  get fastestRender() {
    return this.renders[0];
  }

  get profiles() {
    return this.form.controls.profiles;
  }

  profileCtrls() {
    return this.profiles.controls;
  }

  addProfile() {
    this.profiles.push(profile());
  }

  removeProfile(index: number) {
    this.profiles.removeAt(index);
  }

  addResultSet(profileIndex: number) {
    this.profiles.at(profileIndex).controls.results.push(resultSet());
  }

  removeResultSet(profileIndex: number, setIndex: number) {
    this.profiles.at(profileIndex).controls.results.removeAt(setIndex);
  }

  addResultToSet(profileIndex: number, setIndex: number) {
    this.profiles.at(profileIndex).controls.results.at(setIndex).push(result());
  }

  removeResultFromSet(profileIndex: number, setIndex: number, resultIndex: number) {
    this.profiles.at(profileIndex).controls.results.at(setIndex).removeAt(resultIndex);
  }

  getRenders(renders: ProfilerForm) {
    return renders.profiles
      .map(({ title = '', results = [] }, index) => ({
        totalTime: average(
          results.map(sum)
        ),
        title,
        index,
      }))
      .sort((a, b) => a.totalTime - b.totalTime);
  }
}
