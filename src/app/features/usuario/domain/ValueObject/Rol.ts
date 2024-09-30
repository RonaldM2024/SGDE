export class Rol {
  private static readonly rolesValidos = [
    'DIGITALIZADOR',
    'CONSULTOR',
    'ADMIN USERS',
    'AUDITOR',
    'LEGAL',
    'SOPORTE'
  ];

  private readonly rol: string;

  constructor(rol: string) {
    if (!Rol.rolesValidos.includes(rol)) {
      throw new Error(`Rol inválido: ${rol}`);
    }
    this.rol = rol;
  }

  public getRol(): string {
    return this.rol;
  }

  public static esRolValido(rol: string): boolean {
    return Rol.rolesValidos.includes(rol);
  }

  public static getRolesValidos(): string[] {
    return [...Rol.rolesValidos];
  }
}
