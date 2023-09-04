import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../interfaces/evento.interface';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  constructor(private http: HttpClient) {}

  private interactionSubject = new BehaviorSubject<number>(0);
  interaction$ = this.interactionSubject.asObservable();

  private eventoSubject = new BehaviorSubject<Evento | null>(null);
  evento$ = this.eventoSubject.asObservable();

  private destacadosSubject = new BehaviorSubject<Evento[]>([]);
  destacados$ = this.destacadosSubject.asObservable();

  private proximosSubject = new BehaviorSubject<Evento[]>([]);
  proximos$ = this.proximosSubject.asObservable();

  updateInteraction(interaction: number) {
    this.interactionSubject.next(interaction);
  }

  updateEvento(evento: Evento) {
    this.eventoSubject.next(evento);
  }

  updateDestacados(eventos: Evento[]) {
    this.destacadosSubject.next(eventos);
  }

  updateProximos(eventos: Evento[]) {
    this.proximosSubject.next(eventos);
  }

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(
      'https://occurrens.onrender.com/api/eventos',
      {
        withCredentials: true,
      }
    );
  }

  getEvento(): Evento | null {
    return this.eventoSubject.getValue();
  }

  getEventoById(eventoId: string) {
    return this.http.get<Evento>(
      `https://occurrens.onrender.com/api/evento/${eventoId}`,
      {
        withCredentials: true,
      }
    );
  }
}
