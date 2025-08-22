const API_URL = "http://localhost:5000/api";

// ================= AUTH =================
function saveToken(token) {
    localStorage.setItem("token", token);
}

function getToken() {
    return localStorage.getItem("token");
}

async function register() {
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;

    if (!username || !email || !password) {
        return alert("All fields are required!");
    }

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        alert(data.message || "Registered!");
        if (res.ok) window.location.href = "login.html";
    } catch (err) {
        console.error(err);
        alert("Registration failed. Check your connection.");
    }
}

async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        return alert("Email and password are required!");
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.token) {
            saveToken(data.token);
            window.location.href = "index.html";
        } else {
            alert(data.message || "Login failed");
        }
    } catch (err) {
        console.error(err);
        alert("Login error. Check your connection.");
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ================= INGREDIENTS =================
async function addIngredient() {
    const name = document.getElementById("ingredientName").value.trim();
    if (!name) return alert("Ingredient name cannot be empty");

    try {
        const res = await fetch(`${API_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({ name })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById("ingredientName").value = "";
            getIngredients();
        } else {
            alert(data.message || "Error adding ingredient");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to add ingredient.");
    }
}

async function getIngredients() {
    try {
        const res = await fetch(`${API_URL}/ingredients`, {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const ingredients = await res.json();
        const list = document.getElementById("ingredientList");
        list.innerHTML = "";

        ingredients.forEach(ing => {
            const li = document.createElement("li");

            // Checkbox to select ingredient for AI recipe
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "ingredient-check";
            checkbox.value = ing.name;
            checkbox.title = "Include in AI recipe";

            // Ingredient name
            const span = document.createElement("span");
            span.textContent = ing.name;

            // Delete button
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "❌";
            removeBtn.onclick = () => deleteIngredient(ing._id);

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(removeBtn);
            list.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        alert("Failed to fetch ingredients");
    }
}

async function deleteIngredient(id) {
    try {
        const res = await fetch(`${API_URL}/ingredients/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        if (res.ok) getIngredients();
        else {
            const data = await res.json();
            alert(data.message || "Error deleting ingredient");
        }
    } catch (err) {
        console.error(err);
        alert("Server error while deleting ingredient");
    }
}

// ================= RECIPES =================
function getSelectedIngredients() {
    return Array.from(document.querySelectorAll("#ingredientList input.ingredient-check:checked"))
        .map(cb => cb.value.trim())
        .filter(Boolean);
}

function normalize(str) {
    return (str || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function matchesAllowed(aiItem, allowedList) {
    const aiNorm = normalize(aiItem);
    return allowedList.some(a => {
        const an = normalize(a);
        return aiNorm.includes(an) || an.includes(aiNorm);
    });
}

async function generateRecipe() {
    const selected = getSelectedIngredients();
    if (selected.length === 0) return alert("Please select at least one ingredient.");

    try {
        const res = await fetch(`${API_URL}/ai`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify({
                ingredients: selected,
                dietaryPreferences: [],
                allergies: ["Nuts"]
            })
        });

        const data = await res.json();
        const recipe = data.recipe;
        if (!recipe) {
            document.getElementById("recipeOutput").innerHTML = "<p>No recipe generated.</p>";
            return;
        }

        // Filter AI ingredients to selected list
        const filteredIngredients = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.filter(ing => matchesAllowed(ing.item, selected))
            : [];

        const renderIngredients = filteredIngredients.length > 0
            ? filteredIngredients
            : selected.map(item => ({ quantity: "", unit: "", item, notes: "" }));

        // Build recipe output
        let output = `
            <h3>${recipe.recipeTitle || ""}</h3>
            <p><strong>Servings:</strong> ${recipe.servings || ""}</p>
            <p><strong>Prep Time:</strong> ${recipe.prepTime || ""}</p>
            <p><strong>Cook Time:</strong> ${recipe.cookTime || ""}</p>

            <h4>Ingredients</h4>
            <ul>
        `;
        

        renderIngredients.forEach(ing => {
            const qty = [ing.quantity, ing.unit].filter(Boolean).join(" ").trim();
            output += `<li>${qty ? qty + " " : ""}${ing.item}${ing.notes ? " – " + ing.notes : ""}</li>`;
        });

        output += "</ul><h4>Instructions</h4><ol>";
        (recipe.instructions || []).forEach(step => {
            output += `<li>${step.description || step}</li>`;
        });
        output += "</ol>";

        document.getElementById("recipeOutput").innerHTML = output;

    } catch (err) {
        console.error(err);
        alert("Failed to generate recipe.");
    }
    
}

// ================= EVENT HOOKS =================
document.getElementById("generateBtn")?.addEventListener("click", generateRecipe);
window.addEventListener("DOMContentLoaded", getIngredients);
