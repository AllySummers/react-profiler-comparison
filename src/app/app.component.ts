import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, startWith, Subscription, tap } from 'rxjs';
import { FormService, ProfilerForm } from './form.service';
import { average } from './utils/average.util';
import { sum } from './utils/sum.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly storageKey = 'data';

  form;
  renders$;

  textForm = new FormControl('', { initialValueIsDefault: true });

  formSub?: Subscription;

  constructor(private formSvc: FormService) {
    this.form = this.formSvc.form(this.loadFromStorage() ?? undefined)

    this.renders$ = this.form.valueChanges.pipe(
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
  }

  ngOnInit(): void {
    this.formSub = this.form.valueChanges.pipe(
      map(data => JSON.stringify(data, null, 2)),
      tap(() => this.saveToStorage()),
    )
    .subscribe(data => {
      this.textForm.setValue(data);
    })
  }

  ngOnDestroy(): void {
      this.formSub?.unsubscribe();
  }

  get renders() {
    return this.getRenders(this.form.getRawValue())
  }

  get fastestRender() {
    return this.renders[0];
  }

  get profiles() {
    return this.form.controls.profiles;
  }

  get profileCtrls() {
    return this.profiles.controls;
  }

  addProfile() {
    this.profiles.push(this.formSvc.profile());
  }

  removeProfile(index: number) {
    this.profiles.removeAt(index);
  }

  addResultSet(profileIndex: number) {
    this.profiles.at(profileIndex).controls.results.push(this.formSvc.result());
  }

  removeResultSet(profileIndex: number, setIndex: number) {
    this.profiles.at(profileIndex).controls.results.removeAt(setIndex);
  }

  addRenderToSet(profileIndex: number, setIndex: number) {
    this.profiles.at(profileIndex).controls.results.at(setIndex).push(this.formSvc.renderResult());
  }

  removeRenderFromSet(profileIndex: number, setIndex: number, resultIndex: number) {
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

  loadFromStorage(): ProfilerForm | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const json: ProfilerForm = JSON.parse(data);

        if (json.profiles.length) return json;
      }
    } catch(err) {
      return null;
    }

    return null;
  }

  saveToStorage() {
    const value = this.form.getRawValue();

    const json = JSON.stringify(value, null, 2);

    localStorage.setItem(this.storageKey, json);
  }

  loadFromForm() {
    const { value } = this.textForm;

    try {
      const json = JSON.parse(value);

      this.formSvc.resetFormWithValue(this.form, json);
    } catch {}
  }

  resetForm() {
    this.formSvc.resetForm(this.form);
  }
}
