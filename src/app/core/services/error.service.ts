import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppError, ErrorType } from '../models/app-error';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private currentError = signal<AppError | null>(null);
  error = this.currentError.asReadonly();
  
  private errorMap = new Map<string, string>([
    ['ERR_NETWORK', 'Error de conexión'],
    ['ERR_AUTH_INVALID', 'Credenciales incorrectas'],
    ['ERR_AUTH_EXPIRED', 'Sesión expirada'],
    ['ERR_PERMISSION', 'No tienes permisos'],
    ['ERR_NOT_FOUND', 'Recurso no encontrado'],
    ['ERR_SERVER', 'Error del servidor'],
    ['ERR_VALIDATION', 'Datos inválidos']
  ]);
  
  handleError(error: any, duration: number = 5000) {
    const appError = this.parseError(error);
    this.currentError.set(appError);
    
    if (duration > 0) {
      setTimeout(() => this.clearError(), duration);
    }
  }
  
  setError(message: string, type: ErrorType = ErrorType.UNKNOWN, duration: number = 5000) {
    const appError: AppError = {
      type,
      message,
      timestamp: new Date()
    };
    this.currentError.set(appError);
    
    if (duration > 0) {
      setTimeout(() => this.clearError(), duration);
    }
  }
  
  private parseError(error: any): AppError {
    if (error instanceof HttpErrorResponse) {
      return this.parseHttpError(error);
    }
    
    if (error?.code) {
      return {
        type: this.getErrorType(error.code),
        message: this.errorMap.get(error.code) || error.message,
        code: error.code,
        originalError: error,
        timestamp: new Date()
      };
    }
    
    return {
      type: ErrorType.UNKNOWN,
      message: error?.message || 'Error desconocido',
      originalError: error,
      timestamp: new Date()
    };
  }
  
  private parseHttpError(error: HttpErrorResponse): AppError {
    const statusMap: Record<number, { type: ErrorType; message: string }> = {
      400: { type: ErrorType.VALIDATION, message: 'Datos inválidos' },
      401: { type: ErrorType.AUTH, message: 'Credenciales incorrectas' },
      403: { type: ErrorType.AUTH, message: 'No tienes permisos' },
      404: { type: ErrorType.NETWORK, message: 'Recurso no encontrado' },
      500: { type: ErrorType.SERVER, message: 'Error del servidor' },
      0: { type: ErrorType.NETWORK, message: 'Error de conexión' }
    };
    
    const errorInfo = statusMap[error.status] || {
      type: ErrorType.UNKNOWN,
      message: 'Error inesperado'
    };
    
    return {
      ...errorInfo,
      code: `HTTP_${error.status}`,
      originalError: error,
      timestamp: new Date()
    };
  }
  
  private getErrorType(code: string): ErrorType {
    if (code.startsWith('ERR_AUTH')) return ErrorType.AUTH;
    if (code.startsWith('ERR_NETWORK')) return ErrorType.NETWORK;
    if (code.startsWith('ERR_VALIDATION')) return ErrorType.VALIDATION;
    if (code.startsWith('ERR_SERVER')) return ErrorType.SERVER;
    return ErrorType.UNKNOWN;
  }
  
  clearError() {
    this.currentError.set(null);
  }
  
  registerErrorMessage(code: string, message: string) {
    this.errorMap.set(code, message);
  }
}

