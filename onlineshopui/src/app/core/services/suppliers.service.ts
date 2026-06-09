import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, shareReplay } from 'rxjs';
import { EnvironmentConfig } from '../types/providers/environment-config';
import { SupplierDto } from '../types/dtos/supplier.dto';

@Injectable({
    providedIn: 'root'
})
export class SuppliersService {
    private readonly httpClient = inject(HttpClient);
    private readonly environment = inject(EnvironmentConfig);
    private readonly apiUrl = `${this.environment.apiUrl}/suppliers`;

    private readonly _suppliers = signal<SupplierDto[]>([]);
    private suppliersCache$: Observable<SupplierDto[]> | null = null;

    readonly suppliers = this._suppliers.asReadonly();

    getAll(forceRefresh = false): Observable<SupplierDto[]> {
        if (!this.suppliersCache$ || forceRefresh) {
            this.suppliersCache$ = this.httpClient.get<SupplierDto[]>(this.apiUrl).pipe(
                tap(suppliers => this._suppliers.set(suppliers)),
                shareReplay(1)
            );
        }
        return this.suppliersCache$;
    }

    getById(id: string): Observable<SupplierDto> {
        return this.httpClient.get<SupplierDto>(`${this.apiUrl}/${id}`);
    }
}
