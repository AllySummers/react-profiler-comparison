import { FormArray, FormControl, FormGroup } from '@angular/forms';

export const result = () => new FormControl(0, { initialValueIsDefault: true });

export const profile = () => new FormGroup({
  title: new FormControl('', {initialValueIsDefault: true}),
  description: new FormControl('', {initialValueIsDefault: true}),
  results: new FormArray([
    result()
  ])
});

export const profilerForm = () => new FormGroup({
  profiles: new FormArray([
    profile()
  ])
})

export type ProfilerForm = ReturnType<typeof profilerForm>['getRawValue'];

export interface Profile {
  title: string;
  description: string;
  results: Array<number>;
}