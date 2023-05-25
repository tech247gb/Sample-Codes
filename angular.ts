import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployessService {
  /**create behaviourSubject object */
  private employeeListSource = new BehaviorSubject('');
  /**asssign list current behaviourSubject object */
  currentEmployeeList = this.employeeListSource.asObservable();

  constructor(  private http: HttpClient) { }
/**get data list from api */
  getEmployees(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.get(environment.globalURL+'users').subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }
  /**get one data  from api */
  getEmployee(id:any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.get(environment.globalURL+'users/'+id).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }
  /**add data to backend */
  addEmployee(data:any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.post(environment.globalURL+'users',data).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }
  /**Edit data and pass to backend */
  editEmployee(data:any,item:any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.put(environment.globalURL+'users/'+item.id,data).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }
  /**Delete data */
  deleteEmployee(item:any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.delete(environment.globalURL+'users/'+item.id).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }
  /**change data list without reload page */
  changeList(item:any) {
    this.employeeListSource.next(item);
  }
}
