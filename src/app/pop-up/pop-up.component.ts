import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../data.service'; // Import your DataService
import { formatDate } from '@angular/common';


function quantityLessThanOrEqualToCapacity(control: AbstractControl): { [key: string]: boolean } | null {
  const quantity = control.value;
  const capacity = control.parent?.get('capacity')?.value;
  if (quantity !== null && capacity !== null && quantity > capacity) {
    
    return {'quantityGreaterThanCapacity': true };
  }

  return null;
}

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({});
  currentStep = 0;
  steps = ['General', 'Coordinates', 'Measurement', 'Period'];
  

  constructor(
    private dialogRef: MatDialogRef<PopUpComponent>,
    private formBuilder: FormBuilder,
    private dataService: DataService // Inject your DataService
  ) {}
  fieldempty = false;
  camioncreated = false;
  hideAlerts() {
    setTimeout(() => {
      this.fieldempty = false;
      this.camioncreated = false;
      
    }, 3000); // 3000 milliseconds (3 seconds)
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      camion: ['', Validators.required],
      type: ['', Validators.required],
      shift: ['', Validators.required],
      cluster: ['', Validators.required],
      destination: ['', Validators.required],
      capacity: ['', Validators.required],
      quantity: ['', [Validators.required, quantityLessThanOrEqualToCapacity]],
      date: ['', Validators.required],
      debut: ['', Validators.required],
      fin: ['', Validators.required],
    });
  }


  //Modal to close the pop-up 
  closeModal() {
    this.dialogRef.close();
  }
  

  //Modal to save the object 
  saveModal() {
    if (this.currentStep === this.steps.length - 1) {
      // If it's the last step, check if the form is valid
      if (this.signupForm.valid) {
        // Format date and time values
        const dateValue = this.signupForm.get('date')?.value
          ? formatDate(this.signupForm.get('date')!.value, 'yyyy-MM-dd', 'en-US')
          : null;
        
        // Convert debut and fin time strings to valid date objects
        const debutTimeString = this.signupForm.get('debut')?.value;
        const finTimeString = this.signupForm.get('fin')?.value;
        
        // Check if debut and fin time strings are present
        if (debutTimeString && finTimeString) {
          // Create date objects with the same date and the time from the form
          const debutTimeParts = debutTimeString.split(':');
          const finTimeParts = finTimeString.split(':');
          const debutDate = new Date();
          const finDate = new Date();
          
          debutDate.setHours(Number(debutTimeParts[0]));
          debutDate.setMinutes(Number(debutTimeParts[1]));
          finDate.setHours(Number(finTimeParts[0]));
          finDate.setMinutes(Number(finTimeParts[1]));
          
          // Format the date objects
          const debutValue = formatDate(debutDate, 'HH:mm:ss', 'en-US');
          const finValue = formatDate(finDate, 'HH:mm:ss', 'en-US');
          
          // Create a Camion item using your DataService
          const camionData = {
            ...this.signupForm.value,
            date: dateValue,
            debut: debutValue,
            fin: finValue,
          };
          
          this.dataService.createCamion(camionData).subscribe(
            (response) => {
              // Handle success, e.g., show a success message
              this.camioncreated = true;
              console.log('Operation created:', response);
              setTimeout(() => {
                this.dialogRef.close(); // Close the dialog
              }, 2000);
              setTimeout(() => {
                window.location.reload();
              },2000);
            },
            (error) => {
              // Handle error, e.g., show an error message
              console.error('Error creating Operation:', error);
            }
          );
        } else {
          // Handle the case where debut and fin times are missing
          alert('Please fill in the Start and End times.');
        }
      } else {
        // Find the first invalid control and show an alert pointing to it
        const invalidControlName = this.findFirstInvalidControl();
        if (invalidControlName) {
          const invalidControl = this.signupForm.get(invalidControlName);
          if (invalidControl) {
            invalidControl.markAsTouched(); // Mark the control as touched to display validation messages if any
            alert(`Please fill in the '${invalidControlName}' field.`);
          }
        }
      }
    } else {
      // Move to the next step if it's not the last step
      this.nextPrev(1);
    }
  }
  
  
  nextPrev(step: number) {
    // Check if the fields in the current step are valid before moving to the next step
    if (step === 1) {
      const currentStepControls = this.getControlsForStep(this.currentStep);
      const areFieldsValid = this.areFieldsValid(currentStepControls);
      if (!areFieldsValid) {
        this.fieldempty = true;
        this.hideAlerts();
        return; // Don't move to the next step if fields are not valid
      }
    }

    this.currentStep += step;
  }

  // Helper function to get form controls for the current step
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

  // Helper function to check if all fields in the given step are valid
  areFieldsValid(controlNames: string[]) {
    return controlNames.every(
      (controlName) => this.signupForm.get(controlName)?.valid
    );
  }

  // Helper function to find the first invalid control
  findFirstInvalidControl() {
    for (const controlName of Object.keys(this.signupForm.controls)) {
      const control = this.signupForm.get(controlName) as FormControl;
      if (control.invalid) {
        return controlName;
      }
    }
    return null;
  }

  // Custom validator function to check if quantity is less than or equal to capacity


}
