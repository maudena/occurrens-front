import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { Evento } from 'src/app/interfaces/evento.interface';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user: User = {} as User;
  listaEventos: any = [];
  imageUrlPrefix = 'https://occurrens.onrender.com/public/';
  isCurrentUserProfile: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.http
      .get('https://occurrens.onrender.com/api/user', {
        withCredentials: true,
      })
      .subscribe({
        next: (res: any) => {
          this.authService.setAuthenticated(true);
        },
        error: error => {
          console.log(error);
          this.router.navigate(['/login']);
          this.authService.setAuthenticated(false);
        },
      });

    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.http
          .get<User>(`https://occurrens.onrender.com/api/user/${userId}`, {
            withCredentials: true,
          })
          .subscribe({
            next: (res: any) => {
              this.user = res;
              console.log(this.user);
              this.listaEventos = this.user.userEvents;
              this.isCurrentUserProfile = false; // Indicar que el perfil no es del usuario actual
            },
            error: error => {
              console.log(error);
              this.router.navigate(['/login']);
            },
          });
      } else {
        // No se proporcionó ID de usuario, obtener los datos del usuario activo en la sesión
        this.http
          .get<User>('https://occurrens.onrender.com/api/user', {
            withCredentials: true,
          })
          .subscribe({
            next: (res: any) => {
              this.user = res;
              this.listaEventos = this.user.userEvents;
            },
            error: error => {
              console.log(error);
              this.router.navigate(['/login']);
            },
          });
      }
    });
  }

  redirectToEventoDetails(eventId: string): void {
    this.router.navigate(['/evento', eventId]);
  }
}
