import { Injectable, inject, signal } from '@angular/core';
import { ApiManagerService } from '../api/api-manager.service';
import { Classe } from '../../models/classe.model';

@Injectable({
    providedIn: 'root'
})
export class ClassesManagerService {
    private apiManager = inject(ApiManagerService);

    classes = signal<Classe[]>([]);
    isLoading = signal<boolean>(false);
    error = signal<string | null>(null);

    /**
     * Carrega les classes des de Laravel i actualitza els Signals
     */
    async carregarClasses() {
        this.isLoading.set(true);
        this.error.set(null);

        try {
            const data = await this.apiManager.get<Classe[]>('/classes');
            this.classes.set(data);
        } catch (err) {
            this.error.set('Alguna cosa ha fallat demanant les classes al Laravel');
            console.error(err);
        } finally {
            this.isLoading.set(false);
        }
    }
}
