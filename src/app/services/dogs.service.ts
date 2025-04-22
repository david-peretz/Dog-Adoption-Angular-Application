import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, catchError } from 'rxjs';
import { BreedList } from '../models/breed.model';

@Injectable({
  providedIn: 'root'
})
export class DogsService {
  private API_URL = 'https://dog.ceo/api';
  private breedsWithSubBreedsSubject = new BehaviorSubject<string[]>([]);
  
  breedsWithSubBreeds$ = this.breedsWithSubBreedsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchAllBreeds();
  }

  private fetchAllBreeds(): void {
    this.http.get<BreedList>(`${this.API_URL}/breeds/list/all`)
      .pipe(
        map(response => {
          // Filter breeds with sub-breeds
          const breedsWithSubBreeds = Object.entries(response.message)
            .filter(([_, subBreeds]) => Array.isArray(subBreeds) && subBreeds.length > 0)
            .map(([breed, _]) => breed);
          return breedsWithSubBreeds;
        }),
        catchError(error => {
          console.error('Error fetching breeds:', error);
          return [];
        })
      )
      .subscribe(breeds => {
        this.breedsWithSubBreedsSubject.next(breeds);
      });
  }

  getBreedImages(breed: string, count: number): Observable<string[]> {
    return this.http.get<{message: string[], status: string}>(`${this.API_URL}/breed/${breed}/images/random/${count}`)
      .pipe(
        map(response => response.message)
      );
  }

  getSubBreeds(breed: string): Observable<string[]> {
    return this.http.get<{message: string[], status: string}>(`${this.API_URL}/breed/${breed}/list`)
      .pipe(
        map(response => response.message)
      );
  }
}