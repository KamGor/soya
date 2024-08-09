import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {
  private httpClient: AxiosInstance;
  constructor() {
    this.httpClient = axios.create({
      baseURL: environment.API_URL,
    });
  }

  public async get(url: string, params?: URLSearchParams | undefined) {
    return (await this.httpClient.get(url, {
      params,
      withCredentials: true,
    })).data;
  }

  public post(url: string, body: Record<string, any>) {
    return this.httpClient.post(url, body, {
      withCredentials: true,
    })
  }

  public put(url: string, body: Record<string, any>) {
    return this.httpClient.put(url, body, {
      withCredentials: true,
    });
  }

  public delete(url: string, data?: Record<string, any> | undefined, params?: URLSearchParams | undefined) {
    return this.httpClient.delete(url, {
      data,
      params,
      withCredentials: true,
    });
  }
}
