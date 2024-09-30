export class Cargo {
  private static readonly cargosValidos = [
    'Administrador del Sistema',
    'Secretaría',
    'Director/Directora',
    'Coordinador/Coordinadora Académico/a',
    'Pasante'
  ];

  constructor(private readonly cargo: string) {
    if (!Cargo.cargosValidos.includes(cargo)) {
      throw new Error(`Cargo inválido: ${cargo}`);
    }
  }

  public getCargo(): string {
    return this.cargo;
  }

  public static esCargoValido(cargo: string): boolean {
    return Cargo.cargosValidos.includes(cargo);
  }

  public static getCargosValidos(): string[] {
    return [...Cargo.cargosValidos];
  }
}
