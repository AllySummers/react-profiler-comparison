import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

export type ProfilerForm = ReturnType<ReturnType<FormService['form']>['getRawValue']>

@Injectable({
  providedIn: 'root'
})
export class FormService {
  static readonly DEFAULT_RENDER_RESULT_VALUE = 0;
  static readonly DEFAULT_RESULT_VALUE = [
    FormService.DEFAULT_RENDER_RESULT_VALUE
  ];
  static readonly DEFAULT_SET_VALUE = [
    FormService.DEFAULT_RESULT_VALUE
  ]
  static readonly DEFAULT_PROFILE_VALUE = {
    results: FormService.DEFAULT_SET_VALUE,
    title: '',
    description: '',
  }
  static readonly DEFAULT_PROFILES_VALUE = [
    FormService.DEFAULT_PROFILE_VALUE
  ]
  static readonly DEFAULT_PROFILE_FORM_VALUE = {
    profiles: FormService.DEFAULT_PROFILES_VALUE,
  }

  form(initialValue = FormService.DEFAULT_PROFILE_FORM_VALUE) {
    return new FormGroup({
      profiles: new FormArray(
        initialValue.profiles.map(this.profile.bind(this))
      )
    })
  }

  renderResult(initialValue = FormService.DEFAULT_RENDER_RESULT_VALUE) {
    return new FormControl(initialValue, { initialValueIsDefault: true })
  }

  result(initialValue = FormService.DEFAULT_RESULT_VALUE) {
    return new FormArray(
      initialValue.map(this.renderResult.bind(this))
    )
  }

  resultSet(initialValue = FormService.DEFAULT_SET_VALUE) {
    return new FormArray(
      initialValue.map(this.result.bind(this))
    )
  }

  profile(initialValue = FormService.DEFAULT_PROFILE_VALUE) {
    return new FormGroup({
      title: new FormControl(initialValue.title, { initialValueIsDefault: true }),
      description: new FormControl(initialValue.description, { initialValueIsDefault: true }),
      results: this.resultSet(
        initialValue.results
      )
    })
  }

  resetForm(form: ReturnType<FormService['form']>) {
    form.reset();
    form.controls.profiles.clear();
  }

  resetFormWithValue(form: ReturnType<FormService['form']>, data: ProfilerForm) {
    this.resetForm(form);

    data.profiles.forEach((profile) => {
      form.controls.profiles.push(this.profile(profile))
    })
  }
}
