// =============================
// PREENCHE MOTO PELA URL
// =============================
const params = new URLSearchParams(window.location.search);
const motoParam = params.get("moto");

if (motoParam) {
    const campoMoto = document.getElementById("moto");
    if (campoMoto) {
        campoMoto.value = decodeURIComponent(motoParam);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formFinanciamento");
    const status = document.getElementById("status");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Não carrega a pag

        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const telefone = document.getElementById("telefone").value;
        const dataNascimento = document.getElementById("data_nascimento").value;
        const moto = document.getElementById("moto").value;
        const entrada = document.getElementById("entrada").value || "Não informado";
        const cnh = document.getElementById("cnh").value;

        // 🔴 validação simples
        if (!nome || !cpf || !telefone || !dataNascimento || !cnh) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }

        // 📲 Mensagem WhatsApp
        const mensagem = `
📄 *Simulação de Financiamento*

👤 Nome: ${nome}
🆔 CPF: ${cpf}
📞 Telefone: ${telefone}
🎂 Nascimento: ${dataNascimento}
🏍 Moto: ${moto}
💰 Entrada: ${entrada}
🪪 CNH: ${cnh}
        `;

        const whatsapp = "https://wa.me/5575998646978?text=" +
            encodeURIComponent(mensagem);

        // mostra status
        status.style.display = "block";

        // abre WhatsApp
        setTimeout(() => {
            window.open(whatsapp, "_blank");
        }, 800);
    });
});
