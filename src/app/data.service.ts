import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  // Define the API endpoints for your backend
  private apiUrl = 'http://localhost:8000/api/list/';
  private deleteUrl = 'http://localhost:8000/api/delete/'; // Define the URL for deleting a Camion item
  private createUrl = 'http://localhost:8000/api/create/'; // Define the URL for creating a Camion item
  private updateUrl = 'http://localhost:8000/api/update/';



  
  // Fetch data from the API
  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


    // Method to create a new Camion item
  createCamion(camionData: any): Observable<any> {
    return this.http.post<any>(this.createUrl, camionData);
  }

  // Method to delete a Camion item
  deleteCamion(id: any): Observable<any> {
    return this.http.delete(`${this.deleteUrl}${id}`);
  }


  // Method to update a Camion item
  updateCamion(id: any, camionData: any): Observable<any> {
    return this.http.put(`${this.updateUrl}${id}`, camionData);
  }

  getCamionById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
