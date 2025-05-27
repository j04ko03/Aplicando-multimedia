document.addEventListener('DOMContentLoaded', function() {
    // Elementos principales
    const ingredients = document.querySelectorAll('.ingredient');
    const plateContainer = document.querySelector('.plate-container');
    const plateOrBowl = document.getElementById('plate') || document.getElementById('bowl');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const addSound = document.getElementById('addSound');
    const rotateSound = document.getElementById('rotateSound');
    
    let selectedIngredients = [];
    
    // Hacer ingredientes arrastrables
    ingredients.forEach(ingredient => {
        ingredient.setAttribute('draggable', 'true');
        
        ingredient.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-name'));
            // Hacer el elemento semi-transparente mientras se arrastra
            this.style.opacity = '0.5';
        });
        
        ingredient.addEventListener('dragend', function() {
            this.style.opacity = '1'; // Restaurar opacidad
        });
    });
    
    // Usar plateContainer para los eventos de drag & drop
    plateContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    plateContainer.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    plateContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');

        const ingredientName = e.dataTransfer.getData('text/plain');
        const ingredientElement = document.querySelector(`.ingredient[data-name="${ingredientName}"]`);
        const emoji = ingredientElement.textContent.match(/\p{Emoji}/u)[0];

        // Verificar si ya existe o si hay 5 ingredientes
        if (selectedIngredients.includes(ingredientName) || selectedIngredients.length >= 5) {
            return;
        }

        // Añadir a ingredientes seleccionados
        selectedIngredients.push(ingredientName);
        ingredientElement.classList.add('selected');

        // Crear elemento emoji en el plato
        const emojiElement = document.createElement('div');
        emojiElement.className = 'ingredient-emoji';
        emojiElement.textContent = emoji;
        emojiElement.setAttribute('data-name', ingredientName);

        // Coordenadas relativas al contenedor
        const rect = plateContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - 20; // Ajustar posición
        const y = e.clientY - rect.top - 20;
        emojiElement.style.position = 'absolute';
        emojiElement.style.left = `${x}px`;
        emojiElement.style.top = `${y}px`;

        ingredientsContainer.appendChild(emojiElement);

        // Sonidos
        addSound.currentTime = 0;
        addSound.play();
        
        // Rotación al llegar a 5 ingredientes
        if (selectedIngredients.length === 5) {
            rotateSound.currentTime = 0;
            rotateSound.play();
            plateOrBowl.classList.add('rotate');
            setTimeout(() => {
                plateOrBowl.classList.remove('rotate');
            }, 1000);
        }
    });
    
    // Alternativa con clic
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('click', function() {
            const ingredientName = this.getAttribute('data-name');
            const emoji = this.textContent.match(/\p{Emoji}/u)[0];
            const index = selectedIngredients.indexOf(ingredientName);
            
            if (index === -1) {
                // Añadir ingrediente
                if (selectedIngredients.length < 5) {
                    selectedIngredients.push(ingredientName);
                    this.classList.add('selected');
                    
                    const emojiElement = document.createElement('div');
                    emojiElement.className = 'ingredient-emoji';
                    emojiElement.textContent = emoji;
                    emojiElement.setAttribute('data-name', ingredientName);
                    
                    // Posición aleatoria en el plato
                    emojiElement.style.position = 'absolute';
                    emojiElement.style.left = `${Math.random() * 60 + 20}%`;
                    emojiElement.style.top = `${Math.random() * 60 + 20}%`;
                    
                    ingredientsContainer.appendChild(emojiElement);
                    
                    // Sonidos
                    addSound.currentTime = 0;
                    addSound.play();
                    
                    if (selectedIngredients.length === 5) {
                        rotateSound.currentTime = 0;
                        rotateSound.play();
                        plateOrBowl.classList.add('rotate');
                        setTimeout(() => {
                            plateOrBowl.classList.remove('rotate');
                        }, 1000);
                    }
                }
            } else {
                // Eliminar ingrediente
                selectedIngredients.splice(index, 1);
                this.classList.remove('selected');
                
                const emojiToRemove = ingredientsContainer.querySelector(`[data-name="${ingredientName}"]`);
                if (emojiToRemove) {
                    ingredientsContainer.removeChild(emojiToRemove);
                }
                
                addSound.currentTime = 0;
                addSound.play();
            }
        });
    });
});