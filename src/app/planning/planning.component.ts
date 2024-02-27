import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { DataService } from '../data.service';
import { Router } from '@angular/router'; // Import the Router service
import { PopUpEditComponent } from '../pop-up-edit/pop-up-edit.component';

interface SideNavToggle {
  screenWidth : number;
  collapsed: boolean;
}


@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
  title = 'planning-material';
  data: any[] = [];
  camionData: any[] = [];
  selectedCamion: any;
  selectAllChecked = false;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  isSideNavCollapsed = false;
  screenWidth = 0;

  constructor(
    private dialogRef: MatDialog,
    private dataService: DataService,
    private router: Router // Inject the Router service
  ) {}

  //THE EDIT CODE ---------------------------------------------------------------------------------------------
  selectCamion(camion: any) {
    if (camion) {
      this.selectedCamion = camion;
      this.openEditPopup();
    } else {
      // Handle the case where camion is undefined
      console.error('Selected camion is undefined.');
    }
  }


  openEditPopup() {
    const currentPageBeforeEdit = this.currentPage;
    // Check if this.selectedCamion is defined
    if (this.selectedCamion) {
      // Open the edit popup and pass the selected Camion data to it
      const dialogRef = this.dialogRef.open(PopUpEditComponent, {
        width: '400px',
        data: { editData: this.selectedCamion }
      });
  
      // Subscribe to the dialog's afterClosed event to handle actions after editing
      dialogRef.afterClosed().subscribe(result => {
        // Handle actions after the edit popup is closed
        if (result === 'updated') {
          // If the data was updated, refresh the data
          this.fetchData();
          // Check if the current page is greater than the total pages after deletion
        if (currentPageBeforeEdit > this.getTotalPages()) {
          // Set the current page to the total pages
          this.currentPage = this.getTotalPages();
        } else {
          // Restore the current page after deletion
          this.currentPage = currentPageBeforeEdit;
        }
  
        // Navigate to the current page
        this.onPageChange(this.currentPage);
        }
      });
    } else {
      console.error('Selected camion is undefined.'); // Handle the case where camion is undefined
    }
  }
// -----------------------------------------------------------------------------------------------------------------
  

  ngOnInit() {
    this.fetchData();
  }

  openDialog() {
    this.dialogRef.open(PopUpComponent, {
      width: '400px',
    });
  }


  

  fetchData() {
    this.dataService.getData().subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // Method to delete a Camion item
  deleteCamion(id: number) {
    // Store the current page before deletion
    const currentPageBeforeDelete = this.currentPage;
  
    this.dataService.deleteCamion(id).subscribe(
      () => {
        // After successful delete, refresh the data
        this.fetchData();
  
        // Check if the current page is greater than the total pages after deletion
        if (currentPageBeforeDelete > this.getTotalPages()) {
          // Set the current page to the total pages
          this.currentPage = this.getTotalPages();
        } else {
          // Restore the current page after deletion
          this.currentPage = currentPageBeforeDelete;
        }
  
        // Navigate to the current page
        this.onPageChange(this.currentPage);
      },
      (error) => {
        console.error('Error deleting Camion:', error);
      }
    );
  }
  

  
  calculateTotalQuantity(): number {
    let totalQuantity = 0;
  
    for (const item of this.data) {
      if (item.quantity) {
        totalQuantity += item.quantity;
      }
    }
  
    return totalQuantity;
  }

  calculateTotalCamions():number {
    let totalCamions = 0;
    for (const item of this.data){
      if (item){
        totalCamions = totalCamions+1;
      }
    }
    return totalCamions;
  }

// Function to handle "Select All" checkbox change event
selectAllCamions(event: any) {
  const checked = event.target.checked;

  // Iterate through the data array and set the 'selected' property of each item
  this.data.forEach((item) => (item.selected = checked));
}

 // Function to check if all camions are selected
 isAllCamionsSelected() {
  return this.data.every((item) => item.selected);
}

// Function to check/uncheck the "Select All" checkbox based on individual camion selections
checkCamionSelection() {
  this.selectAllChecked = this.isAllCamionsSelected();
}


// Function to get the data for the current page
getCurrentPageData(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.data.slice(startIndex, endIndex);
}

// Function to handle page change
onPageChange(page: number): void {
  this.currentPage = page;
}

// Inside your component class
getTotalPages(): number {
  return Math.ceil(this.data.length / this.itemsPerPage);
}

getPages(): number[] {
  return Array(this.getTotalPages())
    .fill(0)
    .map((_, i) => i + 1);
}


// Function to navigate to the previous page
navigateToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    // Load data for the previous page if needed.
  }
}


// Function to navigate to the next page
navigateToNextPage(): void {
  if (this.currentPage < this.getTotalPages()) {
    this.currentPage++;
    // Load data for the next page if needed.
  }
}

getShowingText(): string {
  const totalEntries = this.data.length;
  const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
  const endIndex = Math.min(this.currentPage * this.itemsPerPage, totalEntries);
  return `Showing ${startIndex} to ${endIndex} of ${totalEntries} entries`;
}


onToggleSideNav(data : SideNavToggle): void{
  this.screenWidth = data.screenWidth;
  this.isSideNavCollapsed = data.collapsed;
}
}



