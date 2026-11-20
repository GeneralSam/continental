
const weaponGrid = document.getElementById("weapon-grid");
const itemDetails = document.getElementById("item-details");

async function loadWeapons() {
    try {
        const response = await fetch("items.json");

        if (!response.ok) {
            throw new Error("Não foi possível carregar items.json");
        }

        const weapons = await response.json();

        weapons.forEach(weapon => {
            const variants = weapon.variants || [];

            if (variants.length === 0) return;

            const card = document.createElement("div");
            card.classList.add("weapon-card");
            card.dataset.category = weapon.category;

            card.innerHTML = `
                <div class="weapon-name-overlay"></div>

                <button class="variant-arrow left" type="button"
                    aria-label="Variante anterior">
                    ‹
                </button>

                <div class="weapon-image">
                    <img src="${variants[0].image}" alt="${variants[0].name}">
                </div>

                <button class="variant-arrow right" type="button"
                    aria-label="Próxima variante">
                    ›
                </button>
            `;

            const image = card.querySelector(".weapon-image img");
            const title = card.querySelector(".weapon-name-overlay");
            const leftArrow = card.querySelector(".variant-arrow.left");
            const rightArrow = card.querySelector(".variant-arrow.right");

            let currentIndex = 0;

            function updateVariant() {
                const variant = variants[currentIndex];

                image.src = variant.image;
                image.alt = variant.name;

                title.textContent = "";
                typeWriter(title, variant.name, 45);

                showDetails(weapon, variant);

                leftArrow.style.display =
                    variants.length > 1 ? "flex" : "none";

                rightArrow.style.display =
                    variants.length > 1 ? "flex" : "none";
            }
            
            
            function updateVariant() {
    const variant = variants[currentIndex];
    const isSelected = card.classList.contains("selected");

    image.src = variant.image;
    image.alt = variant.name;

    title.textContent = "";

    if (isSelected) {
        typeWriter(title, variant.name, 45);
    }

    showDetails(weapon, variant);

    const arrowDisplay = isSelected && variants.length > 1
        ? "flex"
        : "none";

    leftArrow.style.display = arrowDisplay;
    rightArrow.style.display = arrowDisplay;
}


            function selectCard() {
                document.querySelectorAll(".weapon-card").forEach(item => {
    item.classList.remove("selected");

    const arrows = item.querySelectorAll(".variant-arrow");

    arrows.forEach(arrow => {
        arrow.style.display = "none";
    });

    const oldTitle = item.querySelector(".weapon-name-overlay");

    if (oldTitle) {
        oldTitle.textContent = "";
    }
});

                card.classList.add("selected");
                updateVariant();
            }

            card.addEventListener("click", selectCard);

            leftArrow.addEventListener("click", event => {
                event.stopPropagation();

                currentIndex =
                    (currentIndex - 1 + variants.length) % variants.length;

                updateVariant();
            });

            rightArrow.addEventListener("click", event => {
                event.stopPropagation();

                currentIndex =
                    (currentIndex + 1) % variants.length;

                updateVariant();
            });

            weaponGrid.appendChild(card);
        });

        setupFilters();

    } catch (error) {
        console.error("Erro ao carregar os itens:", error);
    }
}


// FILTROS DE CATEGORIA

function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-button");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedCategory = button.dataset.category;

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            document.querySelectorAll(".weapon-card").forEach(card => {
                const matches =
                    selectedCategory === "all" ||
                    card.dataset.category === selectedCategory;

                card.style.display = matches ? "" : "none";
            });
        });
    });
}


// ANIMAÇÃO DE TEXTO

function typeWriter(element, text, speed = 45) {
    if (!element) return;

    clearTimeout(element.typeTimer);
    element.textContent = "";

    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;

            element.typeTimer = setTimeout(type, speed);
        }
    }

    type();
}


// FICHA TÉCNICA

function showDetails(weapon, variant) {
    const generalInfo = [
        ["VARIANTE", variant.variante],
        ["ORIGEM", variant.origem],
        ["AÇÃO", variant.acao],
        ["CALIBRE", variant.calibre],
        ["PM BASE", variant.pm_base],
        ["CAPACIDADE", variant.capacidade],
        ["ALCANCE", variant.alcance],
        ["PESO", variant.peso]
    ];

    const accessorySlots = [
        ["CANO", variant.slots_acessorios?.Cano],
        ["MIRA", variant.slots_acessorios?.Mira],
        ["LATERAL", variant.slots_acessorios?.Lateral],
        ["INFERIOR", variant.slots_acessorios?.Inferior],
        ["OUTROS", variant.slots_acessorios?.Outros]
    ];

    itemDetails.innerHTML = `
        <div class="details-content">

            <div class="details-header">
                <div>
                    <span class="details-id">
                        ${variant.id || weapon.id}
                    </span>

                    <h2 class="typewriter-title"></h2>
                    <p>${weapon.category}</p>
                </div>

                <span class="details-price">${variant.price ?? "X"}</span>
            </div>

            <div class="info-section">
                <h3 class="info-section-title">INFORMAÇÕES GERAIS</h3>

                <div class="general-info-grid">
                    ${generalInfo.map(([label, value]) => `
                        <div class="info-item">
                            <span>${label}</span>
                            <strong>${value ?? "X"}</strong>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="info-section">
                <h3 class="info-section-title">
                    COMPATIBILIDADE DE ACESSÓRIOS
                </h3>

                <div class="accessory-list">
                    ${accessorySlots.map(([label, value]) => `
                        <div class="accessory-item">
                            <span>${label}</span>

                            <strong class="${
                                value === "X" || !value ? "unavailable" : ""
                            }">
                                ${value || "X"}
                            </strong>
                        </div>
                    `).join("")}
                </div>
            </div>

            <p class="details-description"></p>

        </div>
    `;

    itemDetails.classList.add("visible");

    const title = itemDetails.querySelector(".typewriter-title");
    const description = itemDetails.querySelector(".details-description");

    typeWriter(title, variant.name, 45);
    typeWriter(description, variant.description || "", 25);
}


loadWeapons();
