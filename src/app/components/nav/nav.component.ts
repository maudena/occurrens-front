import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  authenticated = false;
  filterEvento = '';
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.authenticated = isAuthenticated;
    });
  }

  logout(): void {
    this.http
      .post(
        'https://occurrens.onrender.com/api/logout',
        {},
        { withCredentials: true }
      )
      .subscribe({ next: () => this.authService.setAuthenticated(false) });
  }
}
