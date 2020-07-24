import { TestBed, inject } from "@angular/core/testing";

import { FormService } from "./form.service";
import { FormGroup, AbstractControl } from "@angular/forms";

describe("FormService", () => {
  let formService: FormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormService]
    });

    formService = TestBed.get(FormService);
  });

  it("should be created", () => {
    expect(formService).toBeTruthy();
  });
});

export class FormServiceMock {
  inputValidationClass(
    formGroup: FormGroup,
    formControlName: string
  ): { "is-valid": boolean; "is-invalid": boolean } {
    return { "is-valid": true, "is-invalid": false };
  }
  isValid(formGroup: FormGroup, formControlName: string): boolean {
    return true;
  }
  isInvalid(formGroup: FormGroup, formControlName: string): boolean {
    return false;
  }
  markAllDirty(control: AbstractControl) {}
  clearAllValidators(control: AbstractControl) {}
}
