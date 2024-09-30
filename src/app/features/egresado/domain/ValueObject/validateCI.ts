/**
 * Comprueba si el número de cédula ingresado es valido.
 * @param  {string|number}  ci Número de cédula
 * @return {boolean}
 */
export function isValidCI(ci: string | number): boolean {
    let isNumeric = true;
    let total = 0;
    let individual;

    for (let position = 0; position < 10; position++) {
        // Obtiene cada posición del número de cédula
        // Se convierte a string en caso de que 'ci' sea un valor numérico
        individual = ci.toString().substring(position, position + 1);

        if (isNaN(Number(individual))) {
            isNumeric = false;
            break;
        } else {
            // Si la posición es menor a 9
            if (position < 9) {
                // Si la posición es par, osea 0, 2, 4, 6, 8.
                if (position % 2 === 0) {
                    // Si el número individual de la cédula es mayor a 5
                    if (parseInt(individual) * 2 > 9) {
                        // Se duplica el valor, se obtiene la parte decimal y se aumenta uno 
                        // y se lo suma al total
                        total += 1 + ((parseInt(individual) * 2) % 10);
                    } else {
                        // Si el número individual de la cédula es menor que 5 solo se lo duplica
                        // y se lo suma al total
                        total += parseInt(individual) * 2;
                    }
                // Si la posición es impar (1, 3, 5, 7)
                } else {
                    // Se suma el número individual de la cédula al total
                    total += parseInt(individual);
                }
            }
        }
    }

    if ((total % 10) !== 0) {
        total = (total - (total % 10) + 10) - total;
    } else {
        total = 0;
    }

    if (isNumeric) {
        // La cédula debe contener al menos 10 dígitos
        if (ci.toString().length !== 10) {
            console.error("La cédula debe ser de 10 dígitos.");
            return false;
        }

        // El número de cédula no debe ser cero
        if (parseInt(ci.toString(), 10) === 0) {
            console.error("La cédula ingresada no puede ser cero.");
            return false;
        }

        // El total debe ser igual al último número de la cédula
        if (total !== parseInt(ci.toString().substring(9, 10))) {
            console.error("La cédula ingresada no es válida.");
            return false;
        }

        console.log('Cédula válida:', ci);
        return true;
    }

    // Si no es un número  
    console.error("El dato solo puede contener números.");
    return false;
}
