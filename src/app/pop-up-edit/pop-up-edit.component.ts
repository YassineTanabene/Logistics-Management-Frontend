import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl,AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service'; // Import your DataService
import { formatDate } from '@angular/common';

function quantityLessThanOrEqualToCapacity(control: AbstractControl): { [key: string]: boolean } | null {
  const quantity = control.value;
  const capacity = control.parent?.get('capacity')?.value;

  if (quantity !== null && capacity !== null && quantity > capacity) {
    return { 'quantityGreaterThanCapacity': true };
  }

  return null;
}



@Component({
  selector: 'app-pop-up-edit',
  templateUrl: './pop-up-edit.component.html',
  styleUrls: ['./pop-up-edit.component.css']
})
export class PopUpEditComponent implements OnInit {
  editForm: FormGroup = new FormGroup({});
  editData: any = {}; // Initialize this with the data to edit
  currentStep = 0;
  steps = ['General', 'Coordinates', 'Measurement', 'Period'];

  constructor(
    private dialogRef: MatDialogRef<PopUpEditComponent>,
    private formBuilder: FormBuilder,
    private dataService: DataService ,// Inject your DataService
    @Inject(MAT_DIALOG_DATA) public data : any
  ) {}
  fieldempty = false ;
  camionupdated = false ; 
  hideAlerts() {
    setTimeout(() => {
      this.fieldempty = false;
      this.camionupdated = false;
      
    }, 3000); // 3000 milliseconds (3 seconds)
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      camion: ['', Validators.required],
      type: ['', Validators.required],
      shift: ['', Validators.required],
      cluster: ['', Validators.required],
      destination: ['', Validators.required],
      capacity: ['', Validators.required],
      quantity: ['', [Validators.required,quantityLessThanOrEqualToCapacity]],
      date: ['', Validators.required],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
    });

    // Populate the edit form with the data to edit
    this.populateEditForm(this.data.editData);
  }

  closeModal() {
    this.dialogRef.close();
  }

  saveModal() {
    if (this.currentStep === this.steps.length - 1) {
      if (this.editForm.valid) {
        const dateValue = this.editForm.get('date')?.value
          ? formatDate(this.editForm.get('date')!.value, 'yyyy-MM-dd', 'en-US')
          : null;

        const debutTimeString = this.editForm.get('debut')?.value;
        const finTimeString = this.editForm.get('fin')?.value;

        if (debutTimeString && finTimeString) {
          const debutTimeParts = debutTimeString.split(':');
          const finTimeParts = finTimeString.split(':');
          const debutDate = new Date();
          const finDate = new Date();

          debutDate.setHours(Number(debutTimeParts[0]));
          debutDate.setMinutes(Number(debutTimeParts[1]));
          finDate.setHours(Number(finTimeParts[0]));
          finDate.setMinutes(Number(finTimeParts[1]));

          const debutValue = formatDate(debutDate, 'HH:mm:ss', 'en-US');
          const finValue = formatDate(finDate, 'HH:mm:ss', 'en-US');

          const camionData = {
            ...this.editForm.value,
            date: dateValue,
            debut: debutValue,
            fin: finValue,
          };

          // Update the Camion item using your DataService
          this.dataService.updateCamion(this.data.editData.id, camionData).subscribe(
            (response) => {
              // Handle success, e.g., show a success message
              this.camionupdated = true;
              console.log('Camion updated:', response);
              setTimeout(() => {
                this.dialogRef.close('updated'); // Close the dialog
              },2000);
              setTimeout(() => {
                window.location.reload()
              },2000);
            },
            (error) => {
              // Handle error, e.g., show an error message
              
              console.error('Error updating Camion:', error);
            }
          );
        } else {
          alert('Please fill in the debut and fin times.');
        }
      } else {
        const invalidControlName = this.findFirstInvalidControl();
        if (invalidControlName) {
          const invalidControl = this.editForm.get(invalidControlName);
          if (invalidControl) {
            invalidControl.markAsTouched();
            alert(`Please fill in the '${invalidControlName}' field.`);
          }
        }
      }
    } else {
      this.nextPrev(1);
    }
  }

  nextPrev(step: number) {
    if (step === 1) {
      const currentStepControls = this.getControlsForStep(this.currentStep);
      const areFieldsValid = this.areFieldsValid(currentStepControls);
      if (!areFieldsValid) {
        this.fieldempty = true ;
        this.hideAlerts();
        return;
      }
    }

    this.currentStep += step;
  }

  getControlsForStep(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return [
          'camion',
          'type',
          'shift',
        ];
      case 1:
        return ['cluster', 'destination'];
      case 2:
        return ['capacity', 'quantity'];
      case 3:
        return ['date', 'debut', 'fin'];
      default:
        return [];
    }
  }

  areFieldsValid(controlNames: string[]) {
    return controlNames.every(
      (controlName) => this.editForm.get(controlName)?.valid
    );
  }

  findFirstInvalidControl() {
    for (const controlName of Object.keys(this.editForm.controls)) {
      const control = this.editForm.get(controlName) as FormControl;
      if (control.invalid) {
        return controlName;
      }
    }
    return null;
  }

  // Helper function to populate the edit form with data
  populateEditForm(data: any) {
    if (data) {
      this.editForm.patchValue(data);

      // You may need to format and set date and time values here if needed.
    }
  }
}
