import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from 'src/app/interfaces/evento.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
})
export class EventosComponent implements OnInit {
  imageUrlPrefix = 'https://occurrens.onrender.com/public/';
  listaEventos: Evento[] = [];
  category = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public eventoService: EventoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');

      if (category !== null) {
        this.category = category;
        this.loadEventosByCategoria(this.category);
      } else {
        this.loadAllEventos();
      }
    });

    this.http
      .get('https://occurrens.onrender.com/api/user', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.authService.setAuthenticated(true);
        },
        error: error => {
          this.router.navigate(['/login']);
          this.authService.setAuthenticated(false);
        },
      });
  }

  loadEventosByCategoria(category: string) {
    this.http
      .get<Evento[]>(`https://occurrens.onrender.com/api/eventos/${category}`, {
        withCredentials: true,
      })
      .subscribe({
        next: data => {
          this.listaEventos = data;
        },
        error: error => {
          console.log(error);
        },
      });
  }

  loadAllEventos() {
    this.http
      .get<Evento[]>('https://occurrens.onrender.com/api/eventos', {
        withCredentials: true,
      })
      .subscribe({
        next: data => {
          this.listaEventos = data;
        },
        error: error => {
          console.log(error);
        },
      });
  }

  redirectToEventoDetails(eventoId: any): void {
    this.router.navigate([`/evento/${eventoId}`]);
  }
  redirectToUserProfile(userId: string): void {
    console.log(userId);

    this.router.navigate(['/user', userId]);
  }

  getMapLink(location: string): string {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  }
}
