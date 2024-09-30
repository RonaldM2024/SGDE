/* 
Estados del Empleado
1. Activo: El empleado está actualmente en servicio y trabajando en la organización.
2. Inactivo: El empleado ya no trabaja en la organización, pero su registro se mantiene en el sistema para referencia histórica.
3. De Baja Temporal: El empleado está temporalmente fuera de servicio debido a alguna licencia o permiso, como licencia médica, licencia por maternidad/paternidad, o cualquier otra licencia temporal.
4. En Proceso de Contratación: El empleado está en el proceso de ser contratado, es decir, ha sido seleccionado pero aún no ha comenzado oficialmente a trabajar.
5. En Capacitación: El empleado ha sido contratado pero actualmente se encuentra en un período de capacitación antes de asumir sus responsabilidades laborales completas.
6. Suspendido: El empleado ha sido suspendido temporalmente debido a una violación de políticas o cualquier otro motivo disciplinario.
7. Retirado: El empleado ha alcanzado la edad de jubilación y se ha retirado formalmente de la organización.
8. Fallecido: El empleado ha fallecido, y su registro se mantiene en el sistema para referencia histórica y para gestionar beneficios relacionados. 
*/
export class EstadoEmpleado {

  private static readonly estadosValidos = [
    'Activo',
    'Inactivo',
    'De Baja Temporal',
    'En Proceso de Contratación',
    'En Capacitación',
    'Suspendido',
    'Retirado',
    'Fallecido'
  ];

  constructor(private readonly estado: string) {
    if (!EstadoEmpleado.estadosValidos.includes(estado)) {
      throw new Error(`Estado inválido: ${estado}`);
    }
  }

  public getEstado(): string {
    return this.estado;
  }

  public static esEstadoValido(estado: string): boolean {
    return EstadoEmpleado.estadosValidos.includes(estado);
  }

  public static getEstadosValidos(): string[] {
    return [...EstadoEmpleado.estadosValidos];
  }
}
