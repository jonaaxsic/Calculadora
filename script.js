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
                display.value = eval(display.value);
            } catch (error) {
                display.value = "Error";
            }
        } else if (buttonId === "ac") {
            display.value = "";
        } else if (buttonId === "de") {
            display.value = display.value.slice(0, -1);
        } else {
            // Usar el atributo data-value si existe, sino usar el texto del botón
            const value = button.getAttribute("data-value") || button.innerText;
            display.value += value;
        }
    });
});
