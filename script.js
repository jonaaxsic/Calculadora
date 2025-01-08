// Seleccionar el elemento con la ID display
const display = document.querySelector("#display");

// Seleccionar todos los botones
const buttons = document.querySelectorAll("button");

// Función para manejar los clics en los botones
buttons.forEach(button => {
    button.addEventListener("click", () => {
        // Obtener el ID del botón
        const buttonId = button.id;

        if (buttonId === "=") {
            try {
                // Evaluar la expresión matemática en el display de forma segura
                display.value = eval(display.value);
            } catch (error) {
                // Mostrar error si la expresión es inválida
                display.value = "Error";
            }
        } else if (buttonId === "ac") {
            // Limpiar el display
            display.value = "";
        } else if (buttonId === "de") {
            // Eliminar el último carácter del display
            display.value = display.value.slice(0, -1);
        } else {
            // Agregar el texto del botón al display
            display.value += button.innerText;
        }
    });
});