import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PeriodeService } from '../services/periode.service';

@Component({
  selector: 'app-gestio-periodes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestio-periodes.component.html',
  styleUrls: ['./gestio-periodes.component.css']
})
export class GestioPeriodesComponent implements OnInit {
  
  periodes: any[] = [];
  carregant: boolean = true;

  constructor(
    private periodeService: PeriodeService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarPeriodes();
    } else {
      this.carregant = false;
    }
  }

  carregarPeriodes() {
    this.carregant = true;
    this.periodeService.getPeriodes().subscribe({
      next: (dades) => {
        this.periodes = dades;
        this.carregant = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error carregant períodes', err);
        this.carregant = false;
        this.cdr.detectChanges();
      }
    });
  }

  esborrarPeriode(id: number) {
    if (confirm(`Estàs segur que vols eliminar aquest període?`)) {
      this.periodeService.eliminarPeriode(id).subscribe({
        next: () => {
          alert('Període eliminat correctament');
          this.carregarPeriodes(); 
        },
        error: (err) => alert('Hi ha hagut un error al eliminar')
      });
    }
  }
}